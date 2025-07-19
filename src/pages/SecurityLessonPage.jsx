import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Alert, 
  List, 
  Divider,
  Progress,
  Steps,
  Collapse,
  Checkbox,
  Form
} from 'antd';
import { 
  SecurityScanOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

const SecurityLessonPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [securityChecklist, setSecurityChecklist] = useState({});
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      title: 'Tầm quan trọng',
      content: 'Hiểu tại sao bảo mật thông tin cá nhân quan trọng',
    },
    {
      title: 'Thông tin nhạy cảm',
      content: 'Nhận biết các loại thông tin cần bảo vệ',
    },
    {
      title: 'Rủi ro bảo mật',
      content: 'Hiểu các rủi ro khi thông tin bị lộ',
    },
    {
      title: 'Biện pháp bảo vệ',
      content: 'Học các cách bảo vệ thông tin hiệu quả',
    },
    {
      title: 'Kiểm tra bảo mật',
      content: 'Đánh giá mức độ bảo mật hiện tại',
    },
  ];

  const sensitiveInfoTypes = [
    {
      title: 'Thông tin định danh',
      items: ['Họ tên', 'Ngày sinh', 'Số CMND/CCCD', 'Địa chỉ nhà'],
      risk: 'Cao',
      icon: <UserOutlined style={{ color: '#f5222d' }} />
    },
    {
      title: 'Thông tin tài chính',
      items: ['Số thẻ tín dụng', 'Số tài khoản ngân hàng', 'Mật khẩu', 'Mã PIN'],
      risk: 'Rất cao',
      icon: <KeyOutlined style={{ color: '#fa8c16' }} />
    },
    {
      title: 'Thông tin công việc',
      items: ['Email công ty', 'Mật khẩu hệ thống', 'Dữ liệu nội bộ', 'Hợp đồng'],
      risk: 'Cao',
      icon: <SecurityScanOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'Thông tin sức khỏe',
      items: ['Hồ sơ bệnh án', 'Kết quả xét nghiệm', 'Đơn thuốc', 'Bảo hiểm y tế'],
      risk: 'Cao',
      icon: <InfoCircleOutlined style={{ color: '#52c41a' }} />
    }
  ];

  const securityRisks = [
    {
      title: 'Đánh cắp danh tính',
      description: 'Kẻ tấn công sử dụng thông tin của bạn để mở tài khoản, vay tiền, hoặc thực hiện các hành vi phạm pháp.',
      impact: 'Rất nghiêm trọng',
      examples: [
        'Mở thẻ tín dụng giả mạo',
        'Đăng ký dịch vụ trực tuyến',
        'Thực hiện giao dịch bất hợp pháp'
      ]
    },
    {
      title: 'Tấn công tài chính',
      description: 'Truy cập vào tài khoản ngân hàng, thẻ tín dụng để rút tiền hoặc mua sắm.',
      impact: 'Nghiêm trọng',
      examples: [
        'Rút tiền từ tài khoản',
        'Mua sắm trực tuyến',
        'Chuyển khoản bất hợp pháp'
      ]
    },
    {
      title: 'Tấn công mạng',
      description: 'Sử dụng thông tin cá nhân để tấn công các tài khoản trực tuyến khác.',
      impact: 'Nghiêm trọng',
      examples: [
        'Truy cập email, mạng xã hội',
        'Tấn công tài khoản công việc',
        'Lây nhiễm malware'
      ]
    },
    {
      title: 'Quấy rối và bắt nạt',
      description: 'Sử dụng thông tin cá nhân để quấy rối, đe dọa hoặc bắt nạt.',
      impact: 'Trung bình',
      examples: [
        'Gọi điện quấy rối',
        'Gửi tin nhắn đe dọa',
        'Đăng thông tin riêng tư'
      ]
    }
  ];

  const protectionMeasures = [
    {
      title: 'Mật khẩu mạnh',
      description: 'Sử dụng mật khẩu phức tạp, độc đáo cho mỗi tài khoản.',
      tips: [
        'Tối thiểu 12 ký tự',
        'Kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt',
        'Không sử dụng thông tin cá nhân',
        'Sử dụng mật khẩu khác nhau cho mỗi tài khoản'
      ],
      icon: <LockOutlined />
    },
    {
      title: 'Xác thực hai yếu tố',
      description: 'Bật xác thực hai yếu tố (2FA) cho tất cả tài khoản quan trọng.',
      tips: [
        'Sử dụng ứng dụng authenticator',
        'SMS hoặc email xác thực',
        'Khóa bảo mật vật lý',
        'Backup codes an toàn'
      ],
      icon: <SecurityScanOutlined />
    },
    {
      title: 'Mã hóa dữ liệu',
      description: 'Mã hóa dữ liệu nhạy cảm trên thiết bị và khi truyền tải.',
      tips: [
        'Mã hóa ổ cứng',
        'Sử dụng HTTPS cho website',
        'Mã hóa file quan trọng',
        'VPN khi kết nối mạng công cộng'
      ],
      icon: <KeyOutlined />
    },
    {
      title: 'Cập nhật bảo mật',
      description: 'Thường xuyên cập nhật phần mềm, hệ điều hành và ứng dụng.',
      tips: [
        'Bật cập nhật tự động',
        'Cập nhật ngay khi có bản vá bảo mật',
        'Sử dụng phần mềm chính hãng',
        'Kiểm tra tính xác thực của bản cập nhật'
      ],
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Sao lưu dữ liệu',
      description: 'Sao lưu thường xuyên dữ liệu quan trọng.',
      tips: [
        'Sao lưu định kỳ',
        'Lưu trữ nhiều nơi khác nhau',
        'Mã hóa bản sao lưu',
        'Kiểm tra khôi phục dữ liệu'
      ],
      icon: <EyeOutlined />
    }
  ];

  const securityChecklistItems = [
    {
      category: 'Mật khẩu',
      items: [
        'Sử dụng mật khẩu mạnh cho tất cả tài khoản',
        'Không sử dụng cùng mật khẩu cho nhiều tài khoản',
        'Thay đổi mật khẩu định kỳ',
        'Sử dụng trình quản lý mật khẩu'
      ]
    },
    {
      category: 'Xác thực hai yếu tố',
      items: [
        'Bật 2FA cho tài khoản email',
        'Bật 2FA cho tài khoản ngân hàng',
        'Bật 2FA cho mạng xã hội',
        'Bật 2FA cho tài khoản công việc'
      ]
    },
    {
      category: 'Thiết bị',
      items: [
        'Cập nhật hệ điều hành thường xuyên',
        'Cài đặt phần mềm diệt virus',
        'Mã hóa ổ cứng',
        'Khóa màn hình khi không sử dụng'
      ]
    },
    {
      category: 'Mạng',
      items: [
        'Sử dụng mạng Wi-Fi an toàn',
        'Không kết nối Wi-Fi công cộng không bảo mật',
        'Sử dụng VPN khi cần thiết',
        'Kiểm tra cài đặt bảo mật router'
      ]
    },
    {
      category: 'Dữ liệu',
      items: [
        'Sao lưu dữ liệu quan trọng',
        'Không chia sẻ thông tin nhạy cảm qua email',
        'Xóa dữ liệu cũ an toàn',
        'Kiểm tra quyền truy cập file'
      ]
    }
  ];

  const handleChecklistChange = (category, itemIndex, checked) => {
    setSecurityChecklist(prev => ({
      ...prev,
      [`${category}-${itemIndex}`]: checked
    }));
  };

  const calculateSecurityScore = () => {
    const totalItems = securityChecklistItems.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = Object.values(securityChecklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card bordered={false}>
            <Title level={3}>Tại sao bảo mật thông tin cá nhân quan trọng?</Title>
            <Paragraph>
              Trong thời đại số, thông tin cá nhân của chúng ta có giá trị rất lớn và 
              thường xuyên bị nhắm đến bởi các tin tặc và kẻ lừa đảo.
            </Paragraph>
            
            <Alert
              message="Thống kê đáng báo động"
              description="Theo báo cáo, 60% các vụ vi phạm dữ liệu liên quan đến thông tin cá nhân, 
              gây thiệt hại trung bình $150 USD cho mỗi nạn nhân."
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Giá trị thông tin">
                  <List
                    size="small"
                    dataSource={[
                      'Dữ liệu cá nhân: $1-10',
                      'Thông tin tài chính: $50-200',
                      'Thông tin y tế: $100-500',
                      'Dữ liệu công ty: $1000+'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Hậu quả">
                  <List
                    size="small"
                    dataSource={[
                      'Mất tiền từ tài khoản',
                      'Đánh cắp danh tính',
                      'Quấy rối và bắt nạt',
                      'Tổn hại danh tiếng'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Thời gian khôi phục">
                  <List
                    size="small"
                    dataSource={[
                      'Khóa tài khoản: 1-3 ngày',
                      'Thay đổi thông tin: 1-2 tuần',
                      'Khôi phục danh tiếng: 6-12 tháng',
                      'Giải quyết pháp lý: 1-3 năm'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        );

      case 1:
        return (
          <Card bordered={false}>
            <Title level={3}>Các loại thông tin nhạy cảm cần bảo vệ</Title>
            <Paragraph>
              Hiểu rõ các loại thông tin nào cần được bảo vệ đặc biệt.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={sensitiveInfoTypes}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={
                        <Space>
                          {item.title}
                          <Tag color={item.risk === 'Rất cao' ? 'red' : 'orange'}>
                            Rủi ro: {item.risk}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <List
                            size="small"
                            dataSource={item.items}
                            renderItem={infoItem => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Text>• {infoItem}</Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        );

      case 2:
        return (
          <Card bordered={false}>
            <Title level={3}>Rủi ro khi thông tin bị lộ</Title>
            <Paragraph>
              Hiểu các rủi ro cụ thể khi thông tin cá nhân bị lộ.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={securityRisks}
              renderItem={(risk, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={<WarningOutlined style={{ color: '#fa8c16' }} />}
                      title={
                        <Space>
                          {risk.title}
                          <Tag color={
                            risk.impact === 'Rất nghiêm trọng' ? 'red' :
                            risk.impact === 'Nghiêm trọng' ? 'orange' : 'blue'
                          }>
                            {risk.impact}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph>{risk.description}</Paragraph>
                          <Title level={5}>Ví dụ:</Title>
                          <List
                            size="small"
                            dataSource={risk.examples}
                            renderItem={example => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Text>• {example}</Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        );

      case 3:
        return (
          <Card bordered={false}>
            <Title level={3}>Biện pháp bảo vệ thông tin</Title>
            <Paragraph>
              Áp dụng các biện pháp sau để bảo vệ thông tin cá nhân hiệu quả.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={protectionMeasures}
              renderItem={(measure, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={measure.icon}
                      title={measure.title}
                      description={
                        <div>
                          <Paragraph>{measure.description}</Paragraph>
                          <Title level={5}>Lời khuyên:</Title>
                          <List
                            size="small"
                            dataSource={measure.tips}
                            renderItem={tip => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text>{tip}</Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        );

      case 4:
        return (
          <Card bordered={false}>
            <Title level={3}>Kiểm tra mức độ bảo mật</Title>
            <Paragraph>
              Đánh giá mức độ bảo mật hiện tại của bạn và nhận gợi ý cải thiện.
            </Paragraph>
            
            {!showResults ? (
              <div>
                {securityChecklistItems.map((category, cIndex) => (
                  <Card key={cIndex} title={category.category} style={{ marginBottom: 16 }}>
                    <List
                      dataSource={category.items}
                      renderItem={(item, iIndex) => (
                        <List.Item>
                          <Checkbox
                            checked={securityChecklist[`${category.category}-${iIndex}`] || false}
                            onChange={(e) => handleChecklistChange(category.category, iIndex, e.target.checked)}
                          >
                            {item}
                          </Checkbox>
                        </List.Item>
                      )}
                    />
                  </Card>
                ))}
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setShowResults(true)}
                >
                  Xem kết quả đánh giá
                </Button>
              </div>
            ) : (
              <div>
                <Card style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Title level={2}>Kết quả đánh giá bảo mật</Title>
                  <Progress 
                    type="circle" 
                    percent={calculateSecurityScore()} 
                    format={percent => `${percent}%`}
                    size={120}
                    strokeColor={
                      calculateSecurityScore() >= 80 ? '#52c41a' :
                      calculateSecurityScore() >= 60 ? '#fa8c16' : '#f5222d'
                    }
                  />
                  <div style={{ marginTop: 16 }}>
                    <Text>
                      {calculateSecurityScore() >= 80 ? 
                        'Xuất sắc! Bạn đã áp dụng hầu hết các biện pháp bảo mật.' :
                        calculateSecurityScore() >= 60 ?
                        'Tốt! Hãy cải thiện thêm một số điểm để tăng cường bảo mật.' :
                        'Cần cải thiện! Hãy áp dụng các biện pháp bảo mật cơ bản.'
                      }
                    </Text>
                  </div>
                </Card>
                
                <Alert
                  message="Gợi ý cải thiện"
                  description={
                    <div>
                      {calculateSecurityScore() < 80 && (
                        <Paragraph>
                          Dựa trên kết quả đánh giá, bạn nên:
                        </Paragraph>
                      )}
                      <List
                        size="small"
                        dataSource={[
                          'Bật xác thực hai yếu tố cho tất cả tài khoản quan trọng',
                          'Sử dụng mật khẩu mạnh và trình quản lý mật khẩu',
                          'Cập nhật phần mềm và hệ điều hành thường xuyên',
                          'Sao lưu dữ liệu quan trọng định kỳ',
                          'Cẩn thận khi chia sẻ thông tin trực tuyến'
                        ]}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    </div>
                  }
                  type="info"
                  showIcon
                />
                
                <div style={{ marginTop: 16 }}>
                  <Button 
                    type="primary"
                    onClick={() => {
                      setShowResults(false);
                      setSecurityChecklist({});
                    }}
                  >
                    Đánh giá lại
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lesson-page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          
          <Title level={1} style={{ margin: 0 }}>
            <SecurityScanOutlined /> Bảo mật Thông tin Cá nhân
          </Title>
          <Paragraph style={{ fontSize: 16, marginTop: 8 }}>
            Học cách bảo vệ thông tin cá nhân khi sử dụng email và internet
          </Paragraph>
        </div>

        {/* Progress Steps */}
        <Card style={{ marginBottom: 24 }}>
          <Steps current={currentStep} onChange={setCurrentStep}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} description={step.content} />
            ))}
          </Steps>
        </Card>

        {/* Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space>
            <Button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(current => current - 1)}
            >
              Trước
            </Button>
            <Button 
              type="primary"
              disabled={currentStep === steps.length - 1}
              onClick={() => setCurrentStep(current => current + 1)}
            >
              Tiếp theo
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SecurityLessonPage; 