import { db } from "@/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import type { User } from "../app/api/UsersApi"

export const useGetUser = () => {
    const [users,setUsers] = useState<User[]>([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState<string | null>(null)
    const [refetchIndex, setRefetchIndex] = useState(0);

    const refetch = useCallback(() => {
      setLoading(true)
      setUsers([]);
      setRefetchIndex(prev => prev + 1)
    }, [])

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
        const q = query(collection(db,"users"))

        const unsubrscribe = onSnapshot(q,(snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id:doc.id, ...doc.data()
            })) as User[];

            setUsers(userData)
            setLoading(false)
            setError(null)
        },(error) => {
            console.error("Код ошибки:",error.code)
            const errorMessge = getErrorMessage(error.code)
            setError(errorMessge)
            setLoading(false)
         })
        return () => unsubrscribe()
    },[refetchIndex])


    
  return { users, loading, error, refetch}
}

export default useGetUser