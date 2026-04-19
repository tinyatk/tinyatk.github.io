import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TONE_MAPS = [
  THREE.NoToneMapping,
  THREE.LinearToneMapping,
  THREE.ReinhardToneMapping,
  THREE.CineonToneMapping,
  THREE.ACESFilmicToneMapping
];

const settings = {
  dispScale: 1.1,
  dispBias: -0.05,
  segments: 256,
  planeW: 1.12,
  planeH: 2,
  roughness: 0.85,
  metalness: 0,
  mapIntensity: 1,
  wireframe: false,
  doubleSide: false,
  toneMapping: 4,
  exposure: 1.2,
  camZ: 2.5,
  fov: 45,
  orbitSpeed: 0.003,
  autoRotate: false,
  damping: true,
  keyColor: '#fff4e0',
  keyInt: 2.5,
  keyX: 1.5,
  keyY: 2,
  keyZ: 2,
  fillColor: '#c0d8ff',
  fillInt: 0.8,
  fillX: -2,
  fillY: -1,
  ambColor: '#ffffff',
  ambInt: 0.4,
  bgColor: '#080809',
  fogEnabled: false,
  fogDensity: 0.1,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  meshScale: 3.1,
  invertDepth: true,
  mobileTiltSensitivity: 1.1
};

export async function initHeroParallax(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Hero parallax container not found:', containerSelector);
    return;
  }

  // --- Platform Detection ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // --- Settings Helper ---
  const s = (key, fallback) => key in settings ? settings[key] : fallback;

  // --- Mobile Detection & Adaptive Quality ---
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowPower = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  
  // Reduce segments on mobile for performance
  const adaptiveSegments = isLowPower ? 64 : s('segments', 256);

  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported, falling back to static image');
    container.innerHTML = '<img src="assets/images/color.webp" alt="Tin Yat Kwok" style="width:100%;height:auto;border-radius:var(--radius-xl);">';
    return;
  }

  // --- Container Sizing ---
  const parentWidth = container.parentElement?.clientWidth || container.clientWidth || 420;
  const parentHeight = container.parentElement?.clientHeight || container.clientHeight || parentWidth * 1.25;

  container.style.width = Math.min(parentWidth, document.documentElement.clientWidth) + 'px';
  container.style.height = parentHeight + 'px';
  container.style.display = 'block';
  container.style.maxWidth = '100%';

  const width = container.clientWidth || parentWidth;
  const height = container.clientHeight || parentHeight;

  if (!width || !height) {
    console.error('Container has no dimensions:', width, height);
    return;
  }

  // --- Renderer ---
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = TONE_MAPS[s('toneMapping', 4)] ?? THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = s('exposure', 1.2);
    container.appendChild(renderer.domElement);
  } catch (e) {
    console.error('Failed to initialize WebGL renderer:', e);
    container.innerHTML = '<img src="assets/images/color.webp" alt="Tin Yat Kwok" style="width:100%;height:auto;border-radius:var(--radius-xl);">';
    return;
  }

  // --- Scene & Camera ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(s('fov', 45), width / height, 0.01, 100);
  camera.position.z = s('camZ', 2.5);

  // --- Controls (Restricted) ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = s('damping', true);
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  if (isTouchDevice) {
    renderer.domElement.style.touchAction = 'pan-y';
  }

  // --- Lights ---
  const keyLight = new THREE.DirectionalLight(s('keyColor', '#fff4e0'), s('keyInt', 2.5));
  keyLight.position.set(s('keyX', 1.5), s('keyY', 2.0), s('keyZ', 2.0));
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(s('fillColor', '#c0d8ff'), s('fillInt', 0.8));
  fillLight.position.set(s('fillX', -2.0), s('fillY', -1.0), 1);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(s('ambColor', '#ffffff'), s('ambInt', 0.4)));

  // --- Textures ---
  const loader = new THREE.TextureLoader();
  let colorTex, depthTex;
  try {
    [colorTex, depthTex] = await Promise.all([
      loader.loadAsync('assets/images/color.webp'),
      loader.loadAsync('assets/images/depth.webp')
    ]);
    colorTex.colorSpace = THREE.SRGBColorSpace;
  } catch (e) {
    console.error('Failed to load textures:', e);
    container.innerHTML = '<img src="assets/images/hero.png" alt="Tin Yat Kwok" style="width:100%;height:auto;border-radius:var(--radius-xl);">';
    return;
  }

  // --- Mesh ---
  const dispScale = s('invertDepth', false)
    ? -s('dispScale', 0.18)
    : s('dispScale', 0.18);

  const segs = adaptiveSegments;
  const geo = new THREE.PlaneGeometry(s('planeW', 1.6), s('planeH', 2.0), segs, segs);
  const mat = new THREE.MeshStandardMaterial({
    map: colorTex,
    displacementMap: depthTex,
    displacementScale: dispScale,
    displacementBias: s('dispBias', -0.05),
    roughness: s('roughness', 0.85),
    metalness: s('metalness', 0),
    wireframe: s('wireframe', false),
    side: s('doubleSide', false) ? THREE.DoubleSide : THREE.FrontSide,
    transparent: true,
    alphaTest: 0.01
  });

  const mesh = new THREE.Mesh(geo, mat);
  const pivotGroup = new THREE.Group();

  const sc = s('meshScale', 1);
  mesh.scale.set(sc, sc, sc);
  mesh.position.z = -0.5 * sc;
  pivotGroup.add(mesh);

  pivotGroup.rotation.set(
    THREE.MathUtils.degToRad(s('rotX', 0)),
    THREE.MathUtils.degToRad(s('rotY', 0)),
    THREE.MathUtils.degToRad(s('rotZ', 0))
  );
  scene.add(pivotGroup);

  // --- Initial Render ---
  renderer.render(scene, camera);

  // --- Intersection Observer (pause when not visible) ---
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  // --- Input State ---
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const maxTilt = Math.PI / 24; // ~7.5 degrees
  let isHovering = false;

  // --- Desktop: Mouse Parallax ---
  if (!isTouchDevice) {
    container.addEventListener('mouseenter', () => { isHovering = true; });
    container.addEventListener('mouseleave', () => { isHovering = false; });

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
  }

  // --- Mobile: Device Orientation (Gyroscope) ---
  const handleDeviceOrientation = (e) => {
    if (e.gamma === null || e.beta === null) return;
    const tiltX = Math.max(-45, Math.min(45, e.gamma)) / 45;
    const tiltY = Math.max(-35, Math.min(35, e.beta - 35)) / 35;
    const sensitivity = s('mobileTiltSensitivity', 1.5);
    mouse.x = tiltX * sensitivity;
    mouse.y = -tiltY * sensitivity;
  };

  const enableDeviceOrientation = () => {
    window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
  };

  if (isIOS) {
    const requestOrientationPermission = () => {
      DeviceOrientationEvent.requestPermission().then((state) => {
        if (state === 'granted') {
          enableDeviceOrientation();
        }
      }).catch(console.error);
    };
    container.addEventListener('click', requestOrientationPermission, { once: true });
  } else {
    enableDeviceOrientation();
  }

  // --- Resize ---
  const handleResize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    if (newWidth && newHeight) {
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
  };
  window.addEventListener('resize', handleResize);

  // --- Animation Loop ---
  const autoRotate = s('autoRotate', false) && !prefersReducedMotion;
  const rotSpeed = s('orbitSpeed', 0.003);
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isVisible) return;

    if (!prefersReducedMotion) {
      target.x += (mouse.x * maxTilt - target.x) * 0.05;
      target.y += (mouse.y * maxTilt - target.y) * 0.05;
    }

    pivotGroup.rotation.x = target.y;

    if (autoRotate && !isHovering) {
      pivotGroup.rotation.y += rotSpeed;
    }

    pivotGroup.rotation.y += (target.x - pivotGroup.rotation.y) * 0.05;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    geo.dispose();
    mat.dispose();
    colorTex?.dispose();
    depthTex?.dispose();
    container.removeChild(renderer.domElement);
  };
}