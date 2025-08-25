import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse, Typography, Space, Tag, Alert } from 'antd';
import { BugOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;

interface AdDebugInfo {
  totalAds: number;
  loadedAds: number;
  scriptLoaded: boolean;
  adElements: Array<{
    client: string;
    slot: string;
    format: string;
    status: string;
  }>;
}

const AdDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<AdDebugInfo | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);

  const checkAds = () => {
    const scriptLoaded = !!(window as any).adsbygoogle;
    const adElements = document.querySelectorAll('.adsbygoogle');
    
    const adsInfo = Array.from(adElements).map((ad) => ({
      client: ad.getAttribute('data-ad-client') || 'לא מוגדר',
      slot: ad.getAttribute('data-ad-slot') || 'לא מוגדר',
      format: ad.getAttribute('data-ad-format') || 'auto',
      status: ad.getAttribute('data-adsbygoogle-status') || 'לא נטען',
    }));

    const loadedAds = adsInfo.filter(ad => ad.status === 'done').length;

    setDebugInfo({
      totalAds: adElements.length,
      loadedAds,
      scriptLoaded,
      adElements: adsInfo,
    });
  };

  useEffect(() => {
    if (showDebugger) {
      checkAds();
      // בדיקה כל 3 שניות
      const interval = setInterval(checkAds, 3000);
      return () => clearInterval(interval);
    }
  }, [showDebugger]);

  if (!showDebugger) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '20px',
        zIndex: 9998,
      }}>
        <Button
          type="primary"
          icon={<BugOutlined />}
          onClick={() => setShowDebugger(true)}
          size="small"
          style={{
            background: '#722ed1',
            borderColor: '#722ed1',
          }}
        >
          בדיקת פרסומות
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '400px',
      zIndex: 9998,
      maxHeight: '500px',
      overflow: 'auto',
    }}>
      <Card
        title={
          <Space>
            <BugOutlined />
            <span>בדיקת פרסומות AdSense</span>
            <Button
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => setShowDebugger(false)}
              type="text"
            />
          </Space>
        }
        size="small"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid #722ed1',
          color: 'white',
        }}
        headStyle={{ 
          background: '#722ed1', 
          color: 'white',
          padding: '8px 16px'
        }}
        bodyStyle={{ 
          background: 'rgba(0, 0, 0, 0.9)', 
          color: 'white',
          padding: '16px'
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={checkAds}
            block
            size="small"
          >
            רענן בדיקה
          </Button>

          {debugInfo && (
            <>
              {/* סטטוס כללי */}
              <Alert
                message={
                  <Space>
                    {debugInfo.scriptLoaded ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    <Text strong style={{ color: 'white' }}>
                      סקריפט AdSense: {debugInfo.scriptLoaded ? 'נטען' : 'לא נטען'}
                    </Text>
                  </Space>
                }
                type={debugInfo.scriptLoaded ? 'success' : 'error'}
                showIcon={false}
                style={{ 
                  background: debugInfo.scriptLoaded ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)',
                  border: `1px solid ${debugInfo.scriptLoaded ? '#52c41a' : '#ff4d4f'}`,
                  marginBottom: '12px'
                }}
              />

              {/* סטטיסטיקות */}
              <Space wrap>
                <Tag color="blue">
                  סה"כ פרסומות: {debugInfo.totalAds}
                </Tag>
                <Tag color={debugInfo.loadedAds > 0 ? 'green' : 'orange'}>
                  נטענו: {debugInfo.loadedAds}
                </Tag>
                <Tag color="purple">
                  ממתינות: {debugInfo.totalAds - debugInfo.loadedAds}
                </Tag>
              </Space>

              {/* פרטי פרסומות */}
              <Collapse size="small" ghost>
                <Panel 
                  header={`פרטי ${debugInfo.totalAds} פרסומות`} 
                  key="1"
                  style={{ color: 'white' }}
                >
                  {debugInfo.adElements.map((ad, index) => (
                    <Card 
                      key={index}
                      size="small" 
                      title={`פרסומת ${index + 1}`}
                      style={{
                        marginBottom: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      headStyle={{ 
                        background: 'transparent', 
                        color: 'white',
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                      bodyStyle={{ 
                        background: 'transparent',
                        color: 'white',
                        padding: '8px'
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text style={{ color: 'white', fontSize: '11px' }}>
                          <strong>Client:</strong> {ad.client}
                        </Text>
                        <Text style={{ color: 'white', fontSize: '11px' }}>
                          <strong>Slot:</strong> {ad.slot}
                        </Text>
                        <Text style={{ color: 'white', fontSize: '11px' }}>
                          <strong>Format:</strong> {ad.format}
                        </Text>
                        <Tag 
                          color={ad.status === 'done' ? 'green' : ad.status === 'error' ? 'red' : 'orange'}
                          size="small"
                        >
                          {ad.status === 'done' ? 'נטען בהצלחה' : 
                           ad.status === 'error' ? 'שגיאה' : 'ממתין'}
                        </Tag>
                      </Space>
                    </Card>
                  ))}
                </Panel>
              </Collapse>

              {/* הוראות */}
              {!debugInfo.scriptLoaded && (
                <Alert
                  message="הסקריפט לא נטען"
                  description="בדוק את index.html - צריך להיות: ca-pub-YOUR_PUBLISHER_ID"
                  type="error"
                  showIcon
                  style={{
                    background: 'rgba(255, 77, 79, 0.1)',
                    border: '1px solid #ff4d4f',
                    color: 'white'
                  }}
                />
              )}

              {debugInfo.totalAds === 0 && (
                <Alert
                  message="לא נמצאו פרסומות"
                  description="ייתכן שהקומפוננטים לא נטענו עדיין"
                  type="warning"
                  showIcon
                  style={{
                    background: 'rgba(250, 173, 20, 0.1)',
                    border: '1px solid #faad14',
                    color: 'white'
                  }}
                />
              )}
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AdDebugger;
