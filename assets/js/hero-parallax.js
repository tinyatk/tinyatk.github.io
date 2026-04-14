import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Settings and image paths are relative to this script's location (assets/js/)

const TONE_MAPS = [
  THREE.NoToneMapping,
  THREE.LinearToneMapping,
  THREE.ReinhardToneMapping,
  THREE.CineonToneMapping,
  THREE.ACESFilmicToneMapping
];

const settings = {
  dispScale: 1,
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
  meshScale: 1.4,
  invertDepth: true,
  mobileTiltSensitivity: 3
};

export async function initHeroParallax(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Hero parallax container not found:', containerSelector);
    return;
  }

  // Force container to have dimensions before creating renderer
  const parentWidth = container.parentElement?.clientWidth || container.clientWidth || 420;
  const parentHeight = container.parentElement?.clientHeight || container.clientHeight || parentWidth * 1.25;

  // Set explicit styles on container
  container.style.width = parentWidth + 'px';
  container.style.height = parentHeight + 'px';
  container.style.display = 'block';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detect touch devices early (needed for controls setup)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const s = (key, fallback) => key in settings ? settings[key] : fallback;

  // Get container dimensions
  const width = container.clientWidth || parentWidth;
  const height = container.clientHeight || parentHeight;

  if (!width || !height) {
    console.error('Container has no dimensions:', width, height);
    return;
  }

  console.log('Three.js hero parallax initializing with size:', width, 'x', height);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); // Transparent background
  renderer.toneMapping = TONE_MAPS[s('toneMapping', 4)] ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = s('exposure', 1.2);
  container.appendChild(renderer.domElement);
  console.log('Renderer created and appended to container');

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const aspect = width / height;
  const camera = new THREE.PerspectiveCamera(s('fov', 45), aspect, 0.01, 100);
  camera.position.z = s('camZ', 2.5);

  // Controls (restricted)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = s('damping', true);
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  // Allow page scrolling on mobile; desktop interactions unchanged
  if (isTouchDevice && renderer.domElement) {
    renderer.domElement.style.touchAction = 'pan-y';
  }

  // Lights
  const keyLight = new THREE.DirectionalLight(s('keyColor', '#fff4e0'), s('keyInt', 2.5));
  keyLight.position.set(s('keyX', 1.5), s('keyY', 2.0), s('keyZ', 2.0));
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(s('fillColor', '#c0d8ff'), s('fillInt', 0.8));
  fillLight.position.set(s('fillX', -2.0), s('fillY', -1.0), 1);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(s('ambColor', '#ffffff'), s('ambInt', 0.4)));

  // Load textures
  const loader = new THREE.TextureLoader();
  let colorTex, depthTex;
  try {
    [colorTex, depthTex] = await Promise.all([
      loader.loadAsync('assets/images/color.webp'),
      loader.loadAsync('assets/images/depth.webp')
    ]);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    console.log('Textures loaded successfully');
  } catch (e) {
    console.error('Failed to load textures:', e);
    // Show fallback
    container.innerHTML = '<img src="assets/images/hero.png" alt="Tin Yat Kwok" style="width:100%;height:auto;border-radius:var(--radius-xl);">';
    return;
  }

  // Mesh setup
  const dispScale = s('invertDepth', false)
    ? -s('dispScale', 0.18)
    : s('dispScale', 0.18);

  const segs = s('segments', 256);
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
  mesh.rotation.set(
    THREE.MathUtils.degToRad(s('rotX', 0)),
    THREE.MathUtils.degToRad(s('rotY', 0)),
    THREE.MathUtils.degToRad(s('rotZ', 0))
  );
  const sc = s('meshScale', 1);
  mesh.scale.set(sc, sc, sc);
  scene.add(mesh);
  console.log('Mesh added to scene');

  // Force initial render
  renderer.render(scene, camera);
  console.log('Initial render complete');

  // Mouse parallax
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const maxTilt = Math.PI / 9; // 20 degrees

  let isHovering = false;
  container.addEventListener('mouseenter', () => isHovering = true);
  container.addEventListener('mouseleave', () => isHovering = false);

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Mobile: device orientation (gyroscope) tilt controls
  let orientationEnabled = false;

  const handleDeviceOrientation = (e) => {
    if (!e.gamma || !e.beta) return;
    // gamma: left/right tilt (-90 to 90), beta: front/back tilt (-180 to 180)
    // Clamp and normalize to -1 to 1 range
    const tiltX = Math.max(-45, Math.min(45, e.gamma)) / 45;
    const tiltY = Math.max(-45, Math.min(45, e.beta - 45)) / 45; // Subtract 45 for typical phone holding angle
    const sensitivity = s('mobileTiltSensitivity', 1.5);
    mouse.x = tiltX * sensitivity;
    mouse.y = -tiltY * sensitivity;
  };

  if (isTouchDevice) {
    // Request permission on iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Wait for first click/touch to request permission (iOS requirement)
      const requestOrientationPermission = () => {
        DeviceOrientationEvent.requestPermission().then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            orientationEnabled = true;
          }
        }).catch(console.error);
      };
      // Add one-time click listener to request permission
      container.addEventListener('click', requestOrientationPermission, { once: true });
      container.addEventListener('touchstart', requestOrientationPermission, { once: true });
    } else {
      // Non-iOS or older devices: add listener directly
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      orientationEnabled = true;
    }
  }

  // Handle resize
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

  // Animation loop
  const autoRotate = s('autoRotate', false) && !prefersReducedMotion;
  const rotSpeed = s('orbitSpeed', 0.003);

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    // Smooth interpolation
    if (!prefersReducedMotion) {
      target.x += (mouse.x * maxTilt - target.x) * 0.05;
      target.y += (mouse.y * maxTilt - target.y) * 0.05;
    }

    // Apply rotation
    mesh.rotation.x = target.y;
    if (autoRotate && !isHovering) {
      mesh.rotation.y += rotSpeed;
    }
    mesh.rotation.y += (target.x * maxTilt - mesh.rotation.y) * 0.05;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  console.log('Animation loop started');

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    geo.dispose();
    mat.dispose();
    colorTex?.dispose();
    depthTex?.dispose();
    container.removeChild(renderer.domElement);
  };
}
