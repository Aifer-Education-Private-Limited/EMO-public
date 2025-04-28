import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUser } from '../../api/getUserdata'
import { getSubscription } from '../../api/getUserCourses'

// Async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk('users/fetchByIdStatus', async () => {
    let subscription = 'free';
    const userdata = await getUser();
    if (userdata) {
        const result = await getSubscription(userdata.firebase_uid);
        if(result){
            subscription = result.status;
        } 
    }
    return { ...userdata, premium: subscription };
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