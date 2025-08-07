// Redux store configuration with RTK Query
import { configureStore } from '@reduxjs/toolkit';
import { api } from './store/apiSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
});

export default store;