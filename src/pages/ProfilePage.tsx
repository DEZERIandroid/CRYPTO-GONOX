import { SearchOutlined, LogoutOutlined,GoogleOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth, db} from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Skeleton } from "antd";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/userSlice";
import { useGetUsersQuery } from "../app/api/UsersApi";
import { useGetCoinsPriceQuery } from "../app/api/CryptoApi";
import { useNavigate } from "react-router-dom";
import { linkGoogleProvider } from "@/hooks/useGoogle";
import { useAppSelector } from "../hooks/reduxHooks";
import { CameraFilled } from "@ant-design/icons";
import { useEffect,useState } from "react";

import "../styles/Pages/Profile.css"

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { email, name, role } = useAppSelector(state => state.user);
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery(undefined, {
    pollingInterval:3000
  });
  const [isModalPhotoEditShow,setIsModalPhotoEditShow] = useState(false)
  const [editPhotoURL,setEditPhotoURL] = useState("")
  const [succesGoogle,setSuccesGoogle] = useState(false)
  const user = users?.find((u) => u.email === email); 
  const photoURL = user?.photoURL

  const coinIds = user?.portfolio?.map((coin) => coin.coinId).filter(Boolean) || [];
  const { data: pricesData } = useGetCoinsPriceQuery(coinIds, {
    skip: coinIds.length === 0,
  });
  const isGoogleLinked = auth.currentUser?.providerData.some(
    p => p.providerId === "google.com"
  );

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(clearUser())
      navigate("/login" , {replace:true})
    } catch (error) {
      console.error("Ошибка при выходе: ", error)
    }
  }

  useEffect(() => {
    if (user?.id && user?.portfolio && pricesData) {
      const updatedPortfolio = user.portfolio.map(item => {
        const currentPrice = pricesData[item.coinId]?.usd;
        if (currentPrice !== undefined) {
          return {
            ...item,
            cryptoPrice: item.amount * currentPrice,
            cryptoTotalBalance: item.amount * currentPrice
          };
        
        }
        return item;
      });
       const totalBalance = updatedPortfolio.reduce((sum, item) => sum + (item.cryptoPrice || 0), 0);
       const superTotalBalance = totalBalance + user.balance
      updateDoc(doc(db, "users", user.id), {
        portfolio: updatedPortfolio,
        cryptoTotalBalance: superTotalBalance 
      }).catch(err => {
        console.warn("Не удалось обновить cryptoPrice:", err);
      });
    }
  }, [user?.id, user?.portfolio, pricesData]);

  const avatarEdit = () => {
    setIsModalPhotoEditShow(true)
  }

  const handleSaveEditPhoto = () => {
    if (editPhotoURL.trim() !== "" && editPhotoURL.length >= 10 && user?.id) {
      updateDoc(doc(db,"users",user.id), {
        photoURL:editPhotoURL
      })
      setIsModalPhotoEditShow(false)
      setEditPhotoURL("")
    }
  }

  const handleLinkGoogle = async () => {
    try {
      await linkGoogleProvider();
      setSuccesGoogle(true)
      setTimeout(() => {
        setSuccesGoogle(false)
      },1000)
    } catch (e) {
      console.log(e);
    }
  };
  
  if (isLoading)
      return (
        <div className="page-container">
          <div className="page-header">
            <Skeleton.Input active style={{ width: 200, height: 32 }} />
            <div className="header-actions">
              <Skeleton.Input active style={{ width: 250, height: 32 }} />
            </div>
          </div>
          <div className="user-content">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </div>
      );
  
    if (isError)
      return (
        <div className="error">
          Ошибка загрузки данных о пользователе
          <button className="retry-btn" onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      );

    if (!user) return <div className="loading-container">Пользователь не найден <button onClick={() => navigate("/login")} className="button-login">Логин</button> </div>;
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Профиль</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input" type="text" placeholder="Поиск" />
        </div>
      </div>

      <div className="profile-content">
        <div className="profile">
          <div className="profile">
            <div data-aos="fade-in" className="profile-avatar" onClick={avatarEdit}>
              <img src={photoURL} alt="" />
              <CameraFilled className="avatar-edit"/>
            </div>
            <div data-aos="fade-in" className="profile-name">{name || "—"}</div>
          </div>
          <div className="profile-info">
            <div data-aos="fade-in" className={role === "admin" ? "profile-role-admin" : "profile-role-user"}>{role === "admin" ? "Администратор" : "Пользователь"}</div>
          </div>
          <div className="stat-block stat-block-balance">
                <div data-aos="fade-in" className="balance balance-user">
                  <span className="stat-label">Баланс пользователя</span>
                  <span className="stat-value">
                    {user.balance ? user.balance.toFixed((2)) : "0"} $
                  </span>
                </div>
                <div  data-aos="fade-in" className="balance balance-crypto">
                  <span className="stat-label">Баланс крипты</span>
                  <span className="stat-value">
                    {user.portfolio && user.portfolio.length > 0 
                      ? user.portfolio.reduce((sum, coin) =>
                         sum + (coin.cryptoPrice || 0), 0).toFixed(2)
                      : "0"} $
                  </span>
                </div>
          </div>
        </div>

        <div className="user-portfolio">
          <h3 data-aos="fade-in" className="portfolio-title">Портфолио</h3>
          {user.portfolio && user.portfolio.length > 0 ? (
            <div data-aos="fade-in" className="crypto-list">
              {user.portfolio.map((coin, index) => {
                const amountNum = Number(coin.amount); 
                return (
                  <div 
                    key={coin.id || index}
                    className="crypto-item"
                    onClick={() => navigate(`/crypto/${coin.coinId}`)}>
                    <div className="crypto-left">
                      <img src={coin.image} alt={coin.coinId} />
                      <span className="crypto-name">{coin.symbol}</span>
                    </div>
                    <div className="crypto-right">
                      <div className="crypto-amount">
                        {amountNum < 0.01 
                          ? amountNum.toFixed(5) 
                          : amountNum.toFixed(2)} шт
                      </div>
                      <div className="crypto-value">
                        {(amountNum * (pricesData?.[coin.coinId]?.usd || coin.buyPrice)).toFixed(2)} $
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-portfolio">У пользователя пока нет крипты</p>
          )}
        </div>

        <div data-aos="fade-in" className="profile-details">
          <div  data-aos="fade-in" className="detail-item">
            <span className="label">Имя:</span>
            <span className="value">{name || "--"}</span>
          </div>
          <div  data-aos="fade-in" className="detail-item">
            <span className="label">Фамилия:</span>
            <span className="value"></span>
          </div>
          <div  data-aos="fade-in" className="detail-item">
            <span className="label">Электронная почта:</span>
            <span className="value">{email || "-"}</span>
          </div>
          <div  data-aos="fade-in" className="detail-item">
            <span className="label">Роль:</span>
            <span className="value">{role || "-"}</span>
          </div>
          <div className="google-add">
            {!isGoogleLinked ? (
              <button className="google-btn" onClick={handleLinkGoogle}>
                <GoogleOutlined/> Привязать Google
              </button>
            ) : (
              <span>Google подключён</span>
            )}
          </div>
          {succesGoogle && (
            <div className="success-google-overlay">
              <div className="success-google-modal">
                <h3>Google привязан</h3>
              </div>
            </div>
          )}
        </div>

        <div className="logout-container">
          <button data-aos="fade-in" className="logout-button" onClick={handleLogout}>
            <LogoutOutlined /> Выйти
          </button>
        </div>
      </div>

      {isModalPhotoEditShow && (
        <div className="photo-modal-overlay">
          <div className="photo-modal">
            <h2>Изменить фото</h2>

            <input
              type="text"
              placeholder="URL фото"
              value={editPhotoURL}
              onChange={(e) => setEditPhotoURL(e.target.value)}
            />

            <div className="photo-modal-buttons">
              <button className="photo-modal-save" onClick={handleSaveEditPhoto} >
                Сохранить
              </button>
              <button
                className="photo-modal-cancel"
                onClick={() => setIsModalPhotoEditShow(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;