import { createStore } from 'redux';
import rootReducer from './resources/rootReducer';
import middleware from './middleware';

export default createStore(rootReducer, middleware);
