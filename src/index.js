import React,{ useState }from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Signup from './Signup';
import Login from './login';
import Calendar from './components/Calender';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDate] = useState(new Date());

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
        <Route path="/web_dev_react/calender" element={<Calendar currentDate={currentDate}/>} />
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


