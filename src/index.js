import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './login';
import Calendar from './components/Calender';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const MainApp = () => {

  return (
    <Router>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/" element={<Login />} />
        <Route path="/calender" element={<Calendar/>} />
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


