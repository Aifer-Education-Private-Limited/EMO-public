import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';

const ChatMessages = ({ activeTab, popularQuestions, dummyMessages }) => {
  const chatBodyRef = useRef(null)

  useEffect(() => {
    // to scroll to bottom
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [dummyMessages]);

  return (
    <div className={`${styles.messages}`} ref={chatBodyRef}>
      {activeTab === 'search' ? (
        <div>
          {dummyMessages.length > 0 ?
            dummyMessages.map(message => (
              <div
                key={message.id}
                className={`${styles.message} ${message.type === 'ai' ? styles.aiMessage : styles.userMessage
                  }`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
            )) :
            <div className='text-center mt-5'>
              <img src="/emo-logo.png" alt="Emo" className={styles.bgLogo} />
              <h4
                style={{ color: "rgb(185 185 185)" }}
                className='mt-3 fw-semibold'
              >Start chat with Emo</h4>
              <h5
                style={{ color: "rgb(185 185 185)" }}
                className='fw-normal'
              >Type something to start chat with Emo</h5>
            </div>
          }
        </div>
      ) : (
        <div className={styles.popularQuestions}>
          <h5 className="mb-4 fw-bold text-center">Popular Questions</h5>
          <div className="row g-3">
            {popularQuestions.map(question => (
              <div key={question.id} className="col-12">
                <div className={`card border-0 ${styles.questionCard}`}>
                  <div className="card-body">
                    <p className="mb-0">{question.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;