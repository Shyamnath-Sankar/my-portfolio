// The run: an orange agent cursor works through the page's targets as the visitor scrolls.
// One driver: the active target index. It moves the cursor, "clicks" (mint frame), ticks the run
// panel, counts in the status pill. The Stop button halts the agent and every ambient motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, prefersReducedMotion, isMobile } from '../engine';
import { pulseEnergy } from './field';

gsap.registerPlugin(ScrollTrigger);

const html = () => document.documentElement;
const stopped = () => html().classList.contains('is-stopped');

let targets: HTMLElement[] = [];
let active = -1;
let park: HTMLElement | null = null;
let pageLabel = '';
const pos = { x: -100, y: -100 };
let shown = false;

function pill(text: string) {
  const el = document.querySelector<HTMLElement>('[data-pill-text]');
  if (el && el.textContent !== text) el.textContent = text;
}

function titleOf(el: HTMLElement) {
  return el.dataset.agentLabel || el.querySelector('.knot__title, h2, h3')?.textContent?.trim() || '';
}

function describe() {
  const steps = document.querySelectorAll('[data-knot]').length;
  if (stopped()) return active >= 0 && steps ? `Stopped at step ${Math.min(active + 1, steps)} of ${steps}` : 'Stopped';
  if (steps) {
    if (active < 0) return 'Ready, scroll to run';
    if (isPastEnd()) return `Done, ${steps} of ${steps} steps`;
    return `Step ${active + 1} of ${steps}: ${titleOf(targets[active])}`;
  }
  return active < 0 ? pageLabel : `${pageLabel}: ${titleOf(targets[active])}`;
}

function isPastEnd() {
  const last = targets[targets.length - 1];
  return !!last && last.getBoundingClientRect().bottom < innerHeight * 0.6;
}

function syncRun() {
  const run = document.querySelector<HTMLElement>('[data-run]');
  const steps = document.querySelectorAll('[data-knot]').length;
  if (run && steps) {
    const end = active >= 0 && isPastEnd();
    const done = end ? steps : Math.max(0, active);
    run.querySelectorAll<HTMLElement>('[data-run-step]').forEach((li, i) => {
      li.classList.toggle('is-done', i < done);
      li.classList.toggle('is-running', i === active && !end);
    });
    const count = run.querySelector('[data-run-count]');
    if (count) count.textContent = String(done);
    const bar = run.querySelector<HTMLElement>('[data-run-bar]');
    if (bar) bar.style.transform = `scaleX(${done / steps})`;
    const state = run.querySelector('[data-run-state]');
    if (state) state.textContent = stopped() ? 'Stopped' : active < 0 ? 'Queued' : end ? 'Done' : 'Running';
  }
  pill(describe());
}

function setActive(i: number) {
  if (i === active) { syncRun(); return; }
  targets.forEach((t, k) => t.classList.toggle('is-active', k === i));
  active = i;
  syncRun();
  if (i >= 0 && !prefersReducedMotion() && !stopped()) {
    // Glide, then a crisp click once the cursor has (nearly) arrived.
    gsap.delayedCall(0.55, () => {
      const a = document.getElementById('agent');
      if (!a || active !== i) return;
      a.classList.remove('is-click');
      void a.offsetWidth;
      a.classList.add('is-click');
      pulseEnergy();
    });
  }
}

function aim(): { x: number; y: number } | null {
  const el = active >= 0 ? targets[active].querySelector<HTMLElement>('[data-agent-point]') || targets[active] : park;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return null;
  const small = isMobile();
  return {
    // Small anchors (labels, numbers): point just past their end. Large ones (media): a point inside.
    x: el === park && r.width >= 320 ? r.left + r.width * 0.86 : r.width < 320 ? r.right + 10 : r.left + Math.min(r.width * 0.32, small ? 120 : 260),
    y: r.height < 80 ? r.top + r.height * 0.3 : r.top + Math.min(r.height * 0.4, small ? 70 : 140),
  };
}

function tick(time: number) {
  const a = document.getElementById('agent');
  if (!a) return;
  const t = aim();
  if (!t) { if (shown) { a.classList.remove('is-shown'); shown = false; } return; }
  const k = stopped() ? 0 : 1 - Math.pow(0.9, gsap.ticker.deltaRatio());
  const drift = stopped() ? { x: 0, y: 0 } : { x: Math.sin(time * 0.9) * 5 + Math.sin(time * 2.3) * 2, y: Math.cos(time * 0.7) * 4 };
  if (!shown) { pos.x = t.x; pos.y = t.y + 40; }
  pos.x += (t.x + drift.x - pos.x) * k;
  pos.y += (t.y + drift.y - pos.y) * k;
  a.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
  if (!shown) { a.classList.add('is-shown'); shown = true; }
}

export function startAgent() {
  const reduced = prefersReducedMotion();
  if (!reduced) gsap.ticker.add(tick);

  // Stop / resume: the agent halts and every ambient motion pauses (WCAG 2.2.2).
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-stop]');
    if (!btn) return;
    const now = !stopped();
    html().classList.toggle('is-stopped', now);
    try { sessionStorage.setItem('agent-stopped', now ? '1' : '0'); } catch { /* private mode */ }
    syncStop();
    syncRun();
  });

  onPage(({ path }) => {
    syncStop();
    targets = [...document.querySelectorAll<HTMLElement>('[data-agent-target]')];
    park = document.querySelector<HTMLElement>('[data-agent-park]') || document.querySelector<HTMLElement>('h1');
    active = -1;
    shown = false;
    document.getElementById('agent')?.classList.remove('is-shown', 'is-click');
    pageLabel = document.querySelector<HTMLElement>('[data-pill-page]')?.dataset.pillPage || `Reading ${path}`;
    syncRun();
    const triggers = targets.map((el, i) => ScrollTrigger.create({
      trigger: el, start: 'top 62%', end: 'bottom 62%',
      onToggle: (st) => { if (st.isActive) setActive(i); },
      onLeaveBack: () => { if (i === 0) setActive(-1); },
      onLeave: () => syncRun(),
    }));
    return () => { triggers.forEach((t) => t.kill()); targets.forEach((t) => t.classList.remove('is-active')); targets = []; };
  });
}

function syncStop() {
  const btn = document.querySelector<HTMLButtonElement>('[data-stop]');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(stopped()));
  btn.textContent = stopped() ? 'Resume' : 'Stop';
  btn.setAttribute('aria-label', stopped() ? 'Resume the agent and motion' : 'Stop the agent and all motion');
}
