import React from "react";
import {
  LineChart,
  Line,
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

  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="timeLabel"
          tick={{ fill: "#ccc" }}
        />
        <YAxis className="Yaxic"
          domain={["auto", "auto"]}
          tick={{ fill: "#ccc" }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Цена"]}
          labelFormatter={(label) => new Date(label).toLocaleString("ru-RU")}
          contentStyle={{ backgroundColor: "#141318", border: "none", color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#2d81ff"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#fff", stroke: "#2d81ff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CoinChart;