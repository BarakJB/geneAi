-- White label customers table
CREATE TABLE IF NOT EXISTS white_labels_customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  agency_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(512) NOT NULL,
  hero_image_url VARCHAR(512) NULL,
  lead_email VARCHAR(255) NULL,
  primary_color VARCHAR(32) DEFAULT '#007AFF',
  gradient VARCHAR(256) DEFAULT 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
  cta_text VARCHAR(128) DEFAULT 'לתיאום פגישת זום',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO white_labels_customers (slug, agency_name, logo_url, hero_image_url, lead_email)
VALUES
('demo', 'Demo Agency', '/minimal-logo/logo-full.svg', '/minimal-assets/illustrations/illustration_marketing.webp', 'demo@example.com')
ON DUPLICATE KEY UPDATE agency_name=VALUES(agency_name);


