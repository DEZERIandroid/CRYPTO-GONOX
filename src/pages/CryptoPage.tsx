import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCoinQuery } from "../app/api/CryptoApi";
import { Skeleton } from "antd";
import { RiseOutlined, FallOutlined,StarOutlined,
         ShoppingCartOutlined,SwapOutlined, ArrowLeftOutlined, 
         StarFilled,
         SearchOutlined} from "@ant-design/icons";
import "../styles/Pages/Crypto.css";
import CoinChartWithControls from "../components/CoinChartWithControls";
import { useBuyCryptoMutation,useSellCryptoMutation, useFavoriteCryptoMutation, type CryptoForSell } from "../app/api/UsersApi";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import Loading from "../assets/useLoading";
import { useCloseModal } from "@/hooks/useCloseModal";
import { useWindowSize } from "@uidotdev/usehooks";
import useGetUser from "@/hooks/useGetUser";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const CryptoPage = () => {
  const navigate = useNavigate()
  const { id:coinId } = useParams();
  const uid = useAppSelector(state => state.user.uid);
  const Username = useAppSelector(state => state.user.name)
  const { email } = useAppSelector(state => state.user);
  const { users } = useGetUser()
  const [cryptoforsell,setCryptoForSell] = useState(0)

  useEffect(() => {
    if (!uid || !coinId) return;

    const userDocRef = doc(db,"users",uid)
    
    const unsubscribe = onSnapshot(userDocRef,(snapshot) => {
      if (snapshot.exists()) {
        
        const data = snapshot.data()
        const crptfrsl = data.portfolio || []

        if (crptfrsl) {
          const coin = crptfrsl.find((coin:CryptoForSell) => coin.coinId === coinId)
          const amount = coin?.amount ?? 0

          console.log(amount)
          setCryptoForSell(amount)
        }
      }
    })

    return () => unsubscribe()
  },[])

  const size = useWindowSize()
  const isMobile = size.width !== null && size.width >= 480
  
  const user = users?.find((u) => u.email === email); 

  const { data: coin, isLoading:isCoinLoading, isError:isCoinError, } = useGetCoinQuery(coinId ?? skipToken, {
    pollingInterval:250000
  });
  const [buyCrypto,{isLoading:isBuying}] = useBuyCryptoMutation()
  const [sellCrypto,{isLoading:isSelling}] = useSellCryptoMutation()
  const [favoriteCrypto] = useFavoriteCryptoMutation()

  const buyModal = useCloseModal(150)
  const sellModal = useCloseModal(150)

  const [success,setSuccess] = useState(false)
  const [unSuccess,setUnSuccess] = useState(false)
  const [cryptoPrice] = useState(0)
  const [amountCoins,setAmountCoins] = useState('')
  const [buyError,setBuyError] = useState(false)
  const [sellError,setSellError] = useState(false)

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
         setTimeout(() => setBuyError(false), 1500);
         setTimeout(() => setUnSuccess(false), 1500);
        return;
      }
      if (user?.balance === undefined || user?.balance < totalBuy) {
        setUnSuccess(true);
        setBuyError(true)
        setTimeout(() => setBuyError(false), 1500);
        setTimeout(() => setUnSuccess(false), 1500);
        return;
      }

      try {
        const result = await buyCrypto({
                          uid,coinId: coinId,amountCoins:Number(amountBuy),
                          currentPrice:price,image,symbol,cryptoPrice,Username,totalBuyPrice:totalBuy})
        if (result.error) {
          setUnSuccess(true);
          setBuyError(true)
          setTimeout(() => setBuyError(false), 1500);
          setTimeout(() => setUnSuccess(false), 1500);

          
        } else {
          buyModal.closeModal()
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
       setTimeout(() => setSellError(false), 1500);
       setTimeout(() => setUnSuccess(false), 1500);
      return;
    }
    if (amountSell > cryptoforsell) {
       setUnSuccess(true);
       setSellError(true)
       setTimeout(() => setSellError(false), 1500);
       setTimeout(() => setUnSuccess(false), 1500);
      return;
    }
    try {
      const result = await sellCrypto({
                              uid,coinId:coinId,amountCoins:amountSell,
                              image,symbol,cryptoPrice:totalSell,
                                                        Username})
      if (result.error) {
        setUnSuccess(true);
        setSellError(true)
        setTimeout(() => setSellError(false), 1500);
        setTimeout(() => setUnSuccess(false), 1500);
      } else {
        sellModal.closeModal()
        setAmountCoins("")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 1500);
      }
      } catch (err) {
        console.log(err)
      }
      
  }

