import { SearchOutlined } from "@ant-design/icons";
import { Select, Switch } from "antd";
import "../styles/Pages/Setting.css";
import { useState } from "react";
import { useGetSettingsQuery } from "@/app/api/UsersApi";
import { useAppSelector } from "@/hooks/reduxHooks";

const SettingPage = () => {
  const uid = useAppSelector(state => state.user.uid);

  const {data} = useGetSettingsQuery(
    { uid: uid }
  )
  const [theme,setTheme] = useState("Тёмная")
  const [Language,setLanguage] = useState("Русский")

  const themes = ["Тёмная","Белая","Зелёная","Синяя","Неоновая"]
  const Languages = ["Русский","Английский"]

  const selectOptionsTheme = themes.map((item) => ({
    value: item,
    label: item,
  }));
  const selectOptionsLanguage = Languages.map((item) => ({
    value: item,
    label: item,
  }));

  const settings = data
  console.log(settings)

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="header-title">Настройки</h1>

        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder="Поиск настроек"
           />
        </div>
      </div>

      {/* CONTENT */}
      <div className="market-content">
        {/* УВЕДОМЛЕНИЯ */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Приватность и уведомления</h3>

          <div className="settings-item">
            <div data-aos="fade-in"className="settings-item-info">
              <span className="settings-item-label">Приватность</span>
              <span className="settings-item-desc">
                Скрыть портфолио от других пользователей
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
            <Select 
              className="theme-select"
              value={theme}
              onChange={(value) => setTheme(value)}
              options={selectOptionsTheme}
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span data-aos="fade-in" className="settings-item-label">Язык</span>
              <span data-aos="fade-in" className="settings-item-desc">
                Язык интерфейса
              </span>
            </div>
            <Select
              className="theme-select"
              value={Language}
              onChange={(value) => setLanguage(value)}
              options={selectOptionsLanguage}
            />
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
