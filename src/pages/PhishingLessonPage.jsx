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
  Image,
  Collapse
} from 'antd';
import { 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SecurityScanOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

const PhishingLessonPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      title: 'Giới thiệu',
      content: 'Tìm hiểu về email phishing và tác hại của chúng',
    },
    {
      title: 'Dấu hiệu nhận biết',
      content: 'Học cách nhận biết các dấu hiệu phishing',
    },
    {
      title: 'Ví dụ thực tế',
      content: 'Xem các ví dụ email phishing thực tế',
    },
    {
      title: 'Cách phòng tránh',
      content: 'Học các biện pháp phòng tránh hiệu quả',
    },
    {
      title: 'Kiểm tra kiến thức',
      content: 'Làm bài kiểm tra để củng cố kiến thức',
    },
  ];

  const phishingSigns = [
    {
      title: 'Địa chỉ email giả mạo',
      description: 'Email từ ngân hàng nhưng địa chỉ không phải domain chính thức',
      example: 'support@bank-secure.com thay vì support@bank.com',
      icon: <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
    },
    {
      title: 'Yêu cầu cấp bách',
      description: 'Tạo cảm giác khẩn cấp để bạn hành động vội vàng',
      example: 'Tài khoản sẽ bị khóa trong 24 giờ nếu không xác minh',
      icon: <WarningOutlined style={{ color: '#fa8c16' }} />
    },
    {
      title: 'Lỗi chính tả và ngữ pháp',
      description: 'Email chính thức thường không có lỗi chính tả',
      example: 'Tài khoản của bạn đã bị tạm khóa',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'Liên kết đáng ngờ',
      description: 'URL rút gọn hoặc domain không quen thuộc',
      example: 'bit.ly/verify-account hoặc secure-bank.xyz',
      icon: <SecurityScanOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: 'Yêu cầu thông tin nhạy cảm',
      description: 'Yêu cầu cung cấp mật khẩu, số thẻ tín dụng',
      example: 'Vui lòng cập nhật thông tin tài khoản',
      icon: <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
    }
  ];

  const realExamples = [
    {
      title: 'Email giả mạo ngân hàng',
      content: `Chủ đề: Tài khoản của bạn đã bị tạm khóa

Kính gửi quý khách,

Chúng tôi nhận thấy hoạt động bất thường trên tài khoản của bạn. 
Để bảo vệ tài khoản, vui lòng xác minh thông tin tại đây: bit.ly/verify-bank

Nếu không xác minh trong 24 giờ, tài khoản sẽ bị khóa vĩnh viễn.

Trân trọng,
Đội ngũ Bảo mật Ngân hàng`,
      analysis: [
        'Địa chỉ email không phải domain chính thức của ngân hàng',
        'Sử dụng link rút gọn bit.ly',
        'Tạo cảm giác cấp bách',
        'Yêu cầu thông tin nhạy cảm'
      ]
    },
    {
      title: 'Email trúng thưởng giả',
      content: `Chủ đề: Chúc mừng! Bạn đã trúng iPhone 15

Xin chào,

Chúc mừng! Bạn đã được chọn nhận iPhone 15 miễn phí từ Apple.

Để nhận quà, vui lòng:
1. Click vào link: tinyurl.com/claim-iphone
2. Điền thông tin cá nhân
3. Thanh toán phí vận chuyển $5

Ưu đãi chỉ có hiệu lực trong 2 giờ tới!

Apple Store`,
      analysis: [
        'Ưu đãi quá tốt để tin được',
        'Yêu cầu thanh toán phí vận chuyển',
        'Tạo cảm giác cấp bách',
        'Link rút gọn đáng ngờ'
      ]
    }
  ];

  const preventionTips = [
    {
      title: 'Kiểm tra địa chỉ người gửi',
      description: 'Luôn xem kỹ địa chỉ email người gửi. Email chính thức thường có domain chính thức của tổ chức.',
      action: 'Hover chuột qua tên người gửi để xem địa chỉ email đầy đủ'
    },
    {
      title: 'Không nhấp vào link đáng ngờ',
      description: 'Di chuột qua link để xem URL thực tế trước khi nhấp. Không nhấp vào link rút gọn từ người lạ.',
      action: 'Sử dụng công cụ mở rộng URL để kiểm tra link'
    },
    {
      title: 'Không chia sẻ thông tin nhạy cảm',
      description: 'Tổ chức chính thức không bao giờ yêu cầu mật khẩu, số thẻ tín dụng qua email.',
      action: 'Liên hệ trực tiếp với tổ chức qua số điện thoại chính thức'
    },
    {
      title: 'Cài đặt phần mềm bảo mật',
      description: 'Sử dụng phần mềm diệt virus và bảo mật email để phát hiện phishing.',
      action: 'Cập nhật phần mềm bảo mật thường xuyên'
    },
    {
      title: 'Báo cáo email đáng ngờ',
      description: 'Báo cáo email phishing cho tổ chức bị giả mạo và cơ quan chức năng.',
      action: 'Sử dụng tính năng "Báo cáo spam/phishing" trong email client'
    }
  ];

  const quizQuestions = [
    {
      question: 'Email nào sau đây có khả năng cao là phishing?',
      options: [
        'Email từ support@paypal.com yêu cầu xác minh tài khoản',
        'Email từ paypal-secure.com yêu cầu cập nhật mật khẩu',
        'Email từ paypal.com thông báo giao dịch mới',
        'Email từ security@paypal.com cảnh báo bảo mật'
      ],
      correct: 1,
      explanation: 'Domain "paypal-secure.com" không phải domain chính thức của PayPal'
    },
    {
      question: 'Dấu hiệu nào KHÔNG phải là đặc điểm của email phishing?',
      options: [
        'Yêu cầu cấp bách và đe dọa',
        'Lỗi chính tả và ngữ pháp',
        'Địa chỉ email chính thức của tổ chức',
        'Liên kết rút gọn hoặc lạ'
      ],
      correct: 2,
      explanation: 'Email phishing thường sử dụng địa chỉ giả mạo, không phải địa chỉ chính thức'
    },
    {
      question: 'Bạn nên làm gì khi nhận được email đáng ngờ?',
      options: [
        'Nhấp vào link để kiểm tra',
        'Trả lời email để xác minh',
        'Xóa email và báo cáo spam',
        'Chuyển tiếp cho bạn bè để hỏi ý kiến'
      ],
      correct: 2,
      explanation: 'Cách an toàn nhất là xóa email và báo cáo spam'
    }
  ];

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card bordered={false}>
            <Title level={3}>Email Phishing là gì?</Title>
            <Paragraph>
              Email phishing là một hình thức lừa đảo trực tuyến, trong đó kẻ tấn công 
              gửi email giả mạo để đánh cắp thông tin cá nhân, mật khẩu, hoặc tiền bạc của nạn nhân.
            </Paragraph>
            
            <Alert
              message="Thống kê đáng báo động"
              description="Theo báo cáo, 91% các cuộc tấn công mạng bắt đầu bằng email phishing, 
              gây thiệt hại hàng tỷ USD mỗi năm cho các tổ chức và cá nhân."
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Mục tiêu chính">
                  <List
                    size="small"
                    dataSource={[
                      'Thông tin đăng nhập tài khoản',
                      'Số thẻ tín dụng',
                      'Thông tin cá nhân',
                      'Dữ liệu công ty'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Phương thức">
                  <List
                    size="small"
                    dataSource={[
                      'Giả mạo tổ chức uy tín',
                      'Tạo cảm giác cấp bách',
                      'Sử dụng link độc hại',
                      'Yêu cầu thông tin nhạy cảm'
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
                      'Truy cập trái phép',
                      'Lây nhiễm malware'
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
            <Title level={3}>Dấu hiệu nhận biết Email Phishing</Title>
            <Paragraph>
              Học cách nhận biết các dấu hiệu phổ biến của email phishing để bảo vệ bản thân.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={phishingSigns}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                      description={
                        <div>
                          <Paragraph>{item.description}</Paragraph>
                          <Text type="secondary">Ví dụ: {item.example}</Text>
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
            <Title level={3}>Ví dụ Email Phishing Thực tế</Title>
            <Paragraph>
              Xem các ví dụ email phishing thực tế và phân tích các dấu hiệu đáng ngờ.
            </Paragraph>
            
            <Collapse defaultActiveKey={['0']}>
              {realExamples.map((example, index) => (
                <Panel 
                  header={example.title} 
                  key={index}
                  extra={<Tag color="red">VÍ DỤ PHISHING</Tag>}
                >
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 16, 
                    borderRadius: 8,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-line',
                    marginBottom: 16
                  }}>
                    {example.content}
                  </div>
                  
                  <Title level={5}>Phân tích dấu hiệu đáng ngờ:</Title>
                  <List
                    size="small"
                    dataSource={example.analysis}
                    renderItem={item => (
                      <List.Item>
                        <ExclamationCircleOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                        {item}
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          </Card>
        );

      case 3:
        return (
          <Card bordered={false}>
            <Title level={3}>Cách phòng tránh Email Phishing</Title>
            <Paragraph>
              Áp dụng các biện pháp sau để bảo vệ bản thân khỏi email phishing.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={preventionTips}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      title={item.title}
                      description={
                        <div>
                          <Paragraph>{item.description}</Paragraph>
                          <Text type="secondary">Hành động: {item.action}</Text>
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
            <Title level={3}>Kiểm tra kiến thức</Title>
            <Paragraph>
              Hãy trả lời các câu hỏi sau để kiểm tra hiểu biết về email phishing.
            </Paragraph>
            
            {!showResults ? (
              <div>
                {quizQuestions.map((question, qIndex) => (
                  <Card key={qIndex} style={{ marginBottom: 16 }}>
                    <Title level={5}>Câu {qIndex + 1}: {question.question}</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {question.options.map((option, oIndex) => (
                        <Button
                          key={oIndex}
                          type={quizAnswers[qIndex] === oIndex ? 'primary' : 'default'}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          style={{ textAlign: 'left', height: 'auto', padding: '12px 16px' }}
                          block
                        >
                          {String.fromCharCode(65 + oIndex)}. {option}
                        </Button>
                      ))}
                    </Space>
                  </Card>
                ))}
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                >
                  Xem kết quả
                </Button>
              </div>
            ) : (
              <div>
                <Card style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Title level={2}>Kết quả của bạn</Title>
                  <Progress 
                    type="circle" 
                    percent={calculateScore()} 
                    format={percent => `${percent}%`}
                    size={120}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Text>
                      {calculateScore() >= 80 ? 
                        'Xuất sắc! Bạn đã hiểu rõ về email phishing.' :
                        calculateScore() >= 60 ?
                        'Tốt! Hãy ôn lại một số điểm chưa nắm vững.' :
                        'Cần cải thiện! Hãy đọc lại bài học và thử lại.'
                      }
                    </Text>
                  </div>
                </Card>
                
                {quizQuestions.map((question, qIndex) => (
                  <Card key={qIndex} style={{ marginBottom: 16 }}>
                    <Title level={5}>Câu {qIndex + 1}: {question.question}</Title>
                    <div style={{ marginBottom: 8 }}>
                      {question.options.map((option, oIndex) => (
                        <div 
                          key={oIndex}
                          style={{
                            padding: '8px 12px',
                            marginBottom: 4,
                            borderRadius: 4,
                            backgroundColor: 
                              oIndex === question.correct ? '#f6ffed' :
                              oIndex === quizAnswers[qIndex] && oIndex !== question.correct ? '#fff2f0' :
                              '#f5f5f5',
                            border: 
                              oIndex === question.correct ? '1px solid #b7eb8f' :
                              oIndex === quizAnswers[qIndex] && oIndex !== question.correct ? '1px solid #ffccc7' :
                              '1px solid #d9d9d9'
                          }}
                        >
                          {String.fromCharCode(65 + oIndex)}. {option}
                          {oIndex === question.correct && <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />}
                          {oIndex === quizAnswers[qIndex] && oIndex !== question.correct && <ExclamationCircleOutlined style={{ color: '#f5222d', marginLeft: 8 }} />}
                        </div>
                      ))}
                    </div>
                    <Alert
                      message="Giải thích"
                      description={question.explanation}
                      type="info"
                      showIcon
                    />
                  </Card>
                ))}
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => {
                    setShowResults(false);
                    setQuizAnswers({});
                  }}
                >
                  Làm lại
                </Button>
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
            <BookOutlined /> Nhận biết Email Phishing
          </Title>
          <Paragraph style={{ fontSize: 16, marginTop: 8 }}>
            Học cách nhận biết và tránh các email lừa đảo phishing
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

export default PhishingLessonPage; 