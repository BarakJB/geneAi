import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Badge,
  Progress,
  Tag,
  Space,
  Divider,
  Statistic,
  Alert,
  Modal,
  List,
  Rate,
  Tabs,
  Select,
  Input,
  Empty,
  Button,
  FloatButton,
  Drawer,
  message
} from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  StarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  SendOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import apiService from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { TextArea } = Input;

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  clientContext?: string;
}

interface ClientProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  status: 'lead' | 'client' | 'prospect';
  lastContact: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  
  // Financial Data
  monthlyIncome: number;
  currentPensionBalance: number;
  currentInsurances: string[];
  
  // AI Insights
  aiInsights: {
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    lifestage: 'young' | 'family' | 'pre-retirement' | 'retired';
    recommendedProducts: string[];
    urgentActions: string[];
    opportunities: string[];
    nextBestAction: string;
    confidenceScore: number;
  };
  
  // Behavioral Data
  engagement: {
    emailOpenRate: number;
    responseRate: number;
    meetingAttendance: number;
    lastInteraction: string;
  };
}

const BionicAgent: React.FC = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Mock data with AI insights
  useEffect(() => {
    const mockClients: ClientProfile[] = [
      {
        id: '1',
        name: 'דני כהן',
        age: 32,
        email: 'danny@example.com',
        phone: '050-1234567',
        status: 'lead',
        lastContact: '2024-01-15',
        score: 85,
        priority: 'high',
        monthlyIncome: 18500,
        currentPensionBalance: 145000,
        currentInsurances: ['ביטוח בריאות פרטי', 'ביטוח רכב'],
        aiInsights: {
          riskProfile: 'moderate',
          lifestage: 'family',
          recommendedProducts: ['ביטוח חיים', 'ביטוח נכות', 'קרן השתלמות'],
          urgentActions: ['בדיקת ביטוח חיים', 'העברת פנסיה'],
          opportunities: ['חיסכון 15% בעמלות', 'הגדלת כיסוי ביטוחי'],
          nextBestAction: 'תיאום פגישה לבדיקת ביטוח חיים - פוטנציאל חיסכון גבוה',
          confidenceScore: 92
        },
        engagement: {
          emailOpenRate: 78,
          responseRate: 45,
          meetingAttendance: 89,
          lastInteraction: 'פתח אימייל לפני 2 ימים'
        }
      },
      {
        id: '2',
        name: 'שרה לוי',
        age: 45,
        email: 'sarah@example.com',
        phone: '054-9876543',
        status: 'client',
        lastContact: '2024-01-20',
        score: 72,
        priority: 'medium',
        monthlyIncome: 25000,
        currentPensionBalance: 320000,
        currentInsurances: ['ביטוח בריאות', 'ביטוח חיים', 'ביטוח נכות'],
        aiInsights: {
          riskProfile: 'conservative',
          lifestage: 'pre-retirement',
          recommendedProducts: ['מסלול פנסיוני שמרני', 'ביטוח טיפול סיעודי'],
          urgentActions: ['אופטימיזציה לקראת פרישה'],
          opportunities: ['שינוי מסלול פנסיוני', 'הוספת כיסוי סיעודי'],
          nextBestAction: 'פגישת תכנון פרישה - צפוי חיסכון של 50,000 ₪',
          confidenceScore: 88
        },
        engagement: {
          emailOpenRate: 92,
          responseRate: 67,
          meetingAttendance: 95,
          lastInteraction: 'השיבה לאימייל היום'
        }
      },
      {
        id: '3',
        name: 'מיכל רוזן',
        age: 28,
        email: 'michal@example.com',
        phone: '052-5555555',
        status: 'prospect',
        lastContact: '2024-01-10',
        score: 58,
        priority: 'low',
        monthlyIncome: 12000,
        currentPensionBalance: 45000,
        currentInsurances: ['ביטוח רכב'],
        aiInsights: {
          riskProfile: 'aggressive',
          lifestage: 'young',
          recommendedProducts: ['ביטוח בריאות', 'קרן השתלמות', 'חיסכון לטווח ארוך'],
          urgentActions: ['הקמת ביטוח בריאות בסיסי'],
          opportunities: ['התחלת חיסכון פנסיוני מוקדם', 'ניצול הטבות מס'],
          nextBestAction: 'הצעת חבילת צעירים - פוטנציאל לקוח לטווח ארוך',
          confidenceScore: 75
        },
        engagement: {
          emailOpenRate: 34,
          responseRate: 12,
          meetingAttendance: 40,
          lastInteraction: 'לא פתח אימיילים השבוע'
        }
      },
      {
        id: '4',
        name: 'יוסי אברהם',
        age: 52,
        email: 'yossi@example.com',
        phone: '050-7777777',
        status: 'client',
        lastContact: '2024-01-22',
        score: 94,
        priority: 'high',
        monthlyIncome: 35000,
        currentPensionBalance: 890000,
        currentInsurances: ['ביטוח בריאות מורחב', 'ביטוח חיים', 'ביטוח נכות', 'ביטוח טיפול סיעודי'],
        aiInsights: {
          riskProfile: 'moderate',
          lifestage: 'pre-retirement',
          recommendedProducts: ['אופטימיזציה פנסיונית', 'ייעוץ השקעות'],
          urgentActions: ['סקירת תיק השקעות'],
          opportunities: ['חיסכון בעמלות ניהול', 'הגדלת תשואות'],
          nextBestAction: 'פגישת VIP - אופטימיזציה מלאה - פוטנציאל חיסכון 120,000 ₪',
          confidenceScore: 97
        },
        engagement: {
          emailOpenRate: 100,
          responseRate: 89,
          meetingAttendance: 100,
          lastInteraction: 'קבע פגישה אתמול'
        }
      }
    ];
    
    setClients(mockClients);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'גבוהה';
      case 'medium': return 'בינונית';
      case 'low': return 'נמוכה';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'orange';
      case 'client': return 'green';
      case 'prospect': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lead': return 'ליד';
      case 'client': return 'לקוח';
      case 'prospect': return 'פרוספקט';
      default: return status;
    }
  };

  const getRiskProfileText = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'שמרני';
      case 'moderate': return 'מתון';
      case 'aggressive': return 'אגרסיבי';
      default: return risk;
    }
  };

  const getLifestageText = (stage: string) => {
    switch (stage) {
      case 'young': return 'צעיר';
      case 'family': return 'משפחה';
      case 'pre-retirement': return 'לקראת פרישה';
      case 'retired': return 'גמלאי';
      default: return stage;
    }
  };

  const handleClientClick = (client: ClientProfile) => {
    setSelectedClient(client);
    setIsModalVisible(true);
  };

  // AI Chat Functions
  const sendMessageToAI = async (userMessage: string, clientContext?: ClientProfile) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString('he-IL'),
      clientContext: clientContext?.name
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsAiTyping(true);

    try {
      const resp = await apiService.askAssistant({
        question: userMessage,
        phone: clientContext?.phone
      });

      const answerText = resp.success && (resp as any).answer
        ? (resp as any).answer
        : generateAIResponse(userMessage, clientContext);

      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: answerText,
        timestamp: new Date().toLocaleTimeString('he-IL')
      };

      setChatMessages(prev => [...prev, newAiMessage]);
    } catch (e) {
      const fallback = generateAIResponse(userMessage, clientContext);
      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallback,
        timestamp: new Date().toLocaleTimeString('he-IL')
      };
      setChatMessages(prev => [...prev, newAiMessage]);
      message.error('שגיאה בקשר ל-AI, מוצגת תשובה גנרית');
    } finally {
      setIsAiTyping(false);
    }
  };

  const generateAIResponse = (userMessage: string, clientContext?: ClientProfile): string => {
    const message = userMessage.toLowerCase();
    
    if (clientContext) {
      if (message.includes('המלצה') || message.includes('ייעוץ')) {
        return `בהתבסס על הפרופיל של ${clientContext.name}, אני ממליץ על:
        
🎯 **המלצה ראשית**: ${clientContext.aiInsights.nextBestAction}

📋 **מוצרים מומלצים**:
${clientContext.aiInsights.recommendedProducts.map(p => `• ${p}`).join('\n')}

⚠️ **פעולות דחופות**:
${clientContext.aiInsights.urgentActions.map(a => `• ${a}`).join('\n')}

💡 **רמת ודאות**: ${clientContext.aiInsights.confidenceScore}%`;
      }
      
      if (message.includes('סיכון') || message.includes('פרופיל')) {
        return `פרופיל הסיכון של ${clientContext.name}:
        
📊 **רמת סיכון**: ${getRiskProfileText(clientContext.aiInsights.riskProfile)}
👥 **שלב חיים**: ${getLifestageText(clientContext.aiInsights.lifestage)}
💰 **הכנסה חודשית**: ₪${clientContext.monthlyIncome.toLocaleString()}
🏦 **יתרת פנסיה**: ₪${clientContext.currentPensionBalance.toLocaleString()}

המלצתי היא להתמקד ב${clientContext.aiInsights.nextBestAction}`;
      }
      
      if (message.includes('מעורבות') || message.includes('קשר')) {
        return `מצב המעורבות של ${clientContext.name}:
        
📧 **פתיחת אימיילים**: ${clientContext.engagement.emailOpenRate}%
💬 **שיעור מענה**: ${clientContext.engagement.responseRate}%
📅 **נוכחות בפגישות**: ${clientContext.engagement.meetingAttendance}%
🕒 **אינטראקציה אחרונה**: ${clientContext.engagement.lastInteraction}

${clientContext.engagement.responseRate < 50 ? 
  '⚠️ רמת המעורבות נמוכה - מומלץ ליצור קשר טלפוני או להציע פגישה פנים אל פנים.' :
  '✅ רמת מעורבות טובה - ניתן להמשיך בערוצי התקשורת הנוכחיים.'}`;
      }
    }
    
    // General AI responses
    if (message.includes('שלום') || message.includes('היי')) {
      return `שלום! 👋 אני ה-AI שלך לניתוח לקוחות. 
      
אני יכול לעזור לך עם:
🔍 ניתוח פרופילי לקוחות
💡 המלצות אישיות
📊 ניתוח מעורבות
🎯 אסטרטגיות מכירה
      
על איזה לקוח תרצה לדבר?`;
    }
    
    if (message.includes('עזרה') || message.includes('help')) {
      return `אני כאן כדי לעזור! 🤖
      
**איך אני יכול לעזור:**
• לחץ על לקוח כלשהו ושאל עליו שאלות
• שאל "מה ההמלצה עבור [שם לקוח]?"
• בקש "ניתוח סיכון עבור [שם לקוח]"
• שאל על מעורבות לקוח
• בקש טיפים למכירה

**דוגמאות לשאלות:**
- "מה ההמלצה הטובה ביותר עבור דני כהן?"
- "איך לשפר מעורבות של מיכל רוזן?"
- "מה פרופיל הסיכון של שרה לוי?"`;
    }
    
    if (message.includes('טיפ') || message.includes('מכירה')) {
      return `💡 **טיפים למכירות מ-AI:**

🎯 **מיקוד לפי עדיפות**: התמקד בלקוחות עם עדיפות גבוהה (פס אדום)
📊 **השתמש בנתונים**: הציג נתונים קונקרטיים על חיסכון פוטנציאלי
⏰ **תזמון חשוב**: צור קשר בלקוחות עם מעורבות גבוהה תחילה
🔄 **מעקב**: עקוב אחר לקוחות שלא הגיבו תוך 48 שעות

רוצה ניתוח ספציפי ללקוח מסוים?`;
    }
    
    return `מעניין! 🤔 אני מנתח את השאלה שלך...

לצערי, אני לא בטוח שהבנתי בדיוק. תוכל לשאול:
• שאלות על לקוחות ספציפיים
• בקשות להמלצות
• שאלות על אסטרטגיות מכירה
• עזרה כללית

נסה שוב או כתוב "עזרה" לרשימת פקודות 😊`;
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessageToAI(currentMessage.trim(), selectedClient);
    }
  };

  const openChatWithClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setIsChatOpen(true);
    
    // Add welcome message about the client
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `היי! 👋 בחרת לדבר על ${client.name}.
      
📊 **ציון AI**: ${client.score}/100
🎯 **עדיפות**: ${getPriorityText(client.priority)}
💡 **המלצה מהירה**: ${client.aiInsights.nextBestAction}

איך אני יכול לעזור לך עם הלקוח הזה?`,
      timestamp: new Date().toLocaleTimeString('he-IL'),
      clientContext: client.name
    };
    
    setChatMessages([welcomeMessage]);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || client.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedClients = filteredClients.sort((a, b) => {
    // Sort by priority first, then by score
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.score - a.score;
  });

  const containerStyle: React.CSSProperties = {
    background: 'transparent',
    minHeight: 'calc(100vh - 88px)',
    padding: '24px',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    marginBottom: '16px',
  };

  // Dynamic CSS injection for dark theme
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bionic-agent .ant-input {
        background: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
      }
      .bionic-agent .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.6) !important;
      }
      .bionic-agent .ant-select-selector {
        background: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
      }
      .bionic-agent .ant-collapse-header {
        background: rgba(255, 255, 255, 0.05) !important;
        color: white !important;
      }
      .bionic-agent .ant-collapse-content-box {
        background: transparent !important;
        color: white !important;
      }
      .bionic-agent .ant-timeline-item-content {
        color: white !important;
      }
      .bionic-agent .ant-tabs-tab {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      .bionic-agent .ant-tabs-tab-active {
        color: white !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={containerStyle} className="bionic-agent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <RobotOutlined style={{ marginLeft: '12px', color: '#52c41a' }} />
              Bionic Agent
              <Badge count="AI" style={{ backgroundColor: '#52c41a', marginRight: '8px' }} />
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              עוזר חכם עם המלצות מותאמות אישית לכל לקוח
            </Text>
          </Col>
          <Col>
            <Space>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>מופעל על ידי AI</Text>
              <div style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: '#52c41a',
                animation: 'pulse 2s infinite'
              }} />
            </Space>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={cardStyle} styles={{ body: { padding: '16px' } }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="חיפוש לקוחות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: '100%' }}
                placeholder="סטטוס"
              >
                <Select.Option value="all">כל הסטטוסים</Select.Option>
                <Select.Option value="lead">לידים</Select.Option>
                <Select.Option value="client">לקוחות</Select.Option>
                <Select.Option value="prospect">פרוספקטים</Select.Option>
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                value={filterPriority}
                onChange={setFilterPriority}
                style={{ width: '100%' }}
                placeholder="עדיפות"
              >
                <Select.Option value="all">כל העדיפויות</Select.Option>
                <Select.Option value="high">גבוהה</Select.Option>
                <Select.Option value="medium">בינונית</Select.Option>
                <Select.Option value="low">נמוכה</Select.Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {filteredClients.length} לקוחות נמצאו
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Client Cards */}
        <Row gutter={[16, 16]}>
          {sortedClients.map((client) => (
            <Col xs={24} lg={12} xl={8} key={client.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  style={{
                    ...cardStyle,
                    cursor: 'pointer',
                    border: client.priority === 'high' ? '2px solid #ff4d4f' : cardStyle.border
                  }}
                  onClick={() => handleClientClick(client)}
                  styles={{ body: { padding: '20px' } }}
                  hoverable
                >
                  {/* Header */}
                  <Row justify="space-between" align="top">
                    <Col>
                      <Space align="center">
                        <Avatar 
                          size={48} 
                          icon={<UserOutlined />}
                          style={{ backgroundColor: '#007AFF' }}
                        />
                        <div>
                          <Title level={5} style={{ color: 'white', margin: 0 }}>
                            {client.name}
                          </Title>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                            גיל {client.age} • {client.email}
                          </Text>
                        </div>
                      </Space>
                    </Col>
                    <Col>
                      <Space direction="vertical" align="end">
                        <Badge
                          color={getPriorityColor(client.priority)}
                          text={
                            <Text style={{ color: 'white', fontSize: 12 }}>
                              {getPriorityText(client.priority)}
                            </Text>
                          }
                        />
                        <Tag color={getStatusColor(client.status)} style={{ fontSize: 11 }}>
                          {getStatusText(client.status)}
                        </Tag>
                      </Space>
                    </Col>
                  </Row>

                  <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '16px 0' }} />

                  {/* AI Score */}
                  <div style={{ marginBottom: '16px' }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                          ציון AI
                        </Text>
                      </Col>
                      <Col>
                        <Text style={{ color: 'white', fontWeight: 600 }}>
                          {client.score}/100
                        </Text>
                      </Col>
                    </Row>
                    <Progress 
                      percent={client.score} 
                      size="small" 
                      strokeColor={{
                        '0%': '#ff4d4f',
                        '50%': '#faad14',
                        '100%': '#52c41a'
                      }}
                      showInfo={false}
                    />
                  </div>

                  {/* Next Best Action */}
                  <Alert
                    message={<Text style={{ fontSize: 12 }}>AI ממליץ</Text>}
                    description={
                      <Text style={{ fontSize: 11 }}>
                        {client.aiInsights.nextBestAction}
                      </Text>
                    }
                    type="info"
                    showIcon
                    icon={<BulbOutlined />}
                    style={{ 
                      background: 'rgba(24, 144, 255, 0.1)',
                      border: '1px solid rgba(24, 144, 255, 0.3)',
                      marginBottom: '12px'
                    }}
                  />

                  {/* AI Chat Button */}
                  <Button
                    type="primary"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openChatWithClient(client);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      marginBottom: '8px',
                      width: '100%'
                    }}
                  >
                    דבר עם AI
                  </Button>

                  {/* Quick Stats */}
                  <Row gutter={8}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>הכנסה חודשית</Text>}
                        value={client.monthlyIncome}
                        prefix="₪"
                        valueStyle={{ color: 'white', fontSize: 14 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>יתרת פנסיה</Text>}
                        value={client.currentPensionBalance}
                        prefix="₪"
                        valueStyle={{ color: 'white', fontSize: 14 }}
                      />
                    </Col>
                  </Row>

                  {/* Engagement Score */}
                  <div style={{ marginTop: '12px' }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>
                          רמת מעורבות
                        </Text>
                      </Col>
                      <Col>
                        <Rate 
                          value={Math.round(client.engagement.responseRate / 20)} 
                          count={5} 
                          size={12}
                          disabled
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {sortedClients.length === 0 && (
          <Card style={cardStyle}>
            <Empty
              description="לא נמצאו לקוחות התואמים לחיפוש"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
          </Card>
        )}

        {/* Floating AI Chat Button */}
        <FloatButton
          icon={<CustomerServiceOutlined />}
          type="primary"
          style={{
            right: 24,
            bottom: 24,
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(82, 196, 26, 0.4)'
          }}
          onClick={() => setIsChatOpen(true)}
          badge={{ count: chatMessages.filter(m => m.type === 'ai' && !m.content.includes('👋')).length > 0 ? '!' : 0, color: '#ff4d4f' }}
        />

        {/* AI Chat Drawer */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
              <RobotOutlined style={{ color: '#52c41a' }} />
              <span>AI Assistant</span>
              {selectedClient && (
                <Tag color="blue" style={{ marginRight: 8 }}>
                  {selectedClient.name}
                </Tag>
              )}
            </div>
          }
          placement="left"
          width={400}
          open={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          className="bionic-agent"
          styles={{
            header: { 
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            },
            body: { 
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: 0
            }
          }}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Messages */}
            <div style={{ 
              flex: 1, 
              padding: '16px', 
              overflowY: 'auto', 
              maxHeight: 'calc(100vh - 200px)',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <RobotOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                  <Title level={4} style={{ color: 'white', marginBottom: 8 }}>
                    שלום! אני ה-AI שלך 🤖
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    כתוב "עזרה" כדי לראות איך אני יכול לעזור
                  </Text>
                </div>
              )}
              
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 8
                  }}>
                    {msg.type === 'ai' && (
                      <Avatar 
                        icon={<RobotOutlined />}
                        style={{ 
                          background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                          flexShrink: 0
                        }}
                        size="small"
                      />
                    )}
                    
                    <div style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.type === 'user' 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      border: msg.type === 'ai' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Text style={{ 
                        color: 'white', 
                        fontSize: 14, 
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.content}
                      </Text>
                      <div style={{ 
                        fontSize: 11, 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        marginTop: 4,
                        textAlign: msg.type === 'user' ? 'left' : 'right'
                      }}>
                        {msg.timestamp}
                        {msg.clientContext && (
                          <span style={{ marginRight: 8 }}>• {msg.clientContext}</span>
                        )}
                      </div>
                    </div>
                    
                    {msg.type === 'user' && (
                      <Avatar 
                        icon={<UserOutlined />}
                        style={{ 
                          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                          flexShrink: 0
                        }}
                        size="small"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {isAiTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Avatar 
                    icon={<RobotOutlined />}
                    style={{ 
                      background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                      flexShrink: 0
                    }}
                    size="small"
                  />
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                      AI מקליד...
                    </Text>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#52c41a',
                            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div style={{ 
              padding: '16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}>
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="שאל שאלה על הלקוחות..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    resize: 'none'
                  }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isAiTyping}
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: 'auto',
                    alignSelf: 'flex-end'
                  }}
                />
              </Space.Compact>
              
              {/* Quick Actions */}
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  'עזרה',
                  'טיפים למכירה',
                  selectedClient ? `המלצה עבור ${selectedClient.name}` : 'בחר לקוח'
                ].map((action, index) => (
                  <Button
                    key={action}
                    size="small"
                    onClick={() => {
                      setCurrentMessage(action);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isAiTyping || (index === 2 && !selectedClient)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Drawer>

        {/* Client Detail Modal */}
        <Modal
          title={
            <div style={{ color: 'white' }}>
              <RobotOutlined style={{ marginLeft: '8px', color: '#52c41a' }} />
              AI Analysis - {selectedClient?.name}
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={1000}
          className="bionic-agent"
        >
          {selectedClient && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="סקירה כללית" key="1">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="פרטים אישיים" size="small" style={cardStyle}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>שם: </Text>
                          <Text style={{ color: 'white' }}>{selectedClient.name}</Text>
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>גיל: </Text>
                          <Text style={{ color: 'white' }}>{selectedClient.age}</Text>
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>סטטוס: </Text>
                          <Tag color={getStatusColor(selectedClient.status)}>
                            {getStatusText(selectedClient.status)}
                          </Tag>
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>הכנסה חודשית: </Text>
                          <Text style={{ color: 'white' }}>₪{selectedClient.monthlyIncome.toLocaleString()}</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="פרופיל AI" size="small" style={cardStyle}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>פרופיל סיכון: </Text>
                          <Text style={{ color: 'white' }}>{getRiskProfileText(selectedClient.aiInsights.riskProfile)}</Text>
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>שלב חיים: </Text>
                          <Text style={{ color: 'white' }}>{getLifestageText(selectedClient.aiInsights.lifestage)}</Text>
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ציון AI: </Text>
                          <Text style={{ color: 'white' }}>{selectedClient.score}/100</Text>
                          <Progress 
                            percent={selectedClient.score} 
                            size="small" 
                            style={{ width: '60px', marginRight: '8px' }}
                            showInfo={false}
                          />
                        </div>
                        <div>
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>רמת וודאות: </Text>
                          <Text style={{ color: 'white' }}>{selectedClient.aiInsights.confidenceScore}%</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="המלצות AI" key="2">
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Alert
                      message="פעולה מומלצת הבאה"
                      description={selectedClient.aiInsights.nextBestAction}
                      type="success"
                      showIcon
                      icon={<ThunderboltOutlined />}
                      style={{ marginBottom: '16px' }}
                    />
                  </Col>
                  
                  <Col span={8}>
                    <Card title="מוצרים מומלצים" size="small" style={cardStyle}>
                      <List
                        size="small"
                        dataSource={selectedClient.aiInsights.recommendedProducts}
                        renderItem={(item) => (
                          <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>
                              <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '4px' }} />
                              {item}
                            </Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  
                  <Col span={8}>
                    <Card title="פעולות דחופות" size="small" style={cardStyle}>
                      <List
                        size="small"
                        dataSource={selectedClient.aiInsights.urgentActions}
                        renderItem={(item) => (
                          <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>
                              <AlertOutlined style={{ color: '#faad14', marginLeft: '4px' }} />
                              {item}
                            </Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  
                  <Col span={8}>
                    <Card title="הזדמנויות" size="small" style={cardStyle}>
                      <List
                        size="small"
                        dataSource={selectedClient.aiInsights.opportunities}
                        renderItem={(item) => (
                          <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>
                              <StarOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                              {item}
                            </Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="נתוני מעורבות" key="3">
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Card title="פתיחת אימיילים" size="small" style={cardStyle}>
                      <Statistic
                        value={selectedClient.engagement.emailOpenRate}
                        suffix="%"
                        valueStyle={{ color: 'white' }}
                      />
                      <Progress 
                        percent={selectedClient.engagement.emailOpenRate} 
                        strokeColor="#52c41a"
                        size="small"
                      />
                    </Card>
                  </Col>
                  
                  <Col span={8}>
                    <Card title="שיעור מענה" size="small" style={cardStyle}>
                      <Statistic
                        value={selectedClient.engagement.responseRate}
                        suffix="%"
                        valueStyle={{ color: 'white' }}
                      />
                      <Progress 
                        percent={selectedClient.engagement.responseRate} 
                        strokeColor="#1890ff"
                        size="small"
                      />
                    </Card>
                  </Col>
                  
                  <Col span={8}>
                    <Card title="נוכחות בפגישות" size="small" style={cardStyle}>
                      <Statistic
                        value={selectedClient.engagement.meetingAttendance}
                        suffix="%"
                        valueStyle={{ color: 'white' }}
                      />
                      <Progress 
                        percent={selectedClient.engagement.meetingAttendance} 
                        strokeColor="#faad14"
                        size="small"
                      />
                    </Card>
                  </Col>
                  
                  <Col span={24}>
                    <Card title="אינטראקציה אחרונה" size="small" style={cardStyle}>
                      <Text style={{ color: 'white' }}>
                        <ClockCircleOutlined style={{ marginLeft: '8px' }} />
                        {selectedClient.engagement.lastInteraction}
                      </Text>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="ביטוחים ופנסיה" key="4">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="יתרת פנסיה נוכחית" size="small" style={cardStyle}>
                      <Statistic
                        value={selectedClient.currentPensionBalance}
                        prefix="₪"
                        valueStyle={{ color: 'white', fontSize: 24 }}
                      />
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card title="ביטוחים קיימים" size="small" style={cardStyle}>
                      <Space wrap>
                        {selectedClient.currentInsurances.map((insurance) => (
                          <Tag key={insurance} color="blue">
                            {insurance}
                          </Tag>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          )}
        </Modal>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BionicAgent;
