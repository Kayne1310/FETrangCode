import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyAaZlYvHtEeqKRq0VTTCkxHRsjoaI1vWKY';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Create axios instance for Gemini API
const geminiAPI = axios.create({
  baseURL: GEMINI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Regex patterns chặt chẽ để phát hiện các dấu hiệu nguy hiểm
const SECURITY_PATTERNS = {
  // Patterns cho GIẢ MẠO (Phishing/Fraud) - Độ nguy hiểm cao nhất
  FAKE_PATTERNS: {
    title: [
      // Phishing cổ điển
      /\b(urgent|immediate).*action.*(required|needed)\b/i,
      /\bverify.*(account|identity).*(immediately|now|asap)\b/i,
      /\b(suspended|locked|blocked|disabled).*(account|profile)\b/i,
      /\bsecurity.*(alert|warning|breach|violation)\b/i,
      /\bclick.*(here|link).*(immediately|now|urgent)\b/i,
      
      // Lừa đảo thưởng/trúng thưởng
      /\b(congratulations?|congrats).*(winner|won|selected)\b/i,
      /\byou.*(have.*)?(won|winning|winner).*(prize|money|lottery|million)\b/i,
      /\b(inheritance|estate).*(million|billion|\$|USD|€|£)\b/i,
      /\b(prince|princess|heir|widow).*(nigeria|africa|fortune)\b/i,
      
      // Lừa đảo tài chính
      /\btransfer.*money.*(urgent|immediate|today)\b/i,
      /\b(bitcoin|crypto|cryptocurrency).*(investment|opportunity|profit)\b/i,
      /\bguaranteed.*(profit|return|income).*(100%|no.risk)\b/i,
      /\bmake.*\$.*per.*(day|week|month).*(easy|simple|guaranteed)\b/i,
      
      // Tiếng Việt
      /\b(khẩn cấp|gấp|ngay lập tức).*(xác minh|kiểm tra).*(tài khoản|thông tin)\b/i,
      /\b(chúc mừng|congratulation).*(trúng thưởng|chiến thắng|được chọn)\b/i,
      /\btài khoản.*(bị khóa|bị tạm dừng|hết hạn)\b/i,
      /\bthừa kế.*(\d+.*triệu|\d+.*tỷ|triệu đô)\b/i
    ],
    
    content: [
      // Yêu cầu thông tin cá nhân
      /\benter.*(password|pin|ssn|social.security).*(immediately|now|verify)\b/i,
      /\bprovide.*(credit.card|bank.account|personal.info).*(details|number)\b/i,
      /\baccount.*(will.be.*)?(closed|terminated|suspended).*(today|24.hours)\b/i,
      /\bconfirm.*(identity|account).*(clicking|visit|link)\b/i,
      
      // Dấu hiệu lừa đảo tài chính
      /\bwestern.union.*transfer.*fee\b/i,
      /\bbitcoin.*(wallet|address|payment).*(send|transfer)\b/i,
      /\badvance.fee.*fraud\b/i,
      /\bpay.*fee.*(first|upfront|advance).*receive.*money\b/i,
      /\btax.*(clearance|certificate|code).*(fee|payment)\b/i,
      
      // Mạo danh tổ chức
      /\birs.*tax.*(refund|owe|audit)\b/i,
      /\bfbi.*investigation.*money\b/i,
      /\bunited.nations.*compensation\b/i,
      /\bworld.bank.*fund\b/i,
      
      // Yêu cầu hành động gấp
      /\b(respond|reply).*(within|before).*(24.*hours?|today|immediately)\b/i,
      /\btime.*(limited|sensitive|running.out)\b/i,
      
      // Tiếng Việt
      /\bnhập.*(mật khẩu|pin|mã).*(xác minh|kiểm tra)\b/i,
      /\bcung cấp.*(số tài khoản|thông tin cá nhân|cmnd|cccd)\b/i,
      /\btài khoản.*sẽ.*bị.*(đóng|khóa).*trong.*24.*giờ\b/i,
      /\bchuyển khoản.*(phí|lệ phí).*(trước|đầu tiên)\b/i,
      /\btrả lời.*trong.*(24.*giờ|hôm nay|ngay)\b/i
    ],
    
    fromEmail: [
      // Domain miễn phí cực kỳ nguy hiểm (Phishing hotspots)
      /^[^@]+@.*\.(tk|ml|ga|cf|gq|pw|xyz|top|click|online|site|website|info\.tm|uu\.gl)$/i,
      /^[^@]+@.*\.(bid|win|download|stream|review|link|zip|work|men|loan|trade)$/i,
      
      // Temporary/Disposable email services
      /^[^@]+@.*(temp|temporary|10minute|guerrillamail|mailinator|trashmail|throwaway|disposable|fake|dummy)\./i,
      /^[^@]+@.*(yopmail|maildrop|sharklasers|guerrillamailblock|grr\.la|guerrillamail\.biz)$/i,
      /^[^@]+@.*(tempail|getairmail|emailondeck|20minutemail|mailnesia|spamgourmet)$/i,
      /^[^@]+@.*(dispostable|mohmal|mytrashmail|no-spam|spam4\.me|tempinbox|tempr)$/i,
      
      // Email có cấu trúc bất thường và nghi ngờ
      /^[^@]*\d{6,}[^@]*@/i,  // 6+ số liên tiếp
      /^[^@]*[0-9]{4,}[a-z]{0,2}\d*@/i,  // Pattern số + chữ ngắn + số
      /^[^@]*[_.-]{4,}[^@]*@/i,  // Quá nhiều dấu gạch/chấm
      /^[a-z]+\d{5,}@/i,  // Chữ + 5+ số
      /^[^@]*random[^@]*\d+@/i,  // Có từ "random" + số
      /^[^@]*test[^@]*\d*@/i,  // Có từ "test"
      
      // Mạo danh tổ chức lớn (Typosquatting + Domain spoofing)
      /^[^@]+@.*(paypal|amazon|google|microsoft|apple|facebook|twitter|linkedin|netflix|spotify|adobe|dropbox).*\.(tk|ml|ga|cf|gq|pw|xyz|top|click|online|site)$/i,
      /^[^@]*(paypal|amazon|google|microsoft|apple|facebook|twitter|instagram|whatsapp|telegram)[^@]*@(?!.*(paypal|amazon|google|microsoft|apple|facebook|twitter|instagram|whatsapp|telegram)\.(com|net)$)/i,
      /^[^@]*-?(payp4l|4mazon|g00gle|micr0soft|apple|faceb00k|twitt3r)-?[^@]*@/i,  // Leet speak
      /^[^@]*(paipal|amazom|googIe|microsft|appIe|facebbok|twittr)[^@]*@/i,  // Typos phổ biến
      
      // Admin/Support fake accounts
      /^(admin|support|security|help|service|noreply|no-reply|notification|alert)\d+@/i,
      /^(admin|support|security|help|service)[-_]?(team|dept|center|office)\d*@/i,
      /^(system|server|network|technical|it)[-_]?(admin|support|team)\d*@/i,
      
      // Mạo danh ngân hàng và tổ chức tài chính
      /^[^@]+@.*(bank|banking|finance|credit|loan|mortgage|investment).*\.(tk|ml|ga|cf|gq|pw|xyz|top)$/i,
      /^[^@]*-?(visa|mastercard|amex|discover|chase|wellsfargo|bankofamerica|citibank)-?[^@]*@(?!.*(visa|mastercard|discover|chase|wellsfargo|bankofamerica|citibank)\.(com|net)$)/i,
      
      // Mạo danh chính phủ và tổ chức
      /^[^@]+@.*(gov|official|government|federal|state|tax|irs|fbi|cia|police).*\.(tk|ml|ga|cf|gq|pw|xyz|top|com|net|org)$/i,
      /^[^@]+@(?!.*\.gov$).*(government|federal|treasury|irs|homeland|justice|defense)\./i,
      
      // Pattern nguy hiểm khác
      /^[^@]+@[^.]*\.(com|net|org)\.(tk|ml|ga|cf|gq)$/i,  // Double domain extension
      /^[^@]+@.*\d+\.(tk|ml|ga|cf|gq|pw|xyz|top)$/i,  // Số trong subdomain + domain nguy hiểm
      /^[^@]*[\u0400-\u04FF\u4e00-\u9fff\u0590-\u05FF\u0600-\u06FF][^@]*@/i, // Non-Latin scripts
      /^[^@]*[A-Z]{5,}[^@]*@/i,  // Quá nhiều chữ hoa liên tiếp
      /^.{1,2}@/i,  // Username quá ngắn (1-2 ký tự)
      /^.{50,}@/i,  // Username quá dài (50+ ký tự)
      
      // Cryptocurrency/Investment scam patterns
      /^[^@]*(bitcoin|crypto|blockchain|ethereum|trading|forex|invest|profit|earning|mining)[^@]*\d*@/i,
      /^[^@]*(wallet|exchange|trader|investor|btc|eth|usdt)[^@]*@/i,
      
      // Dating/Romance scam patterns
      /^[^@]*(love|heart|romance|dating|single|sexy|beautiful|handsome)[^@]*\d*@/i,
      /^[^@]*(widow|widower|soldier|doctor|engineer|businessman)[^@]*\d+@/i
    ]
  },

  // Patterns cho SPAM - Mức độ trung bình
  SPAM_PATTERNS: {
    title: [
      /\bbuy.*(now|today).*(discount|sale|\d+%.*off)\b/i,
      /\b(limited.*time|special|exclusive).*(offer|deal|promotion)\b/i,
      /\bfree.*(money|gift|trial|shipping)\b/i,
      /\bmake.*\$?\d+.*(per.*(day|week|month)|fast|easy)\b/i,
      /\bwork.*from.*home.*(opportunity|job|income)\b/i,
      /\blose.*weight.*(fast|quick|easy|guaranteed)\b/i,
      /\b(viagra|cialis|pharmacy|medication).*(cheap|discount|online)\b/i,
      /\bcasino.*(bonus|free.*spins|jackpot)\b/i,
      /\blottery.*(winner|jackpot|million)\b/i,
      /\bget.*rich.*(quick|fast|scheme)\b/i,
      /\bmlm|multi.*level.*marketing\b/i,
      /\b(forex|binary.*options|crypto).*trading.*profit\b/i,
      
      // Tiếng Việt
      /\bmua.*ngay.*(giảm giá|khuyến mãi|\d+%)\b/i,
      /\bmiễn phí.*(giao hàng|dùng thử|quà tặng)\b/i,
      /\bkiếm tiền.*(tại nhà|online|nhanh)\b/i,
      /\bgiảm cân.*(nhanh|hiệu quả|an toàn)\b/i,
    ],
    
    content: [
      /\bunsubscribe.*click.*here\b/i,
      /\bbuy.*one.*get.*one.*(free|50%.*off)\b/i,
      /\blimited.*(stock|quantity|time).*hurry\b/i,
      /\bact.*now.*offer.*expires\b/i,
      /\bspecial.*promotion.*today.*only\b/i,
      /\bexclusive.*deal.*vip.*members\b/i,
      /\bmulti.*level.*marketing.*opportunity\b/i,
      /\bpyramid.*scheme.*investment\b/i,
      /\bforex.*trading.*signals.*profit\b/i,
      /\bbinary.*options.*strategy\b/i,
      /\baffiliate.*marketing.*commission\b/i,
      /\bdrop.*shipping.*business\b/i,
      /\bsupplement.*(miracle|breakthrough|secret)\b/i,
      
      // Pattern email marketing
      /\bif.*you.*no.*longer.*wish.*receive\b/i,
      /\bthis.*email.*was.*sent.*to.*you.*because\b/i,
      /\byou.*are.*receiving.*this.*email.*because\b/i,
      
      // Tiếng Việt
      /\bhủy.*đăng.ký.*nhấn.*vào.*đây\b/i,
      /\bmua.*1.*tặng.*1.*miễn.*phí\b/i,
      /\bhành.*động.*ngay.*ưu.*đãi.*hết.*hạn\b/i,
      /\bđầu.*tư.*forex.*lãi.*suất.*cao\b/i,
    ],
    
    fromEmail: [
      // Email marketing spam patterns
      /^(promo|promotion|deals|offer|marketing|newsletter|sales|discount|coupon|special|limited)@/i,
      /^(noreply|no-reply|donotreply|do-not-reply|automail|automated)@.*(promo|deals|marketing|ads|shop|sale)/i,
      /^[^@]*-?(newsletter|promo|deals|offer|sale|discount|coupon|special|limited|exclusive)-?[^@]*@/i,
      /^[^@]+@.*(marketing|promo|ads|deals|shop|sale|discount|coupon|affiliate|campaign)\./i,
      
      // Bulk email senders
      /^[^@]*(bulk|mass|blast|campaign|auto|automated|batch)[^@]*@/i,
      /^[^@]*(mailgun|sendgrid|mailchimp|constantcontact|aweber|getresponse)[^@]*@/i,
      
      // Suspicious email patterns
      /^[^@]*[0-9]+-(promo|deals|offers|marketing|sales)@/i,
      /^(info|contact|hello|hi|hey|support)@.*(promo|deals|marketing|shop|sale)\./i,
      
      // MLM và affiliate marketing
      /^[^@]*(mlm|affiliate|referral|commission|earning|income|opportunity|business|venture)[^@]*@/i,
      /^[^@]*(workfromhome|makemoney|getrich|earnmoney|passiveincome|sidehustle)[^@]*@/i,
      
      // Casino và gambling spam
      /^[^@]*(casino|poker|gambling|lottery|jackpot|winner|prize|slots|betting)[^@]*@/i,
      /^[^@]*(freespin|bonus|deposit|withdraw|payout|winnings)[^@]*@/i,
      
      // Adult/Dating spam
      /^[^@]*(adult|xxx|porn|sexy|hot|dating|hookup|meet|single|lonely|mature)[^@]*@/i,
      /^[^@]*(escort|massage|webcam|cam|model|chat|flirt)[^@]*@/i,
      
      // Pharmaceutical spam
      /^[^@]*(viagra|cialis|pharmacy|pills|medication|drugs|prescription|meds)[^@]*@/i,
      /^[^@]*(weightloss|diet|supplement|enhancement|muscle|fitness)[^@]*@/i
    ]
  },

  // Patterns cho NGHI NGỜ - Mức độ cảnh báo
  SUSPICIOUS_PATTERNS: {
    title: [
      /^(re:\s*){3,}/i, // Quá nhiều Re:
      /^(fwd:\s*){2,}/i, // Quá nhiều Fwd:
      /\bhello.*dear.*(sir|madam|friend)\b/i,
      /\bgreetings?.*(friend|sir|madam)\b/i,
      /\bbusiness.*(proposal|opportunity|partnership)\b/i,
      /\bconfidential.*(matter|business|transaction)\b/i,
      /\burgent.*(business|assistance|help)\b/i,
      /\b(investment|business).*(proposal|opportunity).*million\b/i,
      
      // Tiếng Việt  
      /\bxin chào.*\b(bạn|anh|chị).*thân mến\b/i,
      /\bđề xuất.*kinh doanh.*hợp tác\b/i,
      /\bvấn đề.*bí mật.*quan trọng\b/i,
    ],
    
    content: [
      /\bdear.*(sir|madam).*greetings\b/i,
      /\bi.*hope.*this.*email.*finds.*you.*well\b/i,
      /\bconfidential.*(transaction|business|proposal)\b/i,
      /\bbusiness.*(partnership|proposal|opportunity)\b/i,
      /\bforeign.*(investment|contract|business)\b/i,
      /\boffshore.*(account|banking|investment)\b/i,
      /\btax.*haven.*investment\b/i,
      /\bmoney.*laundering.*scheme\b/i,
      /\bnext.*of.*kin.*inheritance\b/i,
      /\bdied.*in.*(accident|plane.*crash).*fortune\b/i,
      /\bdeceased.*(relative|client).*fund\b/i,
      
      // Yêu cầu thông tin
      /\bsend.*me.*your.*(details|information|phone)\b/i,
      /\bneed.*your.*(assistance|help|cooperation)\b/i,
      /\btrust.*worthy.*person\b/i,
      /\bstrictly.*confidential.*matter\b/i,
      
      // Tiếng Việt
      /\bkính gửi.*anh\/chị.*thân mến\b/i,
      /\btôi.*hy vọng.*email.*này.*đến.*với.*bạn\b/i,
      /\bgiao dịch.*bí mật.*tin cậy\b/i,
      /\bcần.*sự.*hỗ trợ.*của.*bạn\b/i,
    ],
    
    fromEmail: [
      // Email có cấu trúc đáng nghi
      /^[^@]*\+[^@]*@/i, // Email có dấu +
      /^[^@]*\d{4,}[^@]*@/i, // Email có 4+ số liên tiếp
      /^[^@]{1,3}@/i, // Username quá ngắn (1-3 ký tự)
      /^[^@]{30,}@/i, // Username quá dài (30+ ký tự)
      /^[^@]*[._-]{3,}[^@]*@/i, // Quá nhiều dấu gạch/chấm
      
      // Temporary và disposable email
      /^[^@]+@(temp|temporary|10minute|guerrilla|throwaway|disposable)mail\./i,
      /^[^@]+@.*(temp|fake|test|dummy|trash|junk|spam|throw)\./i,
      /^[^@]+@.*(tempmail|fakeinbox|deadaddress|spambox|binmail)\./i,
      
      // Domain nghi ngờ
      /^[^@]+@[^.]*\.(tk|ml|ga|cf|gq|pw|xyz|top|online|site|website|click|link|download|stream)$/i,
      /^[^@]+@.*(\.tk\.|\.ml\.|\.ga\.|\.cf\.|\.gq\.|\.pw\.)/i,
      
      // Pattern tự động tạo
      /^[^@]*(auto|automatic|generated|system|bot|robot|ai)[^@]*\d*@/i,
      /^[^@]*(default|sample|example|placeholder|demo)[^@]*@/i,
      
      // Email có pattern lạ
      /^[a-z]{1,2}\d{3,}@/i, // 1-2 chữ cái + 3+ số
      /^[^@]*[qwertyuiopasdfghjklzxcvbnm]{8,}[^@]*@/i, // Keyboard pattern
      /^[^@]*[abcdefghijklmnopqrstuvwxyz]{10,}@/i, // Alphabet sequence
      /^[^@]*[123456789]{3,}[^@]*@/i, // Number sequence
      
      // Suspicious name patterns
      /^[^@]*(user|client|customer|member|account|person|individual)\d+@/i,
      /^[^@]*(nobody|anonymous|unknown|guest|visitor|stranger)\d*@/i,
      
      // Business proposal related (Nigerian scam patterns)
      /^[^@]*(business|proposal|investment|fund|project|contract|deal)\d*@/i,
      /^[^@]*(barrister|lawyer|attorney|solicitor|advocate|counsel)[^@]*@/i,
      /^[^@]*(manager|director|ceo|president|chairman|officer)[^@]*@/i,
      
      // Suspicious geographic/cultural indicators
      /^[^@]*(nigeria|lagos|abuja|accra|ghana|kenya|uganda|cameroon|benin)[^@]*@/i,
      /^[^@]*(prince|princess|chief|elder|rev|pastor|imam|sheikh)[^@]*@/i,
      
      // Multiple underscore/dash patterns
      /^[^@]*_{2,}[^@]*@/i, // 2+ underscores
      /^[^@]*-{2,}[^@]*@/i, // 2+ dashes
      /^[^@]*\.{2,}[^@]*@/i, // 2+ dots in username
      
      // Mixed case in suspicious way
      /^[^@]*[a-z][A-Z][a-z][A-Z][^@]*@/i, // Alternating case
      /^[A-Z]{2,}[a-z]*\d*@/i // Starts with multiple caps + lowercase + numbers
    ]
  },

  // Patterns cho AN TOÀN - Mức độ tin cậy
  SAFE_PATTERNS: {
    title: [
      /\bmeeting.*(reminder|invitation|update)\b/i,
      /\bproject.*(update|status|report)\b/i,
      /\bnewsletter.*\d{4}\b/i, // Newsletter có năm
      /\breceipt.*order.*#?\d+\b/i,
      /\bwelcome.*(aboard|to.*team|message)\b/i,
      /\bpassword.*reset.*request\b/i,
      /\binvoice.*#?\d+.*payment\b/i,
      /\bappointment.*(confirmation|reminder)\b/i,
      /\bsubscription.*(confirmation|renewal)\b/i,
      
      // Tiếng Việt
      /\bnhắc nhở.*cuộc họp\b/i,
      /\bcập nhật.*dự án\b/i,
      /\bhóa đơn.*thanh toán\b/i,
      /\bxác nhận.*đăng.ký\b/i,
    ],
    
    content: [
      /\bthank.*you.*for.*your.*(order|purchase|subscription)\b/i,
      /\byour.*(subscription|membership).*(renewed|confirmed)\b/i,
      /\bmeeting.*scheduled.*for.*\d{1,2}\/\d{1,2}\/\d{4}\b/i,
      /\bplease.*review.*attached.*(document|file|report)\b/i,
      /\b(kind|best).*(regards|wishes)\b/i,
      /\bsincerely.*yours?\b/i,
      /\byour.*order.*has.*been.*(shipped|confirmed|processed)\b/i,
      /\bpassword.*reset.*instructions\b/i,
      
      // Professional signatures
      /\b\w+.*\w+\s*\|\s*\w+.*department\b/i,
      /\bphone:.*\d{3}-?\d{3}-?\d{4}\b/i,
      /\boffice:.*\d+\b/i,
      
      // Tiếng Việt
      /\bcảm ơn.*bạn.*đã.*đặt.*hàng\b/i,
      /\bđơn hàng.*được.*xác nhận\b/i,
      /\btrân trọng.*kính chào\b/i,
      /\bthành kính.*cảm ơn\b/i,
    ],
    
    fromEmail: [
      // Trusted domains
      /^[^@]+@(gmail|yahoo|hotmail|outlook|live|icloud)\.com$/i,
      /^[^@]+@.*\.(edu|gov|org|ac\.uk|edu\.au)$/i,
      
      // Official company emails  
      /^(support|help|service|info|contact)@(microsoft|google|apple|amazon|paypal|facebook|twitter|linkedin|github|stackoverflow)\.com$/i,
      /^no-?reply@(github|linkedin|facebook|twitter|google|microsoft|apple|amazon|paypal|netflix|spotify|adobe|slack)\.com$/i,
      
      // Professional patterns
      /^[a-z]+\.[a-z]+@[a-z-]+\.(com|net|org)$/i, // firstname.lastname@company.com
      /^[a-z]+@[a-z-]+\.(com|net|org|co\.uk|com\.au)$/i, // name@company.com
      
      // University/Government
      /^[^@]+@.*\.edu$/i,
      /^[^@]+@.*\.gov$/i,
      /^[^@]+@.*\.org$/i,
    ]
  }
};

// Service functions
export const AIcheckService = {
  // Hàm phân tích patterns trước khi gửi AI (chặt chẽ)
  analyzePatterns(emailData) {
    const analysis = {
      riskLevel: 'AN TOÀN',
      confidence: 50,
      detectedPatterns: [],
      fieldAnalysis: {},
      domainAnalysis: null
    };

    let riskScore = 0;
    let safeScore = 0;
    let totalPatterns = 0;

    // Phân tích domain email trước (impact giảm)
    if (emailData.fromEmail) {
      analysis.domainAnalysis = this.analyzeDomain(emailData.fromEmail);
      // Giảm impact của domain analysis xuống 70%
      riskScore += Math.round(analysis.domainAnalysis.riskScore * 0.7);
      safeScore += Math.round(analysis.domainAnalysis.safeScore * 0.7);
    }

    // Kiểm tra từng field với weight khác nhau
    Object.keys(emailData).forEach(field => {
      if (!emailData[field]) return;

      const fieldText = emailData[field].toLowerCase();
      const fieldAnalysis = {
        safe: 0,
        suspicious: 0, 
        spam: 0,
        fake: 0,
        patterns: [],
        weight: this.getFieldWeight(field)
      };

      const fieldMap = {
        title: 'title',
        content: 'content', 
        fromEmail: 'fromEmail',
        toEmail: 'fromEmail' // Dùng chung pattern với fromEmail
      };

      const mappedField = fieldMap[field];
      if (!mappedField) return;

      // Kiểm tra patterns GIẢ MẠO
      if (SECURITY_PATTERNS.FAKE_PATTERNS[mappedField]) {
        SECURITY_PATTERNS.FAKE_PATTERNS[mappedField].forEach((pattern, index) => {
          if (pattern.test(emailData[field])) {
            fieldAnalysis.fake++;
            fieldAnalysis.patterns.push(`Giả mạo: Pattern ${index + 1}`);
            // Điểm số cân bằng hơn cho fromEmail
            const multiplier = field === 'fromEmail' ? 10 : 15;
            riskScore += (fieldAnalysis.weight * multiplier);
            totalPatterns++;
          }
        });
      }

      // Kiểm tra patterns SPAM 
      if (SECURITY_PATTERNS.SPAM_PATTERNS[mappedField]) {
        SECURITY_PATTERNS.SPAM_PATTERNS[mappedField].forEach((pattern, index) => {
          if (pattern.test(emailData[field])) {
            fieldAnalysis.spam++;
            fieldAnalysis.patterns.push(`Spam: Pattern ${index + 1}`);
            const multiplier = field === 'fromEmail' ? 6 : 8;
            riskScore += (fieldAnalysis.weight * multiplier);
            totalPatterns++;
          }
        });
      }

      // Kiểm tra patterns NGHI NGỜ
      if (SECURITY_PATTERNS.SUSPICIOUS_PATTERNS[mappedField]) {
        SECURITY_PATTERNS.SUSPICIOUS_PATTERNS[mappedField].forEach((pattern, index) => {
          if (pattern.test(emailData[field])) {
            fieldAnalysis.suspicious++;
            fieldAnalysis.patterns.push(`Nghi ngờ: Pattern ${index + 1}`);
            const multiplier = field === 'fromEmail' ? 3 : 4;
            riskScore += (fieldAnalysis.weight * multiplier);
            totalPatterns++;
          }
        });
      }

      // Kiểm tra patterns AN TOÀN (Điểm cộng)
      if (SECURITY_PATTERNS.SAFE_PATTERNS[mappedField]) {
        SECURITY_PATTERNS.SAFE_PATTERNS[mappedField].forEach((pattern, index) => {
          if (pattern.test(emailData[field])) {
            fieldAnalysis.safe++;
            fieldAnalysis.patterns.push(`An toàn: Pattern ${index + 1}`);
            safeScore += (fieldAnalysis.weight * 3);
            totalPatterns++;
          }
        });
      }

      // Kiểm tra thêm các dấu hiệu đặc biệt
      const specialAnalysis = this.checkSpecialIndicators(fieldText, fieldAnalysis, field);
      riskScore += specialAnalysis.extraRisk || 0;
      safeScore += specialAnalysis.extraSafe || 0;

      analysis.fieldAnalysis[field] = fieldAnalysis;
    });

    // Tính toán final score với logic chặt chẽ hơn
    const finalScore = riskScore - safeScore;
    const normalizedScore = this.normalizeScore(finalScore, totalPatterns);

    // Xác định mức độ rủi ro với ngưỡng cân bằng
    if (finalScore >= 30 || (analysis.fieldAnalysis.fromEmail?.fake >= 2 && finalScore >= 20)) {
      analysis.riskLevel = 'GIẢ MẠO';
      analysis.confidence = Math.min(95, Math.max(75, 65 + normalizedScore));
    } else if (finalScore >= 18 || (totalPatterns >= 4 && finalScore >= 12)) {
      analysis.riskLevel = 'SPAM';  
      analysis.confidence = Math.min(88, Math.max(65, 55 + normalizedScore));
    } else if (finalScore >= 10 || (totalPatterns >= 3 && finalScore >= 7)) {
      analysis.riskLevel = 'NGHI NGỜ';
      analysis.confidence = Math.min(82, Math.max(55, 45 + normalizedScore));
    } else if (safeScore > riskScore && safeScore >= 5) {
      analysis.riskLevel = 'AN TOÀN';
      analysis.confidence = Math.min(90, Math.max(65, 75 + (safeScore - riskScore)));
    } else {
      analysis.riskLevel = 'AN TOÀN';
      analysis.confidence = Math.max(50, 70 - Math.abs(normalizedScore));
    }

    // Điều chỉnh confidence dựa trên số lượng patterns (cân bằng)
    if (totalPatterns >= 6) {
      analysis.confidence = Math.min(92, analysis.confidence + 3);
    } else if (totalPatterns >= 4) {
      analysis.confidence = Math.min(88, analysis.confidence + 2);
    }

    analysis.totalRiskScore = finalScore;
    analysis.totalSafeScore = safeScore;
    analysis.totalPatterns = totalPatterns;

    return analysis;
  },

  // Hàm phân tích domain email chi tiết
  analyzeDomain(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    const analysis = {
      domain: domain,
      riskScore: 0,
      safeScore: 0,
      type: 'unknown',
      indicators: []
    };

    if (!domain) return analysis;

    // Domain miễn phí nguy hiểm
    const dangerousDomains = ['tk', 'ml', 'ga', 'cf', 'gq', 'pw', 'xyz', 'top'];
    if (dangerousDomains.some(d => domain.endsWith('.' + d))) {
      analysis.riskScore += 20;
      analysis.type = 'dangerous_free';
      analysis.indicators.push('Domain miễn phí nguy hiểm');
    }

    // Temporary email services
    const tempDomains = ['10minutemail', 'guerrillamail', 'mailinator', 'trashmail', 'tempmail'];
    if (tempDomains.some(d => domain.includes(d))) {
      analysis.riskScore += 15;
      analysis.type = 'temporary';
      analysis.indicators.push('Email tạm thời');
    }

    // Domain an toàn
    const safeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const officialDomains = ['microsoft.com', 'google.com', 'apple.com', 'amazon.com', 'paypal.com'];
    const eduGovDomains = ['.edu', '.gov', '.org'];

    if (safeDomains.includes(domain)) {
      analysis.safeScore += 10;
      analysis.type = 'trusted_consumer';
      analysis.indicators.push('Domain tin cậy');
    } else if (officialDomains.includes(domain)) {
      analysis.safeScore += 15;
      analysis.type = 'official';
      analysis.indicators.push('Domain chính thức');
    } else if (eduGovDomains.some(d => domain.endsWith(d))) {
      analysis.safeScore += 12;
      analysis.type = 'institutional';
      analysis.indicators.push('Domain tổ chức');
    }

    // Kiểm tra subdomain và pattern lạ
    if (domain.split('.').length > 3) {
      analysis.riskScore += 5;
      analysis.indicators.push('Subdomain phức tạp');
    }

    // Kiểm tra ký tự số nhiều
    if (/\d{4,}/.test(domain)) {
      analysis.riskScore += 8;
      analysis.indicators.push('Domain chứa nhiều số');
    }

    return analysis;
  },

  // Hàm lấy weight cho từng field
  getFieldWeight(field) {
    const weights = {
      fromEmail: 1.1,  // Email mức trung bình-khá
      title: 1.2,      // Title khá quan trọng  
      content: 1.0,    // Content bình thường
      toEmail: 0.8     // Email đích ít quan trọng
    };
    return weights[field] || 1.0;
  },

  // Kiểm tra các indicator đặc biệt
  checkSpecialIndicators(text, fieldAnalysis, fieldType) {
    let extraRisk = 0;
    let extraSafe = 0;

    // Kiểm tra độ dài bất thường  
    if (fieldType === 'title' && text.length > 200) {
      extraRisk += 3;
      fieldAnalysis.patterns.push('Tiêu đề quá dài');
    }

    // Kiểm tra ký tự đặc biệt nhiều
    const specialChars = (text.match(/[!@#$%^&*()_+={}\]:";'<>?,./\\]/g) || []).length;
    if (specialChars > text.length * 0.1) {
      extraRisk += 2;
      fieldAnalysis.patterns.push('Quá nhiều ký tự đặc biệt');
    }

    // Kiểm tra chữ hoa toàn bộ (SPAM indicator)
    const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (upperCaseRatio > 0.7 && text.length > 20) {
      extraRisk += 4;
      fieldAnalysis.patterns.push('Quá nhiều chữ hoa');
    }

    // Kiểm tra từ ngữ chuyên nghiệp (safe indicator)
    const professionalWords = ['regards', 'sincerely', 'meeting', 'project', 'team', 'company', 'department', 'office'];
    const professionalCount = professionalWords.filter(word => text.includes(word)).length;
    if (professionalCount >= 2) {
      extraSafe += 3;
      fieldAnalysis.patterns.push('Từ ngữ chuyên nghiệp');
    }

    // Kiểm tra URL shorteners (nguy hiểm)
    if (/\b(bit\.ly|tinyurl|t\.co|goo\.gl|short\.link|ow\.ly|is\.gd)\b/i.test(text)) {
      extraRisk += 8;
      fieldAnalysis.patterns.push('URL rút gọn đáng nghi');
    }

    fieldAnalysis.extraRisk = extraRisk;
    fieldAnalysis.extraSafe = extraSafe;
    return fieldAnalysis;
  },

  // Hàm normalize score
  normalizeScore(score, totalPatterns) {
    if (totalPatterns === 0) return 0;
    return Math.min(50, Math.max(-20, score / Math.max(1, totalPatterns) * 10));
  },

  // Hàm gọi Gemini API free để generate content
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
            maxOutputTokens: 800,
          }
        }
      );

      return {
        success: true,
        data: response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: response.data?.usageMetadata
      };
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  // Hàm kiểm tra email với phân tích patterns + AI
  async checkEmail(emailData) {
    // Bước 1: Phân tích patterns trước
    const patternAnalysis = this.analyzePatterns(emailData);
    
    // Bước 2: Tạo prompt thông minh dựa trên pattern analysis
    const prompt = this.createSmartPrompt(emailData, patternAnalysis);
    
    // Bước 3: Gọi AI để phân tích cuối cùng
    const aiResult = await this.generateContent(prompt);
    
    if (aiResult.success) {
      try {
        const aiAnalysis = JSON.parse(aiResult.data.trim());
        
        // Kết hợp kết quả AI với pattern analysis
        return {
          success: true,
          data: {
            level: aiAnalysis.level || patternAnalysis.riskLevel,
            confidence: aiAnalysis.confidence || patternAnalysis.confidence,
            reasons: aiAnalysis.reasons || this.generateReasons(patternAnalysis),
            recommendation: aiAnalysis.recommendation || this.generateRecommendation(aiAnalysis.level || patternAnalysis.riskLevel),
            patternAnalysis: patternAnalysis
          }
        };
      } catch {
        // Fallback to pattern analysis
        return {
          success: true,
          data: {
            level: patternAnalysis.riskLevel,
            confidence: patternAnalysis.confidence,
            reasons: this.generateReasons(patternAnalysis),
            recommendation: this.generateRecommendation(patternAnalysis.riskLevel),
            patternAnalysis: patternAnalysis
          }
        };
      }
    }
    
    return aiResult;
  },

  // Tạo prompt thông minh dựa trên pattern analysis
  createSmartPrompt(emailData, patternAnalysis) {
    const filledFields = Object.keys(emailData).filter(key => emailData[key]);
    const patternSummary = Object.keys(patternAnalysis.fieldAnalysis).map(field => {
      const analysis = patternAnalysis.fieldAnalysis[field];
      return `${field}: Safe(${analysis.safe}) Suspicious(${analysis.suspicious}) Spam(${analysis.spam}) Fake(${analysis.fake})`;
    }).join(', ');

    return `
    Bạn là chuyên gia bảo mật email. Phân tích email với thông tin sau:
    
    THÔNG TIN CÓ SẴN:
    ${filledFields.map(field => `- ${field}: "${emailData[field]}"`).join('\n    ')}
    
    PHÂN TÍCH PATTERN TỰ ĐỘNG:
    - Mức độ rủi ro ban đầu: ${patternAnalysis.riskLevel}
    - Độ tin cậy: ${patternAnalysis.confidence}%
    - Chi tiết patterns: ${patternSummary}
    
    NHIỆM VỤ:
    Dựa trên phân tích pattern và nội dung, đưa ra đánh giá cuối cùng theo 4 mức:
    1. AN TOÀN - Email bình thường, đáng tin cậy
    2. NGHI NGỜ - Cần cẩn thận, có một số dấu hiệu đáng chú ý  
    3. SPAM - Email rác, quảng cáo không mong muốn
    4. GIẢ MẠO - Email lừa đảo, giả danh nguy hiểm
    
    Trả lời JSON:
    {
      "level": "AN TOÀN|NGHI NGỜ|SPAM|GIẢ MẠO",
      "confidence": 85,
      "reasons": ["lý do logic cụ thể 1", "lý do logic cụ thể 2", "lý do logic cụ thể 3"],
      "recommendation": "khuyến nghị chi tiết cho người dùng"
    }
    
    LƯU Ý: Reasons phải logic, cụ thể và dựa trên bằng chứng thực tế trong email.
    `;
  },

  // Generate reasons từ pattern analysis  
  generateReasons(patternAnalysis) {
    const reasons = [];
    
    Object.keys(patternAnalysis.fieldAnalysis).forEach(field => {
      const analysis = patternAnalysis.fieldAnalysis[field];
      
      if (analysis.fake > 0) {
        reasons.push(`${field} chứa ${analysis.fake} dấu hiệu giả mạo/lừa đảo`);
      }
      if (analysis.spam > 0) {
        reasons.push(`${field} có ${analysis.spam} pattern spam điển hình`);
      }
      if (analysis.suspicious > 0) {
        reasons.push(`${field} xuất hiện ${analysis.suspicious} yếu tố đáng nghi`);
      }
      if (analysis.safe > 0) {
        reasons.push(`${field} có ${analysis.safe} dấu hiệu tích cực`);
      }
    });
    
    return reasons.length > 0 ? reasons : ['Không phát hiện pattern đặc biệt'];
  },

  // Generate recommendation
  generateRecommendation(level) {
    const recommendations = {
      'AN TOÀN': 'Email có vẻ an toàn. Vẫn nên thận trọng với các liên kết và tệp đính kèm.',
      'NGHI NGỜ': 'Hãy xác minh người gửi qua kênh khác trước khi thực hiện bất kỳ hành động nào.',  
      'SPAM': 'Nên xóa email này và đánh dấu là spam. Không tương tác với nội dung.',
      'GIẢ MẠO': 'NGUY HIỂM! Không click link, không cung cấp thông tin cá nhân. Báo cáo email này.'
    };
    
    return recommendations[level] || 'Cần phân tích thêm để đưa ra khuyến nghị phù hợp.';
  }

};

export default AIcheckService;