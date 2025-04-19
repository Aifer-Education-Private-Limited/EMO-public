import React, { useEffect, useRef, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import styles from './Chat.module.css';
import ChatSidebar from './ChatSidebar';
import ChatTabs from './ChatTabs';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import Link from 'next/link';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import axios from 'axios';
// import { Toast } from 'bootstrap';
import aiferAxios from '../../constants/axios'
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChatHistory,
  addMessage,
  clearMessages,
  incrementChatCountToday,
  moveSessionToTop,
  removeSession,
  renameSession,
  setChatCountToday,
  setChatHistory,
  setCurrentMode,
  setSelectedSession,
  setSelectedSessionId,
  setTotalChatCount,
  updateLastAssistantMessage
} from '@/app/constants/features/chat';
import keyword_extractor from 'keyword-extractor';

const Chat = () => {
  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.user.value);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { chatid } = useParams()
  const selectedSessionId = useSelector((state) => state.chat.selectedSessionId);

  const [responseLoading, setResponseLoading] = useState(false)
  const [responseError, setResponseError] = useState("")
  const selectedSearchResponseId = useRef(0);
  const [showPopularQuestions, setShowPopularQuestions] = useState(false)
  const [lastQuery, setLastQuery] = useState("")
  const [popularQuestions, setPopularQuestions] = useState([])
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const messages = useSelector((state) => state.chat.messages);
  const { currentMode, totalChatCounts, chatHistory } = useSelector((state) => state.chat);
  const [toasts, setToasts] = useState({ errorToast: null, successToast: null });

  const router = useRouter()

  const resultRef = useRef("")
  let codeBlockStarted;
  let codeBlockTracker;
  let newLineTracker;

  const handleSend = (e) => {
    e.preventDefault()

    if (currentMode === "pyq" && totalChatCounts.pyq >= 5) {
      setError("You have reached the maximum number of chats for today. Please try again tomorrow.")
      showErrorToast()
      return
    } else if (currentMode === "search" && totalChatCounts.search >= 5) {
      setError("You have reached the maximum number of chats for today. Please try again tomorrow.")
      showErrorToast()
      return
    }
    onSubmitNewMessage()
  };

  const onSubmitNewMessage = async () => {
    if (searchQuery === "") return
    setResponseLoading(true)

    if (currentMode === "search") {
      setSearchQuery("");

      await fetchData(
        searchQuery,
        selectedSessionId || 1, // repalce with actual session id
        currentMode,
        messages
      )
    } else if (
      currentMode === "pyq") {
      setShowPopularQuestions(true)
      setSearchQuery("");
      const question = { content: searchQuery, role: "user" };
      dispatch(addMessage(question));
      fetchPyqData(searchQuery)
    } else {
      console.log("else");
    }
  }

  async function fetchData(userQuery, id, mode, prevChat) {
    setResponseLoading(true)
    const question = { content: userQuery, role: "user" };
    const updatedChatList = [...(prevChat ?? messages), question];

    dispatch(addMessage(question));

    const controller = new AbortController();

    const serverBaseURL1 =
      mode === "pyq"
        ? "https://vector.mymeet.link/api/v1/vector/aifer/search"
        : "https://aiferv2.mymeet.link/api/v1/stream/aifer-mithra/";

    const email_id = localStorage.getItem("email");

    const body = {
      email_id,
      stream: true,
      messages: updatedChatList,
      ref_id: id,
    };

    await fetchEventSource(serverBaseURL1, {
      signal: controller.signal,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "*/*",
        authority: "chat.openai.com",
        "accept-language": "en-US,en;q=0.9,ml;q=0.8",
        "Content-Type": "application/json",
      },
      async onopen(res) {
        if (res.ok && res.status === 200) {
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          controller.abort();
        }
      },
      onmessage(event) {
        if (event.data === "``") {
          codeBlockTracker = "``";
        } else if (event.data === "`") {
          codeBlockTracker = `${codeBlockTracker}\``;
        } else if (event.data === "```") {
          codeBlockTracker = "```";
        } else if (codeBlockTracker === "```") {
          codeBlockStarted = !codeBlockStarted;
          if (event.data != "") {
            event.data = "";
          }
          resultRef.current = resultRef.current.replace(
            "```",
            codeBlockStarted
              ? '<div class="code-snippet"><p class="code-copy"></p><pre><code class="language-markup">'
              : "</code></pre></div>"
          );
          codeBlockTracker = undefined;
        } else {
          codeBlockTracker = undefined;
        }

        if (codeBlockStarted && event.data === "" && !codeBlockTracker) {
          event.data = "\n";
        }

        if (event.data.includes("<")) {
          event.data = event.data.replaceAll("<", "&lt;");
        }

        if (event.data.includes(">")) {
          event.data = event.data.replaceAll(">", "&gt;");
        }

        if (event.data === "") {
          if (newLineTracker === "") {
            event.data = "\n\n";
            newLineTracker = undefined;
          } else {
            newLineTracker = "";
          }
        } else {
          newLineTracker = undefined;
        }
        if (event.data !== "[DONE]") {
          if (codeBlockStarted) {
            if (
              resultRef.current.substring(resultRef.current.length - 19) ===
              "</code></pre></div>"
            ) {
              const sliced = resultRef.current.slice(
                0,
                resultRef.current.length - 19
              );
              resultRef.current = sliced;
            }
          }
          resultRef.current = (resultRef.current ?? "") + event.data ?? "";
          const respondedChatItem = {
            content: resultRef.current,
            role: "assistant-remote",
          };

          if (resultRef.current.length === event.data.length) {
            dispatch(addMessage(respondedChatItem));
          } else {
            dispatch(updateLastAssistantMessage(resultRef.current));
          }

        } else {
          const finalMessages = [
            ...updatedChatList,
            { content: resultRef.current, role: "assistant-remote" },
          ];

          saveMessages(finalMessages);

          resultRef.current = "";
          controller.abort();
        }
      },
      onclose() {
        resultRef.current = "";
        controller.abort();
      },
      onerror(err) {
        console.log("There was an error from the server", err);
      },
    });

    setResponseLoading(false)
  }

  const createNewSession = async (messages) => {
    try {
      const title = getTitleFromMessages(messages);

      const body = {
        userId: userDetails.firebase_uid,
        mode: currentMode,
        title: title || new Date().toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "2-digit",
        }),
      }

      const { data } = await aiferAxios.post("/api/emo/createChat", body)

      if (!data.success) {
        setError("Error creating new session")
        showErrorToast()
        return
      }
      router.push(`/chat/${data.data._id}`)
      dispatch(setSelectedSessionId(data.data._id))
      dispatch(addChatHistory(data.data))

      return data.data._id;
    } catch (error) {
      setError("Error creating new session")
      showErrorToast()
    }
  }

  const saveMessages = async (messages) => {
    try {
      let sessionId = selectedSessionId;

      if (messages.length < 2) {
        return;
      } else if (messages.length === 2 || !selectedSessionId) {
        sessionId = await createNewSession(messages)
      }

      const lastTwoMessages = messages.slice(-2);
      const conversation = lastTwoMessages.map((msg) => ({
        sender: msg.role === "user" ? "user" : "assistant-remote",
        content: msg.content,
      }));

      const body = {
        conversation: conversation,
      };

      await aiferAxios.post(`/api/emo/saveMessages/${sessionId}`, body);

      dispatch(moveSessionToTop())

      if (!userDetails.premium) {
        dispatch(incrementChatCountToday())
      }

    } catch (error) {
      console.error("Failed to save messages", error);
    }
  };


  const fetchPyqData = async (query) => {
    setLastQuery(query)
    setResponseError("")
    try {
      const { data } = await axios.post("https://vector.mymeet.link/api/v1/vector/aifer/search", { query })

      if (!data.most_similar_text || data.most_similar_text.length === 0) {
        setResponseError("No results found");
        setResponseLoading(false)
        return;
      }

      setPopularQuestions(formattedPyqData(data))
      setResponseLoading(false)

    } catch (error) {
      console.error("Error fetching data:", error);
      setResponseLoading(false)
      setResponseError("An error occurred while fetching data");
    }

  }

  const formattedPyqData = (data) => {
    return data.most_similar_text
      .filter((_, index) => index !== 2) // Exclude the third item (Remove this if api is fixed. otherwise use the query "Inventory turnover ratio" to work properly.)
      .map((item) => {
        const originalDescription = item.description || "";

        const questionMatch = originalDescription.match(/^\d+\s*\)\s*(.*?)\s*(?=\(a\))/i);
        const optionsMatch = [...originalDescription.matchAll(/\(([a-d])\)\s(.*?)(?=\s*\([a-d]\)|\s*answer\s*:)/gi)];
        const answerMatch = originalDescription.match(/answer\s*:\s*([a-d])/i);
        const explanationMatch = originalDescription.match(/explanation\s*:\s*(.*)/is);

        const formattedData = {
          question: questionMatch ? questionMatch[1].trim() : '',
          options: optionsMatch.map(match => ({ key: match[1], value: match[2].trim() })),
          answer: answerMatch ? answerMatch[1] : '',
          explanation: explanationMatch ? explanationMatch[1].trim() : ''
        };

        return {
          ...item,
          parsed: formattedData
        };
      });
  }


  const handleNewChat = () => {
    dispatch(clearMessages())
    router.push("/chat")
  }

  const handleRegenerate = async () => {
    if (currentMode === "pyq") {
      if (lastQuery) {
        fetchPyqData(lastQuery);
      }
    } else {
      if (messages.length < 2) return;
      const prevChat = messages.slice(0, -1);
      const lastUserQuery = prevChat.pop();

      if (lastUserQuery.role !== "user") return;

      setResponseLoading(true);
      await fetchData(lastUserQuery.content, selectedSearchResponseId?.current ?? 0, currentMode, prevChat);
      setResponseLoading(false);
    }
  };


  const handleSelectQuestion = (question) => {
    setShowPopularQuestions(false)
    const selectedQuestion = { content: question, role: "assistant-remote" };
    saveMessages([...messages, selectedQuestion])

    dispatch(addMessage(selectedQuestion));
    setPopularQuestions([])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getSession = async (sessionId) => {
    try {
      const { data } = await aiferAxios.get(`/api/emo/session/${sessionId}`)

      if (data.success) {
        if (data.data.mode === "pyq") {
          dispatch(setCurrentMode("pyq"))
        } else {
          dispatch(setCurrentMode("search"))
        }
        dispatch(setSelectedSession(data.data))
      } else {
        router.push("/chat")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchMessages = async (id) => {
    try {
      const { data } = await aiferAxios.get(`/api/emo/chat/${id}`)

      if (data.success) {
        dispatch(clearMessages())
        data.data.forEach((item) => {
          item.messages.forEach((message) => {
            const formattedMessages = {
              _id: item._id,
              content: message.content,
              role: message.sender === "user" ? "user" : "assistant-remote",
            };
            dispatch(addMessage(formattedMessages));
          })

        })
      } else {
        setError("Error fetching messages")
        showErrorToast()
      }
    } catch (error) {
      setError("Error fetching messages")
      showErrorToast()
    }
  }

  const getChatCountToday = async () => {
    try {
      const { data } = await aiferAxios.get(`/api/emo/conversationsCountToday/${userDetails.firebase_uid}`)

      if (data.success) {
        dispatch(setChatCountToday(data.counts))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getChatHistory = async () => {
    try {
      const { data } = await aiferAxios.get(`/api/emo/chatHistory/${userDetails.firebase_uid}`, {
        params: {
          limit: 15,
          page,
        },
      });

      if (data.success) {
        if (page === 1) {
          dispatch(setChatHistory(data.data))
          dispatch(setTotalChatCount(data.pagination.total))
        } else {
          dispatch(setChatHistory([...chatHistory, ...data.data]))
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSelectSession = (id) => {
    if (id === selectedSessionId) return
    dispatch(clearMessages())
    dispatch(setSelectedSessionId(id))
    getSession(id)
    router.push(`/chat/${id}`)
  }

  const handleDeleteSession = async (id) => {
    try {
      const { data } = await aiferAxios.delete(`/api/emo/deleteChat/${id}`)

      if (data.success) {
        setSuccessMessage("Session deleted successfully")
        showSuccessToast()
        if (id === selectedSessionId) {
          dispatch(clearMessages())
          dispatch(setSelectedSessionId(null))
          router.push("/chat")
        }
        dispatch(removeSession(id))
      } else {
        setError("Error deleting session")
        showErrorToast()
      }
    } catch (error) {
      setError("Error deleting session")
      showErrorToast()
    }
  }

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap'); // lazy-load bootstrap only on client
      const errorEl = document.getElementById('errorToast');
      const successEl = document.getElementById('successToast');

      if (errorEl && successEl) {
        setToasts({
          errorToast: new bootstrap.Toast(errorEl),
          successToast: new bootstrap.Toast(successEl),
        });
      }
    }
  }, []);

  const showErrorToast = () => {
    toasts.errorToast?.show();
  };

  const showSuccessToast = () => {
    toasts.successToast?.show();
  };

  const handleRename = async (id, newName) => {
    try {
      const { data } = await aiferAxios.patch(`/api/emo/renameChat`, { chatId: id, newTitle: newName })

      if (data.success) {
        setSuccessMessage("Session renamed successfully")
        showSuccessToast()
        dispatch(renameSession({ sessionId: id, newName }))
      } else {
        setError("Error renaming session")
        showErrorToast()
      }
    } catch (error) {
      setError("Error renaming session")
      showErrorToast()
    }
  }

  useEffect(() => {
    setShowPopularQuestions(false)
  }, [currentMode])

  useEffect(() => {
    if (chatid) {
      dispatch(setSelectedSessionId(chatid))
      getSession(chatid)
    }
    if (chatid && messages.length === 0) {
      fetchMessages(chatid)
    }
  }, [chatid])

  useEffect(() => {
    if (userDetails && !userDetails.premium) {
      getChatCountToday()
    }
  }, [userDetails])

  useEffect(() => {
    if (userDetails.firebase_uid && chatHistory.length === 0) {
      getChatHistory()
    }
  }, [userDetails, page])

  useEffect(() => {
    getChatHistory()

  }, [page])

  const getTitleFromMessages = (messages) => {
    const text = messages.map(msg => msg.content).join(" ");
    const keywords = keyword_extractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    return keywords.slice(0, 3).join(' ');
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          history={chatHistory}
          toggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
          handleSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRename}
          showErrorToast={showErrorToast}
          page={page}
          setPage={setPage}
        />

        {/* Main Chat Window */}
        <div className="col-md-9 col-lg-9 col-xl-10 px-0">
          <div className={styles.chatWindow}>
            {/* Mobile Header */}
            <div className={styles.headers}>
              {/* Mobile Header */}
              <div
                className={`${styles.mobileHeader} d-md-none px-3 py-0 mb-0 d-flex justify-content-between mt-2`}>
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
              <ChatTabs
                currentMode={currentMode}
              />

            </div>

            {/* Messages Area */}
            <ChatMessages
              currentMode={currentMode}
              popularQuestions={popularQuestions}
              responseLoading={responseLoading}
              regenrateResponse={handleRegenerate}
              onselectQuestion={handleSelectQuestion}
              responseError={responseError}
              formattedPyqData={formattedPyqData}
              showPopularQuestions={showPopularQuestions}
            />

            {/* Input Area */}
            <ChatInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentMode={currentMode}
              sendMessage={handleSend}
              responseLoading={responseLoading}
              showPyq={showPopularQuestions}
            />

          </div>
        </div>
      </div>

      {/* Toast for success messages */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          style={{ background: "#5cc478", color: "white" }}
          className="toast align-items-center border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          id="successToast"
        >
          <div className="d-flex">
            <div className="toast-body">
              {successMessage}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto fw-semibold"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
      {/* Toast for error messages */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          className="toast align-items-center text-bg-danger border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          id="errorToast"
        >
          <div className="d-flex">
            <div className="toast-body">
              {error}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chat;