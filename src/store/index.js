import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import Base from '../reducers/BaseReducer';

export const store = configureStore({
    reducer: {
        base: Base,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["persist/PERSIST"],
        },
    }),
});

export const persistor = persistStore(store);
