import React, { useEffect, useState } from 'react';
import styles from './Chat.module.css'
import { useDispatch } from 'react-redux';
import { clearMessages, setCurrentMode, setSelectedSessionId } from '@/app/constants/features/chat';
import { useRouter } from 'next/navigation';
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const ChatTabs = ({ currentMode, userDetails }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const dispatch = useDispatch();
  const router = useRouter()

  const changeCurrentMode = (mode) => {
    dispatch(setCurrentMode(mode));
    dispatch(clearMessages());
    dispatch(setSelectedSessionId(null))
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

        <div className='d-inline-flex'>
          <h6
            className={`${styles.userName} mt-2 me-2 d-none d-md-flex`}
            onClick={toggleUserDropdown}
          >
            {userDetails ? userDetails.name?.split(" ")[0] : "Account"}
            {userDropdownOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
            {/* {userDetails.name?.split(" ")[0]} */}
          </h6>
          <img
            src={`https://awstrialfileuploads.s3.ap-south-1.amazonaws.com/DP/${userDetails.id}.jpg`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/circleavatar.png';
            }}
            alt={userDetails.name}
            className={`${styles.avatar} d-none d-lg-flex`}
          />
        </div>
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
