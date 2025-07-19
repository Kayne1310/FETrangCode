import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.safemailguard.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Mock data for demo purposes
const mockResponses = {
  'scam@example.com': {
    classification: 'phishing',
    riskScore: 95,
    description: 'Email này có dấu hiệu lừa đảo phishing rõ ràng',
    threats: [
      { name: 'Phishing attempt', severity: 'high' },
      { name: 'Suspicious domain', severity: 'high' },
      { name: 'Fake sender', severity: 'medium' }
    ],
    recommendations: [
      'Không nhấp vào các liên kết trong email',
      'Không cung cấp thông tin cá nhân',
      'Báo cáo email này là spam'
    ]
  },
  'safe@gmail.com': {
    classification: 'safe',
    riskScore: 5,
    description: 'Email này an toàn và đáng tin cậy',
    threats: [],
    recommendations: [
      'Email này được đánh giá là an toàn',
      'Bạn có thể tương tác bình thường'
    ]
  },
  'spam@marketing.com': {
    classification: 'spam',
    riskScore: 75,
    description: 'Email có đặc điểm của thư rác',
    threats: [
      { name: 'Bulk email', severity: 'medium' },
      { name: 'Marketing spam', severity: 'low' }
    ],
    recommendations: [
      'Có thể đánh dấu là spam',
      'Cẩn thận với các ưu đãi quá hấp dẫn'
    ]
  }
};

// Email safety check service
export const checkEmailSafety = async (data) => {
  try {
    // For demo, use mock data
    const { type, value } = data;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we have mock data for this value
    if (mockResponses[value.toLowerCase()]) {
      return mockResponses[value.toLowerCase()];
    }
    
    // Default response based on type
    let defaultResponse;
    
    if (type === 'email') {
      if (value.includes('test') || value.includes('demo')) {
        defaultResponse = {
          classification: 'suspicious',
          riskScore: 45,
          description: 'Email cần được xem xét thêm',
          threats: [
            { name: 'Test email pattern', severity: 'low' }
          ],
          recommendations: [
            'Kiểm tra kỹ người gửi',
            'Xác minh thông tin trước khi tương tác'
          ]
        };
      } else {
        defaultResponse = {
          classification: 'safe',
          riskScore: 15,
          description: 'Email có vẻ an toàn',
          threats: [],
          recommendations: [
            'Email được đánh giá tương đối an toàn',
            'Vẫn nên cẩn thận với các liên kết lạ'
          ]
        };
      }
    } else if (type === 'link') {
      if (value.includes('bit.ly') || value.includes('tinyurl') || value.includes('suspicious')) {
        defaultResponse = {
          classification: 'suspicious',
          riskScore: 60,
          description: 'Link rút gọn có thể chứa rủi ro',
          threats: [
            { name: 'Shortened URL', severity: 'medium' },
            { name: 'Hidden destination', severity: 'medium' }
          ],
          recommendations: [
            'Không nhấp vào link này',
            'Sử dụng công cụ mở rộng URL trước',
            'Xác minh nguồn gốc link'
          ]
        };
      } else {
        defaultResponse = {
          classification: 'safe',
          riskScore: 20,
          description: 'Link có vẻ an toàn',
          threats: [],
          recommendations: [
            'Link được đánh giá tương đối an toàn',
            'Vẫn nên kiểm tra nội dung trước khi tải xuống'
          ]
        };
      }
    } else if (type === 'phone') {
      if (value.startsWith('0000') || value.includes('1234')) {
        defaultResponse = {
          classification: 'suspicious',
          riskScore: 70,
          description: 'Số điện thoại có pattern đáng ngờ',
          threats: [
            { name: 'Suspicious pattern', severity: 'medium' },
            { name: 'Possible fake number', severity: 'high' }
          ],
          recommendations: [
            'Không trả lời cuộc gọi từ số này',
            'Kiểm tra danh tính người gọi',
            'Báo cáo nếu có dấu hiệu lừa đảo'
          ]
        };
      } else {
        defaultResponse = {
          classification: 'safe',
          riskScore: 25,
          description: 'Số điện thoại có vẻ bình thường',
          threats: [],
          recommendations: [
            'Số điện thoại có format hợp lệ',
            'Vẫn nên cẩn thận với cuộc gọi không mong muốn'
          ]
        };
      }
    } else if (type === 'content') {
      const suspiciousKeywords = ['urgent', 'click now', 'limited time', 'act now', 'congratulations', 'winner'];
      const hasSuspiciousContent = suspiciousKeywords.some(keyword => 
        value.toLowerCase().includes(keyword)
      );
      
      if (hasSuspiciousContent) {
        defaultResponse = {
          classification: 'spam',
          riskScore: 80,
          description: 'Nội dung có đặc điểm của email lừa đảo',
          threats: [
            { name: 'Urgency tactics', severity: 'high' },
            { name: 'Suspicious keywords', severity: 'medium' }
          ],
          recommendations: [
            'Không làm theo yêu cầu trong email',
            'Xóa email này',
            'Không chia sẻ thông tin cá nhân'
          ]
        };
      } else {
        defaultResponse = {
          classification: 'safe',
          riskScore: 10,
          description: 'Nội dung email bình thường',
          threats: [],
          recommendations: [
            'Nội dung email có vẻ an toàn',
            'Vẫn nên cẩn thận với các yêu cầu cung cấp thông tin'
          ]
        };
      }
    }
    
    return defaultResponse;
    
    // Real API call would be:
    // const response = await apiClient.post('/check', data);
    // return response;
    
  } catch (error) {
    console.error('Error in checkEmailSafety:', error);
    throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
  }
};

// Get email statistics
export const getEmailStats = async () => {
  try {
    // Mock statistics data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalChecked: 1234567,
      threatsBlocked: 89234,
      safeEmails: 1145333,
      todayChecked: 5678,
      phishingDetected: 234,
      spamBlocked: 1456
    };
    
    // Real API call:
    // const response = await apiClient.get('/stats');
    // return response;
    
  } catch (error) {
    console.error('Error in getEmailStats:', error);
    throw new Error('Không thể tải thống kê. Vui lòng thử lại sau.');
  }
};

// Get education content
export const getEducationContent = async () => {
  try {
    // Mock education content
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 1,
        title: 'Nhận biết Email Phishing',
        description: 'Học cách nhận biết và tránh các email lừa đảo phishing',
        content: 'Nội dung chi tiết về cách nhận biết phishing...',
        category: 'phishing',
        readTime: 5
      },
      {
        id: 2,
        title: 'Bảo mật Thông tin Cá nhân',
        description: 'Cách bảo vệ thông tin cá nhân khi sử dụng email',
        content: 'Nội dung về bảo mật thông tin...',
        category: 'security',
        readTime: 7
      },
      {
        id: 3,
        title: 'Xử lý Email Spam',
        description: 'Cách xử lý và ngăn chặn email spam hiệu quả',
        content: 'Hướng dẫn xử lý spam...',
        category: 'spam',
        readTime: 4
      }
    ];
    
    // Real API call:
    // const response = await apiClient.get('/education');
    // return response;
    
  } catch (error) {
    console.error('Error in getEducationContent:', error);
    throw new Error('Không thể tải nội dung giáo dục. Vui lòng thử lại sau.');
  }
};

export default {
  checkEmailSafety,
  getEmailStats,
  getEducationContent
}; 