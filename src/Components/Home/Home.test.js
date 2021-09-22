import React from 'react';
import { HashRouter } from "react-router-dom";
import { render } from '@testing-library/react';
import '@testing-library/react/dont-cleanup-after-each';
import Home from './Home.js';

describe('<Home/>', () => {
  it('renders without crashing', () => {
    render(<HashRouter>
      <Home />
    </HashRouter>);
  });
  it('lets start', () => {
    const { queryByTestId } = render(<HashRouter>
      <Home />
    </HashRouter>);
    expect(queryByTestId("startBtn")).toBeTruthy();
  });
  it('renders button correctly', () => {
    const { getByTestId } = render(<HashRouter>
      <Home label="Let's Start" />
    </HashRouter>)
    expect(getByTestId("letsStart")).toHaveTextContent("Let's Start")
  })
  it('renders without crashing in other way', () => {
    const div = document.createElement("link");
    render(<HashRouter>
      <Home />
    </HashRouter>, div);
  });
});