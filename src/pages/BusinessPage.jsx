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
import { emailCheckService } from '../services/incomingService';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const BusinessPage = () => {
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [alertVisible, setAlertVisible] = useState(false);

  // State for Email Logs Table
  const [emailLogs, setEmailLogs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    title: '',
    from_email: '',
    to_email: '',
    category: '',
  });
  const [sort, setSort] = useState({
    column: 'received_time',
    order: 'descend',
  });

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

  // Fetch Email Logs from API
  const fetchEmails = async (
    currentPagination = pagination,
    currentFilters = filters,
    currentSort = sort
  ) => {
    setLoading(true);
    try {
      const requestBody = {
        pageIndex: currentPagination.pageIndex, // Send pageIndex as is (1-based)
        pageSize: currentPagination.pageSize,
        sortColumn: currentSort.column,
        sortOrder: currentSort.order === 'ascend' ? 'asc' : 'desc',
      };

      // Conditionally add filters if they have a value
      if (currentFilters.title) {
        requestBody.title = currentFilters.title;
      }
      if (currentFilters.from_email) {
        requestBody.from_email = currentFilters.from_email;
      }
      if (currentFilters.to_email) {
        requestBody.to_email = currentFilters.to_email;
      }
      if (currentFilters.category) {
        requestBody.category = currentFilters.category;
      }

      const response = await emailCheckService.getDataSearch(requestBody);
      if (response.status && response.data) {
        setEmailLogs(response.data.items.map((item, index) => ({ ...item, key: item.id || index })));
        setPagination(prev => ({
          ...prev,
          total: response.data.totalCount,
        }));
      } else {
        console.error('API Error:', response.message);
        setEmailLogs([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      console.error('Error fetching email logs:', error);
      setEmailLogs([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Search function - doesn't include pageIndex, resets to page 1
  const handleSearch = async () => {
    setLoading(true);
    try {
      const requestBody = {
        pageSize: pagination.pageSize,
        sortColumn: sort.column,
        sortOrder: sort.order === 'ascend' ? 'asc' : 'desc',
      };

      // Conditionally add filters if they have a value
      if (filters.title) {
        requestBody.title = filters.title;
      }
      if (filters.from_email) {
        requestBody.from_email = filters.from_email;
      }
      if (filters.to_email) {
        requestBody.to_email = filters.to_email;
      }
      if (filters.category) {
        requestBody.category = filters.category;
      }

      const response = await emailCheckService.getDataSearch(requestBody);
      if (response.status && response.data) {
        setEmailLogs(response.data.items.map((item, index) => ({ ...item, key: item.id || index })));
        setPagination({
          pageIndex: 1, // Reset to first page
          pageSize: pagination.pageSize,
          total: response.data.totalCount,
        });
      } else {
        console.error('API Error:', response.message);
        setEmailLogs([]);
        setPagination(prev => ({ ...prev, pageIndex: 1, total: 0 }));
      }
    } catch (error) {
      console.error('Error fetching email logs:', error);
      setEmailLogs([]);
      setPagination(prev => ({ ...prev, pageIndex: 1, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(pagination, filters, sort);
  }, [pagination.pageIndex, pagination.pageSize, filters, sort]);

  // Handle table change (pagination, sort, filter)
  const handleTableChange = (newPagination, tableFilters, newSorter) => {
    setPagination({
      pageIndex: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total,
    });

    // Handle sorting
    const newSortColumn = newSorter.columnKey || sort.column; // Use new columnKey if available, otherwise keep current
    const newSortOrder = newSorter.order || sort.order; // Use new order if available, otherwise keep current

    if (newSortColumn !== sort.column || newSortOrder !== sort.order) {
      setSort({
        column: newSortColumn,
        order: newSortOrder,
      });
    }

    // Handle column filters for category
    // tableFilters.category will be an array like ['An Toàn'] or undefined
    const selectedCategoryFilter = tableFilters.category ? tableFilters.category[0] : '';
    if (selectedCategoryFilter !== filters.category) {
      setFilters(prev => ({ ...prev, category: selectedCategoryFilter }));
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'An Toàn': return 'green';
      case 'Nghi ngờ': return 'orange';
      case 'Spam': return 'red';
      case 'Giả mạo': return 'volcano';
      default: return 'default';
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'An Toàn': return <SafetyOutlined />;
      case 'Nghi ngờ': return <ExclamationCircleOutlined />;
      case 'Spam': return <FireOutlined />;
      case 'Giả mạo': return <ExclamationCircleOutlined />;
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
      dataIndex: 'received_time',
      key: 'received_time',
      width: 150,
      sorter: true,
      render: (text) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {new Date(text).toLocaleString('vi-VN')}
        </Text>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Người gửi',
      dataIndex: 'from_email',
      key: 'from_email',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Người nhận',
      dataIndex: 'to_email',
      key: 'to_email',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: [
        { text: 'An Toàn', value: 'An Toàn' },
        { text: 'Nghi ngờ', value: 'Nghi ngờ' },
        { text: 'Spam', value: 'Spam' },
        { text: 'Giả mạo', value: 'Giả mạo' }
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Tag 
          color={getClassificationColor(category)} 
          icon={getClassificationIcon(category)}
        >
          {category}
        </Tag>
      )
    },
    {
      title: 'Chỉ số đáng ngờ',
      dataIndex: 'suspicious_indicators',
      key: 'suspicious_indicators',
      ellipsis: true,
      render: (indicators) => {
        try {
          const parsedIndicators = JSON.parse(indicators);
          return (
            <Space wrap>
              {parsedIndicators.map((indicator, index) => (
                <Tag key={index} color="orange">
                  {indicator}
                </Tag>
              ))}
            </Space>
          );
        } catch (e) {
          return <Text type="secondary">N/A</Text>;
        }
      }
    },
    {
      title: 'Điểm rủi ro',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 120,
      sorter: true,
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
    // Re-fetch data on refresh
    fetchEmails(pagination, filters, sort);
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
    <div className="page-container business-page">
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
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề..."
                    value={filters.title}
                    onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: 200 }}
                  />
                  <Input
                    placeholder="Tìm kiếm theo người gửi..."
                    value={filters.from_email}
                    onChange={(e) => setFilters(prev => ({ ...prev, from_email: e.target.value }))}
                    style={{ width: 200 }}
                  />
                  <Input
                    placeholder="Tìm kiếm theo người nhận..."
                    value={filters.to_email}
                    onChange={(e) => setFilters(prev => ({ ...prev, to_email: e.target.value }))}
                    style={{ width: 200 }}
                  />
                  <Select
                    placeholder="Lọc theo phân loại"
                    value={filters.category}
                    onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                    style={{ width: 180 }}
                    allowClear
                  >
                    <Option value="An Toàn">An Toàn</Option>
                    <Option value="Nghi ngờ">Nghi ngờ</Option>
                    <Option value="Spam">Spam</Option>
                    <Option value="Giả mạo">Giả mạo</Option>
                  </Select>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<FilterOutlined />} onClick={() => {
                    setFilters({ title: '', from_email: '', to_email: '', category: '' });
                    setPagination(prev => ({ ...prev, pageIndex: 1 }));
                    setSort({ column: 'received_time', order: 'descend' });
                  }}>
                    Xóa bộ lọc
                  </Button>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={emailLogs}
                loading={loading}
                pagination={{
                  current: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} emails`
                }}
                scroll={{ x: 1200 }}
                size="small"
                onChange={handleTableChange}
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