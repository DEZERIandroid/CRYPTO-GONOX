import { Link } from "react-router-dom"
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
              <button data-aos="fade-in" className="user-edit">Изменить</button>
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
          <div style={{paddingTop: isAuthChecked ? "0px" : "30px"}}></div>
          <Link to="/" className="item">
            <HomeIcon className="sidebar-icon"/>
            <div className="nav-link">Главная</div>
          </Link>
          <Link to="/topusers" className="item">
            <UsersIcon className="sidebar-icon"/>
            <div className="nav-link">Пользователи</div>
          </Link>
          <Link to="/market" className="item">
            <MarketIcon className="sidebar-icon"/>
            <div className="nav-link">Рынок</div>
          </Link>
          <Link to="/transactions" className="item">
            <TransactionsIcon className="sidebar-icon"/>
            <div className="nav-link">Транзакции</div>
          </Link>
          <Link to="/setting" className="item">
            <SettingsIcon className="sidebar-icon"/>
            <div className="nav-link">Настройки</div>
          </Link>
        </nav>
        <div className="sidebar-theme-toggle">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default Sidebar