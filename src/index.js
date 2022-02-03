import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import { ThemeProvider, createTheme } from "@mui/system";

const theme = createTheme({});

ReactDOM.render(
  <React.StrictMode theme={theme}>
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
