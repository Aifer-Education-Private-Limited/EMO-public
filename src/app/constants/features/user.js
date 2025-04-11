import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUser } from '../../api/getUserdata'
import { getUserCourses } from '../../api/getUserCourses'

// Fetch user data
// const myUser = async () => {
//     const userdata = await getUser();
//     return userdata;
// };

// Async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk('users/fetchByIdStatus', async () => {
    const userdata = await getUser();
    const courses = await getUserCourses();

    const hasPremium = courses.some(
        (course) => course.course_id === "EMO Aifer" && course.is_active === 1
    );

    return { ...userdata, premium: hasPremium };
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