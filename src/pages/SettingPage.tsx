import { SearchOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import "../styles/Pages/Setting.css";

const SettingPage = () => {
  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="header-title">Настройки</h1>

        <div className="header-actions">
          <div className="search-box">
            <SearchOutlined className="search-icon" />
            <input placeholder="Поиск настроек" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="market-content">
        {/* УВЕДОМЛЕНИЯ */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Уведомления</h3>

          <div className="settings-item">
            <div data-aos="fade-in"className="settings-item-info">
              <span className="settings-item-label">Email-уведомления</span>
              <span className="settings-item-desc">
                Получать уведомления о транзакциях
              </span>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">Push-уведомления</span>
              <span className="settings-item-desc">
                Уведомления в браузере
              </span>
            </div>
            <Switch />
          </div>
        </div>

        {/* ИНТЕРФЕЙС */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Интерфейс</h3>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">Тема</span>
              <span className="settings-item-desc">
                Выбор оформления сайта
              </span>
            </div>
            <select data-aos="fade-in" className="settings-select">
              <option>Тёмная</option>
              <option>Светлая</option>
            </select>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span data-aos="fade-in" className="settings-item-label">Язык</span>
              <span data-aos="fade-in" className="settings-item-desc">
                Язык интерфейса
              </span>
            </div>
            <select data-aos="fade-in" className="settings-select">
              <option>Русский</option>
              <option>English</option>
            </select>
          </div>
        </div>

        {/* ПОВЕДЕНИЕ */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Поведение</h3>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">Автообновление цен</span>
              <span className="settings-item-desc">
                Обновлять курсы автоматически
              </span>
            </div>
            <Switch defaultChecked/>
          </div>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">Анимации</span>
              <span className="settings-item-desc">
                Плавные переходы интерфейса
              </span>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* FOOTER */}
        <div data-aos="fade-in" className="settings-footer">
          <button data-aos="fade-in" className="settings-cancel">Отмена</button>
          <button data-aos="fade-in" className="settings-save">Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
