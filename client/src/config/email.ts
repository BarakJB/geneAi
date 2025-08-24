// EmailJS Configuration
// Get these values from https://www.emailjs.com/

export const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default', 
  USER_ID: import.meta.env.VITE_EMAILJS_USER_ID || 'user_default',
  TO_EMAIL: 'yacov131@gmail.com'
};

// For development - you can temporarily hardcode values here
export const EMAIL_CONFIG_DEV = {
  SERVICE_ID: 'service_your_service_id', // החלף בזה שתקבל מ-EmailJS
  TEMPLATE_ID: 'template_your_template_id', // החלף בזה שתקבל מ-EmailJS  
  USER_ID: 'your_user_id', // החלף בזה שתקבל מ-EmailJS
  TO_EMAIL: 'yacov131@gmail.com'
};
