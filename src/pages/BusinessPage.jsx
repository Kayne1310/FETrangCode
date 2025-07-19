import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Table, Button, Select, DatePicker, 
  Statistic, Progress, Tag, Space, Alert, Tabs, List, Avatar,
  Switch, Tooltip, Badge, Dropdown, Menu, Modal, Form, Input
} from 'antd';
import { 
  DashboardOutlined,
  BarChartOutlined,
  MailOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  DownloadOutlined,
  SettingOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  BellOutlined,
  TeamOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const BusinessPage = () => {
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [alertVisible, setAlertVisible] = useState(false);

  // Mock data for business dashboard
  const [dashboardData, setDashboardData] = useState({
    totalEmails: 45623,
    safeEmails: 38456,
    suspiciousEmails: 4234,
    spamEmails: 2456,
    phishingEmails: 477,
    todayProcessed: 1834,
    accuracy: 99.7,
    avgResponseTime: 0.3
  });

  const [emailData, setEmailData] = useState([
    {
      key: '1',
      email: 'finance@company.com',
      sender: 'bank@suspicious.com',
      subject: 'Urgent: Verify your account now!',
      classification: 'phishing',
      riskScore: 95,
      timestamp: '2025-01-19 14:30:25',
      action: 'blocked'
    },
    {
      key: '2',
      email: 'hr@company.com',
      sender: 'linkedin@notification.com',
      subject: 'Weekly newsletter',
      classification: 'safe',
      riskScore: 5,
      timestamp: '2025-01-19 14:25:10',
      action: 'delivered'
    },
    {
      key: '3',
      email: 'support@company.com',
      sender: 'promo@marketing.spam',
      subject: '50% OFF - LIMITED TIME OFFER!!!',
      classification: 'spam',
      riskScore: 85,
      timestamp: '2025-01-19 14:20:45',
      action: 'quarantined'
    },
    {
      key: '4',
      email: 'admin@company.com',
      sender: 'security@company-internal.com',
      subject: 'Monthly security report',
      classification: 'safe',
      riskScore: 8,
      timestamp: '2025-01-19 14:15:30',
      action: 'delivered'
    },
    {
      key: '5',
      email: 'ceo@company.com',
      sender: 'fake-ceo@similar-domain.co',
      subject: 'RE: Wire transfer authorization',
      classification: 'phishing',
      riskScore: 98,
      timestamp: '2025-01-19 14:10:15',
      action: 'blocked'
    }
  ]);

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'safe': return 'green';
      case 'suspicious': return 'orange';
      case 'spam': return 'red';
      case 'phishing': return 'volcano';
      default: return 'default';
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'safe': return <SafetyOutlined />;
      case 'suspicious': return <ExclamationCircleOutlined />;
      case 'spam': return <FireOutlined />;
      case 'phishing': return <ExclamationCircleOutlined />;
      default: return <MailOutlined />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'delivered': return 'green';
      case 'quarantined': return 'orange';
      case 'blocked': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      render: (text) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {new Date(text).toLocaleString('vi-VN')}
        </Text>
      )
    },
    {
      title: 'Người nhận',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      key: 'sender',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Phân loại',
      dataIndex: 'classification',
      key: 'classification',
      width: 120,
      filters: [
        { text: 'An toàn', value: 'safe' },
        { text: 'Nghi ngờ', value: 'suspicious' },
        { text: 'Spam', value: 'spam' },
        { text: 'Phishing', value: 'phishing' }
      ],
      onFilter: (value, record) => record.classification === value,
      render: (classification) => (
        <Tag 
          color={getClassificationColor(classification)} 
          icon={getClassificationIcon(classification)}
        >
          {classification === 'safe' && 'An toàn'}
          {classification === 'suspicious' && 'Nghi ngờ'}
          {classification === 'spam' && 'Spam'}
          {classification === 'phishing' && 'Phishing'}
        </Tag>
      )
    },
    {
      title: 'Điểm rủi ro',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 120,
      sorter: (a, b) => a.riskScore - b.riskScore,
      render: (score) => (
        <div style={{ width: 80 }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={
              score >= 70 ? '#f5222d' : 
              score >= 40 ? '#fa8c16' : '#52c41a'
            }
            format={() => `${score}`}
          />
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action) => (
        <Badge 
          status={
            action === 'delivered' ? 'success' :
            action === 'quarantined' ? 'warning' : 'error'
          }
          text={
            action === 'delivered' ? 'Đã gửi' :
            action === 'quarantined' ? 'Cách ly' : 'Chặn'
          }
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate data refresh
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    Modal.info({
      title: 'Xuất báo cáo',
      content: 'Báo cáo đang được tạo và sẽ được gửi đến email của bạn trong vài phút.',
    });
  };

  const renderOverviewCards = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic
            title="Tổng Email"
            value={dashboardData.totalEmails}
            prefix={<MailOutlined />}
            suffix="emails"
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Hôm nay: {dashboardData.todayProcessed}</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic
            title="Email An toàn"
            value={dashboardData.safeEmails}
            prefix={<SafetyOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress
            percent={Math.round((dashboardData.safeEmails / dashboardData.totalEmails) * 100)}
            size="small"
            strokeColor="#52c41a"
            showInfo={false}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic
            title="Mối đe dọa"
            value={dashboardData.phishingEmails + dashboardData.spamEmails}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#f5222d' }}
          />
          <Space>
            <Tag color="volcano">Phishing: {dashboardData.phishingEmails}</Tag>
            <Tag color="red">Spam: {dashboardData.spamEmails}</Tag>
          </Space>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic
            title="Độ chính xác"
            value={dashboardData.accuracy}
            prefix={<TrophyOutlined />}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Thời gian phản hồi: {dashboardData.avgResponseTime}s</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const renderThreatAnalysis = () => (
    <Card title="Phân tích Mối đe dọa" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Top Nguồn Nguy hiểm">
            <List
              size="small"
              dataSource={[
                { domain: 'suspicious-bank.com', count: 45, type: 'phishing' },
                { domain: 'fake-paypal.net', count: 38, type: 'phishing' },
                { domain: 'spam-marketing.org', count: 156, type: 'spam' },
                { domain: 'virus-download.co', count: 23, type: 'malware' }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: item.type === 'phishing' ? '#f5222d' : 
                                          item.type === 'spam' ? '#fa8c16' : '#722ed1' 
                        }}
                      >
                        {item.count}
                      </Avatar>
                    }
                    title={<Text code>{item.domain}</Text>}
                    description={
                      <Tag color={
                        item.type === 'phishing' ? 'red' : 
                        item.type === 'spam' ? 'orange' : 'purple'
                      }>
                        {item.type.toUpperCase()}
                      </Tag>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card size="small" title="Xu hướng Tấn công">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>Phishing Email</Text>
                <Progress percent={78} strokeColor="#f5222d" />
              </div>
              <div>
                <Text>Spam Marketing</Text>
                <Progress percent={65} strokeColor="#fa8c16" />
              </div>
              <div>
                <Text>Malware Links</Text>
                <Progress percent={34} strokeColor="#722ed1" />
              </div>
              <div>
                <Text>Social Engineering</Text>
                <Progress percent={45} strokeColor="#eb2f96" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );

  const settingsMenu = (
    <Menu>
      <Menu.Item key="1" icon={<ApiOutlined />}>
        Cấu hình API
      </Menu.Item>
      <Menu.Item key="2" icon={<BellOutlined />}>
        Thiết lập Cảnh báo
      </Menu.Item>
      <Menu.Item key="3" icon={<TeamOutlined />}>
        Quản lý Người dùng
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="business-page">
      <div className="container">
        <div className="page-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={1} className="page-title">
                <DashboardOutlined /> Dashboard Doanh nghiệp
              </Title>
              <Paragraph className="page-description">
                Giám sát và quản lý an toàn email cho tổ chức của bạn
              </Paragraph>
            </Col>
            <Col>
              <Space>
                <Tooltip title="Tự động làm mới">
                  <Switch
                    checked={autoRefresh}
                    onChange={setAutoRefresh}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                  />
                </Tooltip>
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                  Làm mới
                </Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                  Xuất báo cáo
                </Button>
                <Dropdown overlay={settingsMenu} placement="bottomRight">
                  <Button icon={<SettingOutlined />}>
                    Cài đặt
                  </Button>
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Alert for critical threats */}
        {!alertVisible && (
          <Alert
            message="Cảnh báo Bảo mật"
            description="Phát hiện 3 email phishing trong 1 giờ qua. Vui lòng kiểm tra và cập nhật chính sách bảo mật."
            type="warning"
            showIcon
            closable
            onClose={() => setAlertVisible(true)}
            action={
              <Button size="small" type="link">
                Xem chi tiết
              </Button>
            }
            style={{ marginBottom: 24 }}
          />
        )}

        <Tabs defaultActiveKey="overview" size="large">
          <TabPane tab={<span><DashboardOutlined />Tổng quan</span>} key="overview">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {renderOverviewCards()}
              {renderThreatAnalysis()}
            </Space>
          </TabPane>

          <TabPane tab={<span><MailOutlined />Email Logs</span>} key="emails">
            <Card 
              title="Nhật ký Email" 
              bordered={false}
              extra={
                <Space>
                  <Select
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    style={{ width: 120 }}
                  >
                    <Option value="1day">Hôm nay</Option>
                    <Option value="7days">7 ngày</Option>
                    <Option value="30days">30 ngày</Option>
                  </Select>
                  <RangePicker size="middle" />
                  <Button icon={<FilterOutlined />}>Lọc</Button>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={emailData}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} emails`
                }}
                scroll={{ x: 1200 }}
                size="small"
              />
            </Card>
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />Báo cáo</span>} key="reports">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Báo cáo Hàng tuần" bordered={false}>
                  <List
                    dataSource={[
                      { title: 'Báo cáo An toàn Email - Tuần 3/2025', date: '2025-01-19', status: 'ready' },
                      { title: 'Phân tích Mối đe dọa - Tuần 2/2025', date: '2025-01-12', status: 'ready' },
                      { title: 'Tổng kết Tháng 12/2024', date: '2025-01-01', status: 'ready' }
                    ]}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" icon={<DownloadOutlined />}>Tải về</Button>,
                          <Button type="link" icon={<EyeOutlined />}>Xem</Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={`Ngày tạo: ${item.date}`}
                        />
                        <Badge status="success" text="Sẵn sàng" />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Tùy chỉnh Báo cáo" bordered={false}>
                  <Form layout="vertical">
                    <Form.Item label="Loại báo cáo">
                      <Select placeholder="Chọn loại báo cáo">
                        <Option value="security">Báo cáo Bảo mật</Option>
                        <Option value="threats">Phân tích Mối đe dọa</Option>
                        <Option value="performance">Hiệu suất Hệ thống</Option>
                        <Option value="compliance">Tuân thủ Quy định</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Khoảng thời gian">
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Email nhận">
                      <Input placeholder="admin@company.com" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" block>
                        Tạo Báo cáo
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><SettingOutlined />Cài đặt</span>} key="settings">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Cấu hình Tổng quan" bordered={false}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Tự động quét email</span>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Cảnh báo thời gian thực</span>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Báo cáo hàng tuần</span>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Chặn tự động</span>
                      <Switch />
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Ngưỡng Cảnh báo" bordered={false}>
                  <Form layout="vertical">
                    <Form.Item label="Điểm rủi ro cao (≥)">
                      <Input placeholder="75" suffix="điểm" />
                    </Form.Item>
                    <Form.Item label="Số email nguy hiểm/giờ (≥)">
                      <Input placeholder="5" suffix="emails" />
                    </Form.Item>
                    <Form.Item label="Tỷ lệ phishing (≥)">
                      <Input placeholder="2" suffix="%" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Lưu Cài đặt</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessPage; 