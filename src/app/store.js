import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { userReducer } from '../features/user/userSlice';
import { campsitesReducer } from '../features/campsites/campsitesSlice';
import { commentsReducer } from '../features/comments/commentsSlice';
import { partnersReducer } from '../features/partners/partnersSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        campsites: campsitesReducer,
        comments: commentsReducer,
        partners: partnersReducer
    }
});
