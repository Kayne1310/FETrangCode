import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Select, 
  Alert, Spin, Result, Progress, Tag, Space, Divider, 
  List, Avatar, Tabs, Statistic, Timeline
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
  CheckCircleOutlined,
  HistoryOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { checkEmailSafety } from '../services/emailService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const CheckPage = () => {
  const [checkType, setCheckType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([
    {
      id: 1,
      type: 'email',
      value: 'test@example.com',
      result: 'safe',
      timestamp: new Date().toISOString(),
      riskScore: 15
    },
    {
      id: 2,
      type: 'link',
      value: 'https://suspicious-site.com',
      result: 'suspicious',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      riskScore: 75
    }
  ]);

  const checkTypes = [
    { value: 'email', label: 'Địa chỉ Email', icon: <MailOutlined /> },
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
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        type: checkType,
        value: inputValue,
        result: response.classification,
        timestamp: new Date().toISOString(),
        riskScore: response.riskScore
      };
      setHistory([newHistoryItem, ...history]);
      
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

  const getPlaceholder = () => {
    switch (checkType) {
      case 'email': return 'Nhập địa chỉ email cần kiểm tra...';
      case 'link': return 'Nhập URL/link cần kiểm tra...';
      case 'phone': return 'Nhập số điện thoại cần kiểm tra...';
      case 'content': return 'Nhập nội dung email cần phân tích...';
      default: return 'Nhập thông tin cần kiểm tra...';
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const renderQuickActions = () => (
    <Card className="quick-actions-card" title="Kiểm tra nhanh" bordered={false}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          block 
          onClick={() => { setCheckType('email'); setInputValue('scam@example.com'); }}
        >
          Test Email Phishing
        </Button>
        <Button 
          block 
          onClick={() => { setCheckType('email'); setInputValue('safe@gmail.com'); }}
        >
          Test Email An toàn
        </Button>
        <Button 
          block 
          onClick={() => { setCheckType('link'); setInputValue('https://bit.ly/suspicious'); }}
        >
          Test Link Đáng ngờ
        </Button>
        <Button 
          block 
          onClick={() => { setCheckType('content'); setInputValue('URGENT! Click now to win $1000!'); }}
        >
          Test Nội dung Spam
        </Button>
      </Space>
    </Card>
  );

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
              <Card size="small" title="Chi tiết Phân tích">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Điểm Rủi ro"
                      value={result.riskScore}
                      suffix="/ 100"
                      valueStyle={{ color: getStatusColor(result.classification) }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Độ Tin cậy"
                      value={100 - result.riskScore}
                      suffix="/ 100"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={result.riskScore}
                    strokeColor={getStatusColor(result.classification)}
                    size="small"
                  />
                </div>
              </Card>
              
              {result.threats && result.threats.length > 0 && (
                <Card size="small" title="Mối Đe dọa Phát hiện">
                  <Space wrap>
                    {result.threats.map((threat, index) => (
                      <Tag 
                        key={index} 
                        color={threat.severity === 'high' ? 'red' : threat.severity === 'medium' ? 'orange' : 'yellow'}
                      >
                        {threat.name}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              )}
              
              {result.recommendations && (
                <Card size="small" title="Khuyến nghị Bảo mật">
                  <List
                    size="small"
                    dataSource={result.recommendations}
                    renderItem={(item, index) => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Card>
              )}
            </Space>
          ]}
        />
      </Card>
    );
  };

  const renderHistory = () => (
    <Card 
      className="history-card" 
      title={
        <Space>
          <HistoryOutlined />
          <span>Lịch sử Kiểm tra</span>
        </Space>
      }
      bordered={false}
      extra={
        <Button 
          type="link" 
          icon={<DeleteOutlined />} 
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Xóa tất cả
        </Button>
      }
    >
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <HistoryOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>Chưa có lịch sử kiểm tra</div>
        </div>
      ) : (
        <List
          dataSource={history}
          renderItem={item => (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<EyeOutlined />} 
                  onClick={() => {
                    setCheckType(item.type);
                    setInputValue(item.value);
                  }}
                >
                  Xem lại
                </Button>,
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDeleteHistoryItem(item.id)}
                >
                  Xóa
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: getStatusColor(item.result),
                      color: 'white'
                    }}
                    icon={getStatusIcon(item.result)}
                  />
                }
                title={
                  <Space>
                    <Text strong>{item.value}</Text>
                    <Tag color={getStatusColor(item.result)}>
                      {getStatusText(item.result)}
                    </Tag>
                  </Space>
                }
                description={
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      {new Date(item.timestamp).toLocaleString('vi-VN')}
                    </Text>
                    <Divider type="vertical" />
                    <Text>Điểm rủi ro: {item.riskScore}/100</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  return (
    <div className="page-container check-page">
      <div className="container">
        <div className="page-header">
          <Title level={1} className="page-title">
            <SafetyOutlined /> Kiểm tra Bảo mật
          </Title>
          <Paragraph className="page-description">
            Sử dụng AI để phân tích và đánh giá độ an toàn của email, link, số điện thoại với độ chính xác cao
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Check Interface */}
          <Col xs={24} lg={16}>
            <Card className="check-interface-card" bordered={false}>
              <Tabs defaultActiveKey="check" size="large">
                <TabPane tab={<span><SearchOutlined />Kiểm tra</span>} key="check">
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
                </TabPane>

                <TabPane tab={<span><HistoryOutlined />Lịch sử</span>} key="history">
                  {renderHistory()}
                </TabPane>
              </Tabs>
            </Card>

            {/* Results */}
            {loading && (
              <Card style={{ marginTop: 24, textAlign: 'center' }}>
                <Spin size="large">
                  <div className="loading-content">
                    <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <p>Đang phân tích với AI...</p>
                  </div>
                </Spin>
              </Card>
            )}

            {result && !loading && (
              <div style={{ marginTop: 24 }}>
                {renderResult()}
              </div>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {renderQuickActions()}

              <Card title="Thống kê Hôm nay" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Đã kiểm tra"
                      value={history.length}
                      prefix={<SearchOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Nguy hiểm"
                      value={history.filter(h => h.result === 'phishing' || h.result === 'spam').length}
                      prefix={<ExclamationCircleOutlined />}
                      valueStyle={{ color: '#f5222d' }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="Mẹo Bảo mật" bordered={false}>
                <Timeline size="small">
                  <Timeline.Item dot={<SafetyOutlined />}>
                    Luôn kiểm tra địa chỉ người gửi
                  </Timeline.Item>
                  <Timeline.Item dot={<EyeOutlined />}>
                    Cẩn thận với liên kết lạ
                  </Timeline.Item>
                  <Timeline.Item dot={<CheckCircleOutlined />}>
                    Không chia sẻ thông tin cá nhân
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckPage; 