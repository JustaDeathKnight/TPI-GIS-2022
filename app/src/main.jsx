import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ReloadPrompt from "./ReloadPrompt";
import "./index.css";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { interactionReducer } from "./reducers/interactionReducer";

const reducers = combineReducers({
  interaction: interactionReducer,
});

const store = createStore(reducers);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ReloadPrompt />
    <App />
  </Provider>
);
