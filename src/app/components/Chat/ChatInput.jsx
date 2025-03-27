import React from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './Chat.module.css';

const ChatInput = ({ searchQuery, setSearchQuery, sendMessage }) => {
  return (
    <div className={styles.inputContainer}>
      <div className={`d-flex gap-1 ${styles.searchInput}`}>
        <input
          type="text"
          className={`form-control ${styles.formControl}`}
          placeholder="Ask a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          // onClick={sendMessage}
          disabled={!searchQuery}
          onClick={sendMessage}
          className={`${styles.searchButton}`}>
          <FiSend size={23} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
