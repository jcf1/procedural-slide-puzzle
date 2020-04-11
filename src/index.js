import React from 'react';
import { render } from 'react-dom';
import Game from './components/Game.jsx';

const root = document.getElementById('root');

render(
  <div>
    <div>
      <header>
        <h1>Procedural Slide Puzzles</h1>
      </header>
    </div>
    <Game/>
  </div>
, root);
