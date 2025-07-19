import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Modal, 
  Alert, 
  Space, 
  Typography, 
  Spin,
  Row,
  Col 
} from 'antd';
import { 
  MailOutlined, 
  SecurityScanOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { AIcheckService } from '../services/AIcheckService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AICheck = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  // Hàm kiểm tra xem có ít nhất 1 field được nhập
  const hasAtLeastOneField = (values) => {
    return values.title || values.content || values.fromEmail || values.toEmail;
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (values) => {
    // Kiểm tra ít nhất 1 field được nhập
    if (!hasAtLeastOneField(values)) {
      Modal.warning({
        title: 'Thiếu thông tin',
        content: 'Vui lòng nhập ít nhất một trong bốn trường: Tiêu đề, Nội dung, Email người gửi, hoặc Email người nhận.'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Lọc chỉ các field có dữ liệu
      const emailData = {};
      if (values.title) emailData.title = values.title;
      if (values.content) emailData.content = values.content;
      if (values.fromEmail) emailData.fromEmail = values.fromEmail;
      if (values.toEmail) emailData.toEmail = values.toEmail;
      
      const result = await AIcheckService.checkEmail(emailData);
      
      if (result.success) {
        setCheckResult(result.data);
        setResultModal(true);
      } else {
        Modal.error({
          title: 'Lỗi khi kiểm tra',
          content: result.error || 'Có lỗi xảy ra khi gọi AI service'
        });
      }
    } catch {
      Modal.error({
        title: 'Lỗi hệ thống',
        content: 'Không thể thực hiện kiểm tra. Vui lòng thử lại sau.'
      });
    }
    
    setLoading(false);
  };

  // Hàm lấy icon và màu sắc theo mức độ
  const getLevelConfig = (level) => {
    switch (level) {
      case 'AN TOÀN':
        return { 
          icon: <CheckCircleOutlined />, 
          color: 'green', 
          type: 'success',
          bgColor: '#f6ffed'
        };
      case 'NGHI NGỜ':
        return { 
          icon: <ExclamationCircleOutlined />, 
          color: 'orange', 
          type: 'warning',
          bgColor: '#fffbe6'
        };
      case 'SPAM':
        return { 
          icon: <WarningOutlined />, 
          color: 'red', 
          type: 'error',
          bgColor: '#fff2f0'
        };
      case 'GIẢ MẠO':
        return { 
          icon: <CloseCircleOutlined />, 
          color: 'red', 
          type: 'error',
          bgColor: '#fff2f0'
        };
      default:
        return { 
          icon: <ExclamationCircleOutlined />, 
          color: 'blue', 
          type: 'info',
          bgColor: '#f0f8ff'
        };
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SecurityScanOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2}>AI Email Security Check</Title>
          <Text type="secondary">
            Kiểm tra độ an toàn của email với AI + Regex Pattern - Phát hiện lừa đảo, spam và giả mạo
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tiêu đề Email"
                name="title"
              >
                <Input 
                  prefix={<MailOutlined />}
                  placeholder="Nhập tiêu đề email cần kiểm tra (tùy chọn)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email Người Gửi"
                name="fromEmail"
                // rules={[
                //   { type: 'email', message: 'Email không đúng định dạng!' }
                // ]}
              >
                <Input placeholder="nguoigui@example.com (tùy chọn)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email Người Nhận"
                name="toEmail"
                // rules={[
                //   { type: 'email', message: 'Email không đúng định dạng!' }
                // ]}
              >
                <Input placeholder="nguoinhan@example.com (tùy chọn)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Nội dung Email"
            name="content"
          >
            <TextArea
              rows={6}
              placeholder="Dán nội dung email cần kiểm tra vào đây... (tùy chọn)"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<SecurityScanOutlined />}
              style={{ width: '100%', height: '48px' }}
            >
              {loading ? 'Đang kiểm tra...' : 'AI Check Email'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal hiển thị kết quả */}
      <Modal
        title={
          <Space>
            <SecurityScanOutlined />
            Kết quả kiểm tra bảo mật
          </Space>
        }
        open={resultModal}
        onCancel={() => setResultModal(false)}
        footer={[
          <Button key="close" onClick={() => setResultModal(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {checkResult && (
          <div>
            <Alert
              message={
                <Space>
                  {getLevelConfig(checkResult.level).icon}
                  <Text strong style={{ fontSize: '16px' }}>
                    Mức độ: {checkResult.level}
                  </Text>
                </Space>
              }
              description={
                <div>
                  <Text>Độ tin cậy: {checkResult.confidence}%</Text>
                </div>
              }
              type={getLevelConfig(checkResult.level).type}
              style={{ 
                marginBottom: '16px',
                backgroundColor: getLevelConfig(checkResult.level).bgColor
              }}
            />

            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Lý do phân tích:</Title>
              <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                {checkResult.reasons?.map((reason, index) => (
                  <li key={index} style={{ marginBottom: '4px', padding: '4px 0' }}>
                    <Text>• {reason}</Text>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Khuyến nghị:</Title>
              <Alert
                message={checkResult.recommendation}
                type="info"
                showIcon
              />
            </div>

            {/* Hiển thị thông tin pattern analysis nếu có */}
            {checkResult.patternAnalysis && (
              <div>
                <Title level={5}>Phân tích Pattern tự động:</Title>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', fontSize: '12px' }}>
                  <Text strong>Risk Score:</Text> {checkResult.patternAnalysis.confidence}%<br/>
                  {Object.keys(checkResult.patternAnalysis.fieldAnalysis).map(field => {
                    const analysis = checkResult.patternAnalysis.fieldAnalysis[field];
                    return (
                      <div key={field} style={{ marginTop: '4px' }}>
                        <Text code>{field}:</Text> 
                        <span style={{ color: '#52c41a' }}> Safe({analysis.safe})</span>
                        <span style={{ color: '#faad14' }}> Suspicious({analysis.suspicious})</span>
                        <span style={{ color: '#f5222d' }}> Spam({analysis.spam})</span>
                        <span style={{ color: '#ff4d4f' }}> Fake({analysis.fake})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AICheck;
