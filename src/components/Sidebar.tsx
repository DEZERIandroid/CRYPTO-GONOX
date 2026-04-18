import bcrypt from 'bcryptjs';
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
import { useEffect, useState } from "react"
import { CloseOutlined, EyeInvisibleOutlined, EyeOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons"
import { signOut } from "firebase/auth"
import { auth, db } from "@/firebase"
import { clearUser } from "@/features/userSlice"
import { useWindowSize } from "@uidotdev/usehooks"
import { motion, AnimatePresence } from 'framer-motion';
import useGetUser from "@/hooks/useGetUser"
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import type { accountsForSwitch } from '@/app/api/UsersApi';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { email, name, isAuthChecked, uid} = useAppSelector(state => state.user);
  const { users } = useGetUser()
  const userMain = useAppSelector(state => state.user)
  const [burgerModal,setBurgerModal] = useState(false)
  const [watchingPass,setWatchingPass] = useState(false)
  const [names, setName] = useState("");
  const [emails, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState<string | null>(null)
  const [accounts,setAccounts] = useState([])
  const mainModal = useCloseModal(100)
  const addModal = useCloseModal(150)
  const accountModal = useCloseModal(150)
  
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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const addNewAccount = async () => {
    const cleanEmail = emails.trim();
    const cleanPassword = password.trim();
    const cleanName = names.trim();
    
    if (!cleanEmail || !cleanPassword || !cleanName) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
  
    if (!isValidEmail(cleanEmail)) {
      setError("Неверный формат email");
      return;
    }
    
    if (cleanName.length > 16) {
      setError("Имя слишком длинное")
      return
    }
    if (cleanPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    try {
      if (!uid) return

      const userDocRef = doc(db,"users",uid)
      const userSnap = await getDoc(userDocRef)
      const userData = userSnap.data()
      const accounts = userData?.accountsForSwitch || []

      const isDuplicate = accounts.some((acc: any) => 
                            acc.email?.trim().toLowerCase() === cleanEmail
                          );

      if (accounts.length >= 5) {
        setError("Cлишком много аккаунтов");
        return
      }

      if (isDuplicate) {
        setError("Этот аккаунт уже добавлен");
        console.log("Дубликат найден:", cleanEmail);
        return
      }

      if (accounts) {
        updateDoc(userDocRef, {
          accountsForSwitch:[...accounts,{
            name:names,
            email:emails,
            password:hashedPassword
          }]
        })
        setEmail("")
        setName("")
        setPassword("")
        setError(null)
      } else {
          updateDoc(userDocRef, {
            accountsForSwitch:[{
              name:name,
              email:email,
              password:""
            }]
          })
        }
      addModal.closeModal()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!uid) return

    const userRef = doc(db,"users",uid)

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        const accountsForSwitch = data?.accountsForSwitch || []
        if (accountsForSwitch) {
          setAccounts(accountsForSwitch)
        }
        const userObj = accountsForSwitch.find((item:any) => item.email == email)
        if (userObj && userObj.uid) {
          const userObjRef = doc(db,"users",userObj.uid)
          console.log(userObj)
          updateDoc(userObjRef, {
            ...accountsForSwitch ,accountsForSwitch:[{
              photoURL: photoURL
            }]
          })
        }
      }
    })
    return () => unsubscribe()
  },[uid])


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
        <div className="sidebar-logo"
             style={{marginRight:!userMain?.uid && isMobile ? "30px" : ''}}>
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
          <Link to="/market" 
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
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)"}}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.13, ease: "easeOut" }}
          >
            {[
              { path: "/", icon: HomeIcon, label: "Главная", active: isHome },
              { path: "/topusers", icon: UsersIcon, label: "Пользователи", active: isUsers || isUsersTop },
              { path: "/market", icon: MarketIcon, label: "Рынок", active: isMarket },
              { path: "/transactions", icon: TransactionsIcon, label: "Транзакции", active: isTransactions },
              { path: "/setting", icon: SettingsIcon, label: "Настройки", active: isSetting }
            ].map((item) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
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
                        {accounts.length > 0 ? 
                          <>
                            {accounts.map((item:accountsForSwitch,index) => (
                                <div className="account" key={index}
                                     onClick={() => accountModal.openModal()}>
                                  <div className="account-avatar">
                                    <Skeleton.Avatar active style={{ width: "40px", height: "40px",}} />
                                  </div>
                                  <div className="account-text">
                                    <div className="account-name">{item.name}</div>
                                    <div className="account-email">{item.email}</div>
                                  </div>
                                  {email == item.email ?
                                    <div className="account-leave" onClick={handleLogout} >
                                      <button className="account-leave-btn">Выйти</button>
                                    </div>
                                  :  
                                    <div className="account-change">
                                      <button className="account-change-btn">{email == item.email ? "Выйти" : "Сменить"}</button>
                                    </div>
                                  }
                                 
                                </div>
                              ))}
                         </>
                          : <div>Аккаунтов нет</div>}
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
                      data-aos={isMobile ? "zoom-in" : "zoom-in-down"} 
                      data-aos-duration="150"
                      onClick={(e) => e.stopPropagation()} >
                  <div className="account-add-modal-inputs">
                    <input
                        className="account-add-modal-input-email"
                        type="text"
                        placeholder="Имя"
                        value={names}
                        onChange={(e) => {
                          setName(e.target.value)
                          setError(null);
                        }}
                        style={{borderBottom:error ? "1px solid red" : ""}}
                      />
                    <input
                        className="account-add-modal-input-email"
                        type="email"
                        placeholder="Почта"
                        value={emails}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError(null);
                        }}
                        style={{borderBottom:error ? "1px solid red" : ""}}
                      />
                      <div className="account-add-modal-password-watch">
                        <input
                          className="account-add-modal-input-password"
                          type={watchingPass ? "text" : "password"}
                          placeholder="Пароль"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError(null);
                          }}
                          style={{borderBottom:error ? "1px solid red" : ""}}
                        />
                        <div className="account-add-modal-watch" onClick={handleWatchPassword}>
                          {watchingPass ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                        </div>
                      </div>
                  </div>
                  <div className="buttons-account">
                    <button className="button-add-account"
                            onClick={addNewAccount}
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
            
                {accountModal.isOpen && (
                  <div className="modal-overlay"
                     onClick={() => accountModal.closeModal()}>
                    <div className={isMobile ? `account-info-modal-mobile 
                                      ${accountModal.modalClass ? 'closing' : ''}`
                                      : `account-info-modal ${accountModal.modalClass ? 'closing' : ''}`}
                         data-aos="zoom-in-down" 
                         data-aos-duration="150"
                         onClick={(e) => e.stopPropagation()}
                    >
                      <div className="exit-modal"
                           onClick={() => accountModal.closeModal()}>
                        <CloseOutlined className="exit-btn" />
                      </div>
                      <div className="account-info">
                        <div className="account-info-text">
                          <div className="account-avatar">
                                    <Skeleton.Avatar active style={{ width: "60px", height: "60px",}} />
                          </div>
                          <div className="account-info-name">
                            Пусто
                          </div>
                          <div className="account-info-email">
                            Пусто@gmail.com
                          </div>
                        </div>
                        <div className="account-info-buttons">
                          <button className="account-info-btn edit-account-btn">Редактировать</button>
                          <button className="account-info-btn remove-account-btn">Удалить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    </div>
  )
}

export default Sidebar