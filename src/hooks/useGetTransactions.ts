import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import type { Transaction } from "@/app/api/UsersApi";

export function useGetTransactions() {
  const [transactions,setTransactions] = useState<Transaction[]>([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string | null>(null)

  const getErrorMessage = (code:string) => {
      switch (code) {
        case 'permission-denied':
          return "У вас недостаточно прав для просмотра этого списка.";
          case 'unavailable':
          return "Сервис временно недоступен. Проверьте подключение к интернету.";
          default:
          return "Произошла непредвиденная ошибка.";
      }
  };

    useEffect(() => {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", auth.currentUser?.uid)
        );
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const transactionsData: Transaction[] = snapshot.docs.map(doc => {
            const d = doc.data();
              return {
                userId: d.userId,
                userName: d.userName,
                coin: d.coin,
                symbol: d.symbol,
                image: d.image,
                Price: d.Price,
                amount: d.amount,
                date: d.date,
                status: d.status as "buy" | "sell",
              };
          });
    
              setTransactions(transactionsData)
              setLoading(false)
              setError(null)
        },(error) => {
                console.error("Код ошибки:",error.code)
                const errorMessge = getErrorMessage(error.code)
                setError(errorMessge)
                setLoading(false)
           })
    
           return () => unsubscribe()
      },[])

      return { transactions, loading, error }

}