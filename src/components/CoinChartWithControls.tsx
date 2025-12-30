import React, { useState } from "react";
import { useGetCoinChartQuery } from "../app/api/CryptoApi";
import CoinChart from "./CoinChart";
import { Skeleton } from "antd";
import "../styles/Components/CoinChart.css"; 
import { ReloadOutlined } from "@ant-design/icons";

interface CoinChartWithControlsProps {
  coinId: string;
}

const CoinChartWithControls: React.FC<CoinChartWithControlsProps> = ({ coinId }) => {
  const [timeRange, setTimeRange] = useState<number | string>(7);

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
    <div className="chart-skeleton">
      <Skeleton.Input active style={{ width: "80%", height: 300 }} />
      <div className="chart-skeleton-text">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </div>
  );
  if (isError)
  return (
    <div className="coin-chart-container">
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
      <div className="chart-controls">
        <button
          className={timeRange === 1 ? "active" : ""}
          onClick={() => handleTimeRangeChange(1)}
        >
          1D
        </button>
        <button
          className={timeRange === 7 ? "active" : ""}
          onClick={() => handleTimeRangeChange(7)}
        >
          7D
        </button>
        <button
          className={timeRange === 30 ? "active" : ""}
          onClick={() => handleTimeRangeChange(30)}
        >
          30D
        </button>
        <button
          className={timeRange === 90 ? "active" : ""}
          onClick={() => handleTimeRangeChange(90)}
        >
          3M
        </button>
        <button
          className={timeRange === 365 ? "active" : ""}
          onClick={() => handleTimeRangeChange(365)}
        >
          1Y
        </button>
        <button
          className={timeRange === "max" ? "active" : ""}
          onClick={() => handleTimeRangeChange("max")}
        >
          All
        </button>
      </div>

      <div className="chart-wrapper">
        <CoinChart data={chartData} />
      </div>
    </div>
  );
};

export default CoinChartWithControls;