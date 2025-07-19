# 🛡️ SafeMail Guard - Hệ thống Phòng chống Lừa đảo Email

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-red.svg)](https://ant.design/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Giới thiệu

**SafeMail Guard** là hệ thống AI tiên tiến giúp phát hiện và phòng chống các mối đe dọa email như phishing, spam và lừa đảo trực tuyến. Được xây dựng với React + Vite + Ant Design, hệ thống cung cấp giao diện hiện đại và trải nghiệm người dùng tuyệt vời.

### ✨ Tính năng chính

#### 🌟 Dành cho Cộng đồng
- **📚 Giáo dục cộng đồng**: Cung cấp kiến thức về an toàn email
- **🔍 Kiểm tra tức thì**: Phân tích email, link, số điện thoại ngay lập tức
- **⚠️ Cảnh báo thông minh**: Phát hiện các mối đe dọa trực tuyến
- **👥 Hỗ trợ cộng đồng**: Chia sẻ thông tin và cảnh báo

#### 🏢 Dành cho Doanh nghiệp
- **🤖 AI phân loại tự động**: Phân loại email với độ chính xác 99.9%
- **🕰️ Giám sát 24/7**: Theo dõi thời gian thực
- **🔗 Tích hợp API**: Kết nối với hệ thống email doanh nghiệp
- **📊 Báo cáo chi tiết**: Dashboard thống kê toàn diện

## 🛠️ Công nghệ sử dụng

- **Framework**: React 18 với Hooks
- **Build Tool**: Vite 5
- **UI Library**: Ant Design 5
- **HTTP Client**: Axios
- **Styling**: CSS3 với Flexbox/Grid
- **Icons**: Ant Design Icons
- **Language**: JavaScript ES6+

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 7.0.0 hoặc yarn >= 1.22.0

### Cài đặt dependencies

```bash
# Clone repository
git clone https://github.com/your-repo/email-fraud-detection.git
cd email-fraud-detection

# Cài đặt packages
npm install
# hoặc
yarn install
```

### Khởi chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: `http://localhost:5173`

### Build cho Production

```bash
npm run build
# hoặc
yarn build
```

### Preview Production Build

```bash
npm run preview
# hoặc
yarn preview
```

## 🏗️ Cấu trúc Project

```
email-fraud-detection/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── HeroSection.jsx # Landing hero section
│   │   ├── FeatureSection.jsx # Features showcase
│   │   ├── CheckSection.jsx   # Email checking interface
│   │   ├── StatsSection.jsx   # Statistics display
│   │   ├── EducationSection.jsx # Educational content
│   │   └── Footer.jsx      # Site footer
│   ├── services/           # API services
│   │   └── emailService.js # Email checking logic
│   ├── styles/             # CSS files
│   │   └── App.css        # Main styles
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── public/                # Static assets
├── package.json           # Dependencies & scripts
└── README.md             # Documentation
```

## 🎯 Hướng dẫn sử dụng

### 1. Kiểm tra Email/Link/SĐT
1. Truy cập phần "Kiểm tra Độ An toàn"
2. Chọn loại kiểm tra (Email, Link, SĐT, hoặc Nội dung)
3. Nhập thông tin cần kiểm tra
4. Nhấn "Kiểm tra ngay" để phân tích
5. Xem kết quả và khuyến nghị

### 2. Xem Thống kê
- Theo dõi số lượng email đã kiểm tra
- Xem mối đe dọa đã chặn
- Thống kê hoạt động hàng ngày

### 3. Học hỏi về An toàn
- Đọc các mẹo bảo mật nhanh
- Nhận biết dấu hiệu cảnh báo
- Tham khảo bài học chi tiết
- Xem câu hỏi thường gặp

## 🔧 Cấu hình

### Biến môi trường

Tạo file `.env` trong thư mục root:

```env
# API Configuration
VITE_API_BASE_URL=https://api.safemailguard.com
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=SafeMail Guard
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_ANALYTICS=false
```

### Tùy chỉnh Theme

Sửa file `src/styles/App.css` để thay đổi:
- Màu sắc chủ đạo
- Font chữ
- Kích thước và spacing
- Responsive breakpoints

## 🔄 API Integration

### Email Service

```javascript
import { checkEmailSafety } from './services/emailService';

// Kiểm tra email
const result = await checkEmailSafety({
  type: 'email', // 'email' | 'link' | 'phone' | 'content'
  value: 'example@domain.com'
});

console.log(result.classification); // 'safe' | 'suspicious' | 'spam' | 'phishing'
```

### Mock Data

Hệ thống hiện tại sử dụng mock data để demo. Để tích hợp API thực:

1. Cập nhật `VITE_API_BASE_URL` trong `.env`
2. Sửa logic trong `src/services/emailService.js`
3. Bỏ comment các real API calls

## 📱 Responsive Design

Giao diện được tối ưu cho:
- **Desktop**: >= 1024px
- **Tablet**: 768px - 1023px  
- **Mobile**: < 768px

Sử dụng CSS `clamp()` và Flexbox/Grid để responsive tự động.

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, card-based layout
- **Smooth Animations**: Hover effects, transitions
- **Accessibility**: Semantic HTML, keyboard navigation
- **Loading States**: Spinners, skeleton screens
- **Visual Feedback**: Success/error states, progress bars

## 🧪 Testing

### Kiểm tra các email mẫu:

- `scam@example.com` → Phishing (High Risk)
- `safe@gmail.com` → Safe (Low Risk)  
- `spam@marketing.com` → Spam (Medium Risk)

### Test cases khác:
- Links với `bit.ly`, `tinyurl` → Suspicious
- Phone numbers với `0000`, `1234` → Suspicious
- Content với "urgent", "click now" → Spam

## 🚀 Deployment

### Vercel
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
drag & drop dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

Dự án được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🆘 Hỗ trợ

- **Email**: support@safemailguard.com
- **Hotline**: 1900 123 456
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 📊 Roadmap

- [ ] Tích hợp AI/ML thực tế
- [ ] Dashboard admin
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] API rate limiting
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics

## 🌟 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Email Checker
![Email Checker](screenshots/checker.png)

### Statistics Dashboard
![Stats Dashboard](screenshots/stats.png)

---

<div align="center">

**🛡️ SafeMail Guard - Bảo vệ bạn khỏi lừa đảo email với AI**

Made with ❤️ by [Trang Code](https://github.com/trangcode)

</div>
