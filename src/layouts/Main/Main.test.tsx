import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Main from './Main';
import mainStore from "../../stores/main";

describe('<Main />', () => {
  test('it should mount', () => {
    render(
      <Provider store={mainStore}>
        <Main/>
      </Provider>
    );

    const main = screen.getByTestId('Main');

    expect(main).toBeInTheDocument();
  });
});
