import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import CharactersView from './CharactersView'
import StatsView from './StatsView'

function App() {
  return (
    <div className="App container-md">
      <div className='card' style={{minHeight: '400px'}}>
        <Switch>
          <Route path='/' component={StatsView} />
          <Route path='/characters' component={CharactersView} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
