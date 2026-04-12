import { SearchOutlined } from "@ant-design/icons"
import { useMemo, useState } from "react"
import { FloatButton, Skeleton } from "antd"
import "../styles/Pages/TopUsers.css"
import { useNavigate } from "react-router-dom"
import useGetUser from "@/hooks/useGetUser"

const TopUsers = () => {
  const {users:topUsers,loading:isLoading,error:isError} = useGetUser()
  const [searchQuery,setSearchQuery] = useState<string>("")

  const navigate = useNavigate()

  
  const sortedData = useMemo(() => {
    if (!topUsers) return [];
    
    return [...topUsers].sort((a, b) => 
      (b.cryptoTotalBalance || 0) - (a.cryptoTotalBalance || 0)
    );
    
  }, [topUsers]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return sortedData.filter(
      (topUsers) => topUsers.displayName && 
                    topUsers.displayName.toLocaleLowerCase().includes(query))                  
  },[sortedData,searchQuery])

                                  
                                  

  if (isLoading) {
    return (
      <div className="page-container" data-aos="fade-in">
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
        <div className="topusers-table">
          <table>
          <thead>
                  <tr>
                    <th>#</th>
                    <th>Пользователь</th>
                    <th>Баланс</th>
                  </tr>
          </thead>
          </table>
        </div>
        <ul className="topusers-list" style={{marginTop:"-250px"}}>
            {[...Array(5)].map((_, index) => (
              <li className="list-item" key={index}>
                <Skeleton.Button active size="small" style={{marginLeft:-50 }} />
                <Skeleton.Avatar active size="large" shape="circle" style={{ width: 35, height: 35, marginLeft:-100}} />
                <Skeleton.Input active size="small" style={{ width: 150, marginLeft:-70 }} />
                <Skeleton.Input active size="small" style={{ width: 0, marginLeft: 12 }} />
              </li>
            ))}
          </ul>
      </div>
    </div>
    )
  }

  return (
  <div className="page-container" data-aos="fade-in">
    <div className="page-header">
      <div className="header-title">
        <div className="title-text">Топ пользователей</div>
      </div>
      <div className="header-input">
        <SearchOutlined className="input-icon" />
        <input 
          className="input"
          type="text" 
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    <div className="topusers-content">
      {isError ? (
        <div className="error-message">{isError}</div>
      ) : (
        <div className="topusers-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Пользователь</th>
                <th>Баланс</th>
              </tr>
            </thead>
            
            <tbody data-aos="fade-in"
                   key={filteredData.length + (filteredData[0]?.cryptoTotalBalance || 0)}
            >
              {isLoading ? (
                // СКЕЛЕТНАЯ ЗАГРУЗКА
                [...Array(10)].map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td style={{ width: '50px' }}>
                      <Skeleton.Button active size="small" style={{ width: 25 }} />
                    </td>
                    <td className="topusers-username">
                      <Skeleton.Avatar active size="large" shape="circle" style={{ width: 40, height: 40 }} />
                      <Skeleton.Input active size="small" style={{ width: 150 }} />
                    </td>
                    <td>
                      <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </td>
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                // РЕАЛЬНЫЕ ДАННЫЕ
                filteredData.map((user, index) => {
                  let balanceClass = "";
                  if (index === 0) balanceClass = "gold-text";
                  else if (index === 1) balanceClass = "silver-text";
                  else if (index === 2) balanceClass = "bronze-text";

                  return (
                    <tr onClick={() => navigate(`/user/${user.id}`)} key={user.id}>
                      <td>{index + 1}</td>
                      <td className="topusers-username">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="user-avatar-placeholder" />
                        ) : (
                          <div className="user-avatar-placeholder">
                            {user.displayName?.charAt(0) || "?"}
                          </div>
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
                })
              ) : (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-message">Нет данных для отображения</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <FloatButton.BackTop className="float-button"/>
  </div>
);
}

export default TopUsers