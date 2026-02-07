import { SearchOutlined } from "@ant-design/icons";
import "../styles/Pages/Transactions.css";
import { useGetTransactionsQuery, type Transaction } from "../app/api/UsersApi";
import { useState,useMemo } from "react";

const TransactionsPage = () => {
  const { data, isError } = useGetTransactionsQuery(undefined , {
    pollingInterval:3000
  });

  const [searchQuery,setSearchQuery] = useState("")

  const sortedData = data
    ? [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  const filteredTransactions:Transaction[] = useMemo(() => {
      if (!sortedData || !Array.isArray(sortedData)) return [];
  
      if (!searchQuery.trim()) {
        return sortedData;
      }
  
      const query = searchQuery.toLowerCase();
  
      return sortedData.filter(sortedData =>
        (sortedData.Username && sortedData.Username.toLowerCase().includes(query)) ||
        (sortedData.coinId && sortedData.coinId.toLowerCase().includes(query)) ||
        (sortedData.symbol && sortedData.symbol.toLowerCase().includes(query))
      );
    }, [sortedData, searchQuery]);

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
          <select data-aos="fade-in" className="filter-select">
            <option>За последний месяц</option>
            <option>За неделю</option>
            <option>За день</option>
          </select>
      </div>

      <div className="transactions-container">
        <div className="filters">
          <button data-aos="fade-in" className="filter-btn active">Все</button>
          <button data-aos="fade-in" className="filter-btn">Покупка</button>
          <button data-aos="fade-in" className="filter-btn">Продажа</button>
        </div>

        <div className="market-content">
          <div className="market-table transactions">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Пользователь</th>
                  <th>Актив</th>
                  <th>Количество</th>
                  <th>Цена покупки</th>
                  <th>Дата</th>
                  <th>Тип</th>
                </tr>
              </thead>
              {isError == false ? (<tbody>
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item, index) => {
                    const total = item.amount * item.buyPrice;
                    return (
                      <tr data-aos="fade-in" key={`${item.timestamp}-${item.coinId}-${index}`}>
                        <td>{index + 1}</td>
                        <td className="transactions-username">{item.Username}</td>
                        <td className="transactions-imgSymbol">
                          <img className="transactions-img"
                            src={item.image}
                            alt={item.symbol}
                          />
                          <div className="transactions-symbol">
                            {item.symbol}
                          </div>
                        </td>
                        <td className="transactions-amount">{item.amount}</td>
                        <td className="transactions-buyPrice">${total.toFixed(2)}</td>
                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                        <td>
                          <span className="status-success">Покупка</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Нет транзакций
                    </td>
                  </tr>
                )} 
              </tbody>) : <div className="page-container">Ошибка загрузки транзакций</div>}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;