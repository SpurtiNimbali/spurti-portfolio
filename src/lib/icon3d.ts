import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type IconKind = "projects" | "research" | "readme";
export const ICON_REV = 9;

export type IconHandle = {
  destroy: () => void;
  setHover: (v: boolean) => void;
};

type Pose = { p: THREE.Vector3; r: THREE.Euler; s: number };

type Piece = {
  mesh: THREE.Object3D;
  rest: Pose;
  hover: Pose;
  delay: number;
  t: number;
  v: number;
};

const C = {
  cream: 0xf3eee6,
  peach: 0xe4b39a,
  mint: 0xc5d9d2,
  sage: 0x8fb3aa,
  teal: 0x2f6f6a,
  fog: 0xd8d5cf,
  charcoal: 0x2b2926,
};

function matte(color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.02,
    envMapIntensity: 0.2,
    ...extra,
  });
}

function frost(color: number) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.38,
    metalness: 0,
    transmission: 0.18,
    thickness: 0.25,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 0.15,
  });
}

function slab(w: number, h: number, d: number, mat: THREE.Material) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.045), mat);
}

function cardTexture(paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  paint(ctx, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function paperCard(tex: THREE.Texture) {
  const mat = matte(C.cream, { map: tex, roughness: 0.68 });
  return new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.78, 0.09), mat);
}

function applyPose(mesh: THREE.Object3D, pose: Pose) {
  mesh.position.copy(pose.p);
  mesh.rotation.copy(pose.r);
  mesh.scale.setScalar(pose.s);
}

function piece(mesh: THREE.Object3D, rest: Pose, hover: Pose, delay = 0): Piece {
  applyPose(mesh, rest);
  return { mesh, rest, hover, delay, t: 0, v: 0 };
}

function makeProjects() {
  const g = new THREE.Group();
  const t1 = cardTexture((ctx, w, h) => {
    ctx.fillStyle = "#f3eee6";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b2926";
    ctx.font = "700 54px 'Iowan Old Style', Palatino, serif";
    ctx.fillText("Design", 48, 120);
    ctx.fillStyle = "#2f6f6a";
    ctx.fillRect(48, 148, 86, 6);
    ctx.fillStyle = "#c5d9d2";
    for (let i = 0; i < 5; i++) ctx.fillRect(48, 220 + i * 36, 280 - i * 18, 10);
  });
  const t2 = cardTexture((ctx, w, h) => {
    ctx.fillStyle = "#efe8dc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b2926";
    ctx.font = "700 46px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Typography", 40, 108);
    ctx.font = "600 210px Palatino, serif";
    ctx.fillText("aA", 48, 390);
    ctx.fillStyle = "#e4b39a";
    ctx.fillRect(48, 430, 120, 8);
  });
  const t3 = cardTexture((ctx, w, h) => {
    ctx.fillStyle = "#f7f3ec";
    ctx.fillRect(0, 0, w, h);
    const swatches = ["#2f6f6a", "#8fb3aa", "#c5d9d2", "#e4b39a", "#efe8dc", "#2b2926"];
    swatches.forEach((hex, i) => {
      const x = 56 + (i % 3) * 132;
      const y = 150 + Math.floor(i / 3) * 160;
      ctx.fillStyle = hex;
      ctx.fillRect(x, y, 112, 128);
    });
  });

  const cards = [paperCard(t1), paperCard(t2), paperCard(t3)];
  const rests: Pose[] = [
    { p: new THREE.Vector3(-0.28, 0.08, 0.12), r: new THREE.Euler(-0.12, 0.42, 0.06), s: 1 },
    { p: new THREE.Vector3(0.06, 0.16, 0), r: new THREE.Euler(-0.08, 0.06, 0), s: 1 },
    { p: new THREE.Vector3(0.38, 0.04, -0.14), r: new THREE.Euler(-0.1, -0.36, -0.05), s: 1 },
  ];
  const hovers: Pose[] = [
    { p: new THREE.Vector3(-1.05, 0.22, 0.18), r: new THREE.Euler(-0.16, 0.62, 0.1), s: 1.04 },
    { p: new THREE.Vector3(0.08, 0.42, 0.08), r: new THREE.Euler(-0.1, 0.08, 0), s: 1.05 },
    { p: new THREE.Vector3(1.12, 0.12, -0.16), r: new THREE.Euler(-0.14, -0.58, -0.08), s: 1.04 },
  ];
  const pieces: Piece[] = cards.map((mesh, i) => piece(mesh, rests[i], hovers[i], i * 0.05));
  pieces.forEach((p) => g.add(p.mesh));
  g.userData.pieces = pieces;
  g.userData.textures = [t1, t2, t3];
  return g;
}

