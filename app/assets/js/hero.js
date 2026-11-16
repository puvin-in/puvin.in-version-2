// PUVIN home page scenes. Loaded only on the home page, only when WebGL is wanted and available.
import * as THREE from '/assets/vendor/three/three.min.js';

const PORTRAIT = '/assets/img/portrait.png';
const KEYWORDS = [
  'REACT.JS', 'NEXT.JS', 'JAVASCRIPT', 'HTML5', 'CSS3', 'TAILWIND', 'NODE.JS', 'EXPRESS.JS', 'REST APIS',
  'AUTH', 'MONGODB', 'MYSQL', 'GIT', 'GITHUB', 'POSTMAN', 'VERCEL', 'CPANEL', 'HOSTINGER',
];
const SETTINGS = {
  high: { particles: 62000, pixelRatio: 2, words: 36 },
  medium: { particles: 24000, pixelRatio: 1.5, words: 27 },
};
const PORTRAIT_HEIGHT = 2.3;

const pointsVertex = /* glsl */ `
  uniform float uTime, uPush, uSize, uMorph, uRadius, uPixel;
  uniform vec2 uMouse;
  attribute float aLum;
  attribute vec3 aRand;
  attribute vec3 aAlt;
  varying float vLum;
  varying float vEnergy;

  void main() {
    vec3 home = position;
    home.z += (aLum - 0.5) * 0.42 + sin(uTime * 0.7 + aRand.x * 6.283) * 0.012;

    float turn = uTime * 0.22;
    vec3 alt = vec3(aAlt.x * cos(turn) - aAlt.z * sin(turn), aAlt.y, aAlt.x * sin(turn) + aAlt.z * cos(turn));

    float m = smoothstep(aRand.z * 0.35, 0.65 + aRand.z * 0.35, uMorph);
    vec3 p = mix(home, alt, m);

    vec2 toPointer = p.xy - uMouse;
    float dist = length(toPointer) + 0.0001;
    float force = smoothstep(uRadius, 0.0, dist) * uPush;
    p.xy += (toPointer / dist) * force * (0.14 + 0.26 * aRand.x);
    p.xy += (aRand.xy - 0.5) * force * 0.1;
    p.z += force * 0.5 * aRand.y;

    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * (0.55 + aLum * 0.95 + force * 0.8) * uPixel * (4.0 / -view.z);
    vLum = aLum;
    vEnergy = force;
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uAccent;
  varying float vLum;
  varying float vEnergy;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.28, d);
    vec3 colour = mix(vec3(0.6), vec3(1.0), vLum);
    colour = mix(colour, uAccent, clamp(vEnergy * 1.1, 0.0, 0.85));
    gl_FragColor = vec4(colour, edge * (0.3 + 0.7 * vLum));
  }
`;

const crtVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const crtFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime, uPush;
  uniform vec2 uPointer;
  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;
    c *= 1.0 + dot(c, c) * 0.07;
    return c * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = barrel(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;

    float near = smoothstep(0.3, 0.0, distance(uv, uPointer)) * uPush;
    uv.x += sin(uv.y * 90.0 + uTime * 8.0) * 0.012 * near;
    uv.x += sin(uv.y * 8.0 + uTime * 1.3) * 0.0014;

    vec2 cells = vec2(210.0, 220.0);
    vec2 snapped = (floor(uv * cells) + 0.5) / cells;
    float shift = 0.0035 + near * 0.02;
    vec4 mid = texture2D(uTex, snapped);
    float r = texture2D(uTex, snapped + vec2(shift, 0.0)).r;
    float b = texture2D(uTex, snapped - vec2(shift, 0.0)).b;

    float a = mid.a;
    vec3 image = vec3(r, mid.g, b) * a + vec3(0.035) * (1.0 - a);
    image = smoothstep(0.03, 0.92, image);

    float scan = 0.72 + 0.28 * sin(uv.y * 880.0);
    float rows = 0.9 + 0.1 * sin(uv.y * 16.0 - uTime * 2.4);
    float flicker = 0.97 + 0.03 * sin(uTime * 37.0);
    vec2 v = uv * (1.0 - uv);
    float vignette = pow(v.x * v.y * 18.0, 0.3);

    gl_FragColor = vec4(image * scan * rows * flicker * vignette, 1.0);
  }
