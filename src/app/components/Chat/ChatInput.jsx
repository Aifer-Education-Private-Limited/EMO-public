import React from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './Chat.module.css';

const ChatInput = ({ searchQuery, setSearchQuery, sendMessage, responseLoading, showPyq, searchInputRef }) => {
  return (
    <form
      onSubmit={sendMessage}
      className={styles.inputContainer}>
      <div className={`d-flex gap-1 ${styles.searchInput}`}>
        <input
          ref={searchInputRef}
          type="text"
          className={`form-control ${styles.formControl}`}
          placeholder="Ask a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          disabled={!searchQuery || responseLoading || showPyq}
          type='submit'
          className={`${styles.searchButton}`}
        >
          <FiSend size={23} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