/* ----------------------- Избранное не избранное ----------------------*/
  const handleIsFavorite = async () => {
    try {
      await favoriteCrypto({uid,coinId: coinId})
    } catch (error) {
      console.log(error)
    }
  }

  const isFavorite = user?.favoritesCrypto?.includes(coinId)


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
            <div className="coin-chart">
              <Skeleton active paragraph={{ rows: 8 }} />
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
          <div className="title-text">{coin.id}</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder="Поиск"
           />
        </div>
      </div>

      {!isCoinError ? (<div className="user-content crypto-content">
        <div className="return">
          <button className="return-btn" onClick={() => navigate("/market")}>
           <ArrowLeftOutlined/>Назад
        </button>
        </div>
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
                  <p className={
                    change === 0 ? "change-zero" : change > 0 ? "change-positive" : "change-negative"
                  }>
                    {change > 0 ? <RiseOutlined /> : change < 0 ? <FallOutlined /> : null}
                    {change !== undefined ? `${Math.abs(change).toFixed(2)}%` : "-"}
                  </p>
                </div>
              </div>
            </div>
          

            
             <div className="coin-actions">
              {isMobile ?
                <>
                  <button onClick={buyModal.openModal} className="coin-btn buy">
                    <ShoppingCartOutlined /> Купить
                  </button>
                  <button onClick={sellModal.openModal} className="coin-btn sell">
                    <SwapOutlined /> Продать
                  </button>
                </>
               : null
              }
              <button onClick={handleIsFavorite} 
                      className="coin-btn favorite"
                      style={{backgroundColor:isFavorite ? "#b49920" : "#221d0d41"}}>
                {isFavorite ? <StarFilled /> : <StarOutlined/>} 
                <div style={{minWidth:"98px"}}>{isFavorite ? "В избранном" : "В избранное"}</div>
              </button>
            </div>
          </div>
        
        <div data-aos="fade-in" className="coin-chart">
          {coinId ? (
            <CoinChartWithControls coinId={coinId} />
          ) : (
            <p className="error">Данные графика недоступны</p>
          )}
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

      </div>) : <div className="user-content crypto-content"> Ошибка загрузки данных</div> }
        {buyModal.isOpen && (
          <div className={`crypto-modal-overlay ${buyModal.isClosing ? "closing" : ""}`}
               onClick={() => buyModal.closeModal()}>
            <div data-aos="zoom-in" data-aos-duration="150"
                className={`crypto-modal ${buyModal.isClosing ? "closing" : ""}`}
                onClick={(e) => e.stopPropagation()}>
              <h2>Покупка {coin.name}</h2>
              <p style={{textAlign:"right",
                        color:buyError ? "red" : "white",
                        transition:buyError ? "0.5s" : "0"
              }}
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
                <button onClick={buyModal.closeModal}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {sellModal.isOpen && (
          <div className={`crypto-modal-overlay ${sellModal.isClosing ? "closing" : ""}`}
               onClick={() => sellModal.closeModal()}>
            <div data-aos="zoom-in" data-aos-duration="150"
                 className={`crypto-modal ${sellModal.isClosing ? "closing" : ""}`}
                 onClick={(e) => e.stopPropagation()}>
              <h2>Продажа {coin.name}</h2>
              <p style={{textAlign:"right",
                        color:sellError ? "red" : "white",
                        transition:sellError ? "0.5s" : "0"
              }}>
                У вас: {cryptoforsell ?? 0}
              </p>
              <input  
                style={{borderBottom:sellError ? "1px solid red" : "none",
                        transition:sellError ? "0.5s " : "0"}}
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
                <button onClick={sellModal.closeModal}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div data-aos="fade-down" data-aos-duratiom="100" className="modal-buysell">
            <div>
              Успешно
            </div>
          </div>
        )}

        {unSuccess && (
          <div data-aos="fade-down" data-aos-duratiom="100" className="modal-buysell-error">
            <div>
              Не успешно
            </div>
          </div>
        )}
        {!isMobile ? 
          <div className="coin-actions-mobile">
            <button onClick={buyModal.openModal} className="coin-btn buy">
              <ShoppingCartOutlined /> Купить
            </button>
            <button onClick={sellModal.openModal} className="coin-btn sell">
              <SwapOutlined /> Продать
            </button>
          </div>
         : null 
        }
    </div>
  );
};

export default CryptoPage;