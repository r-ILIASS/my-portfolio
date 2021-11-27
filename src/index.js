import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./global.scss";

const element = document.getElementById("root");
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  element
);
