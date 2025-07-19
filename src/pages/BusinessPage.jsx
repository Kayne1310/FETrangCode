import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Table, Button, Select, DatePicker, 
  Statistic, Progress, Tag, Space, Alert, Tabs, List, Avatar,
  Switch, Tooltip, Badge, Dropdown, Menu, Modal, Form, Input, Spin
} from 'antd';
import { Column, Pie, Line, Area } from '@ant-design/plots';
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

  // State for Analytics Data
  const [analyticsData, setAnalyticsData] = useState({
    categoryStats: [],
    timeSeriesData: [],
    topDomains: [],
    riskDistribution: []
  });

  // State for Analytics Pagination
  const [analyticsPagination, setAnalyticsPagination] = useState({
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
  });

  // Raw analytics data storage
  const [rawAnalyticsData, setRawAnalyticsData] = useState([]);

  // Dashboard data derived from API
  const [dashboardData, setDashboardData] = useState({
    totalEmails: 0,
    safeEmails: 0,
    suspiciousEmails: 0,
    spamEmails: 0,
    phishingEmails: 0,
    todayProcessed: 0,
    accuracy: 0,
    avgResponseTime: 0.3
  });

  // Process API data for analytics
  const processAnalyticsData = (data, pageData = null) => {
    if (!data || !data.items) return;

    // Use provided pageData or default to data.items
    const items = pageData || data.items;
    
    // Category Statistics
    const categoryCount = {};
    const domainCount = {};
    const timeSeriesMap = {};
    const riskScores = [];

    items.forEach(item => {
      // Category stats
      const category = item.category || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;

      // Domain analysis from email addresses
      if (item.from_email) {
        const domain = item.from_email.split('@')[1];
        if (domain) {
          domainCount[domain] = (domainCount[domain] || 0) + 1;
        }
      }

      // Time series data
      if (item.received_time) {
        const date = new Date(item.received_time).toLocaleDateString('vi-VN');
        if (!timeSeriesMap[date]) {
          timeSeriesMap[date] = { date, count: 0, safe: 0, threat: 0 };
        }
        timeSeriesMap[date].count++;
        if (category === 'An toàn') {
          timeSeriesMap[date].safe++;
        } else {
          timeSeriesMap[date].threat++;
        }
      }

      // Risk distribution
      if (item.riskScore !== undefined) {
        riskScores.push(item.riskScore);
      } else {
        // Calculate risk score from category if not available
        const calculatedScore = calculateRiskScoreFromCategory(item.category);
        riskScores.push(calculatedScore);
      }
    });

    // Update analytics state
    setAnalyticsData({
      categoryStats: Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / items.length) * 100).toFixed(1)
      })),
      timeSeriesData: Object.values(timeSeriesMap).sort((a, b) => new Date(a.date) - new Date(b.date)),
      topDomains: Object.entries(domainCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([domain, count]) => ({ domain, count })),
      riskDistribution: [
        { range: 'Thấp (1-30)', count: riskScores.filter(s => s >= 1 && s <= 30).length, color: '#52c41a' },
        { range: 'Trung bình (31-60)', count: riskScores.filter(s => s >= 31 && s <= 60).length, color: '#faad14' },
        { range: 'Cao (61-80)', count: riskScores.filter(s => s >= 61 && s <= 80).length, color: '#fa8c16' },
        { range: 'Rất cao (81-100)', count: riskScores.filter(s => s >= 81 && s <= 100).length, color: '#f5222d' }
      ]
    });

    // Update dashboard stats
    const safeCount = categoryCount['An toàn'] || 0;
    const suspiciousCount = categoryCount['Nghi ngờ'] || 0;
    const spamCount = categoryCount['Spam'] || 0;
    const phishingCount = categoryCount['Giả mạo'] || 0;
    const totalCount = items.length;

    setDashboardData({
      totalEmails: totalCount,
      safeEmails: safeCount,
      suspiciousEmails: suspiciousCount,
      spamEmails: spamCount,
      phishingEmails: phishingCount,
      todayProcessed: items.filter(item => {
        const today = new Date().toDateString();
        const itemDate = new Date(item.received_time).toDateString();
        return today === itemDate;
      }).length,
      accuracy: totalCount > 0 ? ((safeCount / totalCount) * 100).toFixed(1) : 0,
      avgResponseTime: 0.3
    });

    // Update analytics pagination total
    if (data.totalCount) {
      setAnalyticsPagination(prev => ({
        ...prev,
        total: data.totalCount
      }));
    }
  };

  // Fetch analytics data with pagination support
  const fetchAnalyticsData = async (currentPage = 1, pageSize = 1000) => {
    setLoading(true);
    try {
      const requestBody = {
        pageIndex: currentPage,
        pageSize: pageSize,
        sortColumn: 'received_time',
        sortOrder: 'desc',
      };

      const response = await emailCheckService.getDataSearch(requestBody);
      if (response.status && response.data) {
        // Store raw data for further analysis
        if (currentPage === 1) {
          setRawAnalyticsData(response.data.items);
        } else {
          setRawAnalyticsData(prev => [...prev, ...response.data.items]);
        }

        // Process analytics with current page data
        processAnalyticsData(response.data);
        
        // Update pagination state
        setAnalyticsPagination({
          pageIndex: currentPage,
          pageSize: pageSize,
          total: response.data.totalCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more analytics data
  const loadMoreAnalyticsData = async () => {
    const nextPage = analyticsPagination.pageIndex + 1;
    const maxPage = Math.ceil(analyticsPagination.total / analyticsPagination.pageSize);
    
    if (nextPage <= maxPage) {
      await fetchAnalyticsData(nextPage, analyticsPagination.pageSize);
    }
  };

  // Refresh all analytics data
  const refreshAnalyticsData = async () => {
    setRawAnalyticsData([]);
    await fetchAnalyticsData(1, 1000);
  };

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

  // Separate useEffect for analytics data - only fetch once on mount
  useEffect(() => {
    fetchAnalyticsData(1, 1000); // Fetch analytics data on mount
  }, []); // Empty dependency array - only run once

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
    // tableFilters.category will be an array like ['An toàn'] or undefined
    const selectedCategoryFilter = tableFilters.category ? tableFilters.category[0] : '';
    if (selectedCategoryFilter !== filters.category) {
      setFilters(prev => ({ ...prev, category: selectedCategoryFilter }));
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'An toàn': return 'green';
      case 'Nghi ngờ': return 'orange';
      case 'Spam': return 'red';
      case 'Giả mạo': return 'volcano';
      default: return 'default';
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'An toàn': return <SafetyOutlined />;
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

  // Process suspicious indicators - split, deduplicate, and clean
  const processSuspiciousIndicators = (indicators) => {
    if (!indicators || typeof indicators !== 'string') return [];
    
    try {
      // If it's JSON string, parse it first
      let indicatorText = indicators;
      try {
        const parsed = JSON.parse(indicators);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5); // Return first 5 if already array
        }
        indicatorText = parsed.toString();
      } catch (e) {
        // Not JSON, continue with string processing
      }

      // Split by semicolon and clean up
      const splitIndicators = indicatorText
        .split(';')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Deduplicate and clean
      const cleanedIndicators = [];
      const seenIndicators = new Set();

      splitIndicators.forEach(indicator => {
        // Clean the indicator
        let cleanIndicator = indicator.trim();
        
        // Remove specific domains that are repeated
        if (cleanIndicator.includes('faceb00k-account.ga')) {
          cleanIndicator = cleanIndicator.replace(/faceb00k-account\.ga/g, '[domain]');
        }
        
        // Normalize similar indicators
        const normalizedIndicator = cleanIndicator.toLowerCase();
        
        if (!seenIndicators.has(normalizedIndicator) && cleanIndicator.length > 0) {
          seenIndicators.add(normalizedIndicator);
          cleanedIndicators.push(cleanIndicator);
        }
      });

      // Return max 5 indicators to avoid UI clutter
      return cleanedIndicators.slice(0, 5);
    } catch (error) {
      console.error('Error processing suspicious indicators:', error);
      return ['Lỗi xử lý dữ liệu'];
    }
  };

  // Calculate risk score based on category
  const calculateRiskScoreFromCategory = (category) => {
    switch (category) {
      case 'An toàn': return Math.floor(Math.random() * 30) + 1; // 1-30
      case 'Nghi ngờ': return Math.floor(Math.random() * 30) + 31; // 31-60
      case 'Spam': return Math.floor(Math.random() * 20) + 61; // 61-80
      case 'Giả mạo': return Math.floor(Math.random() * 20) + 81; // 81-100
      default: return 0;
    }
  };

  // Get risk score with fallback to category-based calculation
  const getRiskScore = (score, category) => {
    if (score !== undefined && score !== null && score > 0) {
      return score;
    }
    return calculateRiskScoreFromCategory(category);
  };

  // Get risk level text and color
  const getRiskLevel = (score) => {
    if (score >= 81) return { text: 'Rất cao', color: '#f5222d' };
    if (score >= 61) return { text: 'Cao', color: '#fa8c16' };
    if (score >= 31) return { text: 'Trung bình', color: '#faad14' };
    return { text: 'Thấp', color: '#52c41a' };
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
        { text: 'An toàn', value: 'An toàn' },
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
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (indicators) => {
        const processedIndicators = processSuspiciousIndicators(indicators);
        
        if (processedIndicators.length === 0) {
          return <Text type="secondary">N/A</Text>;
        }

        return (
          <div style={{ maxWidth: '230px' }}>
            <Space wrap size={[4, 4]}>
              {processedIndicators.map((indicator, index) => (
                <Tag 
                  key={index} 
                  color="orange"
                  style={{ 
                    marginBottom: 2,
                    fontSize: '11px',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Tooltip title={indicator} placement="top">
                    {indicator}
                  </Tooltip>
                </Tag>
              ))}
              {processedIndicators.length >= 5 && (
                <Tooltip title="Có thêm nhiều chỉ số khác...">
                  <Tag color="default" style={{ fontSize: '11px' }}>...</Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        );
      }
    },
    {
      title: 'Điểm rủi ro',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 140,
      sorter: true,
      align: 'center',
      render: (score, record) => {
        const calculatedScore = getRiskScore(score, record.category);
        const { text, color } = getRiskLevel(calculatedScore);
        
        return (
          <div style={{ 
            width: '100px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Progress
              percent={calculatedScore}
              size="small"
              strokeWidth={6}
              strokeColor={color}
              trailColor="#f0f0f0"
              format={() => (
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  color: color
                }}>
                  {calculatedScore}
                </span>
              )}
              style={{ width: '100%' }}
            />
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '10px', 
                marginTop: '2px',
                textAlign: 'center'
              }}
            >
              {text}
            </Text>
          </div>
        );
      }
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
  
  ];

  const handleRefresh = () => {
    // Re-fetch data on refresh
    fetchEmails(pagination, filters, sort);
    refreshAnalyticsData(); // Re-fetch analytics data on refresh
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
            <Text type="secondary">
              Hôm nay: {dashboardData.todayProcessed} | 
              Dữ liệu: {rawAnalyticsData.length.toLocaleString()}
            </Text>
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
            value={dashboardData.phishingEmails + dashboardData.spamEmails + dashboardData.suspiciousEmails}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#f5222d' }}
          />
          <Space>
            <Tag color="volcano">Phishing: {dashboardData.phishingEmails}</Tag>
            <Tag color="red">Spam: {dashboardData.spamEmails}</Tag>
            <Tag color="orange">Nghi ngờ: {dashboardData.suspiciousEmails}</Tag>
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
            <Text type="secondary">
              Phân tích: {analyticsPagination.total.toLocaleString()} emails
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const renderThreatAnalysis = () => (
    <Card title="Phân tích Mối đe dọa" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Phân loại Email">
            <Pie
              data={analyticsData.categoryStats}
              angleField="count"
              colorField="category"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name}: {percentage}%',
              }}
              interactions={[{ type: 'element-active' }]}
              color={['#52c41a', '#faad14', '#fa8c16', '#f5222d']}
              height={300}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card size="small" title="Top 10 Domain">
            <Column
              data={analyticsData.topDomains}
              xField="domain"
              yField="count"
              color="#1890ff"
              label={{
                position: 'middle',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.8,
                },
              }}
              meta={{
                domain: {
                  alias: 'Domain',
                },
                count: {
                  alias: 'Số lượng',
                },
              }}
              height={300}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card size="small" title="Xu hướng Theo Thời gian">
            <Line
              data={analyticsData.timeSeriesData}
              xField="date"
              yField="count"
              seriesField="type"
              color={['#52c41a', '#f5222d']}
              point={{
                size: 5,
                shape: 'diamond',
              }}
              label={{
                style: {
                  fill: '#aaa',
                },
              }}
              height={300}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card size="small" title="Phân bố Điểm Rủi ro">
            <Column
              data={analyticsData.riskDistribution}
              xField="range"
              yField="count"
              color={({ range }) => {
                const item = analyticsData.riskDistribution.find(d => d.range === range);
                return item ? item.color : '#1890ff';
              }}
              label={{
                position: 'middle',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.9,
                  fontWeight: 'bold',
                  fontSize: 12,
                },
              }}
              height={300}
              meta={{
                range: {
                  alias: 'Mức độ rủi ro',
                },
                count: {
                  alias: 'Số lượng',
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  // New analytics dashboard
  const renderAnalyticsDashboard = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Analytics Info Bar */}
      <Card size="small" style={{ background: '#f6f8ff' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text strong>Dữ liệu phân tích:</Text>
              <Text>
                {rawAnalyticsData.length.toLocaleString()} / {analyticsPagination.total.toLocaleString()} emails
              </Text>
              <Text type="secondary">
                (Trang {analyticsPagination.pageIndex}/{Math.ceil(analyticsPagination.total / analyticsPagination.pageSize)})
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={refreshAnalyticsData}
                loading={loading}
                size="small"
              >
                Làm mới
              </Button>
              {rawAnalyticsData.length < analyticsPagination.total && (
                <Button 
                  type="primary" 
                  onClick={loadMoreAnalyticsData}
                  loading={loading}
                  size="small"
                >
                  Tải thêm ({Math.min(1000, analyticsPagination.total - rawAnalyticsData.length)})
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Card style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Đang tải dữ liệu phân tích...</Text>
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Xu hướng Email Theo Ngày" bordered={false}>
              {analyticsData.timeSeriesData.length > 0 ? (
                <Area
                  data={analyticsData.timeSeriesData.flatMap(item => [
                    { date: item.date, value: item.safe, type: 'An toàn' },
                    { date: item.date, value: item.threat, type: 'Mối đe dọa' }
                  ])}
                  xField="date"
                  yField="value"
                  seriesField="type"
                  color={['#52c41a', '#f5222d']}
                  smooth={true}
                  height={400}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                  <BarChartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div>Chưa có dữ liệu để hiển thị</div>
                </div>
              )}
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card title="Thống kê Nhanh" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tỷ lệ An toàn:</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      {dashboardData.totalEmails > 0 
                        ? ((dashboardData.safeEmails / dashboardData.totalEmails) * 100).toFixed(1)
                        : 0}%
                    </Text>
              </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Mối đe dọa:</Text>
                    <Text strong style={{ color: '#f5222d' }}>
                      {dashboardData.spamEmails + dashboardData.phishingEmails + dashboardData.suspiciousEmails}
                    </Text>
              </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Domain phổ biến:</Text>
                    <Text strong>
                      {analyticsData.topDomains[0]?.domain || 'N/A'}
                    </Text>
              </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tổng dữ liệu:</Text>
                    <Text strong style={{ color: '#1890ff' }}>
                      {rawAnalyticsData.length.toLocaleString()}
                    </Text>
              </div>
            </Space>
          </Card>

              <Card title="Cảnh báo Rủi ro" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {analyticsData.riskDistribution.map((item, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: '12px' }}>{item.range}</Text>
                        <Text strong>{item.count}</Text>
                      </div>
                      <Progress
                        percent={dashboardData.totalEmails > 0 
                          ? (item.count / dashboardData.totalEmails) * 100 
                          : 0}
                        size="small"
                        strokeColor={item.color}
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Space>
        </Col>
      </Row>
      )}
    </Space>
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
      
        <Tabs defaultActiveKey="overview" size="large">
          <TabPane tab={<span><DashboardOutlined />Tổng quan</span>} key="overview">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {renderOverviewCards()}
              {renderThreatAnalysis()}
            </Space>
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />Phân tích</span>} key="analytics">
            {renderAnalyticsDashboard()}
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
                    <Option value="An toàn">An toàn</Option>
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
                    `${range[0]}-${range[1]} của ${total} emails`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                scroll={{ 
                  x: 1400,
                  y: 600
                }}
                size="small"
                onChange={handleTableChange}
                rowKey="key"
                className="business-table"
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