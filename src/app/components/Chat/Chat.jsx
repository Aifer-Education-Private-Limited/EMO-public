import React, { use, useEffect, useRef, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import styles from './Chat.module.css';
import ChatSidebar from './ChatSidebar';
import ChatTabs from './ChatTabs';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import Link from 'next/link';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import axios from 'axios';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false)
  const [responseError, setResponseError] = useState("")
  const selectedSearchResponseId = useRef(0);
  const [sessionHistory, setSessionHistory] = useState([
    {
      id: 1,
      title: 'New chat',
      mode: 'search'
    }
  ])
  const [popularQuestions, setPopularQuestions] = useState([])
  const [messages, setMessages] = useState([]);

  const resultRef = useRef("")
  let codeBlockStarted;
  let codeBlockTracker;
  let newLineTracker;


  const handleSend = (e) => {
    e.preventDefault()
    onSubmitNewMessage()
  };

  const onSubmitNewMessage = async () => {
    if (searchQuery === "") return
    setResponseLoading(true)

    if (currentMode === "search") {
      setSearchQuery("");

      await fetchData(
        searchQuery,
        "myId", // repalce with actual session id
        currentMode,
        messages
      )
    } else if (selectedSessionId === null && currentMode === "pyq") {
      setSearchQuery("");
      fetchPyqData(searchQuery)
    } else {
      console.log("else");
    }
  }

  async function fetchData(userQuery, id, mode, prevChat) {
    setResponseLoading(true)
    const question = { content: userQuery, role: "user" };
    const updatedChatList = [...(prevChat ?? chatList), question];

    setMessages(updatedChatList);

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

          setMessages([...updatedChatList, respondedChatItem]);
          // console.log(respondedChatItem);

        } else {
          resultRef.current = "";
          controller.abort();
        }
      },
      onclose() {
        resultRef.current = "";
        console.log("Connection closed by the server");
        controller.abort();
      },
      onerror(err) {
        console.log("There was an error from the server", err);
      },
    });

    setResponseLoading(false)
  }


  const fetchPyqData = async (query) => {
    setResponseError("")
    const question = { content: query, role: "user" };
    setMessages([question])
    try {
      const { data } = await axios.post("https://vector.mymeet.link/api/v1/vector/aifer/searc", { query })

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
    const newChat = {
      id: sessionHistory.length + 1,
      title: "New chat",
      mode: currentMode
    }
    setMessages([])
    setSessionHistory((prev) => [...prev, newChat])
  }

  const handleRegenerate = async () => {
    if (messages.length < 2) return; // Ensure there's a previous user query
    const prevChat = messages.slice(0, -1); // Remove last AI response
    const lastUserQuery = prevChat.pop();

    if (lastUserQuery.role !== "user") return; // Ensure last message was from user

    setResponseLoading(true);
    await fetchData(lastUserQuery.content, selectedSearchResponseId?.current ?? 0, currentMode, prevChat);
    setResponseLoading(false);
  };


  const handleSelectQuestion = (question) => {
    const selectedQuestion = { content: question, role: "assistant-remote" };
    setMessages((prev) => [...prev, selectedQuestion]);
    setPopularQuestions([])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setMessages([])
  }, [currentMode])

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          history={sessionHistory}
          toggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
        />

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
              <ChatTabs
                currentMode={currentMode}
                setCurrentMode={setCurrentMode}
              />

            </div>

            {/* Messages Area */}
            <ChatMessages
              currentMode={currentMode}
              popularQuestions={popularQuestions}
              messages={messages}
              responseLoading={responseLoading}
              regenrateResponse={handleRegenerate}
              onselectQuestion={handleSelectQuestion}
              responseError={responseError}
              formattedPyqData={formattedPyqData}
            />

            {/* Input Area */}
            <ChatInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentMode={currentMode}
              sendMessage={handleSend}
              responseLoading={responseLoading}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;