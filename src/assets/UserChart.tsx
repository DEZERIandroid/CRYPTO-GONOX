import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }:CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const color = payload[0].color;

  return (
    <div
      style={{
        backgroundColor: "rgba(30, 30, 40, 0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        color: "#fff",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        lineHeight: 1.5,
      }}
    >
      <div style={{ marginBottom: "4px", opacity: 0.7, fontSize: "12px" }}>
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 0 2px ${color}40`,
          }}
        ></div>
        {value.toLocaleString()} ₽
      </div>
    </div>
  );
};

interface UserChartProps {
  users: any[]; 
}

const UserChart = ({ users }:UserChartProps) => {
  const gradientId = "areaGradient";

  return (
    <div
      style={{
        width:"100%",
        minWidth: 200,           // ← Уменьшили общую ширину графика
        maxWidth: 1380,          // ← Жёсткий лимит ширины (было 580 → теперь 520)
        margin: "0 auto",     // ← Сдвинули график вправо (отступ от сайдбара)
        height: 300,          // ← Высоту оставили прежней (если нужно — можешь изменить)
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={users}

          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {/* Градиент */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#065f46" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Сетка */}
          <CartesianGrid
            stroke="#2d2d3d"
            strokeDasharray="4 4"
            vertical={false}
          />

          {/* Ось X */}
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a0a0b0", fontSize: 11, fontWeight: 400 }}
            tickMargin={10}
            interval="preserveStartEnd"
          />

          {/* Ось Y — увеличена ширина под метки */}
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a0a0b0", fontSize: 12, fontWeight: 500 }}
            tickMargin={10}
            width={70} // ← Ключевое: увеличили ширину оси Y, чтобы числа не обрезались
            tickFormatter={(value) =>
              new Intl.NumberFormat("ru-RU", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {/* Легенда */}
          <Legend
            align="right"
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              color: "#e0e0ff",
              fontSize: "12px",
              fontWeight: 500,
            }}
          />

          {/* График */}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#10b981",
              strokeWidth: 3,
              fill: "#064e3b",
            }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;