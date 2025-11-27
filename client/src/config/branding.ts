// Simple white-label branding config so logos/colors/texts can be replaced per tenant
// Best practice: keep UI copy and assets here to avoid code edits when rebranding

export type Branding = {
  name: string;
  primaryColor: string;
  gradient: string;
  logoUrl: string; // public URL or relative to /public
  heroImageUrl?: string;
  ctaText?: string;
  backgroundCurve?: string; // optional SVG path string
};

// Default brand; override by importing and merging from env/remote later if needed
export const defaultBranding: Branding = {
  name: 'Cover',
  primaryColor: '#007AFF',
  gradient: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
  logoUrl: '/cover-logo.png',
  heroImageUrl: '/minimal-assets/illustrations/illustration_marketing.webp',
  ctaText: 'לתיאום פגישת זום',
};

// Helper to fetch runtime branding (optional future enhancement)
export const getBranding = async (): Promise<Branding> => {
  try {
    const params = new URLSearchParams(window.location.search);
    // brand can come from query (?brand=slug) or first path segment (/slug)
    const pathSegment = window.location.pathname.split('/').filter(Boolean)[0];
    const brand = params.get('brand') || pathSegment;
    if (!brand) return defaultBranding;

    const apiBase = import.meta.env.PROD
      ? 'https://your-api-domain.com/api'
      : 'http://localhost:8000/api';

    const resp = await fetch(`${apiBase}/branding/${encodeURIComponent(brand)}`);
    if (!resp.ok) return defaultBranding;
    const json = await resp.json();
    if (json?.success && json?.data) {
      return {
        name: json.data.name || defaultBranding.name,
        primaryColor: json.data.primaryColor || defaultBranding.primaryColor,
        gradient: json.data.gradient || defaultBranding.gradient,
        logoUrl: json.data.logoUrl || defaultBranding.logoUrl,
        heroImageUrl: json.data.heroImageUrl || defaultBranding.heroImageUrl,
        ctaText: json.data.ctaText || defaultBranding.ctaText,
      };
    }
    return defaultBranding;
  } catch {
    return defaultBranding;
  }
};

export default getBranding;


