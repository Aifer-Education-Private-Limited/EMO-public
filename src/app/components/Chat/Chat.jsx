import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import styles from './Chat.module.css';
import ChatSidebar from './ChatSidebar';
import ChatTabs from './ChatTabs';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import Link from 'next/link';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "https://txp3t1rs-3000.inc1.devtunnels.ms/",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      type: "user",
      content: "I need help understanding photosynthesis.",
      timestamp: "10:01 AM",
    },
    {
      id: 3,
      type: "ai",
      content:
        "Photosynthesis is the process by which plants convert light energy into chemical energy. Would you like me to explain the key steps involved?",
      timestamp: "10:01 AM",
    },
    {
      id: 4,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 5,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 6,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 7,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 8,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 9,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 10,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 11,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 12,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 13,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 14,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 15,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 16,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 17,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 18,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 19,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 20,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 21,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 22,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 23,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
    {
      id: 24,
      type: "user",
      content: "Yes, please explain the main steps.",
      timestamp: "10:02 AM",
    },
    {
      id: 25,
      type: "ai",
      content:
        "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
      timestamp: "10:02 AM",
    },
  ]);


  const handleSend = () => {
    if (!searchQuery.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: searchQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setSearchQuery("");
  };

  const popularQuestions = [
    { id: 1, text: 'What is the difference between mitosis and meiosis?' },
    { id: 2, text: 'Explain Newton\'s three laws of motion' },
    { id: 3, text: 'How does photosynthesis work?' },
    { id: 4, text: 'What are the main causes of World War II?' }
  ];

  const recentChats = [
    { id: 1, title: 'Biology basics' },
    { id: 2, title: 'Physics homework' },
    { id: 3, title: 'Chemistry questions' },
    { id: 4, title: 'Math formulas' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <ChatSidebar isSidebarOpen={isSidebarOpen} recentChats={recentChats} toggleSidebar={toggleSidebar} />

        {/* Main Chat Window */}
        <div className="col-md-9 col-lg-9 col-xl-10 px-0">
          <div className={styles.chatWindow}>
            {/* Mobile Header */}
            <div className={styles.headers}>
              {/* Mobile Header */}
              <div
                className={`${styles.mobileHeader} d-md-none px-3 py-0 mb-0 border-bottom d-flex justify-content-between mt-2`}>
                <Link href="/" className="navbar-brand align-items-center">
                  <img
                    className={styles.logo}
                    src="/emo-logo.png" alt="emo" />
                </Link>
                <button className={`${styles.closeButton} mt-2`} onClick={toggleSidebar}>
                  <FiMenu size={26} />
                </button>
              </div>

              {/* Tabs */}
              <ChatTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            </div>

            {/* Messages Area */}
            <ChatMessages activeTab={activeTab} popularQuestions={popularQuestions} dummyMessages={messages} />

            {/* Input Area */}
            <ChatInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} sendMessage={handleSend} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;



//       import React, {useEffect, useRef, useState} from 'react';
//       import {FiMenu, FiSend} from 'react-icons/fi';
//       import styles from './Chat.module.css';
//       import Link from 'next/link';
//       import {IoChatbubbleOutline, IoClose} from 'react-icons/io5';

// const Chat = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//       const [activeTab, setActiveTab] = useState('search');
//       const [searchQuery, setSearchQuery] = useState('');

//       const chatBodyRef = useRef(null)

//       const [messages, setMessages] = useState([
//       {
//         id: 1,
//       type: "ai",
//       content: "https://txp3t1rs-3000.inc1.devtunnels.ms/",
//       timestamp: "10:00 AM",
//     },
//       {
//         id: 2,
//       type: "user",
//       content: "I need help understanding photosynthesis.",
//       timestamp: "10:01 AM",
//     },
//       {
//         id: 3,
//       type: "ai",
//       content:
//       "Photosynthesis is the process by which plants convert light energy into chemical energy. Would you like me to explain the key steps involved?",
//       timestamp: "10:01 AM",
//     },
//       {
//         id: 4,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 5,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 6,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 7,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 8,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 9,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 10,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 11,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 12,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 13,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 14,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 15,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 16,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 17,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 18,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 19,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 20,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 21,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 22,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 23,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 24,
//       type: "user",
//       content: "Yes, please explain the main steps.",
//       timestamp: "10:02 AM",
//     },
//       {
//         id: 25,
//       type: "ai",
//       content:
//       "There are two main stages in photosynthesis:\n\n1. Light-dependent reactions: These occur in the thylakoid membrane and convert light energy into chemical energy (ATP and NADPH).\n\n2. Light-independent reactions (Calvin cycle): These occur in the stroma and use the ATP and NADPH to convert CO2 into glucose.",
//       timestamp: "10:02 AM",
//     },
//       ]);


//   const handleSend = () => {
//     if (!searchQuery.trim()) return;

//       const newMessage = {
//         id: messages.length + 1,
//       type: "user",
//       content: searchQuery,
//       timestamp: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" }),
//     };

//       setMessages([...messages, newMessage]);
//       setSearchQuery("");
//   };

//       const popularQuestions = [
//       {id: 1, text: 'What is the difference between mitosis and meiosis?' },
//       {id: 2, text: 'Explain Newton\'s three laws of motion' },
//       {id: 3, text: 'How does photosynthesis work?' },
//       {id: 4, text: 'What are the main causes of World War II?' }
//       ];

//       const recentChats = [
//       {id: 1, title: 'Biology basics' },
//       {id: 2, title: 'Physics homework' },
//       {id: 3, title: 'Chemistry questions' },
//       {id: 4, title: 'Math formulas' },
//       ];

//   const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     // to scroll to bottom
//     if (chatBodyRef.current) {
//         chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//     }
//   }, [messages]);

//       return (
//       <div className="container-fluid">
//         <div className="row">
//           {/* Sidebar */}
//           <div className={`col-md-3 col-lg-3 col-xl-2 px-0 ${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
//             <div className="p-3">
//               <div className="d-flex justify-content-between">
//                 <Link href="/" className="navbar-brand align-items-center mb-4 d-none d-md-flex">
//                   <img
//                     className={styles.logo}
//                     src="/emo-logo.png" alt="emo" />
//                 </Link>
//                 <img src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-md-none`} />
//                 <button
//                   onClick={toggleSidebar}
//                   className={`d-md-none ${styles.closeButton}`}>
//                   <IoClose size={26} />
//                 </button>
//               </div>
//               <button
//                 //  onClick={addNewChat}
//                 className="primary-btn w-100 mb-4">+ New Chat</button>
//               <h6 className="text-muted mb-0">Recent Chats</h6>
//               <div className={styles.chatHistory}>
//                 {recentChats.map(chat => (
//                   <div key={chat.id} className={styles.chatHistoryItem}>
//                     <IoChatbubbleOutline /> {chat.title}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>


//           {/* Main Chat Window */}
//           <div className="col-md-9 col-lg-9 col-xl-10 px-0">
//             <div className={styles.chatWindow}>
//               <div className={styles.headers}>
//                 {/* Mobile Header */}
//                 <div
//                   className={`${styles.mobileHeader} d-md-none px-3 py-0 mb-0 border-bottom d-flex justify-content-between mt-2`}>
//                   <Link href="/" className="navbar-brand align-items-center">
//                     <img
//                       className={styles.logo}
//                       src="/emo-logo.png" alt="emo" />
//                   </Link>
//                   <button className={`${styles.closeButton} mt-2`} onClick={toggleSidebar}>
//                     <FiMenu size={26} />
//                   </button>
//                 </div>

//                 {/* Tabs */}
//                 <div className={`${styles.tabs} py-2 bg-light`}>
//                   <div className="d-flex justify-content-between">
//                     <div
//                       className={styles.tabButtons}
//                     >
//                       <button
//                         className={`${activeTab === 'search' ? styles.active : styles.inActive}`}
//                         onClick={() => setActiveTab('search')}
//                       >Search</button>
//                       <button
//                         className={`ms-2 ${activeTab === 'pyq' ? styles.active : styles.inActive}`}
//                         onClick={() => setActiveTab('pyq')}
//                       >PYQ</button>
//                     </div>

//                     {/* <button className={styles.settingsIcon}>
//           <IoSettingsOutline size={20} />
//         </button> */}
//                     <img src='/circleavatar.png' alt='avatar' className={`${styles.avatar} d-none d-md-flex`} />
//                   </div>
//                 </div>
//               </div>


//               {/* Messages Area */}
//               <div className={`${styles.messages}`} ref={chatBodyRef}>
//                 {activeTab === 'search' ? (
//                   <div>
//                     {messages.length > 0 ?
//                       messages.map(message => (
//                         <div
//                           key={message.id}
//                           className={`${styles.message} ${message.type === 'ai' ? styles.aiMessage : styles.userMessage
//                             }`}
//                         >
//                           <div className={styles.messageContent}>
//                             {message.content}
//                           </div>
//                         </div>
//                       )) :
//                       <div className='text-center mt-5'>
//                         <img src="/emo-logo.png" alt="Emo" className={styles.bgLogo} />
//                         <h4
//                           style={{ color: "rgb(185 185 185)" }}
//                           className='mt-3 fw-semibold'
//                         >Start chat with Emo</h4>
//                         <h5
//                           style={{ color: "rgb(185 185 185)" }}
//                           className='fw-normal'
//                         >Type something to start chat with Emo</h5>
//                       </div>
//                     }
//                   </div>
//                 ) : (
//                   <div className={styles.popularQuestions}>
//                     <h5 className="mb-4 fw-bold text-center">Popular Questions</h5>
//                     <div className="row g-3">
//                       {popularQuestions.map(question => (
//                         <div key={question.id} className="col-12">
//                           <div className={`card border-0 ${styles.questionCard}`}>
//                             <div className="card-body">
//                               <p className="mb-0">{question.text}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>


//               {/* Input Area */}
//               <div className={styles.inputContainer}>
//                 <div className={`d-flex gap-1 ${styles.searchInput}`}>
//                   <input
//                     type="text"
//                     className={`form-control ${styles.formControl}`}
//                     placeholder="Ask a question..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <button
//                     // onClick={sendMessage}
//                     disabled={!searchQuery}
//                     onClick={handleSend}
//                     className={`${styles.searchButton}`}>
//                     <FiSend size={23} />
//                   </button>
//                 </div>
//               </div>


//             </div>
//           </div>
//         </div>
//       </div>
//       );
// };

//       export default Chat;