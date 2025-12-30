import { Route,Routes } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Error from "../pages/Error"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"

import ProfilePage from "../pages/ProfilePage"
import UsersPage from "../pages/UsersPage"
import UserPage from "../pages/UserPage"
import MarketPage from "../pages/MarketPage"
import CryptoPage from "../pages/CryptoPage"
import TransactionsPage from "../pages/TransactionsPage"
import TopUsers from "../pages/TopUsers"
import SettingsPage from "../pages/SettingPage"

const AppRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />


          <Route element = {<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage/>} />

            <Route path="/users" element={<UsersPage/>} />
            <Route path="/user/:id" element={<UserPage/>} />            
            <Route path="/topusers" element={<TopUsers/>} />            

            <Route path="/market" element={<MarketPage/>} />
            <Route path="/crypto/:id" element={<CryptoPage/>}/>

            <Route path="/transactions" element={<TransactionsPage/>} />
            <Route path="/setting" element={<SettingsPage/>} />
          </Route>


            <Route path="/*" element={<Error/>} />
        </Routes>
    </div>
  )
}

export default AppRoutes