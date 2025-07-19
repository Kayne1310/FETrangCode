import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Select, Tag, Space, 
  List, Avatar, Divider, Breadcrumb, Pagination, Affix, Anchor, Drawer
} from 'antd';
import { 
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  LikeOutlined,
  ShareAltOutlined,
  BookOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  BulbOutlined,
  HomeOutlined,
  TagOutlined,
  UpOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Link } = Anchor;

const BlogPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isVerySmall, setIsVerySmall] = useState(window.innerWidth <= 480);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = [
    { value: 'all', label: 'Tất cả', count: 30 },
    { value: 'phishing', label: 'Phishing', count: 12 },
    { value: 'spam', label: 'Spam', count: 8 },
    { value: 'security', label: 'Bảo mật', count: 7 },
    { value: 'tips', label: 'Mẹo hay', count: 3 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Dấu hiệu Nhận biết Email Phishing không thể bỏ qua',
      excerpt: 'Tìm hiểu các dấu hiệu quan trọng giúp bạn nhận biết và tránh xa các email lừa đảo phishing nguy hiểm.',
      content: `
        <h2>Email Phishing là gì?</h2>
        <p>Email phishing là một hình thức tấn công mạng trong đó kẻ lừa đảo giả mạo các tổ chức đáng tin cậy để đánh cắp thông tin cá nhân như mật khẩu, số tài khoản ngân hàng, hoặc thông tin thẻ tín dụng.</p>
        
        <h2>10 Dấu hiệu cần chú ý:</h2>
        <h3>1. Địa chỉ email người gửi đáng ngờ</h3>
        <p>Kiểm tra kỹ địa chỉ email người gửi. Các email phishing thường sử dụng tên miền giống nhưng khác một vài ký tự với tổ chức thật.</p>
        
        <h3>2. Lỗi chính tả và ngữ pháp</h3>
        <p>Các email phishing thường chứa nhiều lỗi chính tả, ngữ pháp hoặc sử dụng ngôn ngữ không chuyên nghiệp.</p>
        
        <h3>3. Yêu cầu cấp bách</h3>
        <p>Tạo cảm giác gấp gáp, đe dọa đóng tài khoản hoặc yêu cầu hành động ngay lập tức.</p>
        
        <h3>4. Yêu cầu thông tin nhạy cảm</h3>
        <p>Các tổ chức uy tín sẽ không bao giờ yêu cầu mật khẩu hay thông tin thẻ tín dụng qua email.</p>
        
        <h3>5. Liên kết đáng ngờ</h3>
        <p>Di chuột qua liên kết để xem URL thực tế. Nếu không khớp với tên miền chính thức thì không nhấp vào.</p>
        
        <p><strong>Lời khuyên:</strong> Khi nghi ngờ, hãy liên hệ trực tiếp với tổ chức qua kênh chính thức để xác minh.</p>
      `,
      category: 'phishing',
      author: 'Nguyễn An',
      publishDate: '2025-01-18',
      readTime: 5,
      views: 1248,
      likes: 156,
      image: '/images/Phishing-Email-la-gi.jpg',
      tags: ['phishing', 'bảo mật', 'email', 'lừa đảo']
    },
    {
      id: 2,
      title: 'Cách Thiết lập Email Filter để Chặn Spam Hiệu quả',
      excerpt: 'Hướng dẫn chi tiết cách thiết lập bộ lọc email để tự động chặn spam và bảo vệ hộp thư của bạn.',
      content: `
        <h2>Tại sao cần thiết lập Email Filter?</h2>
        <p>Email filter giúp tự động phân loại, chuyển hướng hoặc chặn các email không mong muốn, giúp bạn tiết kiệm thời gian và bảo vệ khỏi spam.</p>
        
        <h2>Các bước thiết lập cơ bản:</h2>
        <h3>1. Truy cập cài đặt email</h3>
        <p>Đăng nhập vào email của bạn và tìm mục "Filters", "Rules" hoặc "Cài đặt".</p>
        
        <h3>2. Tạo rule mới</h3>
        <p>Chọn "Create new rule" hoặc "Tạo quy tắc mới".</p>
        
        <h3>3. Thiết lập điều kiện</h3>
        <ul>
        <li>Từ khóa trong tiêu đề: "URGENT", "FREE", "WINNER"</li>
        <li>Địa chỉ người gửi chứa: noreply@, marketing@</li>
        <li>Nội dung chứa: "Click now", "Limited time"</li>
        </ul>
        
        <h3>4. Thiết lập hành động</h3>
        <ul>
        <li>Chuyển vào thư mục Spam</li>
        <li>Xóa tự động</li>
        <li>Đánh dấu là đã đọc</li>
        <li>Chuyển tiếp đến email khác</li>
        </ul>
        
        <p><strong>Lưu ý:</strong> Kiểm tra thường xuyên thư mục spam để đảm bảo không bỏ sót email quan trọng.</p>
      `,
      category: 'spam',
      author: 'Trần Minh',
      publishDate: '2025-01-17',
      readTime: 7,
      views: 892,
      likes: 98,
      image: '/images/Phishing-email-concept-image-shows-burglar-using-a-fishing-rod..jpeg',
      tags: ['spam', 'email filter', 'bảo mật']
    },
    {
      id: 3,
      title: 'Bảo mật Email doanh nghiệp: Những điều cần biết',
      excerpt: 'Tổng quan về các biện pháp bảo mật email quan trọng mà mọi doanh nghiệp cần áp dụng.',
      content: `
        <h2>Tầm quan trọng của Bảo mật Email Doanh nghiệp</h2>
        <p>Email là kênh giao tiếp chính của doanh nghiệp, chứa nhiều thông tin nhạy cảm. Việc bảo mật email không chỉ bảo vệ thông tin mà còn duy trì uy tín công ty.</p>
        
        <h2>Các biện pháp bảo mật cần thiết:</h2>
        
        <h3>1. Xác thực hai yếu tố (2FA)</h3>
        <p>Bật 2FA cho tất cả tài khoản email quan trọng để tăng cường bảo mật.</p>
        
        <h3>2. Mã hóa email</h3>
        <p>Sử dụng các giao thức mã hóa như TLS/SSL để bảo vệ email khi truyền tải.</p>
        
        <h3>3. Chính sách mật khẩu mạnh</h3>
        <p>Yêu cầu nhân viên sử dụng mật khẩu phức tạp và thay đổi định kỳ.</p>
        
        <h3>4. Đào tạo nhân viên</h3>
        <p>Tổ chức khóa đào tạo về nhận biết và phòng tránh các mối đe dọa email.</p>
        
        <h3>5. Sử dụng Email Security Gateway</h3>
        <p>Triển khai hệ thống lọc email tiên tiến để chặn spam, phishing và malware.</p>
        
        <h3>6. Backup định kỳ</h3>
        <p>Sao lưu email quan trọng để tránh mất dữ liệu.</p>
        
        <p><strong>Kết luận:</strong> Bảo mật email là một quá trình liên tục, cần sự phối hợp của cả công nghệ và con người.</p>
      `,
      category: 'security',
      author: 'Lê Hương',
      publishDate: '2025-01-16',
      readTime: 8,
      views: 1456,
      likes: 203,
      image: '/images/email-gia-mao-la-gi.png',
      tags: ['doanh nghiệp', 'bảo mật', '2FA', 'mã hóa']
    },
    {
      id: 4,
      title: '5 Mẹo đơn giản để Bảo vệ Email cá nhân',
      excerpt: 'Những mẹo đơn giản nhưng hiệu quả giúp bạn bảo vệ email cá nhân khỏi các mối đe dọa.',
      content: `
        <h2>Bảo vệ email cá nhân - Không khó như bạn nghĩ!</h2>
        <p>Với một vài bước đơn giản, bạn có thể tăng cường đáng kể độ an toàn cho email cá nhân của mình.</p>
        
        <h2>5 Mẹo hiệu quả:</h2>
        
        <h3>1. Sử dụng mật khẩu mạnh và unique</h3>
        <p>Mỗi tài khoản email nên có một mật khẩu riêng, phức tạp với ít nhất 12 ký tự.</p>
        
        <h3>2. Bật xác thực hai yếu tố</h3>
        <p>Sử dụng Google Authenticator hoặc SMS để tăng thêm lớp bảo mật.</p>
        
        <h3>3. Cẩn thận với Wi-Fi công cộng</h3>
        <p>Tránh truy cập email qua Wi-Fi công cộng. Nếu bắt buộc, hãy sử dụng VPN.</p>
        
        <h3>4. Kiểm tra hoạt động tài khoản thường xuyên</h3>
        <p>Xem lại lịch sử đăng nhập để phát hiện hoạt động bất thường.</p>
        
        <h3>5. Cập nhật phần mềm thường xuyên</h3>
        <p>Giữ cho email client và trình duyệt luôn được cập nhật phiên bản mới nhất.</p>
        
        <p><strong>Bonus tip:</strong> Sử dụng email alias để đăng ký các dịch vụ không quan trọng.</p>
      `,
      category: 'tips',
      author: 'Phạm Đức',
      publishDate: '2025-01-15',
      readTime: 4,
      views: 734,
      likes: 89,
      image: '/images/cach-nhan-dang-email-lua-dao-1.jpg',
      tags: ['mẹo hay', 'cá nhân', 'mật khẩu', 'bảo mật']
    },
    {
      id: 5,
      title: 'Social Engineering qua Email: Cách thức và Phòng tránh',
      excerpt: 'Tìm hiểu về kỹ thuật social engineering qua email và cách bảo vệ bản thân khỏi những cuộc tấn công tinh vi này.',
      content: `
        <h2>Social Engineering là gì?</h2>
        <p>Social Engineering (kỹ thuật xã hội) là phương pháp tấn công dựa vào thao túng tâm lý con người thay vì khai thác lỗ hổng kỹ thuật.</p>
        
        <h2>Các kỹ thuật phổ biến:</h2>
        
        <h3>1. Pretexting (Giả danh)</h3>
        <p>Giả mạo danh tính người có thẩm quyền như sếp, IT support, ngân hàng để yêu cầu thông tin.</p>
        
        <h3>2. Baiting (Mồi câu)</h3>
        <p>Đưa ra lời hứa hấp dẫn như phần thưởng, quà tặng để dụ người dùng thực hiện hành động.</p>
        
        <h3>3. Urgency (Tạo cảm giác cấp bách)</h3>
        <p>Sử dụng từ ngữ như "URGENT", "NGAY LẬP TỨC" để làm người nhận hoảng sợ và hành động vội vã.</p>
        
        <h3>4. Authority (Lợi dụng quyền lực)</h3>
        <p>Giả mạo email từ cấp trên, chính phủ, hoặc tổ chức có uy tín.</p>
        
        <h2>Cách phòng tránh:</h2>
        <ul>
        <li><strong>Xác minh nguồn:</strong> Luôn xác nhận qua kênh chính thức</li>
        <li><strong>Đừng vội vàng:</strong> Dành thời gian suy nghĩ trước khi hành động</li>
        <li><strong>Giữ bí mật thông tin:</strong> Không chia sẻ thông tin nhạy cảm qua email</li>
        <li><strong>Đào tạo nhận thức:</strong> Cập nhật kiến thức về các kỹ thuật mới</li>
        </ul>
        
        <p><strong>Nhớ rằng:</strong> Kẻ tấn công luôn khai thác tâm lý con người. Hãy luôn tỉnh táo và thận trọng!</p>
      `,
      category: 'security',
      author: 'Võ Hải',
      publishDate: '2025-01-14',
      readTime: 6,
      views: 1023,
      likes: 142,
      image: '/images/1750910208_phong-tranh-pishing.png',
      tags: ['social engineering', 'tâm lý', 'phòng tránh']
    },
    {
      id: 6,
      title: 'Phishing 2024: Xu hướng và Phương pháp Tấn công Mới',
      excerpt: 'Cập nhật những xu hướng phishing mới nhất trong năm 2024 và cách phòng tránh hiệu quả.',
      content: `
        <h2>Phishing trong năm 2024</h2>
        <p>Năm 2024 chứng kiến sự gia tăng đáng kể các cuộc tấn công phishing với nhiều kỹ thuật tinh vi và khó phát hiện hơn.</p>
        
        <h2>Các xu hướng mới:</h2>
        
        <h3>1. AI-powered Phishing</h3>
        <p>Sử dụng trí tuệ nhân tạo để tạo ra các email phishing có tính cá nhân hóa cao và khó phát hiện.</p>
        
        <h3>2. Deepfake trong Email</h3>
        <p>Sử dụng công nghệ deepfake để tạo ra hình ảnh, âm thanh giả mạo trong email.</p>
        
        <h3>3. Multi-channel Phishing</h3>
        <p>Kết hợp email với SMS, social media và các kênh khác để tăng tính thuyết phục.</p>
        
        <h3>4. Cloud-based Phishing</h3>
        <p>Lợi dụng các dịch vụ cloud hợp pháp để host các trang phishing.</p>
        
        <h2>Cách phòng tránh:</h2>
        <ul>
        <li>Cập nhật kiến thức về các kỹ thuật mới</li>
        <li>Sử dụng các công cụ anti-phishing tiên tiến</li>
        <li>Đào tạo nhận thức bảo mật thường xuyên</li>
        <li>Xác minh đa kênh trước khi hành động</li>
        </ul>
        
        <p><strong>Kết luận:</strong> Phishing ngày càng tinh vi, cần sự cảnh giác cao và cập nhật kiến thức liên tục.</p>
      `,
      category: 'phishing',
      author: 'Nguyễn Minh',
      publishDate: '2025-01-13',
      readTime: 6,
      views: 1567,
      likes: 234,
      image: '/images/Phishing.IS_.2024-03-26-1.png',
      tags: ['phishing', '2024', 'AI', 'xu hướng']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phishing': return <ExclamationCircleOutlined />;
      case 'spam': return <FireOutlined />;
      case 'security': return <SafetyOutlined />;
      case 'tips': return <BulbOutlined />;
      default: return <BookOutlined />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'phishing': return 'red';
      case 'spam': return 'orange';
      case 'security': return 'green';
      case 'tips': return 'blue';
      default: return 'default';
    }
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    // Scroll to top khi mở blog post detail
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    // Scroll to top khi quay lại danh sách
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPost]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsVerySmall(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (selectedPost) {
    return (
      <div className="blog-page">
        <div className="container">
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item href="#" onClick={handleBackToList}>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#" onClick={handleBackToList}>
              <BookOutlined />
              Blog
            </Breadcrumb.Item>
            <Breadcrumb.Item>{selectedPost.title}</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Card className="blog-post-detail" bordered={false}>
                <div className="post-header">
                  <Title level={1} style={{ marginBottom: 16 }}>
                    {selectedPost.title}
                  </Title>
                  
                  <Space size="middle" style={{ marginBottom: 24 }}>
                    <Space>
                      <UserOutlined />
                      <Text>{selectedPost.author}</Text>
                    </Space>
                    <Space>
                      <CalendarOutlined />
                      <Text>{new Date(selectedPost.publishDate).toLocaleDateString('vi-VN')}</Text>
                    </Space>
                    <Space>
                      <EyeOutlined />
                      <Text>{selectedPost.views} lượt xem</Text>
                    </Space>
                    <Tag 
                      color={getCategoryColor(selectedPost.category)}
                      icon={getCategoryIcon(selectedPost.category)}
                    >
                      {selectedPost.category}
                    </Tag>
                  </Space>
                  
                  <div className="post-image">
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title}
                      style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </div>
                </div>

                <Divider />

                <div 
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  style={{ 
                    fontSize: '16px',
                    lineHeight: '1.8',
                    marginBottom: 32
                  }}
                />

                <Divider />

                <div className="post-footer">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space wrap>
                        <Text strong>Tags: </Text>
                        {selectedPost.tags.map(tag => (
                          <Tag key={tag} icon={<TagOutlined />}>{tag}</Tag>
                        ))}
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        <Button icon={<LikeOutlined />} type="text">
                          {selectedPost.likes}
                        </Button>
                        <Button icon={<ShareAltOutlined />} type="text">
                          Chia sẻ
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={6}>
              <div style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? '0' : '50px' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
               

                  <Button 
                    type="primary" 
                    block 
                    onClick={handleBackToList}
                    style={{ height: isMobile ? '44px' : '40px', fontSize: isMobile ? '14px' : '13px' }}
                  >
                    ← Quay lại danh sách
                  </Button>

                  <Card size="small" title="Bài viết liên quan" bordered={false}>
                    <List
                      size="small"
                      dataSource={blogPosts.filter(p => 
                        p.id !== selectedPost.id && p.category === selectedPost.category
                      ).slice(0, 3)}
                      renderItem={item => (
                        <List.Item style={{ padding: '8px 0' }}>
                          <List.Item.Meta
                            title={
                              <Text 
                                style={{ fontSize: '12px', cursor: 'pointer' }}
                                onClick={() => handleReadMore(item)}
                              >
                                {item.title}
                              </Text>
                            }
                            description={
                              <Text type="secondary" style={{ fontSize: '11px' }}>
                                {item.readTime} phút đọc
                              </Text>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container blog-page">
      <div className="container">
        <div className="page-header">
          <Title level={1} className="page-title">
            <BookOutlined /> Blog Bảo mật Email
          </Title>
          <Paragraph className="page-description">
            Chia sẻ kiến thức, mẹo hay và cập nhật mới nhất về bảo mật email
          </Paragraph>
        </div>

        {/* Featured Post Hero Section */}
        <Card 
          className="hero-post-card" 
          bordered={false} 
          style={{ 
            marginBottom: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={12}>
              <div style={{ padding: '20px 0' }}>
                <Tag 
                  color="gold" 
                  style={{ marginBottom: 16, fontSize: '12px', fontWeight: 'bold' }}
                >
                  🔥 BÀI VIẾT NỔI BẬT
                </Tag>
                <Title 
                  level={2} 
                  style={{ 
                    color: 'white', 
                    marginBottom: 16,
                    fontSize: isVerySmall ? '16px' : isMobile ? '18px' : 'clamp(1.5rem, 4vw, 2.2rem)'
                  }}
                >
                  {blogPosts[0].title}
                </Title>
                <Paragraph 
                  style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '16px',
                    marginBottom: 20 
                  }}
                >
                  {blogPosts[0].excerpt}
                </Paragraph>
                <Space size="large">
                  <Space>
                    <UserOutlined />
                    <Text style={{ color: 'white' }}>{blogPosts[0].author}</Text>
                  </Space>
                  <Space>
                    <EyeOutlined />
                    <Text style={{ color: 'white' }}>{blogPosts[0].views} lượt xem</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined />
                    <Text style={{ color: 'white' }}>
                      {new Date(blogPosts[0].publishDate).toLocaleDateString('vi-VN')}
                    </Text>
                  </Space>
                </Space>
                <div style={{ marginTop: 20 }}>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      background: 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onClick={() => handleReadMore(blogPosts[0])}
                  >
                    Đọc ngay →
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  style={{ 
                    width: '100%',
                    maxWidth: '400px',
                    height: isVerySmall ? '160px' : isMobile ? '180px' : '250px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Search and Filters */}
        <Card className="search-filters" bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Input
                placeholder="Tìm kiếm bài viết..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%' }}
                size="large"
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    <Space>
                      {getCategoryIcon(cat.value)}
                      {cat.label} ({cat.count})
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} lg={10}>
              <Space wrap>
                {categories.slice(1).map(cat => (
                  <Button
                    key={cat.value}
                    type={selectedCategory === cat.value ? 'primary' : 'default'}
                    icon={getCategoryIcon(cat.value)}
                    onClick={() => setSelectedCategory(cat.value)}
                    size="small"
                  >
                    {cat.label}
                  </Button>
                ))}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Blog Posts Grid */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <List
              grid={{ 
                gutter: 16, 
                xs: 1, 
                sm: 1, 
                md: 1, 
                lg: 1, 
                xl: 1 
              }}
              dataSource={filteredPosts}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} bài viết`
              }}
              renderItem={item => (
                <List.Item>
                  <Card 
                    hoverable
                    className="blog-post-card"
                    bordered={false}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <div className="post-image">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            style={{ 
                              width: '100%', 
                              height: isVerySmall ? 140 : isMobile ? 160 : 160, 
                              objectFit: 'cover',
                              borderRadius: 8 
                            }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={16}>
                        <div className="post-content">
                          <Space style={{ marginBottom: 8 }}>
                            <Tag 
                              color={getCategoryColor(item.category)}
                              icon={getCategoryIcon(item.category)}
                            >
                              {item.category}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {item.readTime} phút đọc
                            </Text>
                          </Space>
                          
                          <Title 
                            level={4} 
                            style={{ marginBottom: 8, cursor: 'pointer' }}
                            onClick={() => handleReadMore(item)}
                          >
                            {item.title}
                          </Title>
                          
                          <Paragraph 
                            style={{ marginBottom: 16, color: '#666' }}
                            ellipsis={{ rows: 2 }}
                          >
                            {item.excerpt}
                          </Paragraph>
                          
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Space size="middle">
                                <Space size="small">
                                  <UserOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{item.author}</Text>
                                </Space>
                                <Space size="small">
                                  <CalendarOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>
                                    {new Date(item.publishDate).toLocaleDateString('vi-VN')}
                                  </Text>
                                </Space>
                              </Space>
                            </Col>
                            <Col>
                              <Space>
                                <Space size="small">
                                  <EyeOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{item.views}</Text>
                                </Space>
                                <Space size="small">
                                  <LikeOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{item.likes}</Text>
                                </Space>
                                <Button 
                                  type="link" 
                                  size="small"
                                  onClick={() => handleReadMore(item)}
                                >
                                  Đọc thêm →
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <div style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? '0' : '100px' }}>
              <Space direction="vertical" size={isMobile ? 'middle' : 'large'} style={{ width: '100%' }}>
                {/* Categories */}
                <Card title="Chuyên mục" size="small" bordered={false}>
                  <List
                    size="small"
                    dataSource={categories.slice(1)}
                    renderItem={item => (
                      <List.Item 
                        style={{ 
                          padding: '8px 0',
                          cursor: 'pointer',
                          backgroundColor: selectedCategory === item.value ? '#f0f2f5' : 'transparent'
                        }}
                        onClick={() => setSelectedCategory(item.value)}
                      >
                        <List.Item.Meta
                          avatar={getCategoryIcon(item.value)}
                          title={item.label}
                          description={`${item.count} bài viết`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                {/* Popular Posts */}
                <Card title="Bài viết phổ biến" size="small" bordered={false}>
                  <List
                    size="small"
                    dataSource={blogPosts.sort((a, b) => b.views - a.views).slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              style={{ 
                                backgroundColor: '#1890ff',
                                fontSize: '12px' 
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          }
                          title={
                            <Text 
                              style={{ fontSize: '13px', cursor: 'pointer' }}
                              onClick={() => handleReadMore(item)}
                            >
                              {item.title}
                            </Text>
                          }
                          description={
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {item.views} lượt xem
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                {/* Tags */}
                <Card title="Thẻ phổ biến" size="small" bordered={false}>
                  <Space wrap>
                    {['phishing', 'spam', 'bảo mật', 'email', 'lừa đảo', 'mẹo hay', '2FA', 'doanh nghiệp'].map(tag => (
                      <Tag 
                        key={tag} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchValue(tag)}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
                </Space>
              </div>
           </Col>
        </Row>
      </div>
    </div>
  );
};

export default BlogPage; 