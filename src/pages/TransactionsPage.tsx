import { SearchOutlined } from "@ant-design/icons";
import "../styles/Pages/Transactions.css";
import { type Transaction } from "../app/api/UsersApi";
import { useState, useMemo } from "react";
import { FloatButton, Select, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetTransactions } from "@/hooks/useGetTransactions";


const TransactionsPage = () => {
  const navigate = useNavigate()

  const { transactions, loading:isLoading, error:isError } = useGetTransactions()

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState<string>("За всё время");
  const [filterButton, setFilterButton] = useState("Все");

  const filtres = ["За всё время", "За неделю", "За день"];


  const sortedData = transactions
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const filteredTransactions: Transaction[] = useMemo(() => {
        if (!sortedData || !Array.isArray(sortedData)) return [];

        let filtered = sortedData;

        // фильтрация по статусу
        switch (filterButton) { 
          case "Покупка":
            filtered = filtered.filter((t) => t.status === "buy");
            break;
          case "Продажа":
            filtered = filtered.filter((t) => t.status === "sell");
            break;
          case "Все":
          default:
            break;
        }
      
        // фильтрация по поиску
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              (t.userName && t.userName.toLowerCase().includes(query)) ||
              (t.coin && t.coin.toLowerCase().includes(query)) ||
              (t.symbol && t.symbol.toLowerCase().includes(query))
          );
        }
      
        return filtered;

  }, [sortedData, searchQuery, filterButton]);  

  if (isLoading) return (
    <div className="page-container" data-aos="fade-in">
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
          value={filterTime}
          onChange={setFilterTime}
          options={filtres.map(f => ({ label: f, value: f }))}
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
                {[...Array(20)].map((_, i) => (
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
    <div className="page-container" data-aos="fade-in">
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
          value={filterTime}
          onChange={setFilterTime}
          options={filtres.map(f => ({ label: f, value: f }))}
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

        <div className="transactions-content market-content ">
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
                  <th>Сумма</th>
                </tr>
              </thead>
              {!isError ? (
                <tbody>
                  {filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item, index) => {
                      return (
                        <tr key={`${item.date}-${item.coin}-${index}`}>
                          <td>{index + 1}</td>
                          <td onClick={() => navigate(`/crypto/${item.coin}`)} className="transactions-imgSymbol">
                            <img className="transactions-img"
                              src={item.image}
                              alt={item.symbol}
                            />
                            <div className="transactions-symbol">
                              {item.symbol}
                            </div>
                          </td>
                          <td onClick={() => navigate(`/user/${item.userName}`)} className="transactions-userName">
                            {item.userName}
                          </td>
                          <td className="transactions-amount">{item.amount}</td>
                          <td>
                            {item.status === "buy" 
                                      ? (<span className="status-buy">Покупка</span>)
                                      : (<span className="status-sell">Продажа</span>)
                            }
                          </td>
                          <td className="transactions-data">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="transactions-buyPrice">${item.Price.toFixed(2)}</td>
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