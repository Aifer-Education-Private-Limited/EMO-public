import React, { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { LuRefreshCcw } from 'react-icons/lu'
import { SiRobotframework } from "react-icons/si";
import { useSelector } from 'react-redux';
import { FaPen } from 'react-icons/fa6';
import { MdOutlineSaveAlt } from 'react-icons/md';

const ChatMessages = ({
  currentMode,
  popularQuestions,
  // messages,
  responseLoading,
  responseError,
  regenrateResponse,
  onselectQuestion,
  showPopularQuestions,
  handleClickEditQuery
}) => {
  const messages = useSelector((state) => state.chat.messages);
  const messageRefs = useRef([]);

  
  const exportToPdf = async (index) => {
    const html2pdf = (await import('html2pdf.js')).default;

    const element = messageRefs.current[index];
    if (!element) return;

    const options = {
      margin: 10,
      filename: "chat.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
    
  }

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
      <ol style="list-style: none;">${options}</ol>
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

    return () => document.body.style.overflow = "auto";
  }, [messages]);

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
                <div className={styles.messageContent} ref={el => messageRefs.current[index] = el}>
                  <ReactMarkdown
                    children={message.content}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  />
                </div>
                {/* {message.role === 'assistant-remote' && (
                  <div className={styles.responseOptions}>
                    {responseLoading === false &&
                      index === messages.length - 1 &&
                      <button
                        onClick={regenrateResponse}
                      >
                        <LuRefreshCcw size={17} />
                      </button>}
                  </div>
                )} */}
                {message.role !== 'user' && (
                  <div className={styles.responseOptions}>
                    {responseLoading === false &&
                      <button
                        onClick={() => exportToPdf(index)}
                      >
                        <MdOutlineSaveAlt size={17} />
                      </button>}
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
      {currentMode === 'pyq' && (
        messages.length > 0 ? (
          <>
            {/* Chat messages */}
            {messages.map((message, index) => (
              <div
              key={index}
              className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.aiMessage}`}
            >
              <div className={styles.messageContent}>
                {message.role === 'user' ? (
                  <ReactMarkdown
                    children={message.content}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: formattedPyqData(message.content) }} />
                )}
              </div>
            </div>
            
            ))}

            {/* Popular Questions (shown after messages) */}
            {showPopularQuestions && (
              <div className={styles.popularQuestions}>
                <div className='text-center mb-4'>
                  <h5 className="fw-bold text-center">
                    <strong>{messages[messages.length - 1].content}</strong> - Popular Questions
                  </h5>
                  {!responseLoading && popularQuestions.parsed && <p>Please select a question to see answer</p>}
                </div>
                <div className="row g-3">
                  {responseLoading ? (
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
                  ) : responseError ? (
                    <div className={styles.errorResponse}>
                      <p className='m-0 ms-md-4'>
                        {responseError}.{' '}
                        <span
                          onClick={regenrateResponse}
                          style={{ cursor: 'pointer' }}
                          className='fw-semibold'
                        >
                          Please try again
                        </span>
                      </p>
                    </div>
                  ) : !popularQuestions[0].parsed ? (
                    <div className="text-center">
                      <h5 className="text-danger"><SiRobotframework /> Sorry, we couldn't find any questions. <br /> Try with another question.</h5>
                      <span
                        style={{ cursor: "pointer", fontWeight: "500" }}
                        onClick={handleClickEditQuery}
                        className='border-bottom border-dark'><FaPen /> Edit question</span>
                    </div>
                  ) : (
                    popularQuestions.map((question) => (
                      <div
                        onClick={() => onselectQuestion(question.description)}
                        key={question.id}
                        className="col-12"
                      >
                        <div className={`card border-0 ${styles.questionCard}`}>
                          <div className="card-body">
                            <p className="mb-2"><strong>Q :</strong> {question.parsed.question}</p>
                            <span className='fw-bold'>Options :</span>
                            <ol type='a' className='pyq-options'>
                              {question.parsed.options.length > 0 &&
                                question.parsed.options.map((option, index) => (
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
                    )))}
                </div>
                {!responseLoading && popularQuestions.parsed && <p className='text-center my-4'>Please select a question to see the answer</p>}
              </div>
            )}
          </>
        ) : (
          // Welcome screen
          <div className='text-center mt-5'>
            <img src="/emo-logo.png" alt="Emo" className={styles.bgLogo} />
            <h4 className='mt-3 fw-semibold' style={{ color: "rgb(185 185 185)" }}>
              Previous Year Questions
            </h4>
            <h5 className='fw-normal' style={{ color: "rgb(185 185 185)" }}>
              Ask about a topic to get related Previous Year Questions
            </h5>
          </div>
        )
      )}

    </div>
  );
};

export default ChatMessages;