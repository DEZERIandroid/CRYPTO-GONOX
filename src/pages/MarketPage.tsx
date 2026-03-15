import { SearchOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import "../styles/Pages/Market.css"
import { FloatButton, Select, Skeleton } from 'antd';
import { useGetCryptosQuery } from "../app/api/CryptoApi";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ReloadOutlined } from "@ant-design/icons";
import { useGetUsersQuery } from "@/app/api/UsersApi";
import { useAppSelector } from "@/hooks/reduxHooks";

const MarketPage = () => {
  const { data, isLoading, isError, refetch } = useGetCryptosQuery(undefined , {
    pollingInterval:65000
  });
  const { data: users } = useGetUsersQuery(undefined , {
      pollingInterval:60000
  });
  const { email } = useAppSelector(state => state.user);
  const user = users?.find((u) => u.email === email); 

  const [filter,setFilter] = useState<string>("Все")
  const [searchQuery,setSearchQuery] = useState<string>("")

  const navigate = useNavigate()

  
  const filtres = ["Все","Топ-10","Растущие","Падающие","Избранное"]

  const selectOptions = filtres.map((item) => ({
    value: item,
    label: item,
  }));

  const filteredData = useMemo(() => {
    if (!data) return []

    let result = [...data]
    
    const favoriterCrypto = user?.favoritesCrypto
    
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
          .filter((coin) => coin.price_change_percentage_24h > 0)
          .sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      break
      case "Падающие":
        result = result
          .filter((coin) => coin.price_change_percentage_24h < 0)
          .sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      break;
      case "Избранное":
        result = result
          .filter((coin) => favoriterCrypto?.includes(coin.id))
      break;
      case "Все":
      default:
        result = result.sort((a,b) => b.market_cap - a.market_cap)
        break;

    }

  return result; 
  },[data,filter,searchQuery])


  const handleReloadChart = () => {
    refetch()
  }

  if (isLoading) return <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Рынок</div>
        </div>
          <div className="header-input">
            <SearchOutlined className="search-icon" />
            <input
              className="input"
              type="text"
              placeholder="Поиск криптовалюты..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <Select   
              className="filter-select"
              value={filter}
              onChange={(value) => setFilter(value)}
              options={selectOptions}
            />
      </div>

      <div className="market-content">
        <div className="market-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Криптовалюта</th>
                <th>Цена</th>
                <th>Изменение за 24ч</th>
                <th>Рыночная капитализация</th>
                <th>Объём (24ч)</th>
              </tr>
            </thead>
          </table>
        </div>
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 1 }} />
        <br />
      </div>
    </div>

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Рынок</div>
        </div>
          <div className="header-input">
            <SearchOutlined className="search-icon" />
            <input
              className="input"
              type="text"
              placeholder="Поиск криптовалюты..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <Select   
              className="filter-select"
              value={filter}
              onChange={(value) => setFilter(value)}
              options={selectOptions}
            />
      </div>

      <div className="market-content">
        <div className="market-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Криптовалюта</th>
                <th>Цена</th>
                <th>Изменение за 24ч</th>
                <th>Рыночная капитализация</th>
                <th>Объём (24ч)</th>
              </tr>
            </thead>
            {!isError ? (<tbody>
              {filteredData.map((coin, index) => (
                <tr  onClick={() => navigate(`/crypto/${coin.id}`)} key={coin.id}>
                  <td data-aos="fade-in" data-aos-once="false">{index + 1}</td>
                  <td>
                    <div data-aos="fade-in" data-aos-once="false" className="coin-info">
                      <img
                        src={coin.image}
                        alt={coin.symbol}
                        className="coin-icon"
                        
                      />
                      <div data-aos="fade-in" data-aos-once="false" className="coin-name">
                        <div className="name">{coin.name}</div>
                        <div className="symbol">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td data-aos="fade-in" data-aos-once="false" className="coin-prices">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td data-aos="fade-in" data-aos-once="false">
                    <span className={coin.price_change_percentage_24h >= 0 ? "change-positive" : "change-negative"}>
                      {coin.price_change_percentage_24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </td>
                  <td data-aos="fade-in" data-aos-once="false">${(coin.market_cap / 1e9).toFixed(1)}B</td>
                  <td data-aos="fade-in" data-aos-once="false">${(coin.total_volume / 1e9).toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>): 
                  <div className="error">Ошибка загрузки данных
                    <button className="reload-btn" onClick={handleReloadChart}>
                              <ReloadOutlined/> Обновить
                    </button>
                  </div>}
          </table>
        </div> 
      </div> 
      <FloatButton.BackTop  className="float-button"/>
    </div>
  );
};

export default MarketPage;