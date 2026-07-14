const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('in-view'));
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .case-study, .proof-grid > div, .experience-row').forEach((item) => observer.observe(item));

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

const header = document.querySelector('.nav');
const setHeaderState = () => header?.classList.toggle('island', window.scrollY > 110);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const siteOrigin = 'https://shyamnathsankar.genrecai.com';
const seoPages = {
  'index.html': { title: 'Shyamnath Sankar | AI Product Builder & Full-Stack Developer', description: 'Shyamnath Sankar is an AI product builder and full-stack developer from Chennai, building RAG systems, multi-agent AI products, and useful digital experiences.', type: 'website' },
  'projects.html': { title: 'Selected AI Projects | Shyamnath Sankar', description: 'Explore selected AI, RAG, mobile, education, and agentic data-analysis projects by Shyamnath Sankar.', type: 'website' },
  'lumina.html': { title: 'LuminaIQ — RAG AI Learning Platform | Shyamnath Sankar', description: 'LuminaIQ is a RAG-powered AI learning platform that turns PDFs into chat, quizzes, and smart notes.', type: 'article', app: 'LuminaIQ' },
  'anyllm.html': { title: 'AnyLLM — Cross-Platform AI Chat App | Shyamnath Sankar', description: 'AnyLLM unifies GPT, Claude, Gemini, Llama, Groq, web search, and MCP in one cross-platform AI workspace.', type: 'article', app: 'AnyLLM' },
  'eduecho.html': { title: 'EduEcho — Campus Feedback System | Shyamnath Sankar', description: 'EduEcho is a campus-wide feedback platform that turns student voice into structured, actionable insight.', type: 'article', app: 'EduEcho' },
  'selectstar.html': { title: 'SelectStar — Agentic Database Analysis | Shyamnath Sankar', description: 'SelectStar lets people ask databases questions in plain English using a safe TypeScript agent orchestration system.', type: 'article', app: 'SelectStar' },
};

const pageName = location.pathname.split('/').pop() || 'index.html';
const seo = seoPages[pageName] || seoPages['index.html'];
const canonicalUrl = `${siteOrigin}${pageName === 'index.html' ? '/' : `/${pageName}`}`;
const setMeta = (selector, attribute, key, content) => {
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
  element.content = content;
};

document.title = seo.title;
setMeta('meta[name="description"]', 'name', 'description', seo.description);
setMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-image-preview:large');
setMeta('meta[property="og:type"]', 'property', 'og:type', seo.type);
setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
setMeta('meta[property="og:image"]', 'property', 'og:image', `${siteOrigin}/og-shyamnath-sankar.jpg`);
setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${siteOrigin}/og-shyamnath-sankar.jpg`);
let canonical = document.head.querySelector('link[rel="canonical"]');
if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
canonical.href = canonicalUrl;

const schema = seo.app
  ? { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: seo.app, description: seo.description, author: { '@type': 'Person', name: 'Shyamnath Sankar', url: siteOrigin } }
  : { '@context': 'https://schema.org', '@type': 'Person', name: 'Shyamnath Sankar', url: siteOrigin, jobTitle: 'AI Product Builder & Full-Stack Developer', sameAs: ['https://github.com/Shyamnath-Sankar', 'https://www.linkedin.com/in/shyamnath-sankar'] };
const schemaTag = document.createElement('script');
schemaTag.type = 'application/ld+json';
schemaTag.textContent = JSON.stringify(schema);
document.head.append(schemaTag);

document.querySelectorAll('img').forEach((image, index) => {
  image.decoding = 'async';
  if (index === 0) image.fetchPriority = 'high'; else image.loading = 'lazy';
});
