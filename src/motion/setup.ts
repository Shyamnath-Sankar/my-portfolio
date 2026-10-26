// Global motion, registered once before the first page boots.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  setLoaderFormat, setLoaderExit, setTransition, onPage, onScroll,
  ease, isTouch, prefersReducedMotion, stopScroll, startScroll,
} from '../engine';
import { startAgent } from './agent';

gsap.registerPlugin(ScrollTrigger);

export function setupMotion() {
  // ---- Loader counter: real progress, as a percentage.
  setLoaderFormat((p) => String(Math.round(p)).padStart(3, '0'));

  // ---- Page transition: the agent's tool call is shown while the next page loads.
  let label = '';
  let dest = '';
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const named = a.querySelector('.knot__title, .next__title, .thread-row__title, .run__title') || (a.classList.contains('knot__link') ? a : null);
    label = (named?.textContent || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    try { dest = new URL(a.href).pathname; } catch { dest = ''; }
    closeMenu();
  }, true);
  setTransition({
    leave: (c) => {
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      const bar = c.querySelector<HTMLElement>('[data-curtain-bar]')!;
      const text = c.querySelector<HTMLElement>('[data-curtain-label]')!;
      const path = c.querySelector<HTMLElement>('[data-curtain-path]')!;
      text.textContent = label;
      path.textContent = `“${dest || '/'}”`;
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .set(bar, { scaleX: 0 })
        .fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut })
        .fromTo(c.querySelectorAll('.curtain__call, .curtain__label'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: ease.soft, stagger: 0.06 }, 0.3)
        .to(bar, { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, 0.2);
    },
    enter: (c) => {
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      return gsap.timeline()
        .to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: ease.inOut })
        .set(c, { autoAlpha: 0 });
    },
  });

  startAgent();

  // ---- Chapters: the floor turns to paper while a paper block holds the middle of the screen.
  onPage(() => {
    const html = document.documentElement;
    html.classList.remove('is-paper');
    if (prefersReducedMotion()) return;
    document.querySelectorAll<HTMLElement>('[data-chapter-block="paper"]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 55%', end: 'bottom 45%',
        onToggle: (st) => html.classList.toggle('is-paper', st.isActive),
      });
    });
    return () => html.classList.remove('is-paper');
  });

  // ---- Frame: steps aside while scrolling down, comes back solid on the way up.
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 4) return;
    const h = document.documentElement.classList;
    const menuOpen = document.querySelector('[data-menu-btn]')?.getAttribute('aria-expanded') === 'true';
    if (!menuOpen) h.toggle('frame-away', y > 160 && y > last);
    h.toggle('frame-solid', y > 160);
    last = y;
  });
  onPage(() => {
    const h = document.documentElement.classList;
    h.remove('frame-away', 'frame-solid');
    last = 0;
  });

  // ---- Menu overlay (phones).
  onPage(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
    const menu = document.querySelector<HTMLElement>('[data-menu]');
    if (!btn || !menu) return;
    const links = () => [...menu.querySelectorAll<HTMLAnchorElement>('a')];
    const open = () => {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      stopScroll();
      if (!prefersReducedMotion()) {
        gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut });
        gsap.fromTo(menu.querySelectorAll('a span'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.06, delay: 0.2 });
      }
      links()[0]?.focus();
    };
    const close = (restore = true) => {
      if (menu.hidden) return;
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      startScroll();
      if (restore) btn.focus();
    };
    closeMenu = () => close(false);
    const toggle = () => (menu.hidden ? open() : close());
    const key = (e: KeyboardEvent) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const items = [btn, ...links()];
        const i = items.indexOf(document.activeElement as HTMLAnchorElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    };
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', key);
    return () => { btn.removeEventListener('click', toggle); document.removeEventListener('keydown', key); close(false); };
  });

  // ---- CTA fill from the pointer's side.
  onPage(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const off: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-fill]').forEach((btn) => {
      const fill = btn.querySelector<HTMLElement>('.btn__fill');
      if (!fill) return;
      const at = (e: PointerEvent) => { const r = btn.getBoundingClientRect(); return `${e.clientX - r.left}px ${e.clientY - r.top}px`; };
      let closed = true;
      const openAt = (p: string) => {
        if (closed) gsap.set(fill, { clipPath: `circle(0% at ${p})` });
        closed = false;
        btn.classList.add('is-filled');
        gsap.to(fill, { clipPath: `circle(150% at ${p})`, duration: 0.6, ease: ease.soft, overwrite: true });
      };
      const closeAt = (p: string) => {
        btn.classList.remove('is-filled');
        gsap.to(fill, { clipPath: `circle(0% at ${p})`, duration: 0.5, ease: ease.soft, overwrite: true, onComplete: () => { closed = true; } });
      };
      const enter = (e: PointerEvent) => openAt(at(e));
      const leave = (e: PointerEvent) => closeAt(at(e));
      const focus = () => btn.matches(':focus-visible') && openAt('50% 50%');
      const blur = () => closeAt('50% 50%');
      btn.addEventListener('pointerenter', enter); btn.addEventListener('pointerleave', leave);
      btn.addEventListener('focus', focus); btn.addEventListener('blur', blur);
      off.push(() => {
        btn.removeEventListener('pointerenter', enter); btn.removeEventListener('pointerleave', leave);
        btn.removeEventListener('focus', focus); btn.removeEventListener('blur', blur);
      });
    });
    return () => off.forEach((f) => f());
  });

  // ---- Case study system: each step lights its node and draws its share of the edge.
  onPage(() => {
    const sys = document.querySelector<HTMLElement>('[data-system]');
    if (!sys) return;
    const steps = [...sys.querySelectorAll<HTMLElement>('[data-step]')];
    const nodes = [...sys.querySelectorAll<SVGGElement>('[data-graph-node]')];
    const line = sys.querySelector<SVGPathElement>('[data-graph-line]')!;
    const reduced = prefersReducedMotion();
    const show = (n: number) => {
      nodes.forEach((g, i) => g.classList.toggle('is-on', i < n));
      steps.forEach((s, i) => s.classList.toggle('is-on', i === n - 1));
      const p = n <= 1 ? 0 : (n - 1) / (steps.length - 1);
      if (reduced) line.style.strokeDashoffset = String(1 - p);
      else gsap.to(line, { strokeDashoffset: 1 - p, duration: 0.7, ease: 'power2.inOut', overwrite: true });
    };
    if (reduced) { show(steps.length); steps.forEach((s) => s.classList.add('is-on')); return; }
    show(0);
    steps.forEach((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 60%', end: 'bottom 60%',
      onEnter: () => show(i + 1), onEnterBack: () => show(i + 1),
      onLeaveBack: () => show(i),
    }));
  });
}

let closeMenu = () => {};
