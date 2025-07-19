import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyAaZlYvHtEeqKRq0VTTCkxHRsjoaI1vWKY";
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Create axios instance for Gemini API
const geminiAPI = axios.create({
  baseURL: GEMINI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Security patterns for different types of checks
const SECURITY_PATTERNS = {
  EMAIL: {
    // Phishing/Fraud patterns
    PHISHING: [
      /\b(urgent|immediate).*action.*(required|needed)\b/i,
      /\bverify.*(account|identity).*(immediately|now|asap)\b/i,
      /\b(suspended|locked|blocked|disabled).*(account|profile)\b/i,
      /\bsecurity.*(alert|warning|breach|violation)\b/i,
      /\bclick.*(here|link).*(immediately|now|urgent)\b/i,
      /\b(congratulations?|congrats).*(winner|won|selected)\b/i,
      /\byou.*(have.*)?(won|winning|winner).*(prize|money|lottery|million)\b/i,
      /\btài khoản.*(bị khóa|bị tạm dừng|hết hạn)\b/i,
      /\bchúc mừng.*(trúng thưởng|chiến thắng|được chọn)\b/i,
    ],
    
    // Spam patterns
    SPAM: [
      /\bbuy.*(now|today).*(discount|sale|\d+%.*off)\b/i,
      /\b(limited.*time|special|exclusive).*(offer|deal|promotion)\b/i,
      /\bfree.*(money|gift|trial|shipping)\b/i,
      /\bmake.*\$?\d+.*(per.*(day|week|month)|fast|easy)\b/i,
      /\bwork.*from.*home.*(opportunity|job|income)\b/i,
      /\blose.*weight.*(fast|quick|easy|guaranteed)\b/i,
      /\bmiễn phí.*(giao hàng|dùng thử|quà tặng)\b/i,
      /\bkiếm tiền.*(tại nhà|online|nhanh)\b/i,
    ],
    
    // Suspicious patterns
    SUSPICIOUS: [
      /\bhello.*dear.*(sir|madam|friend)\b/i,
      /\bgreetings?.*(friend|sir|madam)\b/i,
      /\bbusiness.*(proposal|opportunity|partnership)\b/i,
      /\bconfidential.*(matter|business|transaction)\b/i,
      /\bxin chào.*\b(bạn|anh|chị).*thân mến\b/i,
      /\bđề xuất.*kinh doanh.*hợp tác\b/i,
    ],
    
    // Safe patterns
    SAFE: [
      /\bmeeting.*(reminder|invitation|update)\b/i,
      /\bproject.*(update|status|report)\b/i,
      /\bnewsletter.*\d{4}\b/i,
      /\breceipt.*order.*#?\d+\b/i,
      /\bwelcome.*(aboard|to.*team|message)\b/i,
      /\bpassword.*reset.*request\b/i,
      /\bnhắc nhở.*cuộc họp\b/i,
      /\bcập nhật.*dự án\b/i,
    ]
  },
  
  DOMAIN: {
    // Dangerous domains
    DANGEROUS: [
      /\.(tk|ml|ga|cf|gq|pw|xyz|top|click|online|site|website|info\.tm|uu\.gl)$/i,
      /\.(bid|win|download|stream|review|link|zip|work|men|loan|trade)$/i,
      /(temp|temporary|10minute|guerrillamail|mailinator|trashmail|throwaway|disposable|fake|dummy)\./i,
    ],
    
    // Safe domains
    SAFE: [
      /^(gmail|yahoo|hotmail|outlook|live|icloud)\.com$/i,
      /\.(edu|gov|org|ac\.uk|edu\.au)$/i,
      /(microsoft|google|apple|amazon|paypal|facebook|twitter|linkedin|github)\.com$/i,
    ]
  },
  
  PHONE: {
    // Suspicious phone patterns
    SUSPICIOUS: [
      /^\+?1[-.\s]?900[-.\s]?\d{3}[-.\s]?\d{4}$/,  // Premium rate numbers
      /^\+?1[-.\s]?976[-.\s]?\d{3}[-.\s]?\d{4}$/,  // Premium rate numbers
      /^\+234\d{10}$/,  // Nigeria (common scam origin)
      /^\+233\d{9}$/,   // Ghana
      /^\+?84\d{8,9}$/,  // Vietnam pattern check
    ],
    
    // Valid patterns
    VALID: [
      /^\+?1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/,  // US/Canada
      /^\+?84[-.\s]?\d{2,3}[-.\s]?\d{3}[-.\s]?\d{4}$/,  // Vietnam
      /^\+?[1-9]\d{1,14}$/,  // International E.164 format
    ]
  },
  
  CONTENT: {
    // High risk content
    HIGH_RISK: [
      /\b(urgent|immediate).*action.*(required|needed)\b/i,
      /\bclick.*(here|link|now).*win.*\$\d+\b/i,
      /\benter.*(password|pin|ssn|social.security).*(immediately|now|verify)\b/i,
      /\bprovide.*(credit.card|bank.account|personal.info).*(details|number)\b/i,
      /\baccount.*(will.be.*)?(closed|terminated|suspended).*(today|24.hours)\b/i,
      /\btransfer.*money.*(urgent|immediate|today)\b/i,
      /\b(bitcoin|crypto|cryptocurrency).*(investment|opportunity|profit)\b/i,
      /\bguaranteed.*(profit|return|income).*(100%|no.risk)\b/i,
    ],
    
    // Medium risk content
    MEDIUM_RISK: [
      /\bbuy.*(now|today).*(discount|sale|\d+%.*off)\b/i,
      /\b(limited.*time|special|exclusive).*(offer|deal|promotion)\b/i,
      /\bfree.*(money|gift|trial|shipping)\b/i,
      /\bmake.*\$?\d+.*(per.*(day|week|month)|fast|easy)\b/i,
      /\bwork.*from.*home.*(opportunity|job|income)\b/i,
    ],
    
    // Low risk content
    LOW_RISK: [
      /\bhello.*dear.*(sir|madam|friend)\b/i,
      /\bgreetings?.*(friend|sir|madam)\b/i,
      /\bbusiness.*(proposal|opportunity|partnership)\b/i,
    ]
  }
};

// Check service functions
export const checkService = {
  // Analyze email patterns
  analyzeEmail(email) {
    const analysis = {
      riskLevel: 'safe',
      riskScore: 0,
      confidence: 50,
      threats: [],
      indicators: [],
      recommendations: []
    };

    let riskPoints = 0;
    let safePoints = 0;

    // Check for phishing patterns
    SECURITY_PATTERNS.EMAIL.PHISHING.forEach((pattern, index) => {
      if (pattern.test(email)) {
        riskPoints += 20;
        analysis.threats.push({
          name: `Phishing Pattern ${index + 1}`,
          severity: 'high',
          description: 'Email có dấu hiệu lừa đảo'
        });
        analysis.indicators.push('Phishing indicator detected');
      }
    });

    // Check for spam patterns
    SECURITY_PATTERNS.EMAIL.SPAM.forEach((pattern, index) => {
      if (pattern.test(email)) {
        riskPoints += 10;
        analysis.threats.push({
          name: `Spam Pattern ${index + 1}`,
          severity: 'medium',
          description: 'Email có dấu hiệu spam'
        });
        analysis.indicators.push('Spam indicator detected');
      }
    });

    // Check for suspicious patterns
    SECURITY_PATTERNS.EMAIL.SUSPICIOUS.forEach((pattern, index) => {
      if (pattern.test(email)) {
        riskPoints += 5;
        analysis.threats.push({
          name: `Suspicious Pattern ${index + 1}`,
          severity: 'low',
          description: 'Email có dấu hiệu đáng nghi'
        });
        analysis.indicators.push('Suspicious indicator detected');
      }
    });

    // Check for safe patterns
    SECURITY_PATTERNS.EMAIL.SAFE.forEach((pattern, index) => {
      if (pattern.test(email)) {
        safePoints += 8;
        analysis.indicators.push(`Safe pattern ${index + 1} detected`);
      }
    });

    // Calculate final risk score
    const finalScore = Math.max(0, Math.min(100, riskPoints - safePoints + 10));
    analysis.riskScore = finalScore;

    // Determine risk level
    if (finalScore >= 70) {
      analysis.riskLevel = 'phishing';
      analysis.confidence = Math.min(95, 75 + (finalScore - 70));
      analysis.recommendations = [
        'NGUY HIỂM! Không click vào bất kỳ liên kết nào',
        'Không cung cấp thông tin cá nhân',
        'Báo cáo email này cho bộ phận IT',
        'Xóa email ngay lập tức'
      ];
    } else if (finalScore >= 40) {
      analysis.riskLevel = 'spam';
      analysis.confidence = Math.min(85, 60 + (finalScore - 40));
      analysis.recommendations = [
        'Đánh dấu email này là spam',
        'Không tương tác với nội dung',
        'Cân nhắc chặn người gửi',
        'Kiểm tra bộ lọc spam'
      ];
    } else if (finalScore >= 20) {
      analysis.riskLevel = 'suspicious';
      analysis.confidence = Math.min(75, 50 + (finalScore - 20));
      analysis.recommendations = [
        'Xác minh người gửi qua kênh khác',
        'Thận trọng với các liên kết',
        'Không cung cấp thông tin nhạy cảm',
        'Kiểm tra kỹ trước khi hành động'
      ];
    } else {
      analysis.riskLevel = 'safe';
      analysis.confidence = Math.max(60, 85 - finalScore);
      analysis.recommendations = [
        'Email có vẻ an toàn',
        'Vẫn nên thận trọng với tệp đính kèm',
        'Xác minh người gửi nếu cần',
        'Tuân thủ chính sách bảo mật công ty'
      ];
    }

    return analysis;
  },

  // Analyze domain
  analyzeDomain(domain) {
    const analysis = {
      riskLevel: 'safe',
      riskScore: 0,
      confidence: 50,
      threats: [],
      indicators: [],
      recommendations: []
    };

    let riskPoints = 0;

    // Check dangerous domains
    SECURITY_PATTERNS.DOMAIN.DANGEROUS.forEach((pattern, index) => {
      if (pattern.test(domain)) {
        riskPoints += 30;
        analysis.threats.push({
          name: `Dangerous Domain Pattern ${index + 1}`,
          severity: 'high',
          description: 'Domain nguy hiểm hoặc tạm thời'
        });
      }
    });

    // Check safe domains
    SECURITY_PATTERNS.DOMAIN.SAFE.forEach((pattern, index) => {
      if (pattern.test(domain)) {
        riskPoints -= 15;
        analysis.indicators.push(`Safe domain pattern ${index + 1}`);
      }
    });

    // Domain length check
    if (domain.length > 50) {
      riskPoints += 10;
      analysis.threats.push({
        name: 'Long Domain',
        severity: 'medium',
        description: 'Domain quá dài, có thể đáng nghi'
      });
    }

    // Multiple subdomains
    if (domain.split('.').length > 4) {
      riskPoints += 8;
      analysis.threats.push({
        name: 'Multiple Subdomains',
        severity: 'low',
        description: 'Domain có nhiều subdomain'
      });
    }

    // Numbers in domain
    if (/\d{4,}/.test(domain)) {
      riskPoints += 5;
      analysis.threats.push({
        name: 'Numeric Domain',
        severity: 'low',
        description: 'Domain chứa nhiều số'
      });
    }

    const finalScore = Math.max(0, Math.min(100, riskPoints + 15));
    analysis.riskScore = finalScore;

    if (finalScore >= 60) {
      analysis.riskLevel = 'phishing';
      analysis.confidence = Math.min(90, 70 + (finalScore - 60));
    } else if (finalScore >= 30) {
      analysis.riskLevel = 'suspicious';
      analysis.confidence = Math.min(80, 60 + (finalScore - 30));
    } else {
      analysis.riskLevel = 'safe';
      analysis.confidence = Math.max(65, 85 - finalScore);
    }

    return analysis;
  },

  // Analyze phone number
  analyzePhone(phone) {
    const analysis = {
      riskLevel: 'safe',
      riskScore: 0,
      confidence: 50,
      threats: [],
      indicators: [],
      recommendations: []
    };

    let riskPoints = 0;

    // Check suspicious patterns
    SECURITY_PATTERNS.PHONE.SUSPICIOUS.forEach((pattern, index) => {
      if (pattern.test(phone)) {
        riskPoints += 25;
        analysis.threats.push({
          name: `Suspicious Phone Pattern ${index + 1}`,
          severity: 'high',
          description: 'Số điện thoại từ khu vực có rủi ro cao'
        });
      }
    });

    // Check valid patterns
    const isValid = SECURITY_PATTERNS.PHONE.VALID.some(pattern => pattern.test(phone));
    if (!isValid) {
      riskPoints += 15;
      analysis.threats.push({
        name: 'Invalid Format',
        severity: 'medium',
        description: 'Định dạng số điện thoại không hợp lệ'
      });
    }

    const finalScore = Math.max(0, Math.min(100, riskPoints + 10));
    analysis.riskScore = finalScore;

    if (finalScore >= 50) {
      analysis.riskLevel = 'suspicious';
      analysis.confidence = Math.min(85, 60 + (finalScore - 50));
      analysis.recommendations = [
        'Không trả lời cuộc gọi từ số này',
        'Kiểm tra số điện thoại trên internet',
        'Báo cáo nếu nhận được cuộc gọi lừa đảo',
        'Chặn số này nếu cần thiết'
      ];
    } else {
      analysis.riskLevel = 'safe';
      analysis.confidence = Math.max(60, 80 - finalScore);
      analysis.recommendations = [
        'Số điện thoại có vẻ hợp lệ',
        'Vẫn nên thận trọng với cuộc gọi lạ',
        'Không cung cấp thông tin cá nhân qua điện thoại',
        'Xác minh danh tính người gọi nếu cần'
      ];
    }

    return analysis;
  },

  // Analyze content
  analyzeContent(content) {
    const analysis = {
      riskLevel: 'safe',
      riskScore: 0,
      confidence: 50,
      threats: [],
      indicators: [],
      recommendations: []
    };

    let riskPoints = 0;

    // Check high risk patterns
    SECURITY_PATTERNS.CONTENT.HIGH_RISK.forEach((pattern, index) => {
      if (pattern.test(content)) {
        riskPoints += 20;
        analysis.threats.push({
          name: `High Risk Content ${index + 1}`,
          severity: 'high',
          description: 'Nội dung có dấu hiệu lừa đảo nghiêm trọng'
        });
      }
    });

    // Check medium risk patterns
    SECURITY_PATTERNS.CONTENT.MEDIUM_RISK.forEach((pattern, index) => {
      if (pattern.test(content)) {
        riskPoints += 10;
        analysis.threats.push({
          name: `Medium Risk Content ${index + 1}`,
          severity: 'medium',
          description: 'Nội dung có dấu hiệu spam'
        });
      }
    });

    // Check low risk patterns
    SECURITY_PATTERNS.CONTENT.LOW_RISK.forEach((pattern, index) => {
      if (pattern.test(content)) {
        riskPoints += 5;
        analysis.threats.push({
          name: `Low Risk Content ${index + 1}`,
          severity: 'low',
          description: 'Nội dung có dấu hiệu đáng nghi nhẹ'
        });
      }
    });

    // Additional checks
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.5 && content.length > 50) {
      riskPoints += 8;
      analysis.threats.push({
        name: 'Excessive Caps',
        severity: 'low',
        description: 'Quá nhiều chữ hoa (dấu hiệu spam)'
      });
    }

    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 5) {
      riskPoints += 5;
      analysis.threats.push({
        name: 'Excessive Exclamation',
        severity: 'low',
        description: 'Quá nhiều dấu chấm than'
      });
    }

    const finalScore = Math.max(0, Math.min(100, riskPoints + 5));
    analysis.riskScore = finalScore;

    if (finalScore >= 70) {
      analysis.riskLevel = 'phishing';
      analysis.confidence = Math.min(95, 75 + (finalScore - 70));
    } else if (finalScore >= 40) {
      analysis.riskLevel = 'spam';
      analysis.confidence = Math.min(85, 60 + (finalScore - 40));
    } else if (finalScore >= 20) {
      analysis.riskLevel = 'suspicious';
      analysis.confidence = Math.min(75, 50 + (finalScore - 20));
    } else {
      analysis.riskLevel = 'safe';
      analysis.confidence = Math.max(60, 85 - finalScore);
    }

    return analysis;
  },

  // Generate content with Gemini AI
  async generateContent(prompt, model = 'gemini-1.5-flash') {
    try {
      const response = await geminiAPI.post(
        `/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 1000,
          }
        }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        success: true,
        data: responseText,
        usage: response.data?.usageMetadata,
        fullResponse: response.data
      };
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  // Main check function with AI enhancement
  async performCheck(type, value) {
    try {
      // Step 1: Pattern analysis (focus on content only for now)
      let patternAnalysis;
      if (type === 'content' || type === 'email') {
        patternAnalysis = this.analyzeContent(value);
      } else if (type === 'link') {
        patternAnalysis = this.analyzeDomain(value);
      } else if (type === 'phone') {
        patternAnalysis = this.analyzePhone(value);
      } else {
        patternAnalysis = this.analyzeContent(value);
      }

      console.log('🔍 Pattern Analysis Result:', patternAnalysis);

      // Step 2: Create AI prompt
      const prompt = this.createAIPrompt(type, value, patternAnalysis);

      // Step 3: Get AI analysis
      const aiResult = await this.generateContent(prompt);
      console.log('🤖 AI Result:', aiResult);

      if (aiResult.success && aiResult.data) {
        try {
          // Extract JSON from response text (handle markdown code blocks)
          let jsonText = aiResult.data.trim();
          
          // Remove markdown code blocks if present
          if (jsonText.includes('```json')) {
            const jsonMatch = jsonText.match(/```json\s*\n([\s\S]*?)\n```/);
            if (jsonMatch) {
              jsonText = jsonMatch[1];
            }
          } else if (jsonText.includes('```')) {
            const jsonMatch = jsonText.match(/```\s*\n([\s\S]*?)\n```/);
            if (jsonMatch) {
              jsonText = jsonMatch[1];
            }
          }

          console.log('📝 Extracted JSON:', jsonText);
          
          const aiAnalysis = JSON.parse(jsonText);
          console.log('✅ Parsed AI Analysis:', aiAnalysis);
          
          // Combine pattern analysis with AI results
          const combinedResult = {
            classification: aiAnalysis.classification || patternAnalysis.riskLevel,
            riskScore: aiAnalysis.riskScore || patternAnalysis.riskScore,
            confidence: aiAnalysis.confidence || patternAnalysis.confidence,
            description: aiAnalysis.description || this.getDefaultDescription(patternAnalysis.riskLevel),
            threats: this.combineThreats(patternAnalysis.threats, aiAnalysis),
            recommendations: aiAnalysis.recommendations || patternAnalysis.recommendations,
            patternAnalysis: patternAnalysis,
            aiEnhanced: true,
            aiResponse: aiAnalysis
          };

          console.log('🎯 Combined Result:', combinedResult);

          return {
            success: true,
            data: combinedResult
          };
        } catch (parseError) {
          // Fallback to pattern analysis if AI parsing fails
          console.warn('❌ AI parsing failed, using pattern analysis:', parseError);
          console.warn('Raw AI response:', aiResult.data);
          
          return {
            success: true,
            data: {
              classification: patternAnalysis.riskLevel,
              riskScore: patternAnalysis.riskScore,
              confidence: patternAnalysis.confidence,
              description: this.getDefaultDescription(patternAnalysis.riskLevel),
              threats: patternAnalysis.threats,
              recommendations: patternAnalysis.recommendations,
              patternAnalysis: patternAnalysis,
              aiEnhanced: false,
              parseError: parseError.message
            }
          };
        }
      } else {
        // Fallback to pattern analysis if AI fails
        console.warn('❌ AI request failed:', aiResult.error);
        
        return {
          success: true,
          data: {
            classification: patternAnalysis.riskLevel,
            riskScore: patternAnalysis.riskScore,
            confidence: patternAnalysis.confidence,
            description: this.getDefaultDescription(patternAnalysis.riskLevel),
            threats: patternAnalysis.threats,
            recommendations: patternAnalysis.recommendations,
            patternAnalysis: patternAnalysis,
            aiEnhanced: false,
            aiError: aiResult.error
          }
        };
      }
    } catch (error) {
      console.error('💥 Error in performCheck:', error);
      return {
        success: false,
        error: error.message || 'Có lỗi xảy ra khi kiểm tra'
      };
    }
  },

  // Create AI prompt
  createAIPrompt(type, value, patternAnalysis) {
    const typeLabels = {
      email: 'nội dung email',
      link: 'website/link',
      phone: 'số điện thoại',
      content: 'nội dung email'
    };

    return `
Bạn là chuyên gia bảo mật email. Phân tích nội dung sau để phát hiện lừa đảo, spam, hoặc các mối đe dọa:

NỘI DUNG CẦN PHÂN TÍCH:
"${value}"

PHÂN TÍCH PATTERN TỰ ĐỘNG:
- Mức độ rủi ro: ${patternAnalysis.riskLevel}
- Điểm rủi ro: ${patternAnalysis.riskScore}/100
- Độ tin cậy: ${patternAnalysis.confidence}%
- Số mối đe dọa phát hiện: ${patternAnalysis.threats?.length || 0}

NHIỆM VỤ:
Dựa trên nội dung và phân tích pattern, đưa ra đánh giá cuối cùng theo 4 mức độ:
1. "safe" - An toàn, không có dấu hiệu nguy hiểm
2. "suspicious" - Nghi ngờ, cần cẩn thận
3. "spam" - Thư rác, quảng cáo không mong muốn  
4. "phishing" - Lừa đảo, rất nguy hiểm

QUAN TRỌNG: 
- Tập trung phân tích NỘI dung text để phát hiện lừa đảo
- Chú ý các từ khóa như "nhận tiền", "trúng thưởng", "click vào đây", "urgent", etc.
- Đánh giá riskScore từ 0-100 (0=an toàn, 100=rất nguy hiểm)
- Confidence từ 0-100 (độ chắc chắn của phân tích)

Trả lời CHÍNH XÁC theo format JSON:
\`\`\`json
{
  "classification": "safe|suspicious|spam|phishing",
  "riskScore": 85,
  "confidence": 90,
  "description": "mô tả chi tiết lý do phân loại và các dấu hiệu phát hiện",
  "recommendations": [
    "khuyến nghị bảo mật cụ thể 1",
    "khuyến nghị bảo mật cụ thể 2", 
    "khuyến nghị bảo mật cụ thể 3"
  ]
}
\`\`\`

LƯU Ý: Chỉ trả lời JSON, không thêm text khác.
`;
  },

  // Get default description
  getDefaultDescription(riskLevel) {
    const descriptions = {
      safe: 'Không phát hiện dấu hiệu nguy hiểm. Tuy nhiên vẫn nên thận trọng.',
      suspicious: 'Phát hiện một số dấu hiệu đáng nghi. Cần xác minh thêm.',
      spam: 'Có đặc điểm của email spam/quảng cáo không mong muốn.',
      phishing: 'Có dấu hiệu lừa đảo nghiêm trọng. Rất nguy hiểm!'
    };
    return descriptions[riskLevel] || 'Cần phân tích thêm để đưa ra kết luận.';
  },

  // Helper to combine threats from pattern analysis and AI
  combineThreats(patternThreats, aiAnalysis) {
    const combined = [...(patternThreats || [])];
    
    // Add AI detected threats if any
    if (aiAnalysis.threats && Array.isArray(aiAnalysis.threats)) {
      aiAnalysis.threats.forEach(aiThreat => {
        if (!combined.some(p => p.name === aiThreat.name)) {
          combined.push(aiThreat);
        }
      });
    }
    
    return combined;
  }
};

export default checkService; 