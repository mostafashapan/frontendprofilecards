import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Navbar from './components/Navbar';
import './App.css';
import Footer from './components/Footer';


import AddTeamMember from './pages/AddTeamMember';
import TeamSectioncard from './components/TeamSectioncard';
import UpdateTeamMember from './pages/UpdateTeamMember';

const App = () => (
  <>
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Corrected routes */}
            <Route path="/" element={<TeamSectioncard/>} />
            <Route path="/TeamSection" element={<TeamSectioncard/>} /> 
            <Route path="/AddTeamMember" element={< AddTeamMember/>} />
            {/* Updated route for product update with the correct route */}
            <Route path="/UpdateTeamMember/:id" element={<UpdateTeamMember/>} /> 
          </Routes>
        </div>
      </div>
    </Router>
    <Footer />
  </>
);

export default App;
