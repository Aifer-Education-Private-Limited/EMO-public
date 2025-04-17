import React, { useEffect, useState } from 'react';
import styles from './Chat.module.css'
import { useDispatch } from 'react-redux';
import { clearMessages, setCurrentMode } from '@/app/constants/features/chat';
import { useRouter } from 'next/navigation';

const ChatTabs = ({ currentMode }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const dispatch = useDispatch();
  const router = useRouter()

  const changeCurrentMode = (mode) => {
    dispatch(setCurrentMode(mode));
    dispatch(clearMessages());
    router.push('/chat');
  }

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
            onClick={() => changeCurrentMode('search')}
          >Search</button>
          <button
            className={`ms-2 ${currentMode === 'pyq' ? styles.active : styles.inActive}`}
            onClick={() => changeCurrentMode('pyq')}
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
