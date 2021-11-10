import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from 'react-dom';
import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./store";

const App = () : JSX.Element => {
  return (
    <Provider store={store}>
      This is a react-app.
    </Provider>
  );
};

// We're using `StrictMode` here to make React show more complete warnings and recommendations.
// See: https://reactjs.org/docs/strict-mode.html
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

