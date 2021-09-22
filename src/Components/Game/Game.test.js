import React from 'react';
import { HashRouter } from "react-router-dom";
import { render } from '@testing-library/react';
import '@testing-library/react/dont-cleanup-after-each';
import Game from './Game.js';

describe('<Home/>', () => {
  it('renders without crashing', () => {
    render(<HashRouter>
      <Game />
    </HashRouter>);
  });

});