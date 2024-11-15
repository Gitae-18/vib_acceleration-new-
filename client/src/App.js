/* eslint-disable */
import React,{useState, useCallback, useEffect} from 'react';
import './App.css';
import Login from './Login';
import Router from './Router';
function App() {
  const [loginModal, setLoginModal] = useState(false);
  return (
    <div className="App">
      <Router/>    
    </div>
  );
}

export default App;
