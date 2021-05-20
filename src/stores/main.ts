import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import mainReducer from "../reducers/main";

const mainStore = createStore(mainReducer, applyMiddleware(thunk));

export default mainStore;
