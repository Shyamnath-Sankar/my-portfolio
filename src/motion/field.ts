// The signal field: the site's motion graphic and its concept, "from noise to signal".
// Contour lines of a warping noise field (noise) straighten into parallel flowing lines (signal)
// wherever a section asks for it (data-signal="0..1"). Orange pulses travel along the lines.
// The pointer bends the field; time keeps it flowing. The layer is transparent over the floor.
import { gsap } from 'gsap';
import { setBackground } from '../engine';

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime, uScroll, uScrollY, uVelocity, uPaper, uEnergy, uOrder;
uniform vec2 uMouse, uResolution;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 asp = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 uv = vUv * asp;
  vec2 m = uMouse * asp;
  float t = uTime * 0.045 + uScroll * 1.8;

  // Domain warp, with the pointer pushing the field away like a hand in water.
  vec2 p = uv * 1.9;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
  vec2 away = uv - m;
  float near = exp(-dot(away, away) * 9.0);
  p += q * 1.7 + away * near * 0.9;
  float fn = fbm(p);

  // Flow lines, kept about 1px wide by dividing by the local gradient.
  float e = 0.01;
  vec2 gn = vec2(fbm(p + vec2(e, 0.0)) - fn, fbm(p + vec2(0.0, e)) - fn) / e;
  // Signal: parallel lines with a travelling wave. uOrder blends noise into signal.
  vec2 s0 = uv * 1.9;
  float wave = 0.06 * sin(s0.x * 1.6 + uTime * 0.6) + 0.03 * sin(s0.x * 3.7 - uTime * 0.9);
  float fs = s0.y * 0.34 + wave;
  vec2 gs = vec2(0.06 * 1.6 * cos(s0.x * 1.6 + uTime * 0.6) + 0.03 * 3.7 * cos(s0.x * 3.7 - uTime * 0.9), 0.34);
  float o = smoothstep(0.0, 1.0, uOrder);
  float f = mix(fn, fs, o);
  vec2 g = mix(gn, gs, o);
  float density = 12.0;
  float k = f * density + uTime * 0.12 * (1.0 - o) + uVelocity * 0.004;
  float c = abs(fract(k) - 0.5) / density;
  float px = c / max(length(g), 0.02) / (1.9 / uResolution.y);
  float line = smoothstep(1.6, 0.5, px);

  // Signal pulses travelling along the contours (orange: the agent acting).
  // Along the noise contours, or along each signal line (offset per line so pulses don't align).
  float along = mix(fn * 3.0, s0.x * 0.35 + fract(floor(k) * 0.618), o);
  float run = fract(along - uTime * 0.22);
  float pulse = smoothstep(0.975, 1.0, run) * smoothstep(3.2, 0.6, px);

  // Loud in the hero (right side) and around the pointer; quiet behind reading text.
  float hero = 1.0 - smoothstep(0.0, uResolution.y * 0.9, uScrollY);
  vec2 fc = (vUv - vec2(0.8, 0.55)) * asp;
  float focus = smoothstep(1.1, 0.1, length(fc)) * hero;
  float a = line * (0.07 + 0.08 * o + 0.45 * focus + 0.3 * near) * (0.85 + 0.4 * uEnergy) * (1.0 - 0.4 * uPaper);
  float oa = pulse * (0.35 + 0.4 * focus + 0.25 * o);

  vec3 mint = mix(vec3(0.56, 0.94, 0.78), vec3(0.06, 0.42, 0.28), uPaper);
  vec3 orange = vec3(1.0, 0.42, 0.17);
  float alpha = clamp(a + oa, 0.0, 1.0);
  vec3 col = mix(mint, orange, oa / (a + oa + 1e-4));
  gl_FragColor = vec4(col * alpha, alpha);
}`;

const uniforms = { uPaper: { value: 0 }, uEnergy: { value: 0 }, uOrder: { value: 0 } };

export function startField() {
  setBackground(FRAG, uniforms); // null without GL: the floor colour alone is the fallback
}

export function setPaper(on: boolean) {
  gsap.to(uniforms.uPaper, { value: on ? 1 : 0, duration: 0.7, ease: 'power2.out', overwrite: true });
}

// Order: how much signal the current section wants (data-signal on sections).
export function setOrder(v: number) {
  gsap.to(uniforms.uOrder, { value: v, duration: 1.6, ease: 'power2.inOut', overwrite: true });
}

// Energy: a brief brighten, e.g. when a project comes into focus.
export function pulseEnergy() {
  gsap.fromTo(uniforms.uEnergy, { value: 1 }, { value: 0, duration: 1.6, ease: 'power2.out', overwrite: true });
}
