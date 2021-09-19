import React from "react";
import Home from "./Components/Home/Home";
import Game from "./Components/Game/Game";
import { HashRouter, Switch, Route } from "react-router-dom";

import './App.css';

function App() {
  return (
    <HashRouter>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/game" exact component={Game} />
      </Switch>

    </HashRouter>
  );
}

export default App;
