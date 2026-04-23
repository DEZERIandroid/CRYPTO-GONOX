import bcrypt from 'bcryptjs';
import { Link, useLocation, useNavigate } from "react-router-dom"
import { HomeIcon } from "./Icons/HomeIcon"
import { MarketIcon } from "./Icons/MarketIcon"
import { UsersIcon } from "./Icons/UsersIcon"
import { TransactionsIcon } from "./Icons/TransactionsIcon"
import { SettingsIcon } from "./Icons/Setting"
import { Skeleton, Tooltip } from "antd"
import ThemeToggle from "../assets/themeToggle"
import "../styles/Components/Sidebar.css"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { useCloseModal } from "@/hooks/useCloseModal"
import { useEffect, useState } from "react"
import { setUser } from "../features/userSlice";
import { CloseOutlined, EyeInvisibleOutlined, EyeOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons"
import { signOut, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase"
import { clearUser } from "@/features/userSlice"
import { useWindowSize } from "@uidotdev/usehooks"
import { motion, AnimatePresence } from 'framer-motion';
import useGetUser from "@/hooks/useGetUser"
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import type { accountsForSwitch } from '@/app/api/UsersApi';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { email, name, isAuthChecked, uid, photoURL:PhotoURL} = useAppSelector(state => state.user);
  const { users } = useGetUser()
  const userMain = useAppSelector(state => state.user)
  const [burgerModal,setBurgerModal] = useState(false)
  const [watchingPass,setWatchingPass] = useState(false)
  const [names, setName] = useState("");
  const [emails, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState<string | null>(null)
  const [errorClosing,setErrorClosing] = useState(false)
  const [accounts,setAccounts] = useState([])
  const [nameforSwitch,setNameforSwitch] = useState("")
  const [emailforSwitch,setEmailforSwitch] = useState("")
  const [photoforSwitch,setPhotoforSwitch] = useState("")
  const [passwordInput,setPasswordInput] = useState("")
  const mainModal = useCloseModal(100)
  const addModal = useCloseModal(150)
  const accountModal = useCloseModal(150)
  const passwordModal = useCloseModal(150)
  const leaveConfirmModal = useCloseModal(150)
  
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

  const ReloadSite = () => {
    window.location.reload()
  }

  const handleWatchPassword = () => {
    setWatchingPass(!watchingPass)
  }
  const closeAllModal = () => {
    mainModal.closeModal()
    addModal.closeModal()
    accountModal.closeModal()
    passwordModal.closeModal()
    leaveConfirmModal.closeModal()
  }
  const handleLogout = (e:any) => {
    e.stopPropagation()
    try {
      signOut(auth)
      dispatch(clearUser())
      navigate("/login" , {replace:true})
      mainModal.closeModal()
      accountModal.closeModal()
    } catch (error) {
      console.error("Ошибка при выходе", error)
    }
  }

  const handleRegisterTo = () => {
    closeAllModal()
    signOut(auth)
    dispatch(clearUser())
    navigate("/register")
  }
  
  const switchModalOpen = (item:{email:string}) => {
    setEmailforSwitch(item.email)
    passwordModal.openModal()
  }
  const handleSwitch = async (email:string) => {
    if (!uid || !passwordInput) {
      setError("Введите пароль");
      return;
    }

    const userDoc = doc(db,"users",uid)
    const userSnap = await getDoc(userDoc)
    const userData = userSnap.data()
    const accounts = userData?.accountsForSwitch || []
    
    const accountSwitch = accounts.find((acc:any) => acc.email == email)
    if (!accountSwitch) return;

    const passwordforSwitch = accountSwitch.password


    const isMatch = bcrypt.compareSync(passwordInput, passwordforSwitch);
      if (!isMatch) {
        setError("Неправильный пароль")
        return
    }

    try {
      const thisLocation = location.pathname
      signOut(auth)
      dispatch(clearUser())
      closeAllModal()

      const userCredential = await signInWithEmailAndPassword(auth,email,passwordInput)
      const { user } = userCredential
      ReloadSite()
      navigate(`${thisLocation}`)

      const userDoc = await getDoc(doc(db, "users", user.uid));

      const userSnap = userDoc.data()

      if (userDoc.exists()) {
              const displayName = userSnap?.displayName || user.email?.split('@')[0] || "Пользователь";
      
              dispatch(setUser({
                uid: user.uid,
                email: user.email,
                name: displayName,
                role: userSnap?.role || "user",
          }))
      }
    } catch (error) {
      console.error("Ошибка при выходе", error)
    }
  }

  const addNewAccount = async () => {
    const cleanEmail = emails.trim().toLowerCase();
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

      const usersCol = collection(db,"users")
      const snapshot = await getDocs(usersCol);

      const users = snapshot.docs.map((doc) => {
                        const data = doc.data() as {
                          uid:any,
                          email?: string;
                          password?:string | any,
                          photoURL:string
                        };
                      
                        return {
                          uid:doc.id,
                          email: data.email,
                          password:data.password,
                          photoURL:data.photoURL
                        };
                    });
      const user = users.find(user => user.email == emails)
      if (!user) {
        setError("Пользователь не найден");
        return;
      }
      const hashedPassword = user.password
      if (!hashedPassword) {
        setError("Профиль требует обновления. Войдите в тот аккаунт обычным способом.");
        return
      } 
      const isMatch = bcrypt.compareSync(password, hashedPassword);
      
      if (!isMatch) {
        setError("Неправильный пароль");
        return;
      }





      
      const userDocRef = doc(db,"users",uid)
      
      const userDoc = await getDoc(doc(db, "users",uid));
      
      const userData = userDoc.data()
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
        const userDocRef = doc(db,"users",uid)
        const userDoc = await getDoc(doc(db, "users",uid));
        const userData = userDoc.data()
        const accounts = userData?.accountsForSwitch || []
        
          if (accounts) {
              updateDoc(userDocRef, {
                accountsForSwitch:[...accounts,{
                  name:cleanName,
                  email:emails,
                  password:hashedPassword,
                  photoURL:user.photoURL
                }]
            })
        }

        setEmail("")
        setName("")
        setPassword("")
        setError(null)
        addModal.closeModal()
      } else {
          await updateDoc(userDocRef, {
            accountsForSwitch:[{
            }]
          })
        }
      addModal.closeModal()
      console.log(2)
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
      }
    })
    return () => unsubscribe()
  },[uid])

  useEffect(() => {
    if (!error) return

    setErrorClosing(false)
    
    const closingTimer = setTimeout(() => {
      setErrorClosing(true)
    },3500)
    
    const clearTimer = setTimeout(() => {
      setError("")
      setErrorClosing(false)
    },3600)
    return () => {
      clearTimeout(closingTimer)
      clearTimeout(clearTimer)
    }
    
  },[error])

  const accountInfoOpen = (EmailPassword:{name:string,email:string,photoURL:string}) => {
    accountModal.openModal()
    setNameforSwitch(EmailPassword.name)
    setEmailforSwitch(EmailPassword.email)
    setPhotoforSwitch(EmailPassword.photoURL)
  }

  const deleteAccount = () => {
    alert("Агьигьа")
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
                    <div className="title" style={{margin:"-20px 0 10px 0"}}>Аккаунты</div>
                      <div className="exit-modal"
                           onClick={closeAllModal}>
                        <CloseOutlined className="exit-btn" />
                      </div>
                      <div className="accounts">
                        <div className="account">
                          <div className="account-avatar">
                            {PhotoURL
                                      ? <><img src={PhotoURL} alt="" /></> 
                                      : <Skeleton.Avatar active style={{ width: "40px", height: "40px",}} />
                            }
                          </div>
                          <div className="account-text">
                            <div className="account-name">{name}</div>
                            <div className="account-email">{email}</div>
                          </div>
                            <div className="account-leave" onClick={(e) => e.stopPropagation()}>
                              <button className="account-leave-btn" 
                                      onClick={handleLogout} >
                                Выйти
                              </button>
                            </div>
                        </div>
                            {accounts.map((item:accountsForSwitch,index) => (
                                <div className="account" key={index}
                                     onClick={() => accountInfoOpen(item)}>
                                  <div className="account-avatar">
                                    {item.photoURL
                                              ? <><img src={item.photoURL} alt="" /></> 
                                              : <Skeleton.Avatar active style={{ width: "40px", height: "40px",}} />
                                    }
                                  </div>
                                  <div className="account-text">
                                    <div className="account-name">{item.name}</div>
                                    <div className="account-email">{item.email}</div>
                                  </div>
                                  {email == item.email ?
                                    <div className="account-leave" onClick={(e) => e.stopPropagation()}>
                                      <button className="account-leave-btn">
                                        Удалить
                                      </button>
                                    </div>
                                  :  
                                    <div className="account-change" onClick={(e) => e.stopPropagation()}>
                                      <button className="account-change-btn"
                                              onClick={() => switchModalOpen(item)}>
                                        Сменить
                                      </button>
                                    </div>
                                  }
                                 
                                </div>
                              ))}
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
                      data-aos={isMobile ? "zoom-in" : "zoom-in"} 
                      data-aos-duration="150"
                      onClick={(e) => e.stopPropagation()} >
                  <div className="title" style={{margin:"-10px 0 -5px 0"}}>Пароль от аккаунта</div>
                  <div className="exit-modal"
                           onClick={() => addModal.closeModal()}>
                        <CloseOutlined className="exit-btn" />
                  </div>
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
                        <div className="account-add-footer">
                                <button onClick={() => leaveConfirmModal.openModal()} className="registerLink account-register-addlink">
                                  Хотите создать аккаунт?
                                </button>
                        </div>
                      </div>
                  </div>
                  <div className="buttons-account">
                    <button className="button-add-account"
                            onClick={addNewAccount}
                    >
                      Добавить
                    </button>
                  </div>
                  {error && 
                    <div className={`error-modal error-add ${errorClosing ? 'fade-out' : 'fade-in'}`}>
                        <div>{error}</div>
                    </div>
                  }
                </div>
                </div>
            )}

            {leaveConfirmModal.isOpen && (
               <div className="leave-confirm-modal-ovarlay "
                   onClick={() => leaveConfirmModal.closeModal()}>
                  <div className={isMobile ? `leave-confirm-modal-mobile 
                                    ${leaveConfirmModal.modalClass ? 'closing' : ''}`
                                    : `leave-confirm-modal ${leaveConfirmModal.modalClass ? 'closing' : ''}`}
                       data-aos="zoom-in" 
                       data-aos-duration="150"
                       onClick={(e) => e.stopPropagation()}
                  >
                      <div className="leave-block">
                        <span className='leave-text'>
                          Уверены что хотите выйти из 
                            <Tooltip placement="top" title={email}>
                                <span style={{color:"#3b82f6"}}> текущего </span>
                            </Tooltip>
                           аккаунта?
                        </span>
                      </div>
                      <div className="leave-buttons">
                        <button className="account-info-btn edit-account-btn leave-btnon"
                                onClick={handleRegisterTo}>
                          Да
                        </button>
                        <button className="account-info-btn remove-account-btn leave-btnon"
                                onClick={() => leaveConfirmModal.closeModal()}>
                          Нет
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
                         data-aos="zoom-in" 
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
                                {photoforSwitch
                                              ? <><img src={photoforSwitch} alt="" style={{width:"65px",height:"65px"}}/></> 
                                              : <Skeleton.Avatar active style={{ width: "40px", height: "40px",}} />
                                    }
                            </div>
                            <div className="account-info-name">
                              {nameforSwitch}
                            </div>
                            <div className="account-info-email">
                              {emailforSwitch}
                            </div>
                        </div>
                        <div className="account-info-buttons">
                          <button className="account-info-btn edit-account-btn">Редактировать</button>
                          <button className="account-info-btn remove-account-btn"
                                  onClick={deleteAccount}>
                                    Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                    {passwordModal.isOpen && (
                      <div className="modal-overlay password-modal-overlay"
                         onClick={() => passwordModal.closeModal()}>
                        <div className={isMobile ? `account-info-modal-mobile  password-modal-mobile
                                          ${passwordModal.modalClass ? 'closing' : ''}`
                                          : `account-info-modal password-modal${passwordModal.modalClass ? 'closing' : ''}`}
                             data-aos="zoom-in" 
                             data-aos-duration="150"
                             onClick={(e) => e.stopPropagation()}
                        >
                          <div className="title">Пароль от аккаунта</div>
                          <div className="exit-modal"
                               onClick={() => passwordModal.closeModal()}>
                            <CloseOutlined className="exit-btn" />
                          </div>
                          <div className="account-add-modal-inputs">
                            <input
                              className="password-modal-input"
                              type={watchingPass ? "text" : "password"}
                              placeholder="Пароль"
                              value={passwordInput}
                              onChange={(e) => {
                                setPasswordInput(e.target.value)
                                setError(null);
                              }}
                              style={{borderBottom:error ? "1px solid red" : ""}}
                            />
                            <div className="account-add-modal-watch password-modal-watch" onClick={handleWatchPassword}>
                              {watchingPass ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                            </div>
                          </div>
                          <button className="button-login" onClick={() => handleSwitch(emailforSwitch)}>
                            Войти
                          </button>
                          {error && 
                            <div className={`error-modal error-add ${errorClosing ? 'fade-out' : 'fade-in'}`} >
                                <div>{error}</div>
                            </div>
                          }
                        </div>
                      </div>
                    )}
    </div>
  )
}

export default Sidebar