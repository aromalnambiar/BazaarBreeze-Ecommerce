import React from "react";
import ReactDOM from "react-dom/client";
// import App2 from "./App.jsx";
import App from "./App2.jsx";
import "./index.css";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store/configureStore";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
    {/* <App2 /> */}
  </Provider>

  // </React.StrictMode>,
);
