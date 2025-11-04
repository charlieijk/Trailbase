import { Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CampsiteDetailPage from './pages/CampsiteDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    return (
        <div className='App'>
            <Header />
            <Routes>
                <Route path='/' element={<div>Home Page</div>} />
                <Route path='/directory' element={<div>Directory Page</div>} />
                <Route path='/directory/:campsiteId' element={<CampsiteDetailPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/contact' element={<ContactPage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
