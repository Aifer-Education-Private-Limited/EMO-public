import React, { useState } from 'react';
import styles from './Chat.module.css';
import { IoClose, IoSearchSharp } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Link from 'next/link';
import { useSelector } from 'react-redux';

const ChatSidebar = ({
    isSidebarOpen,
    history,
    toggleSidebar,
    onNewChat,
    handleSelectSession,
    onDeleteSession,
    onRenameSession,
}) => {
    const [openChatOptions, setOpenChatOptions] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [editingChatId, setEditingChatId] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');

    const selectedSessionId = useSelector((state) => state.chat.selectedSessionId);

    const toggleChatOptions = (chatId) => {
        setOpenChatOptions(openChatOptions === chatId ? null : chatId);
    };

    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

    const userLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("Name");
        window.location.href = '/';
    };

    return (
        <div className={`col-md-3 col-lg-3 col-xl-2 px-0 ${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className="p-3">
                <div className="d-flex justify-content-between mb-3">
                    <Link href="/" className="navbar-brand align-items-center mb-4 d-none d-md-flex">
                        <img
                            className={styles.logo}
                            src="/emo-logo.png" alt="emo"
                        />
                    </Link>
                    <div className={styles.userAvatar}>
                        <img onClick={toggleUserDropdown} src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-md-none`} />
                        {userDropdownOpen && (
                            <ul className={styles.dropdownMenuSidebar}>
                                <li onClick={userLogout}>
                                    <button className={styles.logoutBtn}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className={`d-md-none ${styles.closeButton}`}>
                        <IoClose size={26} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        onNewChat()
                        toggleSidebar()
                    }}
                    className="primary-btn w-100 mb-4"
                >+ New Chat</button>
                <h6 className="text-muted mb-0">Recent Chats</h6>
                <div className={styles.chatHistory}>
                    {history.map((chat, index) => (
                        <div
                            onClick={() => handleSelectSession(chat._id)}
                            key={index}
                            className={`${styles.chatHistoryItem} ${chat._id === selectedSessionId && styles.SelectedItem} d-flex justify-content-between`}
                        >
                            <span>
                                {editingChatId === chat._id ? (
                                    <input
                                        type="text"
                                        value={newChatTitle}
                                        onChange={(e) => setNewChatTitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onBlur={() => {
                                            if (newChatTitle.trim()) {
                                                onRenameSession(chat._id, newChatTitle.trim());
                                            }
                                            setEditingChatId(null);
                                            setNewChatTitle('');
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (newChatTitle.trim()) {
                                                    onRenameSession(chat._id, newChatTitle.trim());
                                                }
                                                setEditingChatId(null);
                                                setNewChatTitle('');
                                            }
                                        }}
                                        autoFocus
                                        className={styles.renameInput}
                                    />
                                ) : (
                                    <>
                                        {chat.mode === "search" ? <IoSearchSharp /> : <SiBookstack />} {chat.title}
                                    </>
                                )}
                            </span>


                            <div className={`${styles.right} position-relative`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleChatOptions(chat._id)
                                    }}
                                    className={styles.optionsBtn}
                                ><BiDotsHorizontalRounded size={20} /></button>
                                {openChatOptions === chat._id && (
                                    <div className={styles.optionsMenu}>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingChatId(chat._id);
                                            setNewChatTitle(chat.title);
                                            setOpenChatOptions(null);
                                        }}>Rename</button>

                                        <button onClick={() => onDeleteSession(chat._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ChatSidebar;