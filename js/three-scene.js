/* ══════════════════════════════════════════
   BIOZAGRI – Three.js 3D Scene
   Molécula agrícola interactiva
   ══════════════════════════════════════════ */

function initThreeScene() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const wrap = canvas.parentElement;
  let W = wrap.clientWidth;
  let H = wrap.clientHeight || 700;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.z = 6;

  /* ── Central icosahedron ── */
  const icoGeo = new THREE.IcosahedronGeometry(1.3, 1);
  const icoMat = new THREE.MeshPhongMaterial({
    color: 0x2e7d32,
    emissive: 0x1b5e20,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.88,
    shininess: 120,
    specular: 0x81c784,
  });
  const icosphere = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icosphere);

  /* ── Wireframe shell ── */
  const wireGeo = new THREE.IcosahedronGeometry(1.38, 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x4caf50, wireframe: true, transparent: true, opacity: 0.22 });
  const wireframe = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireframe);

  /* ── Outer wireframe (larger, slower) ── */
  const wire2Geo = new THREE.IcosahedronGeometry(1.9, 1);
  const wire2Mat = new THREE.MeshBasicMaterial({ color: 0xf5a623, wireframe: true, transparent: true, opacity: 0.1 });
  const wireframe2 = new THREE.Mesh(wire2Geo, wire2Mat);
  scene.add(wireframe2);

  /* ── Orbit ring 1 – green spheres ── */
  const orbit1 = new THREE.Group();
  const numOrb1 = 8;
  for (let i = 0; i < numOrb1; i++) {
    const angle = (i / numOrb1) * Math.PI * 2;
    const r = 2.4;
    const geo = new THREE.SphereGeometry(0.1, 12, 12);
    const mat = new THREE.MeshPhongMaterial({ color: 0x4caf50, emissive: 0x2e7d32, shininess: 80 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    orbit1.add(m);

    /* Connector line from center */
    const linePts = [new THREE.Vector3(0, 0, 0), m.position.clone()];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4caf50, transparent: true, opacity: 0.15 });
    orbit1.add(new THREE.Line(lineGeo, lineMat));
  }
  scene.add(orbit1);

  /* ── Orbit ring 2 – amber spheres ── */
  const orbit2 = new THREE.Group();
  const numOrb2 = 5;
  for (let i = 0; i < numOrb2; i++) {
    const angle = (i / numOrb2) * Math.PI * 2;
    const r = 3.1;
    const geo = new THREE.SphereGeometry(0.13, 12, 12);
    const mat = new THREE.MeshPhongMaterial({ color: 0xf5a623, emissive: 0xe65100, shininess: 100 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    orbit2.add(m);
  }
  scene.add(orbit2);

  /* ── Background particles ── */
  const pCount = 280;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 5;
    pPos[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = radius * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x4caf50, size: 0.045, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── DNA Helix ── */
  const helixGroup = new THREE.Group();
  const helixSteps = 40;
  for (let i = 0; i < helixSteps; i++) {
    const t = (i / helixSteps) * Math.PI * 4;
    const y = (i / helixSteps) * 6 - 3;
    const r = 0.5;

    [1, -1].forEach((side, si) => {
      const geo = new THREE.SphereGeometry(0.06, 8, 8);
      const mat = new THREE.MeshPhongMaterial({
        color: si === 0 ? 0x81c784 : 0xffa726,
        emissive: si === 0 ? 0x2e7d32 : 0xe65100,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(side * r * Math.cos(t), y, r * Math.sin(t) * side);
      helixGroup.add(m);
    });

    if (i % 4 === 0) {
      const p1 = new THREE.Vector3(-r * Math.cos(t), y, -r * Math.sin(t));
      const p2 = new THREE.Vector3(r * Math.cos(t),  y,  r * Math.sin(t));
      const lGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lMat = new THREE.LineBasicMaterial({ color: 0x4caf50, transparent: true, opacity: 0.4 });
      helixGroup.add(new THREE.Line(lGeo, lMat));
    }
  }
  helixGroup.position.set(3.8, 0, -1);
  helixGroup.scale.setScalar(0.55);
  scene.add(helixGroup);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const light1 = new THREE.PointLight(0x4caf50, 3, 10);
  light1.position.set(3, 4, 3);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xf5a623, 2, 8);
  light2.position.set(-3, -2, 2);
  scene.add(light2);

  const light3 = new THREE.PointLight(0x81c784, 1.5, 6);
  light3.position.set(0, -3, 4);
  scene.add(light3);

  /* ── Mouse parallax ── */
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 1.2;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  /* ── Animation ── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    icosphere.rotation.x = t * 0.18;
    icosphere.rotation.y = t * 0.28;

    wireframe.rotation.x = -t * 0.14;
    wireframe.rotation.y = t * 0.22;

    wireframe2.rotation.x = t * 0.07;
    wireframe2.rotation.z = t * 0.11;

    orbit1.rotation.z = t * 0.55;
    orbit1.rotation.x = Math.sin(t * 0.22) * 0.4;

    orbit2.rotation.y = t * 0.38;
    orbit2.rotation.z = Math.cos(t * 0.18) * 0.25;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;

    helixGroup.rotation.y = t * 0.3;

    /* Smooth mouse parallax */
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    camera.position.x += (currentX * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (currentY * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    /* Light pulsation */
    light1.intensity = 2.5 + Math.sin(t * 1.5) * 0.8;
    light2.intensity = 1.5 + Math.cos(t * 1.2) * 0.5;

    renderer.render(scene, camera);
  }
  animate();

  /* ── Resize ── */
  function onResize() {
    W = wrap.clientWidth;
    H = wrap.clientHeight || 700;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', onResize);
}

document.addEventListener('DOMContentLoaded', initThreeScene);
