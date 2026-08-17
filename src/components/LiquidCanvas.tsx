import { useEffect, useRef } from "react";
import * as THREE from "three";
import { tokenToLinear } from "../lib/oklch";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uFlame;
uniform vec3 uCobalt;
uniform vec3 uJade;
uniform vec3 uButter;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = smoothstep(0.0, 1.0, f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

float blob(vec2 p, vec2 c, float r) {
  return smoothstep(r, 0.0, length(p - c));
}

vec3 linearToSrgb(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.12;

  float n1 = fbm(p * 1.6 + vec2(t, -t * 0.73));
  float n2 = fbm(p * 1.6 + vec2(-t * 0.81, t));
  vec2 warp = vec2(n1, n2);
  vec2 q = p + (warp - 0.5) * 0.55;

  vec2 cFlame = vec2(sin(t * 1.7), cos(t * 1.3)) * vec2(0.52, 0.4);
  vec2 cCobalt = vec2(cos(t * 1.1), sin(t * 1.6)) * vec2(0.58, 0.46);
  vec2 cJade = vec2(sin(t * 0.9), cos(t * 2.1)) * vec2(0.48, 0.5);
  vec2 cButter = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float b0 = blob(q, cFlame, 0.62);
  float b1 = blob(q, cCobalt, 0.56);
  float b2 = blob(q, cJade, 0.52);
  float b3 = blob(q, cButter, 0.5);

  vec3 col = uPaper;
  col = mix(col, uFlame, b0 * 0.62);
  col = mix(col, uCobalt, b1 * 0.50);
  col = mix(col, uJade, b2 * 0.46);
  col = mix(col, uButter, b3 * 0.65);

  float fibre = fbm(p * 6.0 + 12.0);
  col = mix(col, uPaper, 0.30 + 0.14 * fibre);

  float field = b0 + b1 + b2 + b3;
  float rings = abs(fract(field * 5.0 - uTime * 0.05) - 0.5) * 2.0;
  float line = 1.0 - smoothstep(0.0, 0.06, rings);
  col = mix(col, uInk, line * 0.14 * smoothstep(0.05, 0.5, field));

  float vig = smoothstep(1.25, 0.25, length(p * vec2(0.85, 1.0)));
  col *= mix(0.94, 1.0, vig);

  float grain = hash(vUv * uRes + fract(uTime)) - 0.5;
  col += grain * 0.022;

  gl_FragColor = vec4(linearToSrgb(col), 1.0);
}
`;

function colorUniform(name: string) {
  return { value: new THREE.Vector3(...tokenToLinear(name)) };
}

export function LiquidCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;

    const canvas = document.createElement("canvas");
    canvas.className = "liquid-canvas";
    root.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPaper: colorUniform("--paper"),
      uInk: colorUniform("--ink"),
      uFlame: colorUniform("--flame"),
      uCobalt: colorUniform("--cobalt"),
      uJade: colorUniform("--jade"),
      uButter: colorUniform("--butter"),
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL1,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uTime.value = (now - t0) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={host} className="liquid-host" />;
}
