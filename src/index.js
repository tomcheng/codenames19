import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const isProduction = process.env.NODE_ENV === "production";

const socket = isProduction ? io() : io("http://localhost:5000");

const onTest = () => {
  console.log("ON TEST");
  socket.emit("chat message", "HELLOOOOOO!");
};

socket.on("chat message", function (msg) {
  console.log("msg", msg);
});

ReactDOM.render(
  <React.StrictMode>
    <App onTest={onTest} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
