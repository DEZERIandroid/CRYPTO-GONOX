import React, { useState } from "react";
import { useGetCoinChartQuery } from "../app/api/CryptoApi";
import CoinChart from "./CoinChart";
import "../styles/Components/CoinChart.css"; 
import { ReloadOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import { useWindowSize } from "@uidotdev/usehooks";

interface CoinChartWithControlsProps {
  coinId: string;
}

const CoinChartWithControls: React.FC<CoinChartWithControlsProps> = ({ coinId }) => {
  const [timeRange, setTimeRange] = useState<number | string>(7);
  const size = useWindowSize()
  const isMobile = size.width !== null && size.width >= 480;

  const { data, isLoading, isError, refetch } = useGetCoinChartQuery(
    { id: coinId, days: timeRange },
    { skip: !coinId }
  );

  const chartData = data?.prices?.map(([time, price]) => ({ time, price })) || [];

  const handleTimeRangeChange = (range: number | string) => {
    setTimeRange(range);
  };
  const handleReloadChart = () => {
    setTimeRange(7)
    refetch()
  }

  if (isLoading)
  return (
    <>
    <div className="coin-chart" style={{display:"grid", placeContent:"center", borderRadius: '15px',marginTop:!isMobile ? "" : "100px"}}>
        <Skeleton.Button active style={{ width:size.width !== null && size.width >= 1400 ? 1100 : !isMobile ? 320 : 600, height: 250, borderRadius: '15px' }}/>
    </div>
    </>
  );
  if (isError)
  return (
    <div className="coin-chart-container" style={{marginTop:!isMobile ? "" : "-100px"}}>
      <div className="chart-wrapper chart-error">
        <p className="error">Ошибка загрузки графика</p>
        <button className="reload-btn" onClick={handleReloadChart}>
          <ReloadOutlined/> Обновить
        </button>
      </div>
    </div>
  );

  return (
    <div className="coin-chart-container">
      <div className="chart-wrapper">
        <CoinChart data={chartData} />
      </div>
        <div className="chart-controls">
          <button className={timeRange === 1 ? "active" : ""} onClick={() => handleTimeRangeChange(1)}>1 день</button>
          <button className={timeRange === 7 ? "active" : ""} onClick={() => handleTimeRangeChange(7)}>7 дней</button>
          <button className={timeRange === 30 ? "active" : ""} onClick={() => handleTimeRangeChange(30)}>30 дней</button>
          <button className={timeRange === 90 ? "active" : ""} onClick={() => handleTimeRangeChange(90)}>3 месяца</button>
          <button className={timeRange === 365 ? "active" : ""} onClick={() => handleTimeRangeChange(365)}>1 год</button>
          <button className={timeRange === "max" ? "active" : ""} onClick={() => handleTimeRangeChange("max")}>Все</button>
        </div>
    </div>
  );
};

export default CoinChartWithControls;