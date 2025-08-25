import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import GoogleAd from './GoogleAd';

const FloatingAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // הצג את הפרסומת אחרי 5 שניות
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // הסתר אוטומטית אחרי 20 שניות
  useEffect(() => {
    if (isVisible) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 20000);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: isMinimized ? '80px' : '300px',
          height: isMinimized ? '80px' : 'auto',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* כפתורי בקרה */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 10,
          display: 'flex',
          gap: '4px'
        }}>
          <Button
            type="text"
            size="small"
            icon={<span style={{ color: 'white', fontSize: '12px' }}>−</span>}
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              border: 'none',
              color: 'white'
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined style={{ fontSize: '10px' }} />}
            onClick={() => setIsVisible(false)}
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255, 77, 79, 0.8)',
              borderRadius: '50%',
              border: 'none',
              color: 'white'
            }}
          />
        </div>

        {/* תוכן הפרסומת */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '16px', paddingTop: '40px' }}
            >
              <GoogleAd 
                adSlot="2222333344"
                adFormat="rectangle"
                style={{
                  background: 'transparent',
                  border: 'none',
                  margin: 0
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* מצב ממוזער */}
        {isMinimized && (
          <div 
            role="button"
            tabIndex={0}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setIsMinimized(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsMinimized(false);
              }
            }}
          >
            <span style={{ 
              color: 'white', 
              fontSize: '12px', 
              fontWeight: 'bold' 
            }}>
              📢
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingAd;
