import { SearchOutlined } from "@ant-design/icons"
import { useGetTopUsersQuery } from "../app/api/UsersApi"
import { useMemo, useState } from "react"
import { Skeleton } from "antd"
import "../styles/Pages/TopUsers.css"
import { useNavigate } from "react-router-dom"

const TopUsers = () => {
  const {data, isLoading, isError} = useGetTopUsersQuery(undefined , {
    pollingInterval:3000
  })
  const [searchQuery,setSearchQuery] = useState<string>("")

  const navigate = useNavigate()

  const sortedData = useMemo(() => {
    if (!data) return [];
    
    return [...data].sort((a, b) => 
      (b.cryptoTotalBalance || 0) - (a.cryptoTotalBalance || 0)
    );
    
  }, [data]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return sortedData.filter((topUsers) => topUsers.displayName && 
                                    topUsers.displayName.toLocaleLowerCase().includes(query))
                                
  },[sortedData,searchQuery])

  if (isLoading) {
    return (
      <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Топ пользователей</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder="Поиск"
           />
        </div>
      </div>
      <div className="topusers-content">
        <ul className="transactions-list">
            {[...Array(5)].map((_, index) => (
              <li className="list-item" key={index}>
                <Skeleton.Avatar active size="small" shape="square" style={{ width: 24, height: 24 }} />
                <Skeleton.Input active size="small" style={{ width: 60, marginLeft: 12 }} />
                <Skeleton.Input active size="small" style={{ width: 80, marginLeft: 12 }} />
                <Skeleton.Input active size="small" style={{ width: 70, marginLeft: 12 }} />
              </li>
            ))}
          </ul>
      </div>
    </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="title-text">Топ пользователей</div>
        </div>
        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder="Поиск"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <div className="topusers-content">
        {isError ? (
          <div className="error-message">Ошибка загрузки топа пользователей</div>
        ) : data && data.length > 0 ? (
          <div className="topusers-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Пользователь</th>
                  <th>Баланс</th>
                </tr>
              </thead>
              
              <tbody data-aos="fade-in">
                {filteredData.map((user, index) => {
                  let balanceClass = "";
                  if (index === 0) balanceClass = "gold-text";
                  else if (index === 1) balanceClass = "silver-text";
                  else if (index === 2) balanceClass = "bronze-text";
                                
                  return (
                    <tr onClick={() => navigate(`/user/${user.id}`)} key={user.id}>
                      <td>{index + 1}</td>
                      <td className="topusers-username">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="user-avatar-placeholder"
                          />
                        ) : (
                          <img className="user-avatar-placeholder"  />
                        )}
                        <span>{user.displayName || "Аноним"}</span>
                      </td>
                      <td>
                        <span className={balanceClass}>
                          ${user.cryptoTotalBalance?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-message">Нет данных для отображения</div>
        )}
      </div>

    </div>
  )
}

export default TopUsers