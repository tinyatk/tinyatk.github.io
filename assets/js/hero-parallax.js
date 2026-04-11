import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TONE_MAPS = [
  THREE.NoToneMapping,
  THREE.LinearToneMapping,
  THREE.ReinhardToneMapping,
  THREE.CineonToneMapping,
  THREE.ACESFilmicToneMapping
];

export async function initHeroParallax(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Hero parallax container not found:', containerSelector);
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load settings
  let settings = {};
  try {
    const response = await fetch('./settings.json');
    if (response.ok) {
      settings = await response.json();
    }
  } catch (e) {
    console.warn('Could not load settings.json, using defaults');
  }

  const s = (key, fallback) => key in settings ? settings[key] : fallback;

  // Get container dimensions - use parent if height is zero
  const width = container.clientWidth;
  const height = container.clientHeight || container.parentElement.clientHeight || width * 1.25;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); // Transparent background
  renderer.toneMapping = TONE_MAPS[s('toneMapping', 4)] ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = s('exposure', 1.2);
  container.appendChild(renderer.domElement);

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
  controls.enableRotate = false; // Disable manual rotation - we control via mouse

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
      loader.loadAsync('./color.webp'),
      loader.loadAsync('./depth.webp')
    ]);
    colorTex.colorSpace = THREE.SRGBColorSpace;
  } catch (e) {
    console.error('Failed to load textures:', e);
    // Show fallback - original image
    container.innerHTML = '<img src="assets/images/hero.png" alt="Tin Yat Kwok" style="width:100%;height:auto;">';
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

  // Mouse parallax
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const maxTilt = Math.PI / 18; // 10 degrees

  let isHovering = false;
  container.addEventListener('mouseenter', () => isHovering = true);
  container.addEventListener('mouseleave', () => isHovering = false);

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Handle resize
  const handleResize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
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
