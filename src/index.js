import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";

import Quiz from './FinalMathQuiz'
import store from "./store";

import './app.css'

const App = () => (

  <Provider store={store}>
    <div id="app">
      <Quiz />
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
