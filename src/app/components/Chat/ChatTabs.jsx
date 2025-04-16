import React, { useState } from 'react';
import styles from './Chat.module.css'

const ChatTabs = ({ currentMode, setCurrentMode }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const userLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("Name");
    window.location.href = '/';
  };

  return (
    <div className={`${styles.tabs} py-2 bg-light`}>
      <div className="d-flex justify-content-between">
        <div
          className={styles.tabButtons}
        >
          <button
            className={`${currentMode === 'search' ? styles.active : styles.inActive}`}
            onClick={() => setCurrentMode('search')}
          >Search</button>
          <button
            className={`ms-2 ${currentMode === 'pyq' ? styles.active : styles.inActive}`}
            onClick={() => setCurrentMode('pyq')}
          >PYQ</button>
        </div>

        <img
          src='/circleavatar.png'
          alt='avatar'
          onClick={toggleUserDropdown}
          className={`${styles.avatar} d-none d-md-flex`}
        />
        {userDropdownOpen && (
          <ul className={styles.dropdownMenu}>
            <li onClick={userLogout}>
              <button className={styles.logoutBtn}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatTabs;
