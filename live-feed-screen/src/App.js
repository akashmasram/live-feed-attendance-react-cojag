import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Dashboard/Login';
import Signup from './Dashboard/Signup';
import Dashboard from './Dashboard/dashboard';
import AddUser from './Dashboard/addUser';
import MacAddressInput from './Dashboard/addMacAddress';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-macadd" element={<MacAddressInput />} />
        

        
      </Routes>
    </Router>
  );
}

export default App;