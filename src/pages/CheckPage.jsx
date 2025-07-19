import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Select, 
  Alert, Spin, Result, Progress, Tag, Space, Divider, 
  List, Avatar, Tabs, Statistic, Timeline, Modal, Descriptions
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
  ClockCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  StopOutlined,
  RobotOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import checkService from '../services/checkService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const CheckPage = () => {
  const [checkType, setCheckType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalResult, setModalResult] = useState(null);
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
      console.log('🔍 Starting check:', { type: checkType, value: inputValue });
      const response = await checkService.performCheck(checkType, inputValue);
      console.log('📊 Check response:', response);
      
      if (response.success) {
        console.log('✅ Analysis data:', response.data);
        
        // Add to history
        const newHistoryItem = {
          id: Date.now(),
          type: checkType,
          value: inputValue,
          result: response.data.classification,
          timestamp: new Date().toISOString(),
          riskScore: response.data.riskScore,
          confidence: response.data.confidence,
          aiEnhanced: response.data.aiEnhanced
        };
        setHistory([newHistoryItem, ...history]);
        
        // Show result in modal
        console.log('🚀 Setting modal data:', response.data);
        setModalResult(response.data);
        setModalVisible(true);
        setResult(response.data);
      } else {
        console.error('❌ Check failed:', response.error);
        setResult({
          status: 'error',
          message: response.error || 'Có lỗi xảy ra khi kiểm tra. Vui lòng thử lại.'
        });
      }
    } catch (error) {
      console.error('💥 Error checking:', error);
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
        <Button 
          block 
          onClick={() => { setCheckType('content'); setInputValue('bấm vào đây để nhận 10 triệu'); }}
        >
          Test Nội dung Lừa đảo
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
                    {item.aiEnhanced && (
                      <Tag color="blue" size="small" icon={<RobotOutlined />}>
                        AI
                      </Tag>
                    )}
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
                    {item.confidence && (
                      <>
                        <Divider type="vertical" />
                        <Text>Độ tin cậy: {item.confidence}%</Text>
                      </>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  const renderResultModal = () => {
    if (!modalResult) return null;

    console.log('🎨 Hiển thị modal với dữ liệu:', modalResult);

    const getStatusColor = (classification) => {
      switch (classification) {
        case 'safe': return '#52c41a';
        case 'suspicious': return '#faad14';
        case 'spam': return '#fa8c16';
        case 'phishing': return '#f5222d';
        default: return '#d9d9d9';
      }
    };

    const getStatusIcon = (classification) => {
      switch (classification) {
        case 'safe': return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '32px' }} />;
        case 'suspicious': return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '32px' }} />;
        case 'spam': return <StopOutlined style={{ color: '#fa8c16', fontSize: '32px' }} />;
        case 'phishing': return <CloseCircleOutlined style={{ color: '#f5222d', fontSize: '32px' }} />;
        default: return <InfoCircleOutlined style={{ fontSize: '32px' }} />;
      }
    };

    const getStatusText = (classification) => {
      switch (classification) {
        case 'safe': return 'An Toàn';
        case 'suspicious': return 'Nghi Ngờ';
        case 'spam': return 'Thư Rác';
        case 'phishing': return 'Lừa Đảo';
        default: return 'Chưa Xác Định';
      }
    };

    const getRiskLevelText = (score) => {
      if (score >= 80) return 'Rất Cao';
      if (score >= 60) return 'Cao';
      if (score >= 40) return 'Trung Bình';
      if (score >= 20) return 'Thấp';
      return 'Rất Thấp';
    };

    const getConfidenceText = (confidence) => {
      if (confidence >= 80) return 'Rất Tin Cậy';
      if (confidence >= 60) return 'Tin Cậy';
      if (confidence >= 40) return 'Khá Tin Cậy';
      if (confidence >= 20) return 'Ít Tin Cậy';
      return 'Không Tin Cậy';
    };

    return (
      <Modal
        title={
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <Space direction="vertical" size="small">
              <Space size="middle">
                <SafetyOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Kết Quả Phân Tích Bảo Mật
                </span>
              </Space>
              {modalResult.aiEnhanced && (
                <Tag color="blue" icon={<RobotOutlined />} style={{ fontSize: '12px' }}>
                  Được Tăng Cường Bởi Gemini AI
                </Tag>
              )}
            </Space>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" size="large" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="check-again" 
            type="primary" 
            size="large"
            onClick={() => {
              setModalVisible(false);
              setInputValue('');
            }}
          >
            Kiểm Tra Mới
          </Button>
        ]}
        width={800}
        centered
      >
        <div style={{ padding: '20px 0' }}>
          {/* Kết Quả Chính */}
          <div style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)',
            borderRadius: '12px',
            padding: '30px 20px',
            marginBottom: '24px',
            border: `2px solid ${getStatusColor(modalResult.classification)}20`
          }}>
            <Space direction="vertical" size="large">
              {getStatusIcon(modalResult.classification)}
              <div>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: getStatusColor(modalResult.classification),
                  fontSize: '28px'
                }}>
                  {getStatusText(modalResult.classification)}
                </Title>
                <Text style={{ 
                  fontSize: '16px', 
                  color: '#666',
                  display: 'block',
                  marginTop: '8px'
                }}>
                  {modalResult.description || 'Quá trình phân tích đã hoàn tất thành công'}
                </Text>
              </div>
              {modalResult.aiEnhanced && (
                <div style={{
                  background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  <RobotOutlined style={{ marginRight: '6px' }} />
                  Phân Tích Bằng Trí Tuệ Nhân Tạo
                </div>
              )}
            </Space>
          </div>

          {/* Thông Tin Đầu Vào */}
          <Card 
            size="small" 
            title={<span><FileTextOutlined /> Thông Tin Kiểm Tra</span>}
            style={{ marginBottom: '16px' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item 
                label={<span style={{ fontWeight: 'bold' }}>Nội dung</span>}
              >
                <div style={{
                  background: '#f5f5f5',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  wordBreak: 'break-all',
                  border: '1px solid #d9d9d9'
                }}>
                  {inputValue}
                </div>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<span style={{ fontWeight: 'bold' }}>Loại kiểm tra</span>}
              >
                <Tag color="blue" style={{ fontSize: '12px' }}>
                  {checkType === 'email' ? 'Địa Chỉ Email' : 
                   checkType === 'link' ? 'Liên Kết Website' :
                   checkType === 'phone' ? 'Số Điện Thoại' : 'Nội Dung Email'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Chỉ Số Rủi Ro */}
          <Card 
            size="small" 
            title={<span><BarChartOutlined /> Đánh Giá Rủi Ro</span>}
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(modalResult.classification) }}>
                    {modalResult.riskScore || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    Điểm Rủi Ro (0-100)
                  </div>
                  <Progress
                    percent={modalResult.riskScore || 0}
                    strokeColor={getStatusColor(modalResult.classification)}
                    size="small"
                    format={() => ''}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    {getRiskLevelText(modalResult.riskScore || 0)}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {100 - (modalResult.riskScore || 0)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    Độ Tin Cậy
                  </div>
                  <Progress
                    percent={100 - (modalResult.riskScore || 0)}
                    strokeColor="#1890ff"
                    size="small"
                    format={() => ''}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    {getConfidenceText(100 - (modalResult.riskScore || 0))}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: modalResult.threats?.length > 0 ? '#f5222d' : '#52c41a' 
                  }}>
                    {modalResult.threats?.length || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    Mối Đe Dọa
                  </div>
                  <div style={{ 
                    background: modalResult.threats?.length > 0 ? '#fff2f0' : '#f6ffed',
                    border: modalResult.threats?.length > 0 ? '1px solid #ffccc7' : '1px solid #b7eb8f',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    color: modalResult.threats?.length > 0 ? '#f5222d' : '#52c41a'
                  }}>
                    {modalResult.threats?.length > 0 ? 'Phát Hiện' : 'Không Có'}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Mối Đe Dọa Phát Hiện */}
          {modalResult.threats && modalResult.threats.length > 0 && (
            <Card 
              size="small" 
              title={
                <span>
                  <WarningOutlined style={{ color: '#f5222d' }} /> 
                  Mối Đe Dọa Phát Hiện ({modalResult.threats.length})
                </span>
              }
              style={{ marginBottom: '16px' }}
            >
              <List
                size="small"
                dataSource={modalResult.threats}
                renderItem={(threat, index) => (
                  <List.Item style={{ 
                    background: '#fff7e6', 
                    margin: '4px 0', 
                    borderRadius: '6px',
                    border: '1px solid #ffd591',
                    padding: '12px'
                  }}>
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: threat.severity === 'high' ? '#f5222d' : 
                                     threat.severity === 'medium' ? '#fa8c16' : '#faad14',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {threat.severity === 'high' ? <WarningOutlined /> :
                           threat.severity === 'medium' ? <ExclamationCircleOutlined /> : <InfoCircleOutlined />}
                        </div>
                      }
                      title={
                        <div>
                          <Text strong style={{ fontSize: '14px' }}>
                            {threat.name}
                          </Text>
                          <Tag 
                            color={
                              threat.severity === 'high' ? 'red' : 
                              threat.severity === 'medium' ? 'orange' : 'gold'
                            }
                            size="small"
                            style={{ marginLeft: '8px' }}
                          >
                            {threat.severity === 'high' ? 'Mức Độ Cao' : 
                             threat.severity === 'medium' ? 'Mức Độ Trung Bình' : 'Mức Độ Thấp'}
                          </Tag>
                        </div>
                      }
                      description={
                        <Text style={{ fontSize: '13px', color: '#666' }}>
                          {threat.description}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Khuyến Nghị */}
          {modalResult.recommendations && modalResult.recommendations.length > 0 && (
            <Card 
              size="small" 
              title={
                <span>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
                  Khuyến Nghị Bảo Mật ({modalResult.recommendations.length})
                </span>
              }
              style={{ marginBottom: '16px' }}
            >
              <List
                size="small"
                dataSource={modalResult.recommendations}
                renderItem={(recommendation, index) => (
                  <List.Item style={{ 
                    background: '#f6ffed', 
                    margin: '4px 0', 
                    borderRadius: '6px',
                    border: '1px solid #b7eb8f',
                    padding: '12px'
                  }}>
                    <Space align="start">
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <Text style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        {recommendation}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Thông Tin Kỹ Thuật */}
          <Card 
            size="small" 
            title={<span><SettingOutlined /> Thông Tin Kỹ Thuật</span>}
          >
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>Phương Thức Phân Tích</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                    {modalResult.aiEnhanced ? (
                      <Space>
                        <Tag color="blue" icon={<RobotOutlined />} size="small">Gemini AI</Tag>
                        <span style={{ fontSize: '12px', color: '#666' }}>+ Regex Patterns</span>
                      </Space>
                    ) : (
                      <Tag color="default" size="small">Regex Patterns</Tag>
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>Thời Gian Xử Lý</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px', color: '#52c41a' }}>
                    ~2-3 giây
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>Patterns Phát Hiện</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                    {modalResult.patternAnalysis?.indicators?.length || 0} chỉ báo
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>Trạng Thái AI</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                    {modalResult.aiEnhanced ? 
                      <Tag color="green" size="small">Hoạt Động</Tag> : 
                      <Tag color="orange" size="small">Dự Phòng</Tag>
                    }
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    );
  };

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
      {renderResultModal()}
    </div>
  );
};

export default CheckPage; 