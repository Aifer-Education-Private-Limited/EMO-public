import React from 'react';
import styles from './Chat.module.css'
import { IoSettingsOutline } from 'react-icons/io5';

const ChatTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={`${styles.tabs} py-2 bg-light`}>
      <div className="d-flex justify-content-between">
        <div
          className={styles.tabButtons}
        >
          <button
            className={`${activeTab === 'search' ? styles.active : styles.inActive}`}
            onClick={() => setActiveTab('search')}
          >Search</button>
          <button
            className={`ms-2 ${activeTab === 'pyq' ? styles.active : styles.inActive}`}
            onClick={() => setActiveTab('pyq')}
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
