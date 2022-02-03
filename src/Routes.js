import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import App from "./App";
import Generator from "./Generator";

export default function Routes() {
  const [store, setStore] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:9000/load");
      const data = await response.json();
      setStore(data);
    })();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" element={<App store={store} />} />
        <Route exact path="/Generator" element={<Generator />} />
      </Switch>
    </Router>
  );
}
