import { useAppSelector } from "../hooks/reduxHooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetUsersQuery } from "../app/api/UsersApi";
import type { User } from "../app/api/UsersApi";
import { Skeleton } from 'antd';
import '../styles/Pages/Users.css';

const UsersPage = () => {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user); 
  const [searchQuery,setSearchQuery] = useState<string>("")
  const { data: users = [], isLoading, isError } = useGetUsersQuery(undefined , {
    pollingInterval:1000
  });

  const filteredUsers:User[] = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();

    return users.filter(user =>
      (user.displayName && user.displayName.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (String(user.id).includes(query))
    );
  }, [users, searchQuery]);


  if (isLoading) return <div className="page-container">
      <div className="page-header">
        <Skeleton.Input active style={{ width: 200, height: 32 }} />
        <div className="header-actions">
          <Skeleton.Input active style={{ width: 250, height: 32 }} />
        </div>
      </div>

      <div className="user-content">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    </div>
      
  if (isError) return <div className="loading-container">Ошибка загрузки списка</div>;


  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="header-title">
          <span className="title-text">Пользователи</span>
        </h1>
        <div className="header-actions">
          <div className="header-input">
            <SearchOutlined className="input-icon" />
            <input
              type="text"
              placeholder="Поиск по пользователям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="user-content">
       <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Имя</th>
                <th style={{display: user.role === "admin" ? "none" : "none"}}>Email</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                {user?.role === "admin" && (
                  <th>Действия</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userData) => (
              <tr data-aos="fade-in"
                key={userData.id}
                className="user-row"
                onClick={() => navigate(`/user/${userData.id}`)}
              >
                <td>
                  {user.photoURL ? (
                          <img
                            src={userData.photoURL}
                            className="users-avatar"
                          />
                        ) : (
                          <img className="users-avatar"/>
                        )}
                </td>
                <td>
                  {userData.displayName}
                </td>
                <td style={{display: user.role === "admin" ? "" : "none"}}>
                  {userData.email}
                </td>
                <td>
                  <span
                    className={`role-badge role-${userData.role
                      ?.toLowerCase()
                      .replace(" ", "-") || "user"}`}
                  >
                    {userData.role || "user"}
                  </span>
                </td>
                <td>
                  {userData.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                {user?.role === "admin" && (
                  <td style={{display: user.role == "admin" ? "flex" : "none"}}
                    className="actions-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="action-btn edit-btn">
                      <EditOutlined />
                    </button>
                    <button className="action-btn delete-btn">
                      <DeleteOutlined />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />
        <br /> 
        
      </div>
    </div>
  );
};

export default UsersPage;