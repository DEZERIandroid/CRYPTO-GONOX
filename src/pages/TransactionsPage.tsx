import { SearchOutlined } from "@ant-design/icons";
import "../styles/Pages/Transactions.css";
import { useGetTransactionsQuery } from "../app/api/UsersApi";

const TransactionsPage = () => {
  const { data, isLoading, isError } = useGetTransactionsQuery(undefined , {
    pollingInterval:3000
  });

  const sortedData = data
    ? [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  if (isLoading) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="header-title">Транзакции</h1>
        <div className="header-actions">
          <div className="search-box skeleton-loading" style={{ width: "400px", height: "50px" }} />
          <div className="filter-select skeleton-loading" style={{ width: "180px", height: "50px" }} />
        </div>
      </div>

      <div className="transactions-container">
        <div className="filters">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="filter-btn skeleton-loading" style={{ width: "80px", height: "36px" }} />
          ))}
        </div>

        <div className="market-content">
          <div className="market-table transactions">
            <table>
              <thead>
                <tr>
                  {[...Array(8)].map((_, i) => (
                    <th key={i} style={{ height: "40px" }}></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(8)].map((_, colIndex) => (
                      <td key={colIndex}>
                        <div className="skeleton-loading" style={{ height: "20px", borderRadius: "4px" }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="header-title">Транзакции</h1>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">
              <SearchOutlined />
            </span>
            <input type="text" placeholder="Поиск по адресу, ID или сумме" />
          </div>
          <select className="filter-select">
            <option>За последний месяц</option>
            <option>За неделю</option>
            <option>За день</option>
          </select>
        </div>
      </div>

      <div className="transactions-container">
        <div className="filters">
          <button className="filter-btn active">Все</button>
          <button className="filter-btn">Покупка</button>
          <button className="filter-btn">Продажа</button>
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
                {sortedData && sortedData.length > 0 ? (
                  sortedData.map((item, index) => {
                    const total = item.amount * item.buyPrice;
                    return (
                      <tr data-aos="fade-up" key={`${item.timestamp}-${item.coinId}-${index}`}>
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