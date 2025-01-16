import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import "./index.css"
import store from "./redux/store";
import { Provider } from "react-redux";
import { Button, message } from 'antd';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

  <Provider
    store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#b85c38", 
            colorPrimaryHover: "#b85c38",
            borderRadius: "2px",
            boxShadow: "none"
          },
          token: {
            borderRadius: "2px",
            colorPrimary: "#b85c38"
          }
        },
      }}
    >
        <ToastContainer 
          position='top-center'
        />
      <App />
    </ConfigProvider>
  </Provider>

);