`;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`could not load ${url}`));
    image.src = url;
  });
}

// Turn the picture into points. Shuffled, so drawing fewer of them still covers the whole face.
function samplePortrait(image, target) {
  const aspect = image.width / image.height;
  const columns = Math.round(Math.sqrt(target * aspect * 1.75));
  const rows = Math.round(columns / aspect);
  const canvas = document.createElement('canvas');
  canvas.width = columns;
  canvas.height = rows;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, columns, rows);
  const pixels = context.getImageData(0, 0, columns, rows).data;

  const found = [];
  const cell = PORTRAIT_HEIGHT / rows;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const i = (y * columns + x) * 4;
      if (pixels[i + 3] < 96) continue;
      const lum = Math.pow(pixels[i] / 255, 1.15);
      if (Math.random() > 0.3 + 0.7 * lum) continue;
      found.push([
        (x - columns / 2 + Math.random() - 0.5) * cell,
        (rows / 2 - y + Math.random() - 0.5) * cell,
        lum,
      ]);
    }
  }
  for (let i = found.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [found[i], found[j]] = [found[j], found[i]];
  }
  return found.slice(0, target);
}

// Where points go when they leave the portrait: a shell with three tilted rings.
function orbitPoint(i) {
  const u = Math.random() * Math.PI * 2;
  const band = i % 4;
  if (band === 3) {
    const v = Math.acos(2 * Math.random() - 1);
    const r = 0.92 + Math.random() * 0.1;
    return [r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)];
  }
  const r = 1.02 + band * 0.1 + Math.random() * 0.04;
  const tilt = [0.5, -0.9, 1.4][band];
  const x = r * Math.cos(u);
  const y = r * Math.sin(u) * Math.sin(tilt);
  const z = r * Math.sin(u) * Math.cos(tilt);
  return [x, y, z];
}

function buildPortraitPoints(samples, stage, pixelRatio) {
  const count = samples.length;
  const position = new Float32Array(count * 3);
  const alt = new Float32Array(count * 3);
  const rand = new Float32Array(count * 3);
  const lum = new Float32Array(count);
  samples.forEach((sample, i) => {
    position.set([sample[0], sample[1], 0], i * 3);
    lum[i] = sample[2];
    rand.set([Math.random(), Math.random(), Math.random()], i * 3);
    alt.set(orbitPoint(i), i * 3);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('aAlt', new THREE.BufferAttribute(alt, 3));
  geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 3));
  geometry.setAttribute('aLum', new THREE.BufferAttribute(lum, 1));

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#fd4766';
  const material = new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPush: { value: 0 },
      uSize: { value: count > 40000 ? 1.85 : 2.9 },
      uMorph: { value: 1 },
      uRadius: { value: 0.42 },
      uPixel: { value: pixelRatio * (stage.clientHeight / 900 + 0.25) },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uAccent: { value: new THREE.Color(accent) },
    },
  });
  return new THREE.Points(geometry, material);
}

function wordTexture(word) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const font = '800 72px "Big Shoulders Display", "Arial Narrow", sans-serif';
  context.font = font;
  canvas.width = Math.ceil(context.measureText(word).width) + 12;
  canvas.height = 92;
  context.font = font;
  context.fillStyle = '#fff';
  context.textBaseline = 'middle';
  context.fillText(word, 6, 48);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: canvas.width / canvas.height };
}

export async function mountHero(stage, { variant = 'particles', perf = 'high', pointerArea = stage } = {}) {
  const preset = SETTINGS[perf] || SETTINGS.medium;
  const isPhone = window.matchMedia('(max-width: 720px)').matches;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isPhone ? Math.min(preset.pixelRatio, 1.5) : preset.pixelRatio);
  const targetCount = Math.round(preset.particles * (isPhone ? 0.42 : 1));

  const image = await loadImage(PORTRAIT);
  if (document.fonts && variant === 'globe') await document.fonts.ready;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: perf === 'high' ? 'high-performance' : 'default',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(pixelRatio);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-scene', variant);
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
  camera.position.z = 4;
  const root = new THREE.Group();
  scene.add(root);

  const disposables = [];
  const clock = { last: performance.now(), time: 0, slow: 0, frames: 0 };
  const pointer = { x: 9, y: 9, targetX: 9, targetY: 9, nx: 0, ny: 0, ex: 0, ey: 0, inside: 0 };
  let update = () => {};
  let points = null;

  if (variant === 'crt') {
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.NoColorSpace;
    const geometry = new THREE.PlaneGeometry(PORTRAIT_HEIGHT * (image.width / image.height), PORTRAIT_HEIGHT);
    const material = new THREE.ShaderMaterial({
      vertexShader: crtVertex,
      fragmentShader: crtFragment,
      transparent: true,
      uniforms: {
        uTex: { value: texture },
        uTime: { value: 0 },
        uPush: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    root.add(new THREE.Mesh(geometry, material));
    disposables.push(texture, geometry, material);
    update = (time) => {
      material.uniforms.uTime.value = time;
      material.uniforms.uPush.value += (pointer.inside - material.uniforms.uPush.value) * 0.08;
      const width = PORTRAIT_HEIGHT * (image.width / image.height);
      material.uniforms.uPointer.value.set(pointer.x / width + 0.5, pointer.y / PORTRAIT_HEIGHT + 0.5);
      root.rotation.y = pointer.ex * 0.1;
      root.rotation.x = -pointer.ey * 0.07;
    };
  } else if (variant === 'globe') {
    const count = preset.words;
    const radius = 1.08;
    const shared = KEYWORDS.map(wordTexture);
    shared.forEach((word) => disposables.push(word.texture));
    const sprites = [];
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const word = shared[i % shared.length];
      const material = new THREE.SpriteMaterial({ map: word.texture, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(Math.cos(angle) * r * radius, y * radius, Math.sin(angle) * r * radius);
      sprite.scale.set(0.105 * word.aspect, 0.105, 1);
      root.add(sprite);
      sprites.push(sprite);
      disposables.push(material);
    }
    const dots = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i += 1) {
      const y = 1 - (i / 1499) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      dots.set([Math.cos(angle) * r * 0.98, y * 0.98, Math.sin(angle) * r * 0.98], i * 3);
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(dots, 3));
    const dotMaterial = new THREE.PointsMaterial({ color: 0x777777, size: 0.007, transparent: true, opacity: 0.65, depthWrite: false });
    root.add(new THREE.Points(dotGeometry, dotMaterial));
    disposables.push(dotGeometry, dotMaterial);

    const world = new THREE.Vector3();
    update = (time, step) => {
      root.rotation.y += step * (0.18 + pointer.ex * 0.5);
      root.rotation.x += (pointer.ey * -0.35 - root.rotation.x) * 0.05;
      sprites.forEach((sprite) => {
        sprite.getWorldPosition(world);
        const front = Math.max(0, (world.z + radius) / (2 * radius));
        sprite.material.opacity = 0.05 + 0.95 * front * front;
      });
    };
  } else {
    const samples = samplePortrait(image, targetCount);
    points = buildPortraitPoints(samples, stage, pixelRatio);
    root.add(points);
    disposables.push(points.geometry, points.material);
    const uniforms = points.material.uniforms;
    update = (time) => {
      uniforms.uTime.value = time;
      uniforms.uMouse.value.set(pointer.x, pointer.y);
      uniforms.uPush.value += (pointer.inside - uniforms.uPush.value) * 0.06;
      if (variant === 'orbit') {
        // Hold the face, scatter into the orbit, hold, then reform.
        const cycle = (time + 2) % 16;
        const goal = cycle < 5 ? 0 : cycle < 13 ? 1 : 0;
        uniforms.uMorph.value += (goal - uniforms.uMorph.value) * 0.012;
      } else {
        uniforms.uMorph.value += (0 - uniforms.uMorph.value) * 0.028;
      }
      root.rotation.y = pointer.ex * 0.16;
      root.rotation.x = -pointer.ey * 0.09;
    };
  }

  // Sizes
  const fit = () => {
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const contentAspect = (image.width / image.height) * 1.02;
    root.scale.setScalar(camera.aspect < contentAspect ? camera.aspect / contentAspect : 1);
    if (points) points.material.uniforms.uPixel.value = pixelRatio * (height / 900 + 0.25);
  };
  fit();
  const resize = new ResizeObserver(fit);
  resize.observe(stage);

  // Pointer: listens on the whole hero so text above the canvas stays fully interactive
  const onMove = (event) => {
    const box = canvas.getBoundingClientRect();
    const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
    const ny = -(((event.clientY - box.top) / box.height) * 2 - 1);
    const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    pointer.targetX = (nx * halfHeight * camera.aspect) / root.scale.x;
    pointer.targetY = (ny * halfHeight) / root.scale.y;
    pointer.nx = Math.max(-1, Math.min(1, nx));
    pointer.ny = Math.max(-1, Math.min(1, ny));
    pointer.inside = 1;
  };
  const onLeave = () => {
    pointer.inside = 0;
    pointer.nx = 0;
    pointer.ny = 0;
  };
  pointerArea.addEventListener('pointermove', onMove, { passive: true });
  pointerArea.addEventListener('pointerleave', onLeave, { passive: true });

  // Render only while it can be seen
  let frame = 0;
  let onScreen = true;
  let firstFrame = true;
  const render = (now) => {
    frame = requestAnimationFrame(render);
    const step = Math.min((now - clock.last) / 1000, 0.1);
    clock.last = now;
    clock.time += step;

    pointer.x += (pointer.targetX - pointer.x) * 0.14;
    pointer.y += (pointer.targetY - pointer.y) * 0.14;
    pointer.ex += (pointer.nx - pointer.ex) * 0.05;
    pointer.ey += (pointer.ny - pointer.ey) * 0.05;

    update(clock.time, step);
    renderer.render(scene, camera);

    if (firstFrame) {
      firstFrame = false;
      stage.classList.add('is-live');
    }

    // Keep the frame rate steady: draw fewer points on a device that is struggling
    clock.frames += 1;
    if (step > 0.034) clock.slow += 1;
    if (clock.frames === 120) {
      if (points && clock.slow > 70) {
        const drawn = points.geometry.drawRange.count === Infinity ? points.geometry.attributes.position.count : points.geometry.drawRange.count;
        points.geometry.setDrawRange(0, Math.max(8000, Math.round(drawn * 0.65)));
      }
      clock.frames = 0;
      clock.slow = 0;
    }
  };
  const start = () => {
    if (frame || !onScreen || document.hidden) return;
    clock.last = performance.now();
    frame = requestAnimationFrame(render);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    if (onScreen) start();
    else stop();
  });
  visibility.observe(stage);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    stop();
    resize.disconnect();
    visibility.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    pointerArea.removeEventListener('pointermove', onMove);
    pointerArea.removeEventListener('pointerleave', onLeave);
    canvas.removeEventListener('webglcontextlost', onLost);
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    stage.classList.remove('is-live');
  };
  // If the graphics card drops the scene, fall back to the static portrait
  function onLost(event) {
    event.preventDefault();
    destroy();
  }
  canvas.addEventListener('webglcontextlost', onLost);

  start();
  return destroy;
}
