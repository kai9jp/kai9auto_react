import { createStore, applyMiddleware, Store  } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers/root.reducer";
import { composeWithDevTools } from 'redux-devtools-extension';


const store: Store = createStore(rootReducers, composeWithDevTools(applyMiddleware(
    thunkMiddleware
)));

store.subscribe(() => {});
export default store;