import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Typography } from "antd";

const { Text } = Typography;

// 1. Описываем структуру одного элемента данных
export interface ExpenseItem {
  name: string;
  value: number;
  color: string;
}

// 2. Описываем пропсы компонента
interface ExpensesPieProps {
  data: ExpenseItem[];
}

const ExpensesPie: React.FC<ExpensesPieProps> = ({ data }) => {
  const total = data.reduce((sum, i) => sum + i.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "240px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                animationDuration={120}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ExpenseItem;
                    return (
                      <div
                        style={{
                          padding: "8px 12px",
                          background: "rgba(0, 0, 0, 0.85)",
                          borderRadius: "8px",
                          color: "#fff",
                          border: "none",
                        }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>
                          {data.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#4ade80" }}>
                          ${data.value.toFixed(2)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                isAnimationActive={true}
              >
                {data.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={item.color}
                    stroke="rgba(255,255,255,0.08)"
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Текст в центре круга */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Всего
            </Text>
            <Text strong style={{ fontSize: "24px", lineHeight: "1.2" }}>
              ${total.toFixed(2)}
            </Text>
          </div>
        </div>
    </motion.div>
  );
};

export default ExpensesPie;