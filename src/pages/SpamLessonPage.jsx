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
  Radio,
  Form
} from 'antd';
import { 
  SafetyOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

const SpamLessonPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      title: 'Email Spam là gì?',
      content: 'Hiểu về email spam và tác hại của chúng',
    },
    {
      title: 'Phân loại Spam',
      content: 'Nhận biết các loại email spam khác nhau',
    },
    {
      title: 'Dấu hiệu nhận biết',
      content: 'Học cách nhận biết email spam',
    },
    {
      title: 'Cách xử lý',
      content: 'Học các cách xử lý email spam hiệu quả',
    },
    {
      title: 'Kiểm tra kiến thức',
      content: 'Làm bài kiểm tra để củng cố kiến thức',
    },
  ];

  const spamTypes = [
    {
      title: 'Spam Marketing',
      description: 'Email quảng cáo không mong muốn từ các công ty marketing.',
      characteristics: [
        'Quảng cáo sản phẩm/dịch vụ',
        'Ưu đãi giảm giá',
        'Newsletter không đăng ký',
        'Email từ đối tác thứ ba'
      ],
      risk: 'Thấp',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'Spam Lừa đảo',
      description: 'Email giả mạo để lừa đảo thông tin hoặc tiền bạc.',
      characteristics: [
        'Giả mạo tổ chức uy tín',
        'Yêu cầu thông tin nhạy cảm',
        'Ưu đãi quá hấp dẫn',
        'Tạo cảm giác cấp bách'
      ],
      risk: 'Cao',
      icon: <WarningOutlined style={{ color: '#f5222d' }} />
    },
    {
      title: 'Spam Malware',
      description: 'Email chứa virus, trojan hoặc các phần mềm độc hại.',
      characteristics: [
        'File đính kèm đáng ngờ',
        'Link tải xuống lạ',
        'Yêu cầu cài đặt phần mềm',
        'Thông báo bảo mật giả'
      ],
      risk: 'Rất cao',
      icon: <StopOutlined style={{ color: '#fa8c16' }} />
    },
    {
      title: 'Spam Chain Mail',
      description: 'Email yêu cầu chuyển tiếp cho nhiều người.',
      characteristics: [
        'Yêu cầu chuyển tiếp',
        'Đe dọa nếu không chuyển tiếp',
        'Hứa hẹn may mắn',
        'Thông tin giả mạo'
      ],
      risk: 'Trung bình',
      icon: <SafetyOutlined style={{ color: '#52c41a' }} />
    }
  ];

  const spamSigns = [
    {
      title: 'Địa chỉ người gửi đáng ngờ',
      description: 'Email từ địa chỉ không quen thuộc hoặc có tên lạ.',
      examples: [
        'support@bank-secure.com',
        'noreply@amazon-payment.com',
        'admin@microsoft-update.net'
      ],
      icon: <WarningOutlined style={{ color: '#f5222d' }} />
    },
    {
      title: 'Tiêu đề email gây chú ý',
      description: 'Tiêu đề tạo cảm giác cấp bách hoặc quá hấp dẫn.',
      examples: [
        'Tài khoản sẽ bị khóa trong 24h',
        'Bạn đã trúng iPhone 15 miễn phí',
        'Cập nhật bảo mật khẩn cấp',
        'Cơ hội kiếm tiền nhanh chóng'
      ],
      icon: <InfoCircleOutlined style={{ color: '#fa8c16' }} />
    },
    {
      title: 'Nội dung có lỗi chính tả',
      description: 'Email có nhiều lỗi chính tả, ngữ pháp hoặc câu từ lạ.',
      examples: [
        'Tài khoản của bạn đã bị tạm khóa',
        'Vui lòng cập nhật thông tin ngay lập tức',
        'Đây là cơ hội cuối cùng'
      ],
      icon: <BookOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'Yêu cầu hành động cấp bách',
      description: 'Tạo cảm giác khẩn cấp để bạn hành động vội vàng.',
      examples: [
        'Phải xác minh trong 2 giờ',
        'Tài khoản sẽ bị xóa vĩnh viễn',
        'Ưu đãi chỉ có hôm nay'
      ],
      icon: <StopOutlined style={{ color: '#f5222d' }} />
    },
    {
      title: 'Liên kết hoặc file đáng ngờ',
      description: 'Chứa link rút gọn, file đính kèm lạ hoặc yêu cầu tải xuống.',
      examples: [
        'bit.ly/verify-account',
        'tinyurl.com/claim-prize',
        'File .exe đính kèm',
        'Link tải phần mềm bảo mật'
      ],
      icon: <SafetyOutlined style={{ color: '#fa8c16' }} />
    }
  ];

  const handlingMethods = [
    {
      title: 'Không mở email spam',
      description: 'Tuyệt đối không mở email từ nguồn không tin cậy.',
      actions: [
        'Xóa email ngay lập tức',
        'Không nhấp vào bất kỳ link nào',
        'Không tải xuống file đính kèm',
        'Không trả lời email'
      ],
      icon: <DeleteOutlined />
    },
    {
      title: 'Báo cáo spam',
      description: 'Báo cáo email spam cho nhà cung cấp email.',
      actions: [
        'Sử dụng nút "Báo cáo spam"',
        'Chuyển tiếp cho abuse@domain.com',
        'Báo cáo cho cơ quan chức năng',
        'Chặn địa chỉ email gửi spam'
      ],
      icon: <FilterOutlined />
    },
    {
      title: 'Cập nhật bộ lọc spam',
      description: 'Cấu hình bộ lọc spam để tự động chặn.',
      actions: [
        'Bật bộ lọc spam tự động',
        'Thêm địa chỉ vào danh sách đen',
        'Cấu hình quy tắc lọc',
        'Cập nhật phần mềm bảo mật'
      ],
      icon: <SafetyOutlined />
    },
    {
      title: 'Giáo dục người khác',
      description: 'Chia sẻ kiến thức về spam với gia đình và đồng nghiệp.',
      actions: [
        'Hướng dẫn nhận biết spam',
        'Chia sẻ các dấu hiệu đáng ngờ',
        'Cảnh báo về rủi ro',
        'Khuyến khích báo cáo spam'
      ],
      icon: <BookOutlined />
    }
  ];

  const quizQuestions = [
    {
      question: 'Email nào sau đây có khả năng cao là spam?',
      options: [
        'Email từ ngân hàng thông báo giao dịch mới',
        'Email từ "support@paypal-secure.com" yêu cầu xác minh',
        'Email từ công ty bảo hiểm gửi hợp đồng',
        'Email từ trường học thông báo lịch học'
      ],
      correct: 1,
      explanation: 'Domain "paypal-secure.com" không phải domain chính thức của PayPal'
    },
    {
      question: 'Bạn nên làm gì khi nhận được email spam?',
      options: [
        'Mở email để xem nội dung',
        'Nhấp vào link để kiểm tra',
        'Xóa email và báo cáo spam',
        'Trả lời email để yêu cầu dừng gửi'
      ],
      correct: 2,
      explanation: 'Cách an toàn nhất là xóa email và báo cáo spam'
    },
    {
      question: 'Dấu hiệu nào KHÔNG phải đặc điểm của email spam?',
      options: [
        'Tiêu đề tạo cảm giác cấp bách',
        'Lỗi chính tả và ngữ pháp',
        'Địa chỉ email chính thức của tổ chức',
        'Yêu cầu thông tin cá nhân'
      ],
      correct: 2,
      explanation: 'Email spam thường sử dụng địa chỉ giả mạo, không phải địa chỉ chính thức'
    },
    {
      question: 'Loại spam nào nguy hiểm nhất?',
      options: [
        'Spam marketing',
        'Spam lừa đảo',
        'Spam malware',
        'Spam chain mail'
      ],
      correct: 2,
      explanation: 'Spam malware có thể lây nhiễm virus và gây hại cho thiết bị'
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
            <Title level={3}>Email Spam là gì?</Title>
            <Paragraph>
              Email spam là những email không mong muốn được gửi hàng loạt đến nhiều người nhận, 
              thường chứa nội dung quảng cáo, lừa đảo hoặc độc hại.
            </Paragraph>
            
            <Alert
              message="Thống kê về Email Spam"
              description="Theo báo cáo, 45% tổng số email được gửi trên toàn thế giới là spam, 
              tương đương khoảng 14.5 tỷ email spam mỗi ngày."
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Tác hại của Spam">
                  <List
                    size="small"
                    dataSource={[
                      'Lãng phí thời gian',
                      'Tốn băng thông mạng',
                      'Làm chậm hệ thống',
                      'Gây phiền nhiễu'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Rủi ro bảo mật">
                  <List
                    size="small"
                    dataSource={[
                      'Lừa đảo thông tin',
                      'Lây nhiễm malware',
                      'Đánh cắp dữ liệu',
                      'Tấn công mạng'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Chi phí">
                  <List
                    size="small"
                    dataSource={[
                      'Thiệt hại do lừa đảo: $6 tỷ/năm',
                      'Chi phí xử lý spam: $20/người/năm',
                      'Mất năng suất lao động',
                      'Chi phí bảo mật tăng'
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
            <Title level={3}>Phân loại Email Spam</Title>
            <Paragraph>
              Hiểu rõ các loại email spam khác nhau để có cách xử lý phù hợp.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={spamTypes}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={
                        <Space>
                          {item.title}
                          <Tag color={
                            item.risk === 'Rất cao' ? 'red' :
                            item.risk === 'Cao' ? 'orange' :
                            item.risk === 'Trung bình' ? 'blue' : 'green'
                          }>
                            Rủi ro: {item.risk}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph>{item.description}</Paragraph>
                          <Title level={5}>Đặc điểm:</Title>
                          <List
                            size="small"
                            dataSource={item.characteristics}
                            renderItem={char => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Text>• {char}</Text>
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
            <Title level={3}>Dấu hiệu nhận biết Email Spam</Title>
            <Paragraph>
              Học cách nhận biết các dấu hiệu phổ biến của email spam.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={spamSigns}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                      description={
                        <div>
                          <Paragraph>{item.description}</Paragraph>
                          <Title level={5}>Ví dụ:</Title>
                          <List
                            size="small"
                            dataSource={item.examples}
                            renderItem={example => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Text code>{example}</Text>
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
            <Title level={3}>Cách xử lý Email Spam</Title>
            <Paragraph>
              Áp dụng các phương pháp sau để xử lý email spam hiệu quả.
            </Paragraph>
            
            <List
              itemLayout="vertical"
              dataSource={handlingMethods}
              renderItem={(method, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <List.Item.Meta
                      avatar={method.icon}
                      title={method.title}
                      description={
                        <div>
                          <Paragraph>{method.description}</Paragraph>
                          <Title level={5}>Hành động cụ thể:</Title>
                          <List
                            size="small"
                            dataSource={method.actions}
                            renderItem={action => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text>{action}</Text>
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
            <Title level={3}>Kiểm tra kiến thức</Title>
            <Paragraph>
              Hãy trả lời các câu hỏi sau để kiểm tra hiểu biết về email spam.
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
                        'Xuất sắc! Bạn đã hiểu rõ về email spam.' :
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
            <SafetyOutlined /> Xử lý Email Spam
          </Title>
          <Paragraph style={{ fontSize: 16, marginTop: 8 }}>
            Học cách xử lý và ngăn chặn email spam hiệu quả
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

export default SpamLessonPage; 