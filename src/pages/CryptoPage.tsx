import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCoinQuery } from "../app/api/CryptoApi";
import { Skeleton } from "antd";
import { RiseOutlined, FallOutlined,StarOutlined,
         ShoppingCartOutlined,SwapOutlined, ArrowLeftOutlined, 
         StarFilled} from "@ant-design/icons";
import "../styles/Pages/Crypto.css";
import CoinChartWithControls from "../components/CoinChartWithControls";
import { useBuyCryptoMutation,useSellCryptoMutation, useGetCryptoForSellQuery } from "../app/api/UsersApi";
import { useGetUsersQuery } from "../app/api/UsersApi";
import { useMemo, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import Loading from "../assets/useLoading";

const CryptoPage = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const uid = useAppSelector(state => state.user.uid);
  const Username = useAppSelector(state => state.user.name)
  const { email } = useAppSelector(state => state.user);
  const { data: users } = useGetUsersQuery(undefined , {
    pollingInterval:30000
  });
  const { data:cryptoforsell, } = useGetCryptoForSellQuery(
    { userId: uid, coinId: id || "" },
    {pollingInterval:500}
  )
  
    const user = users?.find((u) => u.email === email); 
  
  const amountForSell = cryptoforsell?.amount ?? 0
  const isFavorite = cryptoforsell?.isFavorite ?? false

  const { data: coin, isLoading:isCoinLoading, isError:isCoinError, } = useGetCoinQuery(id ?? skipToken);
  const [buyCrypto,{isLoading:isBuying}] = useBuyCryptoMutation()
  const [sellCrypto,{isLoading:isSelling}] = useSellCryptoMutation()

  const [isModalOpenBuy, setIsModalOpenBuy] = useState(false);
  const [isModalOpenSell, setIsModalOpenSell] = useState(false);
  const [success,setSuccess] = useState(false)
  const [unSuccess,setUnSuccess] = useState(false)
  const [cryptoPrice] = useState(0)
  const [amountCoins,setAmountCoins] = useState('')
  const [buyError,setBuyError] = useState(false)
  const [sellError,setSellError] = useState(false)

  const openBuyModal = () => setIsModalOpenBuy(true);
  const openSellModal = () => setIsModalOpenSell(true);

  const price = coin?.market_data?.current_price?.usd ?? 0;


/* ------------------------ Покупка крипты ----------------------- */

  const amountBuy = Number(amountCoins);
     const totalBuy = useMemo(() => 
      amountBuy * price,  
     [amountBuy,price]);
  
  const handleBuy = async () => {
      if (!amountBuy || amountBuy <= 0) {
         setUnSuccess(true);
         setBuyError(true)
         setTimeout(() => setBuyError(false), 4500);
         setTimeout(() => setUnSuccess(false), 1500);
        return;
      }
      if (user?.balance === undefined || user?.balance < totalBuy) {
        setUnSuccess(true);
        setBuyError(true)
        setTimeout(() => setBuyError(false), 4500);
        setTimeout(() => setUnSuccess(false), 1500);
        return;
      }

      try {
        const result = await buyCrypto({
                          uid,coinId: id,amountCoins:Number(amountBuy),
                          currentPrice:price,image,symbol,cryptoPrice,Username})
        if (result.error) {
          setUnSuccess(true);
          setBuyError(true)
          setTimeout(() => setBuyError(false), 4500);
          setTimeout(() => setUnSuccess(false), 1500);
        } else {
          setIsModalOpenBuy(false)
          setAmountCoins("")
          setSuccess(true)
          setTimeout(() => setSuccess(false), 1500);
          }
        } catch (err) {
          console.log(err)
      }
  }

/* ------------------------ Продажа крипты ----------------------- */
  const amountSell = Number(amountCoins)
  const totalSell = useMemo(() => 
      amountSell * price,  
      [amountSell,price]);

  const handleSell = async () => {
    if (!amountSell || amountSell <= 0) {
       setUnSuccess(true);
       setSellError(true)
       setTimeout(() => setSellError(false), 4500);
       setTimeout(() => setUnSuccess(false), 1500);
      return;
    }
    try {
      const result = await sellCrypto({uid,coinId:id,amountCoins:amountSell,cryptoPrice:totalSell}) 
      if (result.error) {
        setUnSuccess(true);
        setSellError(true)
        setTimeout(() => setSellError(false), 4500);
        setTimeout(() => setUnSuccess(false), 1500);
      } else {
        setIsModalOpenSell(false)
        setAmountCoins("")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 1500);
      }
      } catch (err) {
        console.log(err)
      }
      
  }

