import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Button,
  Select,
  Form,
  Collapse,
  Tag,
  Alert,
  Switch,
  message,
  Space,
} from 'antd';
import {
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ApiOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestConfig {
  name: string;
  method: string;
  url: string;
  headers: Header[];
  body: string;
  authType: string;
  apiKey: string;
  bearerToken: string;
  basicAuth: { username: string; password: string };
  timeout: number;
  followRedirects: boolean;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];


const Integrations: React.FC = () => {
  // Add custom styles for inputs to match CRM
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .integrations-component .ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .integrations-component .ant-input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .integrations-component .ant-select .ant-select-selector {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }
      
      .integrations-component .ant-select .ant-select-selection-placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      
      .integrations-component .ant-select .ant-select-selection-item {
        color: white !important;
      }
      
      .integrations-component .ant-input:focus,
      .integrations-component .ant-input-focused {
        border-color: white !important;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
      }

      .integrations-component .ant-select:focus .ant-select-selector,
      .integrations-component .ant-select-focused .ant-select-selector {
        border-color: white !important;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
      }

      .integrations-component .ant-form-item-label > label {
        color: white !important;
      }

      .integrations-component textarea.ant-input {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-color: white !important;
        color: white !important;
        border-radius: 8px !important;
      }

      .integrations-component textarea.ant-input:focus {
        border-color: white !important;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [currentRequest, setCurrentRequest] = useState<RequestConfig>({
    name: 'בקשה חדשה',
    method: 'GET',
    url: 'https://api.example.com',
    headers: [
      { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    body: '',
    authType: 'none',
    apiKey: '',
    bearerToken: '',
    basicAuth: { username: '', password: '' },
    timeout: 30000,
    followRedirects: true,
  });

  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [curlInput, setCurlInput] = useState('');

  const executeRequest = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();

      // Prepare headers
      const headers: Record<string, string> = {};
      
      currentRequest.headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      // Add authentication headers
      if (currentRequest.authType === 'api-key' && currentRequest.apiKey) {
        headers['X-API-Key'] = currentRequest.apiKey;
      } else if (currentRequest.authType === 'bearer' && currentRequest.bearerToken) {
        headers['Authorization'] = `Bearer ${currentRequest.bearerToken}`;
      } else if (currentRequest.authType === 'basic' && currentRequest.basicAuth.username) {
        const credentials = btoa(`${currentRequest.basicAuth.username}:${currentRequest.basicAuth.password}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }

      // Set default content type for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const requestOptions: RequestInit = {
        method: currentRequest.method,
        headers,
        mode: 'cors',
        credentials: 'include',
        ...(currentRequest.body && ['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && {
          body: currentRequest.body
        })
      };

      const response = await fetch(currentRequest.url, requestOptions);
      const endTime = Date.now();

      let responseData;
      const contentType = response.headers.get('content-type');

      try {
        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (parseError) {
        responseData = `Error parsing response: ${(parseError as Error).message}`;
      }

      const responseObj: Response = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: JSON.stringify(responseData).length,
      };

      setResponse(responseObj);
      message.success('הבקשה בוצעה בהצלחה!');

    } catch (error) {
      console.error('Request failed:', error);
      
      let errorMessage = 'שגיאת רשת';
      if ((error as Error).name === 'TypeError' && (error as Error).message.includes('Failed to fetch')) {
        if (currentRequest.url.includes('localhost')) {
          errorMessage = `שגיאת רשת: לא ניתן להתחבר ל-${currentRequest.url}. בדוק שהשרת פועל וזמין`;
        } else {
          errorMessage = 'שגיאת CORS או שגיאת רשת. בדוק את הURL או הגדרות הרשת';
        }
      }

      const errorResponse: Response = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: errorMessage, details: (error as Error).message },
        time: 0,
        size: 0,
      };

      setResponse(errorResponse);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      key: '',
      value: '',
      enabled: true,
    };
    setCurrentRequest(prev => ({
      ...prev,
      headers: [...prev.headers, newHeader],
    }));
  };

  const updateHeader = (id: string, field: keyof Header, value: string | boolean) => {
    setCurrentRequest(prev => ({
      ...prev,
      headers: prev.headers.map(header =>
        header.id === id ? { ...header, [field]: value } : header
      ),
    }));
  };

  const removeHeader = (id: string) => {
    setCurrentRequest(prev => ({
      ...prev,
      headers: prev.headers.filter(header => header.id !== id),
    }));
  };

  const parseCurl = () => {
    try {
      let curl = curlInput.trim();
      
      if (!curl) {
        message.warning('נא הזן פקודת cURL');
        return;
      }

      // Remove 'curl' from the beginning if exists
      curl = curl.replace(/^curl\s+/, '');

      // Parse method - fix regex and default for data requests
      let method = 'GET';
      const methodMatch = curl.match(/-X\s+(\w+)|--request\s+(\w+)/i);
      if (methodMatch) {
        method = (methodMatch[1] || methodMatch[2]).toUpperCase();
        curl = curl.replace(/-X\s+\w+|--request\s+\w+/gi, '').trim();
      } else {
        // If no method specified but has data, default to POST
        if (curl.includes('-d ') || curl.includes('--data')) {
          method = 'POST';
        }
      }

      // Parse URL - look for the URL (usually the last argument or in quotes)
      let url = '';
      const urlMatch = curl.match(/'([^']*)'|"([^"]*)"|(\S+)$/);
      if (urlMatch) {
        url = urlMatch[1] || urlMatch[2] || urlMatch[3];
        curl = curl.replace(/'[^']*'|"[^"]*"|\S+$/, '').trim();
      }

      // Parse headers
      const headers: Header[] = [];
      const headerMatches = curl.matchAll(/-H\s+'([^']*)'/g);
      for (const match of headerMatches) {
        const headerString = match[1];
        const colonIndex = headerString.indexOf(':');
        if (colonIndex !== -1) {
          const key = headerString.substring(0, colonIndex).trim();
          const value = headerString.substring(colonIndex + 1).trim();
          headers.push({
            id: Date.now().toString() + Math.random(),
            key,
            value,
            enabled: true,
          });
        }
      }

      // Parse body/data
      let body = '';
      const dataMatch = curl.match(/-d\s+'([^']*)'|--data\s+'([^']*)'/);
      if (dataMatch) {
        body = dataMatch[1] || dataMatch[2] || '';
      }

      // Parse authentication
      let authType = 'none';
      let bearerToken = '';
      let basicAuth = { username: '', password: '' };

      const authHeader = headers.find(h => h.key.toLowerCase() === 'authorization');
      if (authHeader) {
        if (authHeader.value.startsWith('Bearer ')) {
          authType = 'bearer';
          bearerToken = authHeader.value.substring(7);
        } else if (authHeader.value.startsWith('Basic ')) {
          authType = 'basic';
          try {
            const decoded = atob(authHeader.value.substring(6));
            const [username, password] = decoded.split(':');
            basicAuth = { username: username || '', password: password || '' };
          } catch (e) {
            console.error('Failed to decode basic auth:', e);
          }
        }
      }

      // Update request configuration
      setCurrentRequest(prev => ({
        ...prev,
        method,
        url,
        headers: headers.length > 0 ? headers : prev.headers,
        body,
        authType,
        bearerToken,
        basicAuth,
      }));

      message.success('cURL נותח בהצלחה!');
      setCurlInput('');

    } catch (error) {
      console.error('cURL parsing error:', error);
      message.error('שגיאה בניתוח cURL');
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    minHeight: 'calc(100vh - 140px)',
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    marginBottom: '24px',
  };

  return (
    <div style={containerStyle} className="integrations-component">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Card */}
        <Card 
          style={cardStyle}
          bodyStyle={{ padding: '32px', textAlign: 'center', direction: 'rtl' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ApiOutlined style={{ fontSize: '48px', color: '#f59e0b' }} />
            </motion.div>
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              מנהל אינטגרציות
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
              בצע בקשות HTTP למערכות חיצוניות ונהל אינטגרציות
            </Text>
          </Space>
        </Card>

        {/* Debug Console Alert */}
        <Alert
          type="info" 
          style={{
            marginBottom: '24px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#FFFFFF',
            borderRadius: '12px',
            textAlign: 'right',
            direction: 'rtl',
          }}
          message={
            <>
              <Title level={5} style={{ color: '#FFFFFF', margin: '0 0 8px 0' }}>
                🔍 למציאת בעיות - פתח את Developer Tools
              </Title>
              <Text style={{ fontSize: '14px', lineHeight: 1.5, display: 'block', marginBottom: '8px' }}>
                <strong>Windows/Linux:</strong> F12 או Ctrl+Shift+I | <strong>Mac:</strong> Cmd+Option+I
              </Text>
              <Text style={{ fontSize: '14px', lineHeight: 1.5 }}>
                לך ללשונית <strong>Console</strong> ו-<strong>Network</strong> לראות מה קורה עם הבקשה
              </Text>
            </>
          }
        />

        {/* CORS Warning for localhost requests */}
        {currentRequest.url.includes('localhost') && (
          <Alert
            type="error"
            style={{
              marginBottom: '24px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textAlign: 'right',
              direction: 'rtl',
            }}
            message={
              <>
                <Title level={5} style={{ color: '#FFFFFF', margin: '0 0 8px 0' }}>
                  🚨 זיהיתי בעיית CORS! השרת מקבל OPTIONS במקום POST
                </Title>
                <Text style={{ fontSize: '14px', lineHeight: 1.5, display: 'block', marginBottom: '16px' }}>
                  הדפדפן שולח בקשת OPTIONS (preflight) לפני הבקשה האמיתית. השרת שלך צריך להחזיר CORS headers.
                </Text>
                
                <Title level={5} style={{ color: '#FFFFFF', margin: '16px 0 8px 0' }}>
                  🔧 פתרון בשרת Node.js/Express:
                </Title>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <pre style={{
                    margin: 0,
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                  }}>
{`// הוסף בתחילת השרת שלך:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // טיפול בבקשת OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});`}
                  </pre>
                </div>

                <Title level={5} style={{ color: '#FFFFFF', margin: '16px 0 8px 0' }}>
                  🛠️ פתרונות זמניים:
                </Title>
                <ul style={{ margin: 0, paddingRight: '20px', fontSize: '14px' }}>
                  <li>התקן <strong>CORS Unblock</strong> extension בדפדפן</li>
                  <li>הפעל Chrome עם <code style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 4px' }}>--disable-web-security</code></li>
                </ul>
              </>
            }
          />
        )}

        {/* Main Interface */}
        <Card 
          style={cardStyle}
          title={
            <Space>
              <SendOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: 'white' }}>HTTP Request</span>
            </Space>
          }
          headStyle={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            direction: 'rtl',
          }}
          bodyStyle={{ padding: '32px', direction: 'rtl' }}
        >
          {/* Quick Actions */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Button
                type="primary"
                size="large"
                block
                icon={<SendOutlined />}
                onClick={executeRequest}
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: 600,
                }}
              >
                {loading ? 'שולח...' : 'שלח בקשה'}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                block
                icon={<SaveOutlined />}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: 600,
                }}
              >
                שמור הגדרות
              </Button>
            </Col>
          </Row>

          {/* cURL Import */}
          <Collapse
            ghost
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <Panel
              header={
                <Space>
                  <CodeOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    יבוא מcURL
                  </Text>
                </Space>
              }
              key="curl"
              style={{ direction: 'rtl' }}
            >
              <Row gutter={[16, 16]}>
                <Col span={18}>
                  <TextArea
                    rows={4}
                    placeholder="הדבק כאן פקודת cURL..."
                    value={curlInput}
                    onChange={(e) => setCurlInput(e.target.value)}
                    style={{ borderRadius: '8px', direction: 'ltr', textAlign: 'left' }}
                  />
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    block
                    onClick={parseCurl}
                    style={{
                      height: '100%',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      border: 'none',
                      fontWeight: 600,
                    }}
                  >
                    המר cURL
                  </Button>
                </Col>
              </Row>
            </Panel>
          </Collapse>

          {/* Request Configuration */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Form.Item label="שיטה">
                <Select
                  value={currentRequest.method}
                  onChange={(value) => setCurrentRequest(prev => ({ ...prev, method: value }))}
                  style={{ borderRadius: '8px' }}
                >
                  {httpMethods.map(method => (
                    <Select.Option key={method} value={method}>
                      {method}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item label="URL">
                <Input
                  value={currentRequest.url}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.example.com"
                  style={{ borderRadius: '8px', textAlign: 'left', direction: 'ltr' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Authentication */}
          <Card
            title="אימות"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
            headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
            bodyStyle={{ direction: 'rtl' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item label="סוג אימות">
                  <Select
                    value={currentRequest.authType}
                    onChange={(value) => setCurrentRequest(prev => ({ ...prev, authType: value }))}
                    style={{ borderRadius: '8px' }}
                  >
                    <Select.Option value="none">ללא אימות</Select.Option>
                    <Select.Option value="api-key">API Key</Select.Option>
                    <Select.Option value="bearer">Bearer Token</Select.Option>
                    <Select.Option value="basic">Basic Auth</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                {currentRequest.authType === 'api-key' && (
                  <Form.Item label="API Key">
                    <Input
                      value={currentRequest.apiKey}
                      onChange={(e) => setCurrentRequest(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="הזן API Key"
                      style={{ borderRadius: '8px', textAlign: 'left', direction: 'ltr' }}
                    />
                  </Form.Item>
                )}
                {currentRequest.authType === 'bearer' && (
                  <Form.Item label="Bearer Token">
                    <Input
                      value={currentRequest.bearerToken}
                      onChange={(e) => setCurrentRequest(prev => ({ ...prev, bearerToken: e.target.value }))}
                      placeholder="הזן Bearer Token"
                      style={{ borderRadius: '8px', textAlign: 'left', direction: 'ltr' }}
                    />
                  </Form.Item>
                )}
                {currentRequest.authType === 'basic' && (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item label="שם משתמש">
                        <Input
                          value={currentRequest.basicAuth.username}
                          onChange={(e) => setCurrentRequest(prev => ({
                            ...prev,
                            basicAuth: { ...prev.basicAuth, username: e.target.value }
                          }))}
                          placeholder="שם משתמש"
                          style={{ borderRadius: '8px', textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="סיסמה">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={currentRequest.basicAuth.password}
                          onChange={(e) => setCurrentRequest(prev => ({
                            ...prev,
                            basicAuth: { ...prev.basicAuth, password: e.target.value }
                          }))}
                          placeholder="סיסמה"
                          style={{ borderRadius: '8px', textAlign: 'right' }}
                          suffix={
                            <Button
                              type="text"
                              size="small"
                              icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Card>

          {/* Headers */}
          <Card
            title="Headers"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
            headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
            bodyStyle={{ direction: 'rtl' }}
          >
            {currentRequest.headers.map((header) => (
              <Row key={header.id} gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={1}>
                  <Switch
                    checked={header.enabled}
                    onChange={(checked) => updateHeader(header.id, 'enabled', checked)}
                    size="small"
                  />
                </Col>
                <Col span={8}>
                  <Input
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    style={{ borderRadius: '8px', textAlign: 'left', direction: 'ltr' }}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    style={{ borderRadius: '8px', textAlign: 'left', direction: 'ltr' }}
                  />
                </Col>
                <Col span={3}>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeHeader(header.id)}
                    style={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addHeader}
              style={{
                width: '100%',
                borderRadius: '8px',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
              }}
            >
              הוסף Header
            </Button>
          </Card>

          {/* Request Body */}
          {['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && (
            <Card
              title="Body"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
              headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
              bodyStyle={{ direction: 'rtl' }}
            >
              <TextArea
                rows={6}
                placeholder="Body content (JSON, XML, etc.)"
                value={currentRequest.body}
                onChange={(e) => setCurrentRequest(prev => ({ ...prev, body: e.target.value }))}
                style={{ borderRadius: '8px', direction: 'ltr', textAlign: 'left' }}
              />
            </Card>
          )}
        </Card>

        {/* Response Card */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card 
              style={cardStyle}
              title={
                <Space>
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : response.status === 0 ? (
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  ) : (
                    <WarningOutlined style={{ color: '#faad14' }} />
                  )}
                  <span style={{ color: 'white' }}>Response</span>
                  <Tag
                    color={response.status >= 200 && response.status < 300 ? 'success' : 
                          response.status === 0 ? 'error' : 'warning'}
                  >
                    {response.status} {response.statusText}
                  </Tag>
                </Space>
              }
              headStyle={{
                background: 'transparent',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                direction: 'rtl',
              }}
              bodyStyle={{ padding: '32px', direction: 'rtl' }}
            >
              {/* Response Stats */}
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                    bodyStyle={{ padding: '16px', textAlign: 'center' }}
                  >
                    <Text style={{ color: 'white', fontSize: '12px' }}>זמן תגובה</Text>
                    <br />
                    <Text style={{ color: '#1890ff', fontSize: '18px', fontWeight: 600 }}>
                      {response.time}ms
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                    bodyStyle={{ padding: '16px', textAlign: 'center' }}
                  >
                    <Text style={{ color: 'white', fontSize: '12px' }}>גודל</Text>
                    <br />
                    <Text style={{ color: '#52c41a', fontSize: '18px', fontWeight: 600 }}>
                      {response.size} bytes
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                    bodyStyle={{ padding: '16px', textAlign: 'center' }}
                  >
                    <Text style={{ color: 'white', fontSize: '12px' }}>סטטוס</Text>
                    <br />
                    <Text style={{ 
                      color: response.status >= 200 && response.status < 300 ? '#52c41a' : '#ff4d4f',
                      fontSize: '18px', 
                      fontWeight: 600 
                    }}>
                      {response.status}
                    </Text>
                  </Card>
                </Col>
              </Row>

              {/* Response Content */}
              <Card
                title="Response Data"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                headStyle={{ background: 'transparent', color: 'white', direction: 'rtl' }}
                bodyStyle={{ direction: 'ltr' }}
              >
                <pre style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  fontSize: '14px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '400px',
                  overflow: 'auto',
                }}>
                  {typeof response.data === 'object' 
                    ? JSON.stringify(response.data, null, 2)
                    : response.data
                  }
                </pre>
              </Card>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Integrations;