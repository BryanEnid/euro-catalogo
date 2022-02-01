import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import App from "./App";
import Generator from "./Generator";

export default function Routes() {
  const store = React.useState({ saleType: "mayor" });

  return (
    <Router>
      <Switch>
        <Route exact path="/" element={<App store={store} />} />
        <Route exact path="/Generator" element={<Generator store={store} />} />
      </Switch>
    </Router>
  );
}
