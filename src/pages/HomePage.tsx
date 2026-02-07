import { useState, useMemo } from "react";
import { SearchOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import { useGetCryptosQuery } from "../app/api/CryptoApi";
import { useGetTopUsersQuery, useGetTransactionsQuery } from "../app/api/UsersApi";
import ExpensesPie from "../assets/use";
import { Skeleton } from 'antd';
import "../styles/Pages/Home.css"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const {data: cryptosData,isLoading: isCryptosLoading,
                                isError: isCryptosError
        } = useGetCryptosQuery(undefined , {
    pollingInterval:100000
  });

  const {data: transactionsData,isLoading: isTransactionsLoading,
                                  isError: isTransactionsError
      } = useGetTransactionsQuery(undefined , {
    pollingInterval:100000
  });

  const {data:topusersData, isLoading:isTopusersLoading,
                            isError:isTopusersError
      } = useGetTopUsersQuery(undefined , {
    pollingInterval:2500
  })

  
  const [filter,setFilter] = useState<string>("Все")
  const [searchQuery] = useState<string>("")
  const navigate = useNavigate()

  const expenses = [
      { name: "BTC", value: 500, color: "orange.solid" },
      { name: "ETH", value: 400, color: "blue.solid" },
      { name: "SOL", value: 250, color: "#6e6e6eff" },
      { name: "NEG", value: 250, color: "#2d10f35ff" }
    ]
  
  const filteredCrypto = useMemo(() => {
    if (!cryptosData) return []
    
    let result = [...cryptosData]
    
    if (searchQuery) {
      const query = searchQuery.toLocaleLowerCase()
      result = result.filter(
          (coin) => coin.name.toLocaleLowerCase().includes(query) ||
          coin.symbol.toLocaleLowerCase().includes(query)
        )
      }
  
      switch (filter) {
        case "Топ-10":
          result = result.slice(0,10);
        break;
        case "Растущие":
          result = result
          .filter((coin) => coin.price_change_percentage_24h >= 0)
          .sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          break
          case "Падающие":
            result = result
            .filter((coin) => coin.price_change_percentage_24h < 0)
            .sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            break
            case "Все":
              default:
                result = result.sort((a,b) => b.market_cap - a.market_cap)
                break;
      }
      
      return result; 
    },[cryptosData,filter,searchQuery])
    
    const sortedTransactions = useMemo(() => {
      if (!transactionsData) return [];
      return [...transactionsData].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }, [transactionsData]);

    const sortedTopUsers = useMemo(() => {
      if (!topusersData) return []
      return [...topusersData].sort(
        (a,b) => (b.cryptoTotalBalance || 0) - (a.cryptoTotalBalance || 0)
      )
    },[topusersData])

    if (isCryptosLoading && isTransactionsLoading && isTopusersLoading) return
          <div className="home-content">
            <div className="block">
              <div className="block-title" onClick={() => navigate("/transactions")}>
                Рынок
              </div>
              <ul className="market-list">
                {[...Array(3)].map((_, index) => (
                  <li className="list-item" key={index}>
                    <Skeleton.Avatar active size="small" shape="square" style={{ width: 24, height: 24 }} />
                    <Skeleton.Input active size="small" style={{ width: 60, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 80, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 70, marginLeft: 12 }} />
                  </li>
                ))}
              </ul>
            </div>

              
            <div className="block">
              <div className="block-title" onClick={() => navigate("/transactions")}>
                Расходы
              </div>
              <ul className="transactions-list market-list">
                {[...Array(1)].map((_, index) => (
                  <li className="list-item" key={index}>
                    <Skeleton.Avatar active size="small" shape="square" style={{ width: 24, height: 24 }} />
                    <Skeleton.Input active size="small" style={{ width: 160, marginLeft: 12 }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="block">
              <div className="block-title" onClick={() => navigate("/transactions")}>
                Транзакции
              </div>
              <ul className="transactions-list market-list">
                {[...Array(3)].map((_, index) => (
                  <li className="list-item" key={index}>
                    <Skeleton.Avatar active size="small" shape="square" style={{ width: 24, height: 24 }} />
                    <Skeleton.Input active size="small" style={{ width: 60, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 80, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 70, marginLeft: 12 }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="block">
              <div className="block-title" onClick={() => navigate("/transactions")}>
                Топ пользователей
              </div>
              <ul className="topusers-list market-list">
                {[...Array(3)].map((_, index) => (
                  <li className="list-item" key={index}>
                    <Skeleton.Avatar active size="small" shape="square" style={{ width: 24, height: 24 }} />
                    <Skeleton.Input active size="small" style={{ width: 60, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 80, marginLeft: 12 }} />
                    <Skeleton.Input active size="small" style={{ width: 70, marginLeft: 12 }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Статистика</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder="Поиск"
           />
        </div>
      </div>
      <div className="home-content">
        {/*=============== Маркет ================ */}
        <div className="block">
          <div className="block-title" onClick={() => navigate("/market")}>
            Рынок
          </div>
          <div className="market-buttons">
            <div className="tabs" role="tablist" aria-label="Фильтр криптовалют">
              {["Топ-10", "Растущие", "Падающие",].map((label) => (
                <button
                  key={label}
                  className={`tab ${filter === label ? "active" : ""}`}
                  onClick={() => setFilter(label)}
                  role="tab"
                  aria-selected={filter === label}
                  aria-controls={`panel-${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {isCryptosError == false ? (<ul className="market-list">
              {filteredCrypto.map((coin) => (
                <li className="list-item" 
                    data-aos="fade-in"
                    key={coin.id}
                    onClick={() => navigate(`/crypto/${coin.id}`)}>
                  <div className="item-photo">
                    <img src={coin.image} alt="" />
                  </div>
                  <span className="item-name">{coin.symbol}</span>
                  <span className="item-price">$ {coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  <span className={coin.price_change_percentage_24h >= 0 ? "change-positive" : "change-negative"}>
                      {coin.price_change_percentage_24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                </li>
              ))}
          </ul>) : <div className="error-modal"> Ошибка заргузки данных</div> }
        </div>

        {/*=============== Расходы ================ */}
        <div className="block">
          <div className="block-title" style={{marginBottom:"-30px"}}>Расходы</div>
          <ExpensesPie data-aos="fade-up" data={expenses}/>
        </div>

        {/*=============== Транзакции ================ */}
        <div className="block">
          <div className="block-title" onClick={() => navigate("/transactions")}>
            Транзакции
          </div>
          {isTransactionsError === false ? (
            <ul className="transaction-list market-list">
              {sortedTransactions.slice(0, 3).map((item, index) => {
                const total = item.amount * item.buyPrice;
                return (
                  <li
                    className="list-item" data-aos="fade-in"
                    key={`${item.timestamp}-${item.coinId}-${index}`}
                    onClick={() => navigate(`/transactions`)}
                  >
                    <div className="item-photo">
                      <img src={item.image || "/src/assets/meduza.jpg"} alt={item.symbol} />
                    </div>
                    <span className="item-name">{item.Username || "Пользователь"}</span>
                    <span className="item-price">${total.toFixed(2)}</span>
                    <span className="status-success">Покупка</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div><div className="error-modal">
                  <button
                   className="button-join-small"
                    onClick={() => navigate("/login")}>
                          Вход
                  </button>
            </div></div>
        )}
        </div>

        {/*=============== Топ пользователей ================ */}
        <div className="block" onClick={() => navigate("/topusers")}>
          <div className="block-title">Топ пользователей</div>
             {isTopusersError === false ? (<ul className="topusers-list">
                  {sortedTopUsers.slice(0,3).map((user, index) => {
                    let balanceClass = "";
                    if (index === 0) balanceClass = "gold-text item-price";
                    else if (index === 1) balanceClass = "silver-text item-price";
                    else if (index === 2) balanceClass = "bronze-text item-price";

                    return (
                      <li data-aos="fade-in"
                          className="topusers-item list-item"
                          key={user.id}>
                          <div className="place-item">{index + 1}</div>
                          {user.photoURL ? (
                            <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="user-avatar-placeholder"
                            />
                          ) : (
                            <img className="user-avatar-placeholder"  />
                          )}
                          <span className="topusers-name item-name">{user.displayName || "Аноним"}</span>
                          <span className={balanceClass}>
                            ${user.cryptoTotalBalance?.toFixed(2) || "0.00"}
                          </span>
                      </li>
                    );
                  })}
            </ul>)
            : <div><div className="error-modal">
                  <button
                   className="button-join-small"
                    onClick={() => navigate("/loginpage")}>
                          Вход
                  </button>
              </div></div>}
          </div>
        </div>
    </div>
  )
}

export default HomePage