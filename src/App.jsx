import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CheckPage from './pages/CheckPage';
import BusinessPage from './pages/BusinessPage';
import BlogPage from './pages/BlogPage';
import AICheck from './pages/AICheck';
import IntroductionPage from './pages/IntroductionPage';
import PhishingLessonPage from './pages/PhishingLessonPage';
import SecurityLessonPage from './pages/SecurityLessonPage';
import SpamLessonPage from './pages/SpamLessonPage';
import './styles/App.css';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Layout className="app-layout">
          <Header />
          <Content>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/check" element={<CheckPage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/AIcheck" element={<AICheck />} />
              <Route path="/Introduction" element={<IntroductionPage />} />
              <Route path="/lesson/phishing" element={<PhishingLessonPage />} />
              <Route path="/lesson/security" element={<SecurityLessonPage />} />
              <Route path="/lesson/spam" element={<SpamLessonPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
