import { Switch } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import "../styles/Components/Sidebar.css";

const ThemeToggle = () => {
  const onChange = (checked:any) => {
    console.log(`switch to ${checked ? 'dark' : 'light'}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span className="Light" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '17px' }}>
        Light
      </span>

      <Switch
        className="theme"
        defaultChecked
        onChange={onChange}
        checkedChildren={<SunOutlined style={{ color: '#fadb14' }} />} 
        unCheckedChildren={<MoonOutlined style={{ color: '#8c8c8c' }} />}
        size="default" 
      />

      <span className="Dark" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '17px' }}>
        Dark
      </span>
    </div>
  );
};

export default ThemeToggle;