// The signal field: the site's motion graphic. Flow lines of a slowly warping field, like data
// moving through a network, in mint; orange pulses run along them (the agent acting).
// One driver: scroll progress shifts the field, the pointer bends it, time keeps it flowing.
// The layer is transparent, so the black or paper floor shows between the lines.
import { gsap } from 'gsap';
import { setBackground } from '../engine';

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime, uScroll, uVelocity, uPaper, uEnergy;
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
  float f = fbm(p);

  // Flow lines: contours of the field, kept about 1px wide by dividing by the local gradient.
  float e = 0.01;
  vec2 g = vec2(fbm(p + vec2(e, 0.0)) - f, fbm(p + vec2(0.0, e)) - f) / e;
  float density = 12.0;
  float k = f * density + uTime * 0.12 + uVelocity * 0.004;
  float c = abs(fract(k) - 0.5) / density;              // distance in field units
  float px = c / max(length(g), 0.02) / (1.9 / uResolution.y); // distance in pixels
  float line = smoothstep(1.6, 0.5, px);

  // Signal pulses travelling along the contours (orange: the agent acting).
  float run = fract(f * 3.0 - uTime * 0.22);
  float pulse = smoothstep(0.975, 1.0, run) * smoothstep(3.2, 0.6, px);

  // Strongest on the right and around the pointer, quiet where body text sits.
  vec2 fc = (vUv - vec2(0.78, 0.55)) * asp;
  float focus = smoothstep(1.25, 0.1, length(fc));
  float a = line * (0.12 + 0.5 * focus + 0.4 * near) * (0.8 + 0.4 * uEnergy) * (1.0 - 0.45 * uPaper);
  float oa = pulse * (0.7 + 0.3 * focus);

  vec3 mint = mix(vec3(0.56, 0.94, 0.78), vec3(0.06, 0.42, 0.28), uPaper);
  vec3 orange = vec3(1.0, 0.42, 0.17);
  float alpha = clamp(a + oa, 0.0, 1.0);
  vec3 col = mix(mint, orange, oa / (a + oa + 1e-4));
  gl_FragColor = vec4(col * alpha, alpha);
}`;

const uniforms = { uPaper: { value: 0 }, uEnergy: { value: 0 } };

export function startField() {
  setBackground(FRAG, uniforms); // null without GL: the floor colour alone is the fallback
}

export function setPaper(on: boolean) {
  gsap.to(uniforms.uPaper, { value: on ? 1 : 0, duration: 0.7, ease: 'power2.out', overwrite: true });
}

// Energy: brighter while the agent is clicking a step.
export function pulseEnergy() {
  gsap.fromTo(uniforms.uEnergy, { value: 1 }, { value: 0, duration: 1.6, ease: 'power2.out', overwrite: true });
}
