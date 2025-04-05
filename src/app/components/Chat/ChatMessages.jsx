import React, { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';
import { marked } from 'marked';
import { LuRefreshCcw } from 'react-icons/lu'

const ChatMessages = ({
  currentMode,
  popularQuestions,
  messages,
  responseLoading,
  responseError,
  regenrateResponse,
  onselectQuestion,
}) => {

  const formattedPyqData = (data) => {
    const originalDescription = data || "";

    const questionMatch = originalDescription.match(/^\d+\s*\)\s*(.*?)\s*(?=\(a\))/i);
    const optionsMatch = [...originalDescription.matchAll(/\(([a-d])\)\s(.*?)(?=\s*\([a-d]\)|\s*answer\s*:)/gi)];
    const answerMatch = originalDescription.match(/answer\s*:\s*([a-d])/i);
    const explanationMatch = originalDescription.match(/explanation\s*:\s*(.*)/is);

    const question = questionMatch ? questionMatch[1].trim() : '';
    const options = optionsMatch.map(match => `<li><strong>(${match[1]})</strong> ${match[2].trim()}</li>`).join('');
    const answer = answerMatch ? answerMatch[1] : '';
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    const html = `
      <p><strong>Question:</strong> ${question}</p>
      <p><strong>Options:</strong></p>
      <ol>${options}</ol>
      <p><strong>Answer:</strong> (${answer})</p>
      <p><strong>Explanation:</strong> ${explanation}</p>
    `;

    return html;
  };


  // const [copySuccess, setCopySuccess] = useState({});
  const chatBodyRef = useRef(null)
  // const messageRefs = useRef({});

  // const copyToClipboard = (index) => {
  //   const messageElement = messageRefs.current[index];

  //   if (messageElement) {
  //     const text = messageElement.innerText || messageElement.textContent;
  //     navigator.clipboard.writeText(text)
  //       .then(() => {
  //         setCopySuccess(prevState => ({ ...prevState, [index]: true })); // Update only the copied message

  //         setTimeout(() => {
  //           setCopySuccess(prevState => ({ ...prevState, [index]: false })); // Reset after 1s
  //         }, 1000);
  //       })
  //       .catch(err => console.error("Copy failed:", err));
  //   }
  // };


  useEffect(() => {
    if (chatBodyRef.current && messages.length > 0) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, currentMode]);


  useEffect(() => {
    if (messages.length <= 1) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [messages]);

  const formatMessage = (content) => {
    if (!content) return "";
    return marked(content);
  };

  return (
    <div className={`${styles.messages}`} ref={chatBodyRef}>

      {currentMode === 'search' &&
        <div>
          {messages.length > 0 ?
            messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.aiMessage
                  }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  className={styles.messageContent}
                // ref={(el) => messageRefs.current[index] = el}
                >
                </div>
                {message.role === 'assistant-remote' && (
                  <div className={styles.responseOptions}>
                    {responseLoading === false &&
                      index === messages.length - 1 &&
                      <button
                        onClick={regenrateResponse}
                      >
                        <LuRefreshCcw size={17} />
                      </button>}
                    {/* <button onClick={() => copyToClipboard(index)}>
                      {copySuccess[index] ? <FaCheck /> : <LuCopy size={17} />}
                    </button> */}
                  </div>
                )}
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
      }


      {/* PYQ */}

      {currentMode === 'pyq' && messages.length === 0 && (
        // Show welcome message and logo
        <div className='text-center mt-5'>
          <img src="/emo-logo.png" alt="Emo" className={styles.bgLogo} />
          <h4 className='mt-3 fw-semibold' style={{ color: "rgb(185 185 185)" }}>
            Previous Year Questions
          </h4>
          <h5 className='fw-normal' style={{ color: "rgb(185 185 185)" }}>
            Ask about a topic to get related Previous Year Questions
          </h5>
        </div>
      )}

      {currentMode === 'pyq' && messages.length === 1 && (
        // Show popular questions related to the first user question
        <div className={styles.popularQuestions}>
          <h5 className="mb-4 fw-bold text-center">
            <strong>{messages[0].content}</strong> - Popular Questions
          </h5>
          <div className="row g-3">
            {responseLoading ? (
              // Show 4 loading skeletons
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="col-12">
                  <div className={`card border-0 ${styles.questionCard}`}>
                    <div className="card-body">
                      <p className="skeleton skeleton-text mb-2" style={{ width: '70%' }}></p>
                      <span className="skeleton skeleton-text mb-2" style={{ width: '40%' }}></span>
                    </div>
                  </div>
                </div>
              ))
            ) : !responseError ? (
              popularQuestions.map((question) => (
                <div onClick={() => onselectQuestion(question.description)} key={question.id} className="col-12">
                  <div className={`card border-0 ${styles.questionCard}`}>
                    <div className="card-body">
                      <p className="mb-2"><strong>Q :</strong> {question.parsed.question}</p>
                      <span className='fw-bold'>Options :</span>
                      <ol type='a' className='pyq-options'>
                        {question.parsed.options.length > 0 && question.parsed.options.map((option, index) => (
                          <li key={index}>{option.value}</li>
                        ))}
                      </ol>
                      <style>{`
            .pyq-options {
              list-style-type: lower-alpha;
            }
            .pyq-options li::marker {
              content: counter(list-item) ") ";
            }
          `}</style>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.errorResponse}>
                <p className='m-0 ms-md-4'>{responseError}. <span
                style={{ cursor: 'pointer' }}
                onClick={onsu}
                 className='fw-semibold'>Please try again</span></p>
              </div>
            )}

          </div>
        </div>
      )}

      {currentMode === 'pyq' && messages.length > 1 && (
        // Show full chat conversation
        messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.aiMessage
              }`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: message.role === 'user' ? formatMessage(message.content) : formattedPyqData(message.content) }}
              className={styles.messageContent}
            ></div>
          </div>
        ))
      )}

    </div>
  );
};

export default ChatMessages;