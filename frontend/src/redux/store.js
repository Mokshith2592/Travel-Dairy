import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReduser from './slice/userSlice'
import storage from 'redux-persist/lib/storage'
import {persistReducer ,persistStore} from 'redux-persist'

const rootReducer = combineReducers({
    user: userReduser 
})

const persistConfig = {
    key: "root",
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig ,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})


export const persistor = persistStore(store)

//  default persistor