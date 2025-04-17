import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'
import chatReducer from './features/chat'

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    }
})