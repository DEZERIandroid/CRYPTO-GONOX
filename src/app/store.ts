import { configureStore } from "@reduxjs/toolkit"
import { usersApi } from "./api/UsersApi"
import UserSlice from "../features/userSlice"
import { CryptoApi } from "./api/CryptoApi"

const store = configureStore({
    reducer:{
        [usersApi.reducerPath]: usersApi.reducer,
        [CryptoApi.reducerPath]: CryptoApi.reducer,
        user:UserSlice
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(usersApi.middleware, 
                                      CryptoApi.middleware),
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;