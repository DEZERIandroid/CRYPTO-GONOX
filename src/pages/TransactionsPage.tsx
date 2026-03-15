import { SearchOutlined } from "@ant-design/icons";
import "../styles/Pages/Transactions.css";
import { useGetTransactionsQuery, type Transaction } from "../app/api/UsersApi";
import { useState, useMemo } from "react";
import { FloatButton, Select, Skeleton } from "antd";

const TransactionsPage = () => {
  const { data, isError, isLoading } = useGetTransactionsQuery(undefined, {
    pollingInterval: 3000
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("За всё время");
  const [filterButton, setFilterButton] = useState("Все");

  const filtres = ["За всё время", "За неделю", "За день"];

  const selectOptions = filtres.map((item) => ({
    value: item,
    label: item,
  }));

  const sortedData = data
    ? [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  const filteredTransactions: Transaction[] = useMemo(() => {
    if (!sortedData || !Array.isArray(sortedData)) return [];

    if (!searchQuery.trim()) {
      return sortedData;
    }

    const query = searchQuery.toLowerCase();

    return sortedData.filter((sortedData) =>
      (sortedData.Username && sortedData.Username.toLowerCase().includes(query)) ||
      (sortedData.coinId && sortedData.coinId.toLowerCase().includes(query)) ||
      (sortedData.symbol && sortedData.symbol.toLowerCase().includes(query))
    );
  }, [sortedData, searchQuery]);

  if (isLoading) return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Транзакции</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по адресу, ID или сумме"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          className="filter-select"
          value={filter}
          onChange={(value) => setFilter(value)}
          options={selectOptions}
        />
      </div>
      <div data-aos="fadeIn" className="transactions-container">
        <div className="filters" role="filterslist" aria-label="Фильтр Транзакций">
          {["Все", "Покупка", "Продажа"].map((label) => (
            <button
              key={label}
              className={`${filterButton === label ? "filter-btn-active" : "filter-btn"}`}
              onClick={() => setFilterButton(label)}
              role="filters"
              aria-selected={filterButton === label}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="market-content">
          <div className="market-table transactions">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Актив</th>
                  <th>Пользователь</th>
                  <th>Количество</th>
                  <th>Тип</th>
                  <th>Дата</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(7)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7}>
                      <Skeleton avatar active paragraph={{ rows: 1 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FloatButton.BackTop className="float-button" />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Транзакции</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по адресу, ID или сумме"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          className="filter-select"
          value={filter}
          onChange={(value) => setFilter(value)}
          options={selectOptions}
        />
      </div>

      <div data-aos="fadeIn" className="transactions-container">
        <div className="filters" role="filterslist" aria-label="Фильтр Транзакций">
          {["Все", "Покупка", "Продажа"].map((label) => (
            <button
              key={label}
              className={`${filterButton === label ? "filter-btn-active" : "filter-btn"}`}
              onClick={() => setFilterButton(label)}
              role="filters"
              aria-selected={filterButton === label}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="market-content">
          <div className="market-table transactions">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Актив</th>
                  <th>Пользователь</th>
                  <th>Количество</th>
                  <th>Тип</th>
                  <th>Дата</th>
                  <th>Цена</th>
                </tr>
              </thead>
              {!isError ? (
                <tbody>
                  {filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item, index) => {
                      const total = item.amount * item.buyPrice;
                      return (
                        <tr key={`${item.timestamp}-${item.coinId}-${index}`}>
                          <td data-aos="fade-in" data-aos-once="false">{index + 1}</td>
                          <td data-aos="fade-in" data-aos-once="false" className="transactions-imgSymbol">
                            <img className="transactions-img"
                              src={item.image}
                              alt={item.symbol}
                            />
                            <div data-aos="fade-in" data-aos-once="false" className="transactions-symbol">
                              {item.symbol}
                            </div>
                          </td>
                          <td data-aos="fade-in" data-aos-once="false" className="transactions-username">
                            {item.photoURL ? (
                              <img
                                src={item.photoURL}
                                alt={item.Username}
                                className="user-avatar-placeholder"
                              />
                            ) : null} {item.Username}
                          </td>
                          <td data-aos="fade-in" data-aos-once="false" className="transactions-amount">{item.amount}</td>
                          <td data-aos="fade-in" data-aos-once="false">
                            <span className="status-success">Покупка</span>
                          </td>
                          <td data-aos="fade-in" data-aos-once="false" className="transactions-data">{new Date(item.timestamp).toLocaleDateString()}</td>
                          <td data-aos="fade-in" data-aos-once="false" className="transactions-buyPrice">${total.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        Нет транзакций
                      </td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "red" }}>
                      Ошибка загрузки транзакций
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <FloatButton.BackTop className="float-button" />
    </div>
  );
};

export default TransactionsPage;