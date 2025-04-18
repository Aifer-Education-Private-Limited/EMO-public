import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    selectedSessionId: null,
    selectedSession: null,
    currentMode: 'search',
    chatCountToday: 0,
    chatHistory: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setSelectedSessionId: (state, action) => {
            state.selectedSessionId = action.payload;
        },
        setSelectedSession: (state, action) => {
            state.selectedSession = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        updateLastAssistantMessage: (state, action) => {
            const lastIndex = state.messages.length - 1;
            if (lastIndex >= 0 && state.messages[lastIndex].role === "assistant-remote") {
                state.messages[lastIndex].content = action.payload;
            }
        },
        setCurrentMode: (state, action) => {
            state.currentMode = action.payload;
        },
        setChatCountToday: (state, action) => {
            state.chatCountToday = action.payload;
        },
        incrementChatCountToday: (state) => {
            state.chatCountToday += 1;
        },
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
        },
        addChatHistory: (state, action) => {
            state.chatHistory.unshift(action.payload);
        },
        renameSession: (state, action) => {
            const { sessionId, newName } = action.payload;
            const sessionIndex = state.chatHistory.findIndex(session => session._id === sessionId);
            state.chatHistory[sessionIndex].title = newName;
        },
        moveSessionToTop: (state) => {
            const sessionId = state.selectedSessionId;

            if (state.chatHistory.length > 0 && state.chatHistory[0]._id === sessionId) {
                return;
            }

            const index = state.chatHistory.findIndex(session => {
                session._id === sessionId
            });

            // if (index !== -1) {
            const [session] = state.chatHistory.splice(index, 1);
            state.chatHistory.unshift(session);
            // }
        },
        removeSession: (state, action) => {
            const sessionId = action.payload;
            state.chatHistory = state.chatHistory.filter(session => session._id !== sessionId);
        },
    },
})

export const {
    addMessage,
    setSelectedSessionId,
    clearMessages,
    updateLastAssistantMessage,
    setSelectedSession,
    setCurrentMode,
    setChatCountToday,
    incrementChatCountToday,
    setChatHistory,
    addChatHistory,
    renameSession,
    moveSessionToTop,
    removeSession,
} = chatSlice.actions;
export default chatSlice.reducer;