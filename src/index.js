import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/";
import { theme } from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Routes />
  </ThemeProvider>,
  document.getElementById("root")
);
