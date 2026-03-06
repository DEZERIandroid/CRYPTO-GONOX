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
import { useCloseModal } from "@/hooks/useCloseModal"
import { useGetUsersQuery } from "../app/api/UsersApi"
import { useState } from "react"
import { CloseOutlined, EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import meduza from "../assets/SOL.jpg"

const Sidebar = () => {
  const { email, name, isAuthChecked } = useAppSelector(state => state.user);
  const { data: users, } = useGetUsersQuery(undefined, {
      pollingInterval:3000
    });
  const [watchingPass,setWatchingPass] = useState(false)
  const [emails, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mainModal = useCloseModal(200)
  const addModal = useCloseModal(150)
  
  const user = users?.find((u) => u.email === email); 
  const photoURL = user?.photoURL

  const location = useLocation()
  const isHome = location.pathname === '/';
  const isUsers = location.pathname.startsWith('/users');
  const isUsersTop = location.pathname.startsWith('/topusers');
  const isMarket = location.pathname.startsWith('/market');
  const isTransactions = location.pathname.startsWith('/transactions');
  const isSetting = location.pathname.startsWith('/setting');


  const handleWatchPassword = () => {
    setWatchingPass(!watchingPass)
  }
  const closeAllModal = () => {
    mainModal.closeModal()
    addModal.closeModal()
  }

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
              <button onClick={mainModal.isOpen ? closeAllModal : mainModal.openModal}
                      data-aos="fade-in" className="user-change">
                        {mainModal.isOpen ? 'Закрыть' : 'Изменить'}
              </button>
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

        {mainModal.isOpen && (
              <div data-aos="zoom-in-right"
                   data-aos-duration="150" 
                   className={`modal-change ${mainModal.modalClass ? 'closing' : ''}`}>
                      <div className="exit-modal"
                           onClick={closeAllModal}>
                        <CloseOutlined className="exit-btn" />
                      </div>
                      <div className="accounts">
                        <div className="account">
                            <div className="account-avatar">
                              {user?.photoURL ? (
                                <img src={user.photoURL} alt="" />
                              ) : (<Skeleton.Avatar active style={{ width: "40px", height: "40px" }} />)}
                            </div>
                            <div className="account-text">
                              <div className="account-name">{user?.displayName}</div>
                              <div className="account-email">{user?.email}</div>
                            </div>
                            <div className="account-leave">
                              <button className="account-leave-btn">Выйти</button>
                            </div>
                        </div>
                        <div className="account">
                            <div className="account-avatar">
                              {user?.photoURL ? (
                                <img src={meduza} alt="" />
                              ) : (<Skeleton.Avatar active style={{ width: "40px", height: "40px" }} />)}
                            </div>
                            <div className="account-text">
                              <div className="account-name">Солана</div>
                              <div className="account-email">solana@gmail.com</div>
                            </div>
                            <div className="account-change">
                              <button className="account-change-btn">Сменить</button>
                            </div>
                        </div>
                      </div>

                      <div className="account-add">
                         <button className="account-add-btn" 
                                 onClick={addModal.isOpen ? addModal.closeModal : addModal.openModal}>
                           <PlusOutlined className="plus"/>Добавить аккаунт
                         </button>
                      </div>
                      
                        {addModal.isOpen && (
                            <div className={`account-add-modal ${addModal.modalClass ? 'closing' : ''}`}
                                    data-aos="zoom-in-down" 
                                    data-aos-duration="150"
                                    onClick={(e) => e.stopPropagation()} >
                                <div className="account-add-modal-inputs">
                                  <input
                                      className="account-add-modal-input-email"
                                      type="email"
                                      placeholder="Почта"
                                      value={emails}
                                      onChange={(e) => {
                                        setEmail(e.target.value)
                                      }}
                                    />
                                    <div className="account-add-modal-password-watch">
                                      <input
                                        className="account-add-modal-input-password"
                                        type={watchingPass ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => {
                                          setPassword(e.target.value)
                                        }}
                                      />
                                      <div className="account-add-modal-watch" onClick={handleWatchPassword}>
                                        {watchingPass ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                      </div>
                                    </div>
                                </div>
                                <div className="buttons-account">
                                  <button className="button-add-account"
                                          onClick={addModal.closeModal}
                                  >
                                    Добавить
                                  </button>
                                  <button className="button-modal-close"
                                          onClick={addModal.closeModal}
                                  >
                                    Отмена
                                  </button>
                                </div>
                              </div>
                        )}
                        </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar