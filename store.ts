import { AsyncStorage } from "react-native";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";

import ReactotronConfig from "./reactotronConfig";
import rootReducer from "./reducers";
import config, { DEV } from "./config";

const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const middlewares = [applyMiddleware(thunk)];
if (config.state === DEV) {
  import("./reactotronConfig").then(() => console.log("Reactotron Configured"));
  middlewares.push(ReactotronConfig.createEnhancer());
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, compose(...middlewares));
const persistor = persistStore(store);
export { store, persistor };
