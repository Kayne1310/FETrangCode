import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tag, Space, Spin, Collapse } from 'antd';
import { 
  BookOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SecurityScanOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  BulbOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getEducationContent } from '../services/emailService';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const EducationSection = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEducationContent = async () => {
      try {
        const data = await getEducationContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching education content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationContent();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'phishing': return '#f5222d';
      case 'spam': return '#fa8c16';
      case 'security': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phishing': return <ExclamationCircleOutlined />;
      case 'spam': return <SafetyOutlined />;
      case 'security': return <SecurityScanOutlined />;
      default: return <BookOutlined />;
    }
  };

  const tips = [
    {
      title: "Kiểm tra địa chỉ người gửi",
      description: "Luôn xác minh địa chỉ email của người gửi. Các email lừa đảo thường sử dụng địa chỉ giả mạo hoặc có lỗi chính tả.",
      icon: <EyeOutlined />
    },
    {
      title: "Cẩn thận với liên kết",
      description: "Không nhấp vào liên kết đáng ngờ. Di chuột qua liên kết để xem URL thực tế trước khi nhấp.",
      icon: <ExclamationCircleOutlined />
    },
    {
      title: "Bảo mật thông tin",
      description: "Không bao giờ chia sẻ thông tin cá nhân, mật khẩu hay thông tin tài khoản qua email.",
      icon: <SecurityScanOutlined />
    },
    {
      title: "Xác minh nguồn gốc",
      description: "Liên hệ trực tiếp với tổ chức/công ty để xác minh tính xác thực của email quan trọng.",
      icon: <CheckCircleOutlined />
    }
  ];

  const warningSigns = [
    "Yêu cầu cấp bách và đe dọa",
    "Lỗi chính tả và ngữ pháp",
    "Địa chỉ email đáng ngờ",
    "Yêu cầu thông tin cá nhân",
    "Liên kết rút gọn hoặc lạ",
    "Ưu đãi quá tốt để tin được",
    "Đính kèm file không mong muốn",
    "Thiếu thông tin liên hệ rõ ràng"
  ];

  if (loading) {
    return (
      <div className="education-section">
        <div className="container">
          <Row justify="center" style={{ padding: '60px 0' }}>
            <Spin size="large" />
          </Row>
        </div>
      </div>
    );
  }

  return (
    <div className="education-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="section-title">
            Giáo dục An toàn
          </Title>
          <Paragraph className="section-description">
            Học hỏi và nâng cao kiến thức về bảo mật email để tự bảo vệ mình
          </Paragraph>
        </div>

        {/* Quick Tips */}
        <div className="quick-tips">
          <Title level={3} className="subsection-title">
            <BulbOutlined /> Mẹo Bảo mật Nhanh
          </Title>
          
          <Row gutter={[24, 24]}>
            {tips.map((tip, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="tip-card" bordered={false} hoverable>
                  <div className="tip-icon">{tip.icon}</div>
                  <Title level={5} className="tip-title">{tip.title}</Title>
                  <Paragraph className="tip-description">{tip.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Warning Signs */}
        <div className="warning-signs">
          <Title level={3} className="subsection-title">
            <ExclamationCircleOutlined /> Dấu hiệu Cảnh báo
          </Title>
          
          <Card className="warning-card" bordered={false}>
            <Paragraph className="warning-intro">
              Nhận biết các dấu hiệu sau để tránh bẫy lừa đảo:
            </Paragraph>
            <Row gutter={[16, 16]}>
              {warningSigns.map((sign, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <div className="warning-item">
                    <ExclamationCircleOutlined className="warning-icon" />
                    <span>{sign}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </div>

        {/* Education Articles */}
        <div className="education-articles">
          <Title level={3} className="subsection-title">
            <BookOutlined /> Bài học Chi tiết
          </Title>
          
          <Row gutter={[24, 24]}>
            {content.map((article) => (
              <Col xs={24} lg={8} key={article.id}>
                <Card 
                  className="article-card" 
                  bordered={false} 
                  hoverable
                  actions={[
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />}
                      onClick={() => {
                        const lessonRoutes = {
                          1: '/lesson/phishing',
                          2: '/lesson/security', 
                          3: '/lesson/spam'
                        };
                        navigate(lessonRoutes[article.id]);
                      }}
                    >
                      Đọc thêm
                    </Button>
                  ]}
                >
                  <div className="article-header">
                    <div 
                      className="article-icon"
                      style={{ color: getCategoryColor(article.category) }}
                    >
                      {getCategoryIcon(article.category)}
                    </div>
                    <Tag 
                      color={getCategoryColor(article.category)}
                      className="article-category"
                    >
                      {article.category.toUpperCase()}
                    </Tag>
                  </div>
                  
                  <Title level={4} className="article-title">
                    {article.title}
                  </Title>
                  
                  <Paragraph className="article-description">
                    {article.description}
                  </Paragraph>
                  
                  <div className="article-meta">
                    <Space>
                      <ClockCircleOutlined />
                      <span>{article.readTime} phút đọc</span>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <Title level={3} className="subsection-title">
            Câu hỏi Thường gặp
          </Title>
          
          <Collapse ghost>
            <Panel 
              header="Làm thế nào để nhận biết email phishing?"
              key="1"
              extra={<BookOutlined />}
            >
              <Paragraph>
                Email phishing thường có các đặc điểm: địa chỉ người gửi giả mạo, 
                yêu cầu cung cấp thông tin cá nhân, tạo cảm giác cấp bách, 
                chứa liên kết đáng ngờ và có lỗi chính tả.
              </Paragraph>
            </Panel>
            
            <Panel 
              header="Tôi nên làm gì nếu nhận được email đáng ngờ?"
              key="2"
              extra={<SecurityScanOutlined />}
            >
              <Paragraph>
                Không nhấp vào bất kỳ liên kết nào, không tải xuống file đính kèm, 
                không trả lời email. Hãy xóa email đó và báo cáo nếu cần thiết.
              </Paragraph>
            </Panel>
            
            <Panel 
              header="Hệ thống AI phát hiện lừa đảo như thế nào?"
              key="3"
              extra={<BulbOutlined />}
            >
              <Paragraph>
                Hệ thống sử dụng machine learning để phân tích nội dung, 
                metadata, pattern và so sánh với cơ sở dữ liệu các mối đe dọa 
                đã biết để đưa ra đánh giá chính xác.
              </Paragraph>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default EducationSection; 