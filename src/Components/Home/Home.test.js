import React from 'react';
import { HashRouter } from "react-router-dom";
import { render } from '@testing-library/react';
import Home from './Home.js';

describe('<Home/>', () => {
  it('renders without crashing', () => {
    render(<HashRouter>
      <Home />
    </HashRouter>);
  });
});