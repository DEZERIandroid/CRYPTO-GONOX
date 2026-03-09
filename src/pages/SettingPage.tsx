import { SearchOutlined } from "@ant-design/icons";
import { Select, Switch } from "antd";
import "../styles/Pages/Setting.css";
import { useEffect, useState } from "react";
import { useGetSettingsQuery } from "@/app/api/UsersApi";
import { useAppSelector } from "@/hooks/reduxHooks";

const SettingPage = () => {
  const uid = useAppSelector(state => state.user.uid);

  const {data} = useGetSettingsQuery(
    { uid: uid }
  )
  const [theme,setTheme] = useState("Тёмная")
  const [isPrivate,setIsPrivate] = useState(false)
  const [isPush,setIsPush] = useState(true)
  const [Language,setLanguage] = useState("Русский")
  const [isAutoUpdate,setIsAutoUpdate] = useState(true)
  const [isAnimation,setIsAnimation] = useState(true)

  const themes = ["Тёмная","Белая","Зелёная","Синяя","Неоновая"]
  const Languages = ["Русский","Английский","Аварский"]

  const selectOptionsTheme = themes.map((item) => ({
    value: item,
    label: item,
  }));
  const selectOptionsLanguage = Languages.map((item) => ({
    value: item,
    label: item,
  }));
  
  useEffect(() => {
    if (data && data.length > 0) {
      const settings = data[0];
      if (settings) {
        setTheme(settings.theme || "Тёмная");
        setLanguage(settings.language || "Русский");
        setIsPrivate(!!settings.privates);
        setIsPush(!!settings.push);
        setIsAutoUpdate(!!settings.updatenow);
        setIsAnimation(!!settings.animation);
      }
    }
  }, [data]);

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="header-title">{Language === "Аварский" ? "Настройкаялзаби" : "Настройки"}</h1>

        <div className="header-input">
          <SearchOutlined className="input-icon" />
          <input className="input"
           type="text" 
           placeholder={Language === "Аварский" ? "Настройкаби ралагьи" : "Поиск настроек"}
           />
        </div>
      </div>

      {/* CONTENT */}
      <div className="settings-content">
        {/* УВЕДОМЛЕНИЯ */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Приватность и уведомления</h3>

          <div className="settings-item">
            <div data-aos="fade-in"className="settings-item-info">
              <span className="settings-item-label">{Language === "Аварский" ? "Бахчин" : "Приватность"}</span>
              <span className="settings-item-desc">
                {Language === "Аварский" ? "Цогидал гӀадамаздалсан бахчизе" : "Скрыть портфолио от других пользователей"}
              </span>
            </div>
            <Switch checked={isPrivate} 
                    onChange={() => setIsPrivate(!isPrivate)} />
          </div>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">{Language === "Аварский" ? "Лъазаби" : "Push-уведомление"}</span>
              <span className="settings-item-desc">
                {Language === "Аварский" ? "Лъазаби браузералда жаниб" : "Уведомления в браузере"}
              </span>
            </div>
            <Switch checked={isPush} 
                    onChange={() => setIsPush(!isPush)}/>
          </div>
        </div>

        {/* ИНТЕРФЕЙС */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">Интерфейс</h3>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">{Language === "Аварский" ? "Кьерал" : "Тема"}</span>
              <span className="settings-item-desc">
                {Language === "Аварский" ? "Сайталъул кьерал рищи" : "Выбор оформления сайта"}
              </span>
            </div>
            <Select 
              className="select"
              value={theme}
              onChange={(value) => setTheme(value)}
              options={selectOptionsTheme}
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span data-aos="fade-in" className="settings-item-label">{Language === "Аварский" ? "МацI" : "Язык"}</span>
              <span data-aos="fade-in" className="settings-item-desc">
                {Language === "Аварский" ? "Интерфейсалъул мацI" : "Язык интерфейса"}
              </span>
            </div>
            <Select
              className="select language-select"
              value={Language}
              onChange={(value) => setLanguage(value)}
              options={selectOptionsLanguage}
            />
          </div>
        </div>

        {/* ПОВЕДЕНИЕ */}
        <div data-aos="fade-in" className="settings-section">
          <h3 className="settings-section-title">{Language === "Аварский" ? "ГIамал" : "Поведение"}</h3>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">{Language === "Аварский" ? "Багьа жибго хиси" : "Автообновление цен"}</span>
              <span className="settings-item-desc">
                {Language === "Аварский" ? "Багьа жибго хисизабизе" : "Обновлять курсы автоматически"}
              </span>
            </div>
            <Switch checked={isAutoUpdate}
                    onChange={() => setIsAutoUpdate(!isAutoUpdate)}/>
          </div>

          <div className="settings-item">
            <div data-aos="fade-in" className="settings-item-info">
              <span className="settings-item-label">Анимации</span>
              <span className="settings-item-desc">
                {Language === "Аварский" ? "Тамахго интерфейс хиси" : "Плавные переходы интерфейса"}
              </span>
            </div>
            <Switch checked={isAnimation}
                    onChange={() => setIsAnimation(!isAnimation)} />
          </div>
        </div>

        {/* FOOTER */}
        <div data-aos="fade-in" className="settings-footer">
          <button data-aos="fade-in" className="settings-save">Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
