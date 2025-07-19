import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Select, 
  Alert, Spin, Result, Progress, Tag, Space, Divider 
} from 'antd';
import { 
  SearchOutlined,
  MailOutlined,
  LinkOutlined,
  PhoneOutlined,
  FileTextOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { checkEmailSafety } from '../services/emailService';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CheckSection = () => {
  const [checkType, setCheckType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkTypes = [
    { value: 'email', label: 'Email Address', icon: <MailOutlined /> },
    { value: 'link', label: 'Website Link', icon: <LinkOutlined /> },
    { value: 'phone', label: 'Số điện thoại', icon: <PhoneOutlined /> },
    { value: 'content', label: 'Nội dung Email', icon: <FileTextOutlined /> }
  ];

  const handleCheck = async () => {
    if (!inputValue.trim()) return;
    
    setLoading(true);
    try {
      const response = await checkEmailSafety({
        type: checkType,
        value: inputValue
      });
      setResult(response);
    } catch (error) {
      console.error('Error checking:', error);
      setResult({
        status: 'error',
        message: 'Có lỗi xảy ra khi kiểm tra. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#52c41a';
      case 'suspicious': return '#faad14';
      case 'spam': return '#fa8c16';
      case 'phishing': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'suspicious': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'spam': return <CloseCircleOutlined style={{ color: '#fa8c16' }} />;
      case 'phishing': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return <ExclamationCircleOutlined />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'safe': return 'An toàn';
      case 'suspicious': return 'Nghi ngờ';
      case 'spam': return 'Thư rác (Spam)';
      case 'phishing': return 'Lừa đảo (Phishing)';
      default: return 'Không xác định';
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === 'error') {
      return (
        <Alert
          message="Lỗi kiểm tra"
          description={result.message}
          type="error"
          showIcon
          className="check-result"
        />
      );
    }

    return (
      <Card className="result-card" bordered={false}>
        <Result
          icon={getStatusIcon(result.classification)}
          title={getStatusText(result.classification)}
          subTitle={result.description}
          extra={[
            <Space key="details" direction="vertical" style={{ width: '100%' }}>
              <div className="risk-score">
                <Title level={5}>Điểm rủi ro</Title>
                <Progress
                  percent={result.riskScore}
                  strokeColor={getStatusColor(result.classification)}
                  size="small"
                />
                <span className="score-text">{result.riskScore}/100</span>
              </div>
              
              <Divider />
              
              <div className="threat-indicators">
                <Title level={5}>Các chỉ số nguy hiểm</Title>
                <Space wrap>
                  {result.threats?.map((threat, index) => (
                    <Tag 
                      key={index} 
                      color={threat.severity === 'high' ? 'red' : 'orange'}
                    >
                      {threat.name}
                    </Tag>
                  ))}
                </Space>
              </div>
              
              {result.recommendations && (
                <>
                  <Divider />
                  <div className="recommendations">
                    <Title level={5}>Khuyến nghị</Title>
                    <ul>
                      {result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </Space>
          ]}
        />
      </Card>
    );
  };

  const getPlaceholder = () => {
    switch (checkType) {
      case 'email': return 'Nhập địa chỉ email cần kiểm tra...';
      case 'link': return 'Nhập URL/link cần kiểm tra...';
      case 'phone': return 'Nhập số điện thoại cần kiểm tra...';
      case 'content': return 'Nhập nội dung email cần phân tích...';
      default: return 'Nhập thông tin cần kiểm tra...';
    }
  };

  return (
    <div className="check-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="section-title">
            Kiểm tra Độ An toàn
          </Title>
          <Paragraph className="section-description">
            Sử dụng AI để phân tích và đánh giá mức độ rủi ro của email, link, số điện thoại
          </Paragraph>
        </div>

        <Row justify="center">
          <Col xs={24} lg={16} xl={12}>
            <Card className="check-card" bordered={false}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="check-type-selector">
                  <Title level={4}>Chọn loại kiểm tra</Title>
                  <Select
                    value={checkType}
                    onChange={setCheckType}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    {checkTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        <Space>
                          {type.icon}
                          {type.label}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="input-section">
                  {checkType === 'content' ? (
                    <TextArea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholder()}
                      rows={6}
                      size="large"
                    />
                  ) : (
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholder()}
                      size="large"
                      onPressEnter={handleCheck}
                    />
                  )}
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleCheck}
                  loading={loading}
                  disabled={!inputValue.trim()}
                  block
                >
                  {loading ? 'Đang phân tích...' : 'Kiểm tra ngay'}
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
                <p>Đang phân tích với AI...</p>
              </div>
            </Spin>
          </Row>
        )}

        {result && !loading && (
          <Row justify="center" style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              {renderResult()}
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default CheckSection; 