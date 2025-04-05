import React, { useEffect } from 'react';
import styles from './Chat.module.css'

const ChatTabs = ({ currentMode, setCurrentMode }) => {
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

        {/* <button className={styles.settingsIcon}>
          <IoSettingsOutline size={20} />
        </button> */}
        <img src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-none d-md-flex`} />
      </div>
    </div>
  );
};

export default ChatTabs;