function makeFun() {
  const g = new THREE.Group();
  const palette = [C.cream, C.peach, C.mint, C.sage, C.teal, C.charcoal];
  const pieces: Piece[] = palette.map((color, i) => {
    const mesh = slab(0.92, 1.38, 0.08, matte(color));
    const n = palette.length - 1;
    const t = n === 0 ? 0 : i / n - 0.5;
    return piece(
      mesh,
      {
        p: new THREE.Vector3(t * 0.62, 0, -i * 0.04),
        r: new THREE.Euler(0.02, t * 0.82, 0),
        s: 1,
      },
      {
        p: new THREE.Vector3(t * 1.55, 0.08, -i * 0.02),
        r: new THREE.Euler(0.02, t * 1.05, t * 0.04),
        s: 1.05,
      },
      i * 0.03,
    );
  });
  pieces.forEach((p) => g.add(p.mesh));
  g.userData.pieces = pieces;
  return g;
}

function makeAbout() {
  const g = new THREE.Group();
  const layers = [
    { c: C.cream, mat: matte(C.cream) },
    { c: C.mint, mat: frost(C.mint) },
    { c: C.teal, mat: matte(C.teal) },
    { c: C.charcoal, mat: matte(C.charcoal) },
  ];
  const pieces: Piece[] = layers.map((layer, i) => {
    const mesh = slab(1.48, 1.48, 0.11, layer.mat);
    return piece(
      mesh,
      {
        p: new THREE.Vector3(i * 0.05, i * 0.34, -i * 0.05),
        r: new THREE.Euler(0, 0, 0),
        s: 1,
      },
      {
        p: new THREE.Vector3((i - 1.5) * 0.18, i * 0.52, (1.5 - i) * 0.12),
        r: new THREE.Euler(0.08, 0.1, 0),
        s: 1.03,
      },
      i * 0.05,
    );
  });
  pieces.forEach((p) => g.add(p.mesh));
  g.userData.pieces = pieces;
  return g;
}

