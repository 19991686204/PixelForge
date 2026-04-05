import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomClaudeCode from './components/CustomClaudeCode';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logo from './components/logo';




function App() {
  return (
    <BrowserRouter>
    <CustomClaudeCode />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path='/Logo' element={<Logo/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
