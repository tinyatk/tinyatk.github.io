import * as THREE from 'three';

// Hero 3D Parallax Portrait
// Loads settings from ./settings.json and renders a 3D portrait with depth-based parallax

const TONE_MAPS = [
  THREE.NoToneMapping,
  THREE.LinearToneMapping,
  THREE.ReinhardToneMapping,
  THREE.CineonToneMapping,
  THREE.ACESFilmicToneMapping
];

export async function initHero3D(containerSelector = '#hero-3d-container') {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn('Hero 3D container not found:', containerSelector);
    return;
  }

  // Load settings from external JSON
  const settings = await fetch('./settings.json')
    .then(r => r.json())
    .catch(() => ({}));

  const s = (key, fallback) => key in settings ? settings[key] : fallback;

  // Get container dimensions
  const rect = container.getBoundingClientRect();
  const width = rect.width || container.offsetWidth || 400;
  const height = rect.height || container.offsetHeight || 500;

  // Setup renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = TONE_MAPS[s('toneMapping', 4)] ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = s('exposure', 1.2);
  container.appendChild(renderer.domElement);

  // Setup scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(s('bgColor', '#080809'));

  if (s('fogEnabled', false)) {
    scene.fog = new THREE.FogExp2(s('bgColor', '#080809'), s('fogDensity', 0.1));
  }

  // Setup camera
  const camera = new THREE.PerspectiveCamera(s('fov', 45), width / height, 0.01, 100);
  camera.position.z = s('camZ', 2.5);

  // Lighting setup
  const keyLight = new THREE.DirectionalLight(s('keyColor', '#fff4e0'), s('keyInt', 2.5));
  keyLight.position.set(s('keyX', 1.5), s('keyY', 2.0), s('keyZ', 2.0));
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(s('fillColor', '#c0d8ff'), s('fillInt', 0.8));
  fillLight.position.set(s('fillX', -2.0), s('fillY', -1.0), 1);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(s('ambColor', '#ffffff'), s('ambInt', 0.4)));

  // Load textures and create mesh
  const loader = new THREE.TextureLoader();

  try {
    const [colorTex, depthTex] = await Promise.all([
      loader.loadAsync('./color.png'),
      loader.loadAsync('./depth.png')
    ]);

    colorTex.colorSpace = THREE.SRGBColorSpace;

    const dispScale = s('invertDepth', false) ? -s('dispScale', 0.18) : s('dispScale', 0.18);
    const segs = s('segments', 256);

    // Plane geometry adjusted for portrait aspect ratio
    const planeW = s('planeW', 1.6);
    const planeH = s('planeH', 2.0);
    const geo = new THREE.PlaneGeometry(planeW, planeH, segs, segs);

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

    const meshScale = s('meshScale', 1);
    mesh.scale.set(meshScale, meshScale, meshScale);
    scene.add(mesh);

    // Mouse parallax tracking
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const maxTilt = Math.PI / 18; // 10 degrees max tilt

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
    };

    // Track if mouse is over container
    let isHovering = false;
    container.addEventListener('mouseenter', () => { isHovering = true; });
    container.addEventListener('mouseleave', () => { isHovering = false; });
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width || container.offsetWidth;
      const h = rect.height || container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const autoRotate = s('autoRotate', false); // Disabled for hero
    const rotSpeed = s('orbitSpeed', 0.003);

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(container);

    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      // Smooth interpolation for mouse parallax
      target.x += (mouse.x * maxTilt - target.x) * 0.05;
      target.y += (mouse.y * maxTilt - target.y) * 0.05;

      mesh.rotation.x = THREE.MathUtils.degToRad(s('rotX', 0)) + (isHovering ? target.y : 0);
      mesh.rotation.y = THREE.MathUtils.degToRad(s('rotY', 0)) + (isHovering ? target.x : 0);

      if (autoRotate && !isHovering) {
        mesh.rotation.y += rotSpeed;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      colorTex.dispose();
      depthTex.dispose();
    });

  } catch (err) {
    console.error('Failed to load textures:', err);
    // Fallback: show static image if textures fail
    container.innerHTML = '<img src="./assets/images/hero.webp" alt="Tin Yat Kwok portrait" style="width:100%;height:auto;border-radius:48px;">';
  }
}
