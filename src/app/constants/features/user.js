import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUser } from '../../api/getUserdata'

// Fetch user data
const myUser = async () => {
    const userdata = await getUser();
    return userdata;
};

// Async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk('users/fetchByIdStatus', async () => {
    const response = await myUser();
    return response;
});

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState: { value: {}, show: false },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    },
});

export default userSlice.reducer;