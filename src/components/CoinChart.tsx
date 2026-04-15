import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  time: number;
  price: number;
}

interface CoinChartProps {
  data: ChartDataPoint[];
}

const CoinChart: React.FC<CoinChartProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    timeLabel: new Date(item.time).toLocaleDateString("ru-RU"),
  }));


  const formatNumber = (num:number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <ResponsiveContainer className="chart-graph" width="100%" height={270}>
      <AreaChart data={formattedData}>
        <defs>
          {/* Основной глубокий градиент */}
          <linearGradient id="deepBlueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d81ff" stopOpacity={0.65} />
            <stop offset="40%" stopColor="#1b4ed8" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity={0.2} />
          </linearGradient>

          {/* Линия с переливом */}
          <linearGradient id="lineBlueGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4da3ff" />
            <stop offset="50%" stopColor="#2d81ff" />
            <stop offset="100%" stopColor="#1b4ed8" />
          </linearGradient>

          {/* Neon Glow */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <CartesianGrid
          stroke="#1e293b"
          strokeDasharray="3 3"
          vertical={false}
        />

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div
                style={{
                    backdropFilter: "blur(12px)",
                    background: "rgba(15, 23, 42, 0.8)",
                    padding: "14px 18px",
                    borderRadius: "16px",
                    border: "1px solid rgba(45,129,255,0.5)",
                    boxShadow:
                    "0 0 3px rgba(45,129,255,0.3)",
                    color: "#fff",
                  }}
                >
                  <p style={{ color: "#94a3b8", fontSize: 12 }}>
                    {payload[0].payload.timeLabel}
                  </p>
                  <p
                    style={{
                      color: "#2d81ff",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    ${Number(payload[0].value).toFixed(2)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Area
          type="monotone"
          dataKey="price"
          stroke="url(#lineBlueGradient)"
          strokeWidth={2}
          fill="url(#deepBlueGradient)"
          dot={false}
          filter="url(#neonGlow)"
          isAnimationActive={true}
          animationDuration={900}
          activeDot={{
            r: 7,
            fill: "#2d81ff",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />

        <XAxis
          className="Xaxis-chart"
          dataKey="timeLabel"
          tick={{ fill: "#64748b", fontSize: 12 }}
          hide={isMobile}
          axisLine={{ stroke: "#1e293b" }}
          tickLine={false}
        />
        <YAxis
            className="Yaxis-chart"
            domain={["auto", "auto"]}
            tick={{ fill: isMobile ? "#c6e1ff" : "#e0e0e0", fontSize: 12,}}
            width={isMobile ? 30 : 64}
            axisLine={false}
            tickFormatter={(value) => `$${isMobile ? formatNumber(value) : value}`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CoinChart;