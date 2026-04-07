import React from 'react';
import { ConfigProvider, theme } from 'antd';

const glassShadow = `
  0 8px 32px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.3),
  inset 0 -1px 0 rgba(255, 255, 255, 0.1)
`;

const GlassConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          borderRadius: 15,
          colorBorder: 'rgba(255, 255, 255, 0.144)',
          // colorBgElevated управляет фоном всех выпадающих меню (Dropdown, Select, Popover)
          colorBgElevated: 'rgba(25, 25, 25, 0.7)', 
          boxShadow: glassShadow,
        },
        components: {
          Select: {
            // Фон и текст пунктов списка
            optionSelectedBg: 'rgba(255, 255, 255, 0.15)',
            optionActiveBg: 'rgba(255, 255, 255, 0.08)',
            colorText: '#ffffff',
            borderRadiusSM: 10, // Скругление самих предметов (items)
            colorBgContainer: 'rgba(255, 255, 255, 0.02)', // Фон самого поля
          },
          Button: {
            colorBgContainer: 'rgba(255, 255, 255, 0.05)',
            colorBorder: 'rgba(255, 255, 255, 0.1)',
          },
          Input: {
            colorBgContainer: 'rgba(255, 255, 255, 0.02)',
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default GlassConfigProvider;