/* ----------------------- Избранное не избранное ----------------------*/
  const handleIsFavorite = () => {
    
  }


  if (isCoinLoading)
    return (
        <div className="page-container">
          
          <div className="user-content crypto-content">
            <Skeleton.Button active style={{ width: 120, height: 36, marginBottom: 24 }} />

            <div className="coin-header">
              <div className="coin-logo">
                <Skeleton.Avatar active size={72} shape="circle" />
              </div>

              <div className="coinCryptos-info">
                <div className="infoCrypto-text">
                  <Skeleton.Input active style={{ width: 220, height: 28, marginBottom: 12 }} />

                  <div className="price-change">
                    <Skeleton.Input active style={{ width: 140, height: 24 }} />
                    <Skeleton.Input active style={{ width: 80, height: 24 }} />
                  </div>
                </div>

                <div className="coin-actions">
                  <Skeleton.Button active style={{ width: 110, height: 36 }} />
                  <Skeleton.Button active style={{ width: 110, height: 36 }} />
                  <Skeleton.Button active style={{ width: 130, height: 36 }} />
                </div>
              </div>
            </div>

            <div className="coin-stats">
              <div className="stat-block">
                <Skeleton.Input active style={{ width: 180, height: 20, marginBottom: 8 }} />
                <Skeleton.Input active style={{ width: 160, height: 24 }} />
              </div>

              <div className="stat-block">
                <Skeleton.Input active style={{ width: 180, height: 20, marginBottom: 8 }} />
                <Skeleton.Input active style={{ width: 160, height: 24 }} />
              </div>
            </div>

            <div className="coin-chart">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          </div>
        </div>
    );

  if (!coin) return <div className="loading-container">Монета не найдена</div>;

  
  const change = coin.market_data?.price_change_percentage_24h ?? null;
  const marketCap = coin.market_data?.market_cap?.usd ?? null;
  const volume = coin.market_data?.total_volume?.usd ?? null;
  const image = coin.image?.large ?? coin.image?.small ?? coin.image;
  const symbol = coin.symbol?.toUpperCase();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <span className="title-text">{coin.name}</span>
        </div>
        <div className="header-actions">
          <div className="header-input">
            <input type="text" placeholder={`Поиск по ${coin.name}...`} />
          </div>
        </div>
      </div>

      {!isCoinError ? (<div className="user-content crypto-content">
        <button className="return-btn" onClick={() => navigate("/market")}>
           <ArrowLeftOutlined/>Назад
        </button>
        <div data-aos="fade-in" className="coin-header">
          <div className="coin-logo">
            <img src={image} alt={coin.name} />
          </div>
          <div className="coinCryptos-info">
            <div className="infoCrypto-text">
              <h2>
                <span>{coin.name}</span> 
                <span>({coin.symbol?.toUpperCase()})</span>
              </h2>
              <div className="price-change">
                <p className="coin-price">{price ? `$${price.toLocaleString()}` : "-"}</p>
                <p className={change && change >= 0 ? "change-positive" : "change-negative"}>
                  {change && change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {change ? `${Math.abs(change).toFixed(2)}%` : "-"}
                </p>
              </div>
            </div>

            <div className="coin-actions">
              <button onClick={openBuyModal} className="coin-btn buy">
                <ShoppingCartOutlined /> Купить
              </button>
              <button onClick={openSellModal} className="coin-btn sell">
                <SwapOutlined /> Продать
              </button>
              <button onClick={handleIsFavorite} className="coin-btn favorite">
                {isFavorite ? <StarFilled /> : <StarOutlined/>} В избранное
              </button>
            </div>
          </div>
        </div>

        <div className="coin-stats">
          <div data-aos="fade-in" className="stat-block">
            <span className="stat-label">Рыночная капитализация</span>
            <span className="stat-value">{marketCap ? `$${marketCap.toLocaleString()}` : "-"}</span>
          </div>
          <div data-aos="fade-in" className="stat-block">
            <span className="stat-label">Объем торгов (24ч)</span>
            <span className="stat-value">{volume ? `$${volume.toLocaleString()}` : "-"}</span>
          </div>
        </div>

        <div data-aos="fade-in" className="coin-chart">
          {id ? (
            <CoinChartWithControls coinId={id} />
          ) : (
            <p className="error">Данные графика недоступны</p>
          )}
        </div>
      </div>) : <div className="user-content crypto-content"> Ошибка загрузки данных</div> }
        {isModalOpenBuy && (
          <div className="buy-modal-overlay">
            <div className="buy-modal">
              <h2>Покупка {coin.name}</h2>
              <p style={{textAlign:"right",}}
                 className="stat-value">Ваш баланс : 
                 {user?.balance ? user.balance.toFixed((2)) : "0"}$
              </p>
              <input 
                style={{borderBottom:buyError ? "1px solid red" : "none",
                        transition:buyError ? "0.5s" : "0"}}
                type="number"
                value={amountCoins}
                min={1}
                placeholder="Количество"
                onChange={(e) => setAmountCoins(e.target.value)}
              />
              <p>Итого: {totalBuy.toFixed(2)} $</p>
              <div className="modal-buttons">
                <button onClick={handleBuy} disabled={isBuying}>
                                  {!isBuying ? 
                                    <span>Купить</span> :
                                    <Loading/> }
                </button>
                <button onClick={() => setIsModalOpenBuy(false)}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {isModalOpenSell && (
          <div className="buy-modal-overlay">
            <div className="buy-modal">
              <h2>Продажа {coin.name}</h2>
              <p style={{textAlign:"right"}}>
                У вас: {amountForSell ?? 0}
              </p>
              <input  
                style={{borderBottom:sellError ? "1px solid red" : "none",
                        transition:sellError ? "0.5s" : "0"}}
                type="number"
                value={amountCoins}
                min={1}
                placeholder="Количество"
                onChange={(e) => setAmountCoins(e.target.value)}
              />
              <p>Итого: {totalSell.toFixed(2)} $</p>
              <div className="modal-buttons">
                <button onClick={handleSell} disabled={isSelling && sellError}>
                                            {!isSelling ? 
                                              <span>Продать</span> : 
                                              <Loading/>}
                </button>
                <button onClick={() => setIsModalOpenSell(false)}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="modal-buysell">
            <div>
              Успешно
            </div>
          </div>
        )}

        {unSuccess && (
          <div className="modal-buysell-error">
            <div>
              Не успешно
            </div>
          </div>
        )}
    </div>
  );
};

export default CryptoPage;