function groundShadow() {
  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 40),
    new THREE.MeshBasicMaterial({
      color: 0x1d2422,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.92;
  mesh.scale.set(1.15, 0.72, 1);
  return mesh;
}

function build(kind: IconKind) {
  if (kind === "projects") return makeProjects();
  if (kind === "research") return makeFun();
  return makeAbout();
}

function stepSpring(
  value: number,
  velocity: number,
  target: number,
  dt: number,
  omega = 9.4,
  zeta = 0.52,
) {
  const accel = omega * omega * (target - value) - 2 * zeta * omega * velocity;
  const vel = velocity + accel * dt;
  return { value: value + vel * dt, velocity: vel };
}

function mixEuler(a: THREE.Euler, b: THREE.Euler, t: number, out: THREE.Euler) {
  out.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
}

export function startIcon(
  canvas: HTMLCanvasElement,
  kind: IconKind,
  options?: { ambient?: boolean },
): IconHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xf6f3ec, 0xb7c7c2, 1.05));
  const key = new THREE.DirectionalLight(0xfff7ee, 1.12);
  key.position.set(-3.2, 5.4, 2.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd5e4df, 0.32);
  fill.position.set(2.8, 1.2, -1.6);
  scene.add(fill);

  const object = build(kind);
  object.scale.setScalar(0.2);
  scene.add(object);
  scene.add(groundShadow());
  const pieces = (object.userData.pieces as Piece[]) ?? [];
  const textures = (object.userData.textures as THREE.Texture[]) ?? [];

  const camera = new THREE.OrthographicCamera(-2.4, 2.4, 2.4, -2.4, 0.1, 40);
  camera.position.set(5.2, 4.4, 5.2);
  camera.lookAt(0, 0.15, 0);

  let hovered = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 };
  let hover = 0;
  let hoverV = 0;
  let scale = 0.2;
  let scaleV = 0;
  const phase = kind === "projects" ? 0 : kind === "research" ? 2.09 : 4.18;
  const ambient = options?.ambient ?? false;
  const introDelay = ambient ? 0 : kind === "projects" ? 0.04 : kind === "research" ? 0.12 : 0.2;
  const floatPeriod = kind === "projects" ? 9 : kind === "research" ? 8.5 : 10;

  const onMove = (e: PointerEvent) => {
    const r = canvas.parentElement?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
    mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
  };
  const parent = canvas.parentElement;
  parent?.addEventListener("pointermove", onMove);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    const aspect = w / Math.max(1, h);
    const s = 2.35;
    camera.left = -s * aspect;
    camera.right = s * aspect;
    camera.top = s;
    camera.bottom = -s;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  if (ambient) {
    object.scale.setScalar(1.05);
  }

  const tmpE = new THREE.Euler();
  let raf = 0;
  let last = performance.now();
  const t0 = last;
  const loop = (now: number) => {
    const t = (now - t0) / 1000;
    const dt = Math.min(0.033, Math.max(0.001, (now - last) / 1000));
    last = now;
    const live = ambient || t > introDelay;
    const h = stepSpring(hover, hoverV, hovered && live ? 1 : 0, dt, 8.8, 0.5);
    hover = h.value;
    hoverV = h.velocity;
    const targetScale = ambient ? 1.05 : live ? 1.05 : 0.2;
    const s = stepSpring(scale, scaleV, targetScale, dt, 10, 0.56);
    scale = s.value;
    scaleV = s.velocity;

    if (!ambient) {
      const mx = stepSpring(mouse.x, mouse.vx, hovered ? mouse.tx : 0, dt, 7.5, 0.84);
      mouse.x = mx.value;
      mouse.vx = mx.velocity;
      const my = stepSpring(mouse.y, mouse.vy, hovered ? mouse.ty : 0, dt, 7.5, 0.84);
      mouse.y = my.value;
      mouse.vy = my.velocity;
      object.rotation.y = mouse.x * 0.22;
      object.rotation.x = -mouse.y * 0.16;
    }

    object.scale.setScalar(scale);
    if (ambient && !hovered) {
      const w = (Math.PI * 2) / floatPeriod;
      object.position.y = Math.sin(t * w + phase) * 0.028;
      object.rotation.z = Math.sin(t * w * 0.85 + phase + 0.6) * 0.026;
    } else if (ambient) {
      object.position.y = hover * 0.04;
      object.rotation.z = 0;
    } else {
      object.position.y = Math.sin(t * 0.9 + phase) * 0.035 + hover * 0.08;
    }

    for (const bit of pieces) {
      const ready = live && (ambient || t > introDelay + bit.delay);
      const sprung = stepSpring(bit.t, bit.v, hovered && ready ? 1 : 0, dt, 8.2, 0.5);
      bit.t = sprung.value;
      bit.v = sprung.velocity;
      const k = bit.t;
      bit.mesh.position.lerpVectors(bit.rest.p, bit.hover.p, k);
      mixEuler(bit.rest.r, bit.hover.r, k, tmpE);
      bit.mesh.rotation.copy(tmpE);
      const sc = bit.rest.s + (bit.hover.s - bit.rest.s) * k;
      bit.mesh.scale.setScalar(Math.max(0.001, sc));
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    setHover(v: boolean) {
      hovered = v;
      if (!v) {
        mouse.tx = 0;
        mouse.ty = 0;
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent?.removeEventListener("pointermove", onMove);
      textures.forEach((tex) => tex.dispose());
      renderer.dispose();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const mat = node.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    },
  };
}
