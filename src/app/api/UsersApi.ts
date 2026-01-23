import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, Timestamp, 
         doc, updateDoc, getDoc} from "firebase/firestore";
import { db } from "../../firebase";

export interface User {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  cryptoBalance?: number;
  portfolio?: any[];
  photoURL?: string;
  createdAt: string | null;
  balance?:number;
}
interface buyCrypto {
  uid:any,
  coinId:undefined | string,
  amountCoins:number,
  currentPrice:number,
  cryptoPrice:number,
  image:any,
  symbol:string,
  Username:string | null,
}
interface sellCrypto {
  uid:any,
  coinId:undefined | string,
  amountCoins:number,
  cryptoPrice:number,
}
export interface Transaction {
  Username: string;
  coinId: string;
  buyPrice: number;
  amount: number;
  date: string;
  image: string;
  symbol: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}
interface TopUsers {
  id?:string;
  displayName?: string;
  cryptoTotalBalance?: number;
  photoURL?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      providesTags: ["Users"],
      async queryFn() {
        try {
          const usersCol = collection(db, "users");
          const snapshot = await getDocs(usersCol);

          const users: User[] = snapshot.docs.map((doc) => {
            const data = doc.data() as {
              displayName?: string;
              email?: string;
              role?: string;
              cryptoBalance?: number;
              portfolio?: any[];
              photoURL?: string;
              createdAt?: Timestamp;
              balance?:number;
            };

            return {
              id: doc.id,
              displayName: data.displayName,
              email: data.email,
              role: data.role,
              cryptoBalance: data.cryptoBalance,
              portfolio: data.portfolio,
              photoURL: data.photoURL,
              createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
              balance:data.balance,
            };
          });

          return { data: users };
        } catch (error) {
          console.error("Ошибка получения пользователей:", error);

          let message = "Не удалось загрузить пользователей";
          if (error instanceof Error) {
            message = error.message;
          }

          return { error: { status: "CUSTOM_ERROR", error: message } };
        }
      },
    }),

    buyCrypto:builder.mutation<void,buyCrypto>({
      async queryFn({uid,coinId,amountCoins,
                     currentPrice,cryptoPrice,
                     image,symbol,Username}) {
        try {
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          const MAX_AMOUNT = 0.00001

          if (!userSnap.exists()) {
            return { error: { status: "USER_NOT_FOUND", error: "Пользователь не найден" } };
          }
          if (amountCoins < MAX_AMOUNT) {
            return { error: { status: "MAX_AMOUNT", error: "Привышен лимит количества" } };
          }
          
          const userData = userSnap.data()
          const balance = userData.balance
          const portfolio = userData.portfolio || []

          const totalPrice = amountCoins * currentPrice

          if (balance < totalPrice) {
            return { error: {status:"NO_MONEY", error:"Недостаточно средств"}}
          }

          let updatePortfolio: any[] = [];


          const existingCoin = portfolio.find((item:any) => item.coinId === coinId)
          if (existingCoin && amountCoins) {
            existingCoin.amount = existingCoin.amount + amountCoins

            updatePortfolio = [...portfolio]
          } else {
            const NewCoin = {
              coinId,
              amount: amountCoins,
              buyPrice: currentPrice,
              cryptoPrice,
              timestamp: Date.now(),
              date: new Date().toISOString(),
              image,
              symbol,
              Username,
            }
            updatePortfolio = [...portfolio, NewCoin];
          }
          const newBalance = balance - totalPrice

          await updateDoc(userRef, {
            balance:newBalance,
            portfolio:updatePortfolio
          })
          
          return { data: undefined };
        
        } catch (error:any) {
          return { error: { status: "BUY_ERROR", error: error.message } };
        }
      },
      invalidatesTags: ["Users"]
    }),
    sellCrypto:builder.mutation<void,sellCrypto>({
      async queryFn({uid,coinId,amountCoins,cryptoPrice,}) {
          try {
            const userRef = doc(db,"users",uid)
            const userSnap = await getDoc(userRef)
            if (!userSnap.exists()) {
              return { error: { status: "USER_NOT_FOUND", error: "Пользователь не найден" } };
            }
            
            const userData = userSnap.data()
            const balance = userData.balance
            const portfolio = userData.portfolio
            
            const existingCoin = portfolio.find((i:any) => i.coinId === coinId)
            if (!existingCoin) {
              return { error: {status:"SELL_ERROR",error:"Монета не найдена в портфеле"}}
            }
            if (existingCoin.amount < amountCoins) {
              console.log(existingCoin == amountCoins)
              return {
                error: {
                  status: "SELL_ERROR", 
                  error: "Недостаточно монет для продажи, или монета не найдена",
                },
              };
            }

            const updatePortfolio = portfolio.map((item:any) => 
              item.coinId === coinId ? { ...item, amount:item.amount - amountCoins}
            : item
            )

            const MIN_AMOUNT = 0.00001;
            
            const filtredPortfolio = updatePortfolio.filter((item:any) => item.amount > MIN_AMOUNT)
            
            const totalPrice = Number(cryptoPrice);
            const newBalance = Number(balance) + totalPrice;
            if (totalPrice <= 0) {
              return { error: { status:"SELL_ERROR", error:"Некорректная сумма продажи" } }
            }
            
            await updateDoc(userRef,{
              balance:newBalance,
              portfolio:filtredPortfolio
            })
            
            return {data:undefined}
          } catch (err:any) {
            return { error: {status:"SELL_ERROR", err: err.message}}
          }
      }
    }),
    getTransactions: builder.query<Transaction[], void>({
      providesTags: ["Users"],
      async queryFn() {
        try {
          const usersSnapshot = await getDocs(collection(db, "users"));

          let Transactions: Transaction[] = [];
        
          usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const portfolio: Transaction[] = userData.portfolio || [];
            
            Transactions = Transactions.concat(portfolio);
          });
        
          Transactions.sort((a, b) => b.timestamp - a.timestamp);
        
          return { data: Transactions };
        } catch (error) {
          console.error("Ошибка получения всех транзакций:", error);
          let message = "Не удалось загрузить транзакции";
          if (error instanceof Error) message = error.message;
          return { error: { status: "CUSTOM_ERROR", error: message } };
        }
      },
    }),
    getCryptoForSell: builder.query<number, { userId:any; coinId: string }>({
      providesTags: ["Users"],
      async queryFn({ userId, coinId }) {
        try {
          const snap = await getDoc(doc(db, "users", userId))
          const data = snap.data()
          const portfolio = data?.portfolio ?? []
        
          const coin = portfolio.find((i:any) => i.coinId === coinId)
          const amount = coin?.amount ?? 0
        
          return { data: amount }
        } catch (error) {
          console.error(error)
          return { error: error as any }
        }
      }
    }),
    
    getTopUsers: builder.query<TopUsers[], void>({
      providesTags: ["Users"],
      async queryFn() {
        try {
          const topUsersCol = collection(db, "users");
          const snapshot = await getDocs(topUsersCol);
        
          const topUsers = snapshot.docs.map((doc) => ({
            id:doc.id,
            ...(doc.data() as Omit<TopUsers,"id">),
          }));
        
          return { data: topUsers };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              data: error,
            },
          };
        }
      },
    }),
  }),
});

export const { useGetUsersQuery,useGetTransactionsQuery,
               useGetTopUsersQuery,

              useBuyCryptoMutation,useGetCryptoForSellQuery,
              useSellCryptoMutation
                                   } = usersApi;