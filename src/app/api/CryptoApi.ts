import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CryptoCoin {
  market_data:any,
  id: string;
  symbol: string;
  name: string;
  image: any;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface MarketChartResponse {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

interface CoinsPriceResponse {
  [coinId: string]: {
    usd: number;
  };
}

export const CryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3/",
  }),
  endpoints: (builder) => ({
    getCryptos: builder.query<CryptoCoin[], void>({
      query: () => `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`,
    }),
    getCoin: builder.query<CryptoCoin, string>({
      query: (id) => `/coins/${id}`,
    }),
    getCoinChart: builder.query<MarketChartResponse, { id: string; days: number | string }>({
      query: ({ id, days }) => `/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    }),
    getCoinsPrice: builder.query<CoinsPriceResponse, string[]>({
      query: (coinIds) => {
        if (coinIds.length === 0) return "";
        return `/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`;
      },
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetCryptosQuery, useGetCoinQuery,
             useGetCoinChartQuery, useGetCoinsPriceQuery } = CryptoApi;