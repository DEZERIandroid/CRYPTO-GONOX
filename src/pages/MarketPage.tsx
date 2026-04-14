import { SearchOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import "../styles/Pages/Market.css"
import { FloatButton, Select, Skeleton } from 'antd';
import { useGetCryptosQuery } from "../app/api/CryptoApi";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ReloadOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useWindowSize } from "@uidotdev/usehooks";
import useGetUser from "@/hooks/useGetUser";

const MarketPage = () => {
  const { data, isLoading, isError, refetch } = useGetCryptosQuery(undefined , {
    pollingInterval:65000
  });
  const { users } = useGetUser()
  const { email } = useAppSelector(state => state.user);
  const user = users?.find((u) => u.email === email); 

  const [filter,setFilter] = useState<string>("Все")
  const [searchQuery,setSearchQuery] = useState<string>("")

  const navigate = useNavigate()

  const size = useWindowSize()
  const isReady = size.width !== null;
  const isMobile = size.width !== null && size.width >= 480;

  

  
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
  if (!isReady) return null;
  if (isLoading) return <div className="page-container" data-aos="fade-in">
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
      <div className="market-content" style={{marginTop:"10px"}} data-aos="fade-in">
        <div className="market-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Криптовалюта</th>
                <th>Цена</th>
                {isMobile ? 
                  <>
                    <th>Изменение за 24ч</th>
                    <th>Рыночная капитализация</th>
                    <th>Объём (24ч)</th>
                  </>
                : null}
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
        <div className="market-table"
             style={{padding:!isMobile ? "5px" : "0px"}}>
          <table style={{display:isError ? "grid" : "", placeContent:isError ? "center" : ""}}>
            <thead>
              <tr>
                <th>#</th>
                <th>Криптовалюта</th>
                <th>Цена</th>
                {isMobile ?
                  <>
                    <th>Изменение за 24ч</th>
                    <th>Рыночная капитализация</th>
                    <th>Объём (24ч)</th>
                  </>
                : null}
              </tr>
            </thead>
            
            {!isError ? (<tbody>
              {filteredData.map((coin, index) => (
                <tr onClick={() => navigate(`/crypto/${coin.id}`)} key={coin.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="coin-info">
                      <img
                        src={coin.image}
                        alt={coin.symbol}
                        className="coin-icon"
                        
                      />
                      <div className="coin-name">
                        <div className="name">{coin.name?.length <= 22 ? coin.name : coin.symbol}</div>
                        <div className="symbol">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  {isMobile ?
                    <>
                      <td className="coin-prices">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <span className={coin.price_change_percentage_24h >= 0 ? "change-positive" : "change-negative"}>
                          {coin.price_change_percentage_24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </td>
                    </>:
                    <>
                      <td className="price-mobile">
                        <div className="coin-prices coin-prices">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div>
                          <span className={coin.price_change_percentage_24h >= 0 ? "change-mobile change-positive" : "change-mobile change-negative"}>
                            {coin.price_change_percentage_24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div> 
                      </td>
                    </> 
                  }
                  {isMobile ? 
                    <>
                      <td>${(coin.market_cap / 1e9).toFixed(1)}B</td>
                      <td>${(coin.total_volume / 1e9).toFixed(1)}B</td>
                    </>
                  : null}
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
      <FloatButton.BackTop className="float-button"/>
    </div>
  );
};

export default MarketPage;