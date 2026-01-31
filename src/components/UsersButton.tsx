import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon } from './Icons/UsersIcon';

export const UsersButton = () => {
  const [displayText, setDisplayText] = useState('Клиенты');
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setDisplayText('Топ клиенты');
    }, 250);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayText('Клиенты');
  };

  return (
    <div className="item sidebar-split-item">
      <Link to="/users" className="sidebar-split-left">
        <UsersIcon className="sidebar-icon" />
      </Link>
      <Link
        to="/topusers"
        className="sidebar-split-right nav-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayText}
      </Link>
    </div>
  );
};