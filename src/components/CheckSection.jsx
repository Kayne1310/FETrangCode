import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, 
  Alert, Spin, Result, Progress, Tag, Space, Divider, Modal 
} from 'antd';
import { 
  SearchOutlined,
  MailOutlined,
  FileTextOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { predictEmailCategory } from '../services/mlService';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const CheckSection = () => {
  const [emailData, setEmailData] = useState({
    title: '',
    content: '',
    sender: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheck = async () => {
    if (!emailData.title.trim() || !emailData.content.trim() || !emailData.sender.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await predictEmailCategory(emailData);
      setResult(response);
      setModalVisible(true);
    } catch (error) {
      console.error('Error checking:', error);
      setResult({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi kiểm tra. Vui lòng thử lại.'
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'An toàn': return '#52c41a';
      case 'Nghi ngờ': return '#faad14';
      case 'Spam': return '#fa8c16';
      case 'Giả mạo': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'An toàn': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Nghi ngờ': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'Spam': return <WarningOutlined style={{ color: '#fa8c16' }} />;
      case 'Giả mạo': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return <ExclamationCircleOutlined />;
    }
  };

  const getCategoryDescription = (category) => {
    switch (category) {
      case 'An toàn': return 'Email này được đánh giá là an toàn và đáng tin cậy.';
      case 'Nghi ngờ': return 'Email này có một số dấu hiệu đáng ngờ, cần thận trọng.';
      case 'Spam': return 'Email này có đặc điểm của thư rác, không nên mở.';
      case 'Giả mạo': return 'Email này có dấu hiệu giả mạo, có thể là phishing.';
      default: return 'Không thể xác định loại email.';
    }
  };

  const renderModalContent = () => {
    if (!result) return null;

    if (!result.success) {
      return (
        <Alert
          message="Lỗi phân tích"
          description={result.message}
          type="error"
          showIcon
        />
      );
    }

    const confidencePercent = Math.round(result.confidence * 100);
    const sortedProbabilities = Object.entries(result.probabilities)
      .sort(([,a], [,b]) => b - a);

    return (
      <div className="prediction-result">
        <Result
          icon={getCategoryIcon(result.category)}
          title={result.category}
          subTitle={getCategoryDescription(result.category)}
          extra={[
            <Space key="details" direction="vertical" style={{ width: '100%' }}>
              <div className="confidence-score">
                <Title level={5}>Độ tin cậy</Title>
                <Progress
                  percent={confidencePercent}
                  strokeColor={getCategoryColor(result.category)}
                  size="small"
                />
                <span className="score-text">{confidencePercent}%</span>
              </div>
              
              <Divider />
              
              <div className="all-probabilities">
                <Title level={5}>Xác suất các loại</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {sortedProbabilities.map(([category, probability]) => (
                    <div key={category} className="probability-item">
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <span>{category}</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {Math.round(probability * 100)}%
                        </span>
                      </Space>
                      <Progress
                        percent={Math.round(probability * 100)}
                        strokeColor={getCategoryColor(category)}
                        size="small"
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </div>
              
              <Divider />
              
                             <div className="analysis-info">
                 <Space direction="vertical" size="small">
                   <div>
                     <strong>Phương pháp:</strong> Mô hình học máy phân loại dựa trên dữ liệu
                   </div>
                   <div>
                     <strong>Thời gian xử lý:</strong> {result.processing_time}ms
                   </div>
                   <div>
                     <strong>Độ dài văn bản:</strong> {result.text_length} ký tự
                   </div>
                 </Space>
               </div>
            </Space>
          ]}
        />
      </div>
    );
  };

  const isFormValid = emailData.title.trim() && emailData.content.trim() && emailData.sender.trim();

  return (
    <div className="check-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="section-title">
            Kiểm tra Độ An toàn Email
          </Title>
          <Paragraph className="section-description">
            Sử dụng AI để phân tích và đánh giá mức độ rủi ro của email dựa trên tiêu đề, nội dung và người gửi
          </Paragraph>
        </div>

        <Row justify="center">
          <Col xs={24} lg={16} xl={12}>
            <Card className="check-card" bordered={false}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="email-form">
                  <Title level={4}>
                    <MailOutlined /> Thông tin Email
                  </Title>
                  
                  <div className="form-field">
                    <Title level={5}>Tiêu đề Email</Title>
                    <Input
                      value={emailData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tiêu đề email..."
                      size="large"
                    />
                  </div>

                  <div className="form-field">
                    <Title level={5}>Người gửi</Title>
                    <Input
                      value={emailData.sender}
                      onChange={(e) => handleInputChange('sender', e.target.value)}
                      placeholder="Nhập địa chỉ email người gửi..."
                      size="large"
                    />
                  </div>

                  <div className="form-field">
                    <Title level={5}>Nội dung Email</Title>
                    <TextArea
                      value={emailData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Nhập nội dung email cần phân tích..."
                      rows={6}
                      size="large"
                    />
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleCheck}
                  loading={loading}
                  disabled={!isFormValid}
                  block
                >
                  {loading ? 'Đang phân tích...' : 'Kiểm tra Email'}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {loading && (
          <Row justify="center" style={{ marginTop: 24 }}>
            <Spin size="large">
              <div className="loading-content">
                <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <p>Đang phân tích email với AI...</p>
              </div>
            </Spin>
          </Row>
        )}

        <Modal
          title="Kết quả phân tích Email"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Đóng
            </Button>
          ]}
          width={600}
          centered
        >
          {renderModalContent()}
        </Modal>
      </div>
    </div>
  );
};

export default CheckSection; 