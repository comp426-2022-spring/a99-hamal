import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UpdatePage from './pages/UpdatePage'
import ClickedCountry from './pages/ClickedCountry'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Layout from './components/Layout';

function App() {
  return (
    <div >
      <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element= {<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/country" element={<ClickedCountry />} />

        </Routes>
      </Layout>
  </BrowserRouter>
    </div>
    
  );
}

export default App;
