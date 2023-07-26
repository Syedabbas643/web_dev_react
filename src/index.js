import React,{ useState }from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Signup from './Signup';
import Login from './login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/web_dev_react/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        {isLoggedIn ? (
          <Route path="/web_dev_react/app" element={<App />} />
        ) : (
          <Route path="/web_dev_react/" element={<Login />} />
        )}
        <Route path="/web_dev_react/signup" element={<Signup setIsLoggedIn={setIsLoggedIn}/>} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);


