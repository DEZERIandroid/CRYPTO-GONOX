import { Link, useLocation } from "react-router-dom"
import { HomeIcon } from "./Icons/HomeIcon"
import { MarketIcon } from "./Icons/MarketIcon"
import { UsersIcon } from "./Icons/UsersIcon"
import { TransactionsIcon } from "./Icons/TransactionsIcon"
import { SettingsIcon } from "./Icons/Setting"
import { Skeleton } from "antd"
import ThemeToggle from "../assets/themeToggle"
import "../styles/Components/Sidebar.css"
import { useAppSelector } from "../hooks/reduxHooks"
import { useGetUsersQuery } from "../app/api/UsersApi"

const Sidebar = () => {
  const { email, name, isAuthChecked } = useAppSelector(state => state.user);
  const { data: users, } = useGetUsersQuery(undefined, {
      pollingInterval:3000
    });
  const user = users?.find((u) => u.email === email); 
  const photoURL = user?.photoURL

  const location = useLocation()
  const isHome = location.pathname === '/';
  const isUsers = location.pathname.startsWith('/users');
  const isUsersTop = location.pathname.startsWith('/topusers');
  const isMarket = location.pathname.startsWith('/market');
  const isTransactions = location.pathname.startsWith('/transactions');
  const isSetting = location.pathname.startsWith('/setting');

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-logo">
          <Link to="/" className="logo"></Link>
        </div>

        {isAuthChecked ? (
          user ? (
            <div className="user">
              <Link data-aos="fade-in" to="/profile">
                {user.photoURL ? (
                  <img className="user-avatar" src={photoURL} alt="Аватар" />
                ) : (
                  <Skeleton.Avatar active style={{ width: "90px", height: "90px" }} />
                )}
              </Link>
              <div data-aos="fade-in" className="user-name">
                {name || <Skeleton paragraph={false} active style={{ width: 80, height: 29 }} />}
              </div>
              <button data-aos="fade-in" className="user-change">Изменить</button>
            </div>
          ) : null
        ) : (
          <div className="user">
            <Skeleton.Avatar active style={{ width: "90px", height: "90px" }} />
            <div className="user-name">
              <Skeleton paragraph={false} active style={{ width: 80, height: 29 }} />
            </div>
            <Skeleton.Button active style={{ width: 80, height: 32 }} />
          </div>
        )}

        <nav className="sidebar-items" >
          <Link data-aos="fade-in" to="/"
                className={isHome ? "item-actived" : "item"}>
            <HomeIcon className="sidebar-icon"/>
            <div style={{color:isHome ? "white" : ""}} className="nav-link" >Главная</div>
          </Link>
          <Link data-aos="fade-in" to="/topusers" 
                className={isUsers || isUsersTop ? "item-actived" : "item"}>
            <UsersIcon className="sidebar-icon"/>
            <div style={{color:isUsers || isUsersTop ? "white" : ""}} className="nav-link">Пользователи</div>
          </Link>
          <Link data-aos="fade-in" to="/market" 
                className={isMarket ? "item-actived" : "item"}>
            <MarketIcon className="sidebar-icon"/>
            <div style={{color:isMarket ? "white" : ""}} className="nav-link">Рынок</div>
          </Link>
          <Link data-aos="fade-in" to="/transactions" 
                className={isTransactions ? "item-actived" : "item"}>
            <TransactionsIcon className="sidebar-icon"/>
            <div style={{color:isTransactions ? "white" : ""}} className="nav-link">Транзакции</div>
          </Link>
          <Link data-aos="fade-in" to="/setting"
                className={isSetting ? "item-actived" : "item"}>
            <SettingsIcon className="sidebar-icon"/>
            <div style={{color:isSetting ? "white" : ""}} className="nav-link">Настройки</div>
          </Link>
        </nav>
        <div data-aos="fade-in" className="sidebar-theme-toggle">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default Sidebar