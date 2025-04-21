import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import FormFillPage from './FormFillPage';
import DirectFormAccess from './DirectFormAccess';
import FormPageCopy from './FormPageCopy';
import KidsFormPage from './KidsFormPage';
import DirectKidsFormAccess from './DirectKidsFormAccess';
import CWIKidsForm from './CWIKidsForm';
import DirectCWIKidsFormAccess from './DirectCWIKidsFormAccess';

const AppRoutes = ({ isAuthenticated, userInfo, handleLogout, handleLogin }) => {
  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/form/kids" /> : 
              <App onLogin={handleLogin} />
          }
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/form/kids" /> : 
              <Navigate to="/" />
          } 
        />
        <Route 
          path="/form/register" 
          element={
            isAuthenticated ? 
              <FormFillPage userInfo={userInfo} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        <Route 
          path="/direct/form" 
          element={<DirectFormAccess />} 
        />
        <Route 
          path="/direct/kids" 
          element={<DirectKidsFormAccess />} 
        />
        <Route 
          path="/form/copy" 
          element={
            isAuthenticated ? 
              <FormPageCopy userInfo={userInfo} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        <Route 
          path="/form/kids" 
          element={<KidsFormPage userInfo={userInfo} onLogout={handleLogout} />} 
        />
        <Route 
          path="/form/cwikids" 
          element={<CWIKidsForm userInfo={userInfo} onLogout={handleLogout} />} 
        />
        <Route 
          path="/direct/cwikids" 
          element={<DirectCWIKidsFormAccess />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
        
        {/* Direct access shortcut routes */}
        <Route path="/kids" element={<KidsFormPage userInfo={userInfo} onLogout={handleLogout} />} />
        <Route path="/cwikids" element={<CWIKidsForm userInfo={userInfo} onLogout={handleLogout} />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes; 