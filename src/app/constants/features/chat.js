import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const editMessage = createAsyncThunk(
    'chat/editMessage',
    async ({ position, newMessage }) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { position, newMessage };
    }
);

const initialState = {
    messages: [],
    selectedSessionId: null,
    selectedSession: null,
    currentMode: 'search',
    chatCountToday: 0,
    chatHistoryCount: 0,
    chatHistory: [],
    totalChatCount: null,
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
            state.totalChatCount = action.payload;
        },
        incrementChatCountToday: (state) => {
            const mode = state.currentMode;
            if (!state.totalChatCount[mode]) {
                state.totalChatCount[mode] = 0;
            }
            state.totalChatCount[mode] += 1;
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
        setTotalChatCount: (state, action) => {
            state.totalChatCount = action.payload;
        },
        setChatHistoryCount: (state, action) => {
            state.chatHistoryCount = action.payload;
        },
        // editMessage: (state, action) => {
        //     const { position, newMessage } = action.payload
        //     console.log(action.payload);

        //     state.messages[position].content = newMessage;
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(editMessage.fulfilled, (state, action) => {
            const { position, newMessage } = action.payload;
            if (state.messages[position]) {
                state.messages[position].content = newMessage;
            }
        });
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
    setTotalChatCount,
    setChatHistoryCount,
} = chatSlice.actions;
export default chatSlice.reducer;