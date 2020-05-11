import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from "react-router-dom";
import Game from './components/Game.jsx';

const root = document.getElementById('root');

render(
  <div>
    <HashRouter basename={process.env.PUBLIC_URL}>
      <div>
        <header>
          <h1>Procedural Slide Puzzles</h1>
        </header>
      </div>
      <Game/>
    </HashRouter>
  </div>
, root);
