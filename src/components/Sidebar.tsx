import { Link, useLocation, useNavigate } from "react-router-dom"
import { HomeIcon } from "./Icons/HomeIcon"
import { MarketIcon } from "./Icons/MarketIcon"
import { UsersIcon } from "./Icons/UsersIcon"
import { TransactionsIcon } from "./Icons/TransactionsIcon"
import { SettingsIcon } from "./Icons/Setting"
import { Skeleton } from "antd"
import ThemeToggle from "../assets/themeToggle"
import "../styles/Components/Sidebar.css"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { useCloseModal } from "@/hooks/useCloseModal"
import { useState } from "react"
import { CloseOutlined, EyeInvisibleOutlined, EyeOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons"
import meduza from "../assets/SOL.jpg"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import { clearUser } from "@/features/userSlice"
import { useWindowSize } from "@uidotdev/usehooks"
import { motion, AnimatePresence } from 'framer-motion';
import useGetUser from "@/hooks/useGetUser"

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { email, name, isAuthChecked } = useAppSelector(state => state.user);
  const { users } = useGetUser()
  const [burgerModal,setBurgerModal] = useState(false)
  const [watchingPass,setWatchingPass] = useState(false)
  const [emails, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mainModal = useCloseModal(100)
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
  const isProfile = location.pathname.startsWith('/profile');

  const size = useWindowSize();
  const isMobile = size.width !== null && size.width <= 480;

  const handleWatchPassword = () => {
    setWatchingPass(!watchingPass)
  }
  const closeAllModal = () => {
    mainModal.closeModal()
    addModal.closeModal()
  }

  const handleLogout = () => {
    try {
      signOut(auth)
      dispatch(clearUser())
      navigate("/login" , {replace:true})
      mainModal.closeModal()
    } catch (error) {
      console.error("Ошибка при выходе", error)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        {isMobile && (
          <motion.div 
            className="burger-menu"
            onClick={() => setBurgerModal(!burgerModal)}
            whileTap={{ scale: 1 }}
          >
            <MenuOutlined />
                
            
          </motion.div>
          
        )}

        {isAuthChecked && user && isMobile && (
          <button 
            onClick={mainModal.isOpen ? closeAllModal : mainModal.openModal}
            data-aos="fade-in" 
            className={`user-change-mobile ${mainModal.isClosing ? "closing" : ""}`}
          >
            {mainModal.isOpen ? 'Закрыть' : 'Изменить'}
          </button>
        )}
        <div className="sidebar-logo">
          <Link to="/" className="logo"></Link>
        </div>

        {isAuthChecked ? (
          user ? (
            <div className="user">
              <div className="avatar-container">
              <Link  data-aos="fade-in" to="/profile">
                {user.photoURL ? (
                  <img  className="user-avatar" style={{border:isProfile ? "1px solid white" : ""}} src={photoURL} alt="Аватар" />
                ) : (
                  <Skeleton.Avatar active style={{ width: "90px", height: "90px" }} />
                )}
              </Link>
              </div>
              <div data-aos="fade-in" className="user-name">
                {name || <Skeleton paragraph={false} active style={{ width: 80, height: 29 }} />}
              </div>
              <button onClick={mainModal.isOpen ? closeAllModal : mainModal.openModal}
                      data-aos="fade-in" 
                      className={`user-change ${mainModal.isClosing ? "closing" : ""}`}>
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
        
      </div>


      <AnimatePresence>
        {burgerModal && !mainModal.isOpen && (
          <div className="burger-modal-overlay" 
               onClick={() => setBurgerModal(false)}>
          <motion.nav 
            className="burger-items"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.13, ease: "easeInOut" }}
          >
            {[
              { path: "/", icon: HomeIcon, label: "Главная", active: isHome },
              { path: "/topusers", icon: UsersIcon, label: "Пользователи", active: isUsers || isUsersTop },
              { path: "/market", icon: MarketIcon, label: "Рынок", active: isMarket },
              { path: "/transactions", icon: TransactionsIcon, label: "Транзакции", active: isTransactions },
              { path: "/setting", icon: SettingsIcon, label: "Настройки", active: isSetting }
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ x: 0, opacity: 0 }}
                animate={{ y: 3, opacity: 1 }}
                transition={{ delay: index * 0.04, type: "spring", stiffness: 120 }}
              >
                <Link 
                  to={item.path}
                  className={item.active ? "burger-item-actived" : "burger-item"}
                >
                  <item.icon className="sidebar-icon"/>
                  <div className="burger-nav-link">{item.label}</div>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          </div>
        )}
      </AnimatePresence>

      {mainModal.isOpen && (
              <div className="modal-overlay"
                   onClick={closeAllModal}>
              <div data-aos={isMobile ? "zoom-in-down" : "zoom-in-right"}
                   data-aos-duration="150"
                   onClick={(e) => e.stopPropagation()}
                   className={isMobile ? `modal-change-mobile ${mainModal.modalClass ? 'closing' : ''}` : `modal-change ${mainModal.modalClass ? 'closing' : ''}`}>
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
                            <div className="account-leave" onClick={handleLogout} >
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
                           {!addModal.isOpen ? 
                            <><PlusOutlined className="plus"/>Добавить аккаунт</> 
                            : <><CloseOutlined className="plus"/>Закрыть</>
                           }
                         </button>
                      </div>           
                </div>
                </div>
        )}
          {addModal.isOpen && (
                <div className="modal-overlay"
                     onClick={() => addModal.closeModal()}>
                <div className={isMobile ? `account-add-modal-mobile ${addModal.modalClass ? 'closing' : ''}` : `account-add-modal ${addModal.modalClass ? 'closing' : ''}`}
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
                </div>
            )}
            
    </div>
  )
}

export default Sidebar