import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import App from './components/app/App';

const isAuthenticated = () => {
  return localStorage.getItem('jwt')
}
const PrivateRoute = ({component, ...rest}: any) => {
  const routeComponent = (props: any) => (
      isAuthenticated()
          ? React.createElement(component, props)
          : <Redirect to={{pathname: '/login'}}/>
  );
  return <Route {...rest} render={routeComponent}/>;
};

ReactDOM.render(
  <React.StrictMode>
    <HashRouter hashType='slash'>
      <Header />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
