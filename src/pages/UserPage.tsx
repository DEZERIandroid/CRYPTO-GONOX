import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../app/api/UsersApi";
import { Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/Pages/User.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useGetCoinsPriceQuery } from "../app/api/CryptoApi"

const UserPage = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { data: users, isLoading:usersLoading, isError, refetch } = useGetUsersQuery(undefined , {
    pollingInterval:3000
  });

  const user = users?.find((u) => u.id === id);
  const coinIds = user?.portfolio?.map((coin) => coin.coinId) || [];
  const { data: pricesData, isLoading: pricesLoading } = useGetCoinsPriceQuery(coinIds);

  
  if (usersLoading && pricesLoading)
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
    
    if (!user) return <div className="loading-container">Пользователь не найден</div>;
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="header-title">Профиль пользователя {user.displayName}</h1>
        <div className="header-actions">
        </div>
      </div>
      <div className="user-content">
         <button onClick={() => navigate("/topusers")} className="return-btn">
            <ArrowLeftOutlined/> Назад к списку
        </button>
        <div data-aos="fade-in" className="user-header">
          <div className="user-info-avatar-cont">
            <img
            src={user.photoURL || "/default-avatar.png"}
            className="user-info-avatar"
          />
          </div>
          <div className="user-info">
            <div className="user-info-name">{user.displayName}</div>
            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
              {user.role}
            </span>
          </div>
        </div>

        <div data-aos="fade-in" className="user-stats">
          <div className="stat-block">
            <span className="stat-label">Дата регистрации</span>
            <span className="stat-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Неизвестно"}
            </span>
          </div>
          <div data-aos="fade-in" className="stat-block stat-block-balance">
                <div className="balance balance-user">
                  <span className="stat-label">Баланс пользователя</span>
                  <span className="stat-value">
                    {user.balance ? user.balance.toFixed((2)) : "0"} $
                  </span>
                </div>
                <div className="balance balance-crypto">
                  <span className="stat-label">Баланс крипты</span>
                  <span className="stat-value">
                    {user.portfolio && user.portfolio.length > 0 
                      ? user.portfolio.reduce((sum, coin) => sum + (coin.amount * coin.buyPrice), 0).toFixed(2)
                      : "0"} $
                  </span>
                </div>
          </div>
        </div>

        <div data-aos="fade-in" className="user-portfolio">
          <h3 className="portfolio-title">Портфолио пользователя</h3>
          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="crypto-list">
              {user.portfolio.map((coin,index) => (
                <div data-aos="fade-in" key={coin.id || index}
                     className="crypto-item"
                     onClick={() => navigate(`/crypto/${coin.coinId}`)}>
                  <div className="crypto-left">
                    <img src={coin.image} alt={coin.coinId} />
                    <span className="crypto-name">{coin.symbol}</span>
                  </div>
                  <div className="crypto-right">
                    <div className="crypto-amount">{coin.amount} шт</div>
                    <div className="crypto-value">
                      {pricesData
                        ? (coin.amount * (pricesData[coin.coinId]?.usd || coin.buyPrice)).toFixed(2)
                        : coin.buyPrice.toFixed(2)} $
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p data-aos="fade-in" className="empty-portfolio">У пользователя пока нет крипты</p>
          )}
        </div>

        <div data-aos="fade-in" className="user-chart">
          <div className="chart-placeholder">📊 Здесь будет график пользователя</div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;