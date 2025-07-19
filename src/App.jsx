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
