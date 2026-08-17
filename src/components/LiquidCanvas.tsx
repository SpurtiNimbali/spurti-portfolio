import { useEffect, useRef } from "react";
import {
  Camera,
  LinearSRGBColorSpace,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { tokenToLinear } from "../lib/oklch";

const MAX_PIXEL_RATIO = 1.75;
/** Pointer easing per frame. Low enough that the bloom lags well behind the cursor. */
const POINTER_INERTIA = 0.045;

const VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uFlame;
uniform vec3 uCobalt;
uniform vec3 uJade;
uniform vec3 uButter;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

float blob(vec2 p, vec2 c, float r) {
  return smoothstep(r, 0.0, distance(p, c));
}

vec3 encodeSrgb(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0031308)), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.12;

  // Two opposing fbm drifts, so the field kneads itself rather than sliding.
  vec2 warp = vec2(
    fbm(p * 1.6 + vec2(t, -t * 0.8)),
    fbm(p * 1.6 + vec2(-t * 0.7, t * 1.1) + 5.2)
  );
  vec2 q = p + (warp - 0.5) * 0.55;

  vec2 pointer = (uMouse - 0.5) * vec2(aspect, 1.0);

  // Incommensurate rates keep the orbit from visibly repeating.
  float b1 = blob(q, vec2(sin(t * 1.7) * 0.42, cos(t * 1.3) * 0.30), 0.58);
  float b2 = blob(q, vec2(cos(t * 1.1) * 0.46, sin(t * 1.6) * 0.34), 0.62);
  float b3 = blob(q, vec2(sin(t * 0.9) * 0.36, cos(t * 2.1) * 0.40), 0.50);
  float b4 = blob(q, pointer, 0.54);

  vec3 col = uPaper;
  col = mix(col, uFlame, b1 * 0.38);
  col = mix(col, uCobalt, b2 * 0.30);
  col = mix(col, uJade, b3 * 0.27);
  col = mix(col, uButter, b4 * 0.40);

  // Pulling back toward paper is what keeps the ink printed instead of glowing.
  col = mix(col, uPaper, 0.48 + 0.14 * fbm(p * 6.0 + 12.0));

  // Contour rings, gated so linework only shows inside a bloom.
  float field = b1 + b2 + b3 + b4;
  float rings = abs(fract(field * 5.0 - uTime * 0.05) - 0.5) * 2.0;
  float contour = 1.0 - smoothstep(0.0, 0.06, rings);
  col = mix(col, uInk, contour * 0.075 * smoothstep(0.05, 0.5, field));

  // Engraved dot grid, dragged by the same warp as the blooms.
  vec2 g = uv * uRes / 26.0 + (warp - 0.5) * 2.0;
  float dots = smoothstep(0.30, 0.12, length(fract(g) - 0.5));
  col = mix(col, uInk, dots * 0.038);

  float vignette = smoothstep(1.25, 0.25, length(p * vec2(0.85, 1.0)));
  col *= mix(0.94, 1.0, vignette);
  col += (hash(uv * uRes + fract(uTime)) - 0.5) * 0.016;

  gl_FragColor = vec4(encodeSrgb(clamp(col, 0.0, 1.0)), 1.0);
}
`;

const COLOR_TOKENS = [
  ["uPaper", "--paper"],
  ["uInk", "--ink"],
  ["uFlame", "--flame"],
  ["uCobalt", "--cobalt"],
  ["uJade", "--jade"],
  ["uButter", "--butter"],
] as const;

export function LiquidCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const uniforms: Record<string, { value: unknown }> = {
      uTime: { value: 0 },
      uRes: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new Vector2(0.5, 0.5) },
    };
    for (const [name, token] of COLOR_TOKENS) {
      uniforms[name] = { value: new Vector3(...tokenToLinear(token)) };
    }

    const renderer = new WebGLRenderer({ antialias: false, alpha: false });
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const scene = new Scene();
    scene.add(new Mesh(geometry, material));

    // Bare camera: the vertex shader already emits clip space.
    const camera = new Camera();

    const res = uniforms.uRes.value as Vector2;
    const mouse = uniforms.uMouse.value as Vector2;
    const target = new Vector2(0.5, 0.5);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      res.set(window.innerWidth, window.innerHeight);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    const start = performance.now();

    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      mouse.lerp(target, POINTER_INERTIA);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="liquid-canvas" aria-hidden="true" />;
}
