import React, { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';
import { IoChevronDown, IoChevronUp, IoClose, IoSearchSharp } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Link from 'next/link';
import { useSelector } from 'react-redux';

const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const ChatSidebar = ({
    isSidebarOpen,
    history,
    toggleSidebar,
    onNewChat,
    handleSelectSession,
    onDeleteSession,
    onRenameSession,
    setPage,
    ref,
    onClose,
    userDetails
}) => {
    const [openChatOptions, setOpenChatOptions] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [editingChatId, setEditingChatId] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');
    const historyContainerRef = useRef(null);
    const { chatHistoryCount } = useSelector((state) => state.chat);
    const optionsRef = useRef(null);
    const longPressTimeout = useRef(null);

    const handleLongPressStart = (chatId) => {
        longPressTimeout.current = setTimeout(() => {
            toggleChatOptions(chatId);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500);
    };

    const handleLongPressEnd = () => {
        clearTimeout(longPressTimeout.current);
    };

    const isFetchingRef = useRef(false);
    const selectedSessionId = useSelector((state) => state.chat.selectedSessionId);

    const handleScroll = () => {
        if (chatHistoryCount === history.length) return;
        const container = historyContainerRef.current;
        if (!container || isFetchingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
            isFetchingRef.current = true;

            setPage(prev => prev + 1);

            setTimeout(() => {
                isFetchingRef.current = false;
            }, 500);
        }
    };

    const toggleChatOptions = (chatId) => {
        setOpenChatOptions(openChatOptions === chatId ? null : chatId);
    };

    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

    const userLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("Name");
        window.location.href = '/';
    };

    const todayChats = history.filter(chat => isToday(chat.updatedAt));
    const otherChats = history.filter(chat => !isToday(chat.updatedAt));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target)
            ) {
                setOpenChatOptions(null);
            }
        };

        if (openChatOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openChatOptions]);

    const renderChatItem = (chat, index) => (
        <div
            key={chat._id}
            onClick={() => handleSelectSession(chat._id)}
            onTouchStart={() => handleLongPressStart(chat._id)}
            onTouchEnd={handleLongPressEnd}
            onTouchCancel={handleLongPressEnd}
            className={`${styles.chatHistoryItem} ${chat._id === selectedSessionId && styles.SelectedItem} d-flex justify-content-between no-select`}
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
                            if (e.key === 'Enter' && newChatTitle.trim()) {
                                onRenameSession(chat._id, newChatTitle.trim());
                                setEditingChatId(null);
                                setNewChatTitle('');
                            }
                        }}
                        autoFocus
                        className={styles.renameInput}
                    />
                ) : (
                    <span className={styles.chatTitle}>
                        {chat.mode === "search" ? <IoSearchSharp /> : <SiBookstack />} {chat.title}
                    </span>
                )}
            </span>

            <div className={`${styles.right} position-relative`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleChatOptions(chat._id);
                    }}
                    className={styles.optionsBtn}
                >
                    <BiDotsHorizontalRounded size={20} />
                </button>
                {openChatOptions === chat._id && (
                    <div className={`${index === history.length - 1 ? styles.optionsMenuTop : styles.optionsMenu}`} ref={optionsRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingChatId(chat._id);
                                setNewChatTitle(chat.title);
                                setOpenChatOptions(null);
                            }}
                        >
                            Rename
                        </button>
                        <button onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSession(chat._id)
                        }}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            ref={ref}
            className={`col-md-3 col-lg-3 col-xl-2 px-0 ${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        >
            <div className="p-3">
                <div className="d-flex justify-content-between mb-3">
                    <Link href="/" className="navbar-brand align-items-center mb-4 d-none d-md-flex">
                        <img
                            className={styles.logo}
                            src="/emo-logo.svg"
                            alt="emo"
                            width={40}
                            height={40}
                        />
                    </Link>
                    <div className={styles.userAvatar}>
                        <img onClick={toggleUserDropdown} src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-md-none`} />
                        <h6
                            className={`${styles.userName} mt-2 ms-2 d-md-none`}
                            onClick={toggleUserDropdown}
                        >
                            {userDetails ? userDetails.name?.split(" ")[0] : "Account"} 
                            {userDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
                        </h6>
                        {userDropdownOpen && (
                            <ul className={styles.dropdownMenuSidebar}>
                                <li onClick={userLogout}>
                                    <button className={styles.logoutBtn}>Logout</button>
                                </li>
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                            setUserDropdownOpen(false)
                        }}
                        className={`d-md-none ${styles.closeButton}`}
                    >
                        <IoClose size={26} />
                    </button>
                </div>

                <button
                    onClick={() => {
                        onNewChat();
                        toggleSidebar();
                    }}
                    className="primary-btn w-100 mb-4"
                >
                    + New Chat
                </button>

                <div
                    className={`${styles.chatHistory} ${history.length > 3 && styles.overflowAuto}`}
                    onScroll={handleScroll}
                    ref={historyContainerRef}
                >
                    {todayChats.length > 0 && (
                        <>
                            <div className={styles.dateLabel}>Today</div>
                            {todayChats.map(renderChatItem)}
                        </>
                    )}

                    {otherChats.length > 0 && (
                        <>
                            <div className={styles.dateLabel}>Earlier</div>
                            {otherChats.map(renderChatItem)}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
