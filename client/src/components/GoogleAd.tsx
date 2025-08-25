import React, { useEffect } from 'react';
import { Card } from 'antd';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'banner' | 'leaderboard' | 'skyscraper';
  adClient?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  showWrapper?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  adSlot, 
  adFormat = 'auto',
  adClient = 'ca-pub-YOUR_PUBLISHER_ID',
  responsive = true,
  style = {},
  className = '',
  showWrapper = true
}) => {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Google AdSense error:', error);
    }
  }, []);

  const defaultStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    minHeight: '90px',
    ...style
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '24px',
    ...style
  };

  const adElement = (
    <ins
      className="adsbygoogle"
      style={defaultStyle}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );

  if (!showWrapper) {
    return adElement;
  }

  return (
    <Card 
      style={cardStyle}
      className={`google-ad-container ${className}`}
      styles={{ body: { padding: '16px', textAlign: 'center' } }}
    >
      {adElement}
    </Card>
  );
};

export default GoogleAd;
