import { SearchOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import "../styles/Pages/Market.css"
import { Skeleton } from 'antd';
import { useGetCryptosQuery } from "../app/api/CryptoApi";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"

const MarketPage = () => {
  const { data, isLoading, isError } = useGetCryptosQuery(undefined , {
    pollingInterval:35000
  });
  const [filter,setFilter] = useState<string>("Все")
  const [searchQuery,setSearchQuery] = useState<string>("")

  const navigate = useNavigate()

  const filteredData = useMemo(() => {
    if (!data) return []

    let result = [...data]

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
      break
      case "Все":
      default:
        result = result.sort((a,b) => b.market_cap - a.market_cap)
        break;
    }

  return result; 
  },[data,filter,searchQuery])

  const filtres = ["Все","Топ-10","Растущие","Падающие"]

  if (isLoading) return <div className="page-container">
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
          <div className="filters">
            <select 
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filtres.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
        </div>
      </div>

      <div className="market-content">
        {!isError ? (<div className="market-table">
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
            <tbody>
              {filteredData.map((coin, index) => (
                <tr data-aos="fade-up" onClick={() => navigate(`/crypto/${coin.id}`)} key={coin.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="coin-info">
                      <img
                        src={coin.image}
                        alt={coin.symbol}
                        className="coin-icon"
                        
                      />
                      <div className="coin-name">
                        <div className="name">{coin.name}</div>
                        <div className="symbol">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="coin-prices">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>
                    <span className={coin.price_change_percentage_24h >= 0 ? "change-positive" : "change-negative"}>
                      {coin.price_change_percentage_24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </td>
                  <td>${(coin.market_cap / 1e9).toFixed(1)}B</td>
                  <td>${(coin.total_volume / 1e9).toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>) : <div className="error">Ошибка загрузки данных</div>}
      </div> 
    </div>
  );
};

export default MarketPage;