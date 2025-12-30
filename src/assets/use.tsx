import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Text, Flex, VStack } from "@chakra-ui/react";

const MotionBox = motion(Box);

export type ExpenseItem = {
  name: string;
  value: number;
  color: string; 
};

type Props = {
  data: ExpenseItem[];
  title?: string;
};

export default function ExpensesPie({ data }: Props) {
  const total = data.reduce((sum, i) => sum + i.value, 0);

  return (
    <MotionBox
      p={5}
      rounded="2xl"
      bg="bg.surface"
      shadow="xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <Flex align="center" justify="center" position="relative" h="240px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              animationDuration={120}
              content={({ payload }) =>
                payload?.length ? (
                  <Box px={3} py={2} bg="blackAlpha.800" rounded="lg">
                    <Text fontSize="sm" fontWeight="600">
                      {payload[0].name}
                    </Text>
                    <Text fontSize="sm" color="green.300">
                      ${payload[0].value}
                    </Text>
                  </Box>
                ) : null
              }
            />

            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              isAnimationActive
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                  stroke="rgba(255,255,255,0.08)"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <VStack gap={0} position="absolute">
          <Text fontSize="sm" color="fg.muted">
            Всего
          </Text>
          <Text fontSize="2xl" fontWeight="800">
            ${total.toFixed(2)}
          </Text>
        </VStack>
      </Flex>
    </MotionBox>
  );
}
