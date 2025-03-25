import React from 'react';
import styles from './Chat.module.css';
import { IoChatbubbleOutline, IoClose } from "react-icons/io5";
import Link from 'next/link';

const ChatSidebar = ({ isSidebarOpen, recentChats, toggleSidebar }) => {
    return (
        <div className={`col-md-3 col-lg-3 col-xl-2 px-0 ${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className="p-3">
                <div className="d-flex justify-content-between">
                    {/* <Link href="/" className="navbar-brand align-items-center mb-4">
                        <img
                            className={styles.logo}
                            src="/emo-logo.png" alt="emo" />
                    </Link> */}
                    <img src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-md-none`} />
                    <button
                        onClick={toggleSidebar}
                        className={`d-md-none ${styles.closeButton}`}>
                        <IoClose size={26} />
                    </button>
                </div>
                <button
                    //  onClick={addNewChat} 
                    className="primary-btn w-100 mb-4">+ New Chat</button>
                <h6 className="text-muted mb-0">Recent Chats</h6>
                <div className={styles.chatHistory}>
                    {recentChats.map(chat => (
                        <div key={chat.id} className={styles.chatHistoryItem}>
                            <IoChatbubbleOutline /> {chat.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ChatSidebar;