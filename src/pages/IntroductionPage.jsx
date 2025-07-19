import React from 'react';
import './IntroductionPage.css';

const IntroductionPage = () => {
    const teamMembers = [
        {
            name: "Khánh",
            role: "Full Stack Developer",
            description: "Chuyên về phát triển toàn diện và tích hợp hệ thống",
            avatar: "👨‍💻"
        },
        {
            name: "Toàn",
            role: "Full Stack Developer", 
            description: "Chuyên về phát triển toàn diện và tích hợp hệ thống",
            avatar: "👨‍💼"
        },
        {
            name: "Trường",
            role: "Full Stack Developer",
            description: "Chuyên về phát triển toàn diện và tích hợp hệ thống",
            avatar: "👨‍🔬"
        }
    ];

    return (
        <div className="introduction-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="team-title">
                        <span className="highlight">Watchers</span> Team
                    </h1>
                    <p className="team-subtitle">
                        Đội ngũ phát triển chuyên nghiệp cam kết bảo vệ người dùng khỏi các mối đe dọa trực tuyến
                    </p>
                    <div className="shield-icon">🛡️</div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="container">
                    <h2 className="section-title">Sứ Mệnh Của Chúng Tôi</h2>
                    <div className="mission-content">
                        <div className="mission-card">
                            <div className="mission-icon">🎯</div>
                            <h3>Mục Tiêu</h3>
                            <p>Xây dựng hệ thống AI thông minh để phát hiện và ngăn chặn email lừa đảo, bảo vệ người dùng khỏi các mối đe dọa an ninh mạng.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">🚀</div>
                            <h3>Tầm Nhìn</h3>
                            <p>Trở thành nền tảng hàng đầu trong việc bảo vệ thông tin cá nhân và tạo môi trường internet an toàn cho mọi người.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">💡</div>
                            <h3>Giá Trị</h3>
                            <p>Cam kết mang đến giải pháp công nghệ tiên tiến, dễ sử dụng và hiệu quả để bảo vệ quyền lợi của người dùng.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <h2 className="section-title">Đội Ngũ Phát Triển</h2>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="member-card">
                                <div className="member-avatar">{member.avatar}</div>
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-role">{member.role}</p>
                                <p className="member-description">{member.description}</p>
                                <div className="member-social">
                                    <span className="social-link">📧</span>
                                    <span className="social-link">💼</span>
                                    <span className="social-link">🔗</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Section */}
            <section className="project-section">
                <div className="container">
                    <h2 className="section-title">Dự Án Chống Lừa Đảo Email</h2>
                    <div className="project-content">
                        <div className="project-info">
                            <div className="project-features">
                                <div className="feature-item">
                                    <div className="feature-icon">🤖</div>
                                    <div className="feature-text">
                                        <h4>AI Phát Hiện Thông Minh</h4>
                                        <p>Sử dụng công nghệ machine learning để phân tích và phát hiện các email đáng ngờ</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">⚡</div>
                                    <div className="feature-text">
                                        <h4>Xử Lý Nhanh Chóng</h4>
                                        <p>Phân tích email trong thời gian thực với độ chính xác cao</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">🔒</div>
                                    <div className="feature-text">
                                        <h4>Bảo Mật Tuyệt Đối</h4>
                                        <p>Cam kết không lưu trữ nội dung email và bảo vệ quyền riêng tư người dùng</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">📊</div>
                                    <div className="feature-text">
                                        <h4>Báo Cáo Chi Tiết</h4>
                                        <p>Cung cấp phân tích chi tiết và lời khuyên để tránh các mối đe dọa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="project-stats">
                            <div className="stat-item">
                                <div className="stat-number">99.5%</div>
                                <div className="stat-label">Độ Chính Xác</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">1000+</div>
                                <div className="stat-label">Email Đã Kiểm Tra</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">&lt; 2s</div>
                                <div className="stat-label">Thời Gian Phản Hồi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn Sàng Bảo Vệ Bản Thân?</h2>
                        <p>Hãy thử ngay công cụ kiểm tra email thông minh của chúng tôi</p>
                        <button className="cta-button">
                            Kiểm Tra Email Ngay 🚀
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IntroductionPage;