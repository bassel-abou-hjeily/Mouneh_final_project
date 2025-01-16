
import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null, // Initialize user state
    },
    reducers: {
        SetUser: (state, action) => {
            state.user = action.payload; // Update the user state
        },
    },
});

// Export the action to be used in components
export const { SetUser } = usersSlice.actions;

// Export the reducer to be added to the store
export default usersSlice.reducer;
