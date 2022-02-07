import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import { ThemeProvider, createTheme } from "@mui/system";

const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <Routes />
    {/* </ThemeProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
