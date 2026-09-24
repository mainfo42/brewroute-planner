import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamic canonical and OpenGraph URL synchronization per applet-seo best practices
if (typeof window !== 'undefined') {
  const currentUrl = window.location.origin + window.location.pathname;
  const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalLink && window.location.origin && !window.location.hostname.includes('localhost')) {
    canonicalLink.href = currentUrl;
  }
  const ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (ogUrlMeta && window.location.origin && !window.location.hostname.includes('localhost')) {
    ogUrlMeta.content = currentUrl;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
