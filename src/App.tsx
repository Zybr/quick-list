import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import 'fontsource-roboto';
import { Container } from '@material-ui/core';
import Main from "./layouts/Main/Main";
import mainStore from "./stores/main";

function App() {
  return (
    <div className="App {classes.root}" data-testid='App'>
      <Container>
        <Provider store={mainStore}>
          <Main/>
        </Provider>
      </Container>
    </div>
  );
}

export default App;
