import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass, EffectPass, EffectComposer, GodRaysEffect } from 'postprocessing';

// Image & Alpha Texture URLs
const image_url = 'monera-mamm.jpg';
const alpha_url = 'https://images.unsplash.com/photo-1510942752400-ebce99a8a2c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHRyaWFuZ2xlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60';

// Load Textures
const image_tex = new THREE.TextureLoader().load(image_url);
const alpha_tex = new THREE.TextureLoader().load(alpha_url);

// Adjust Alpha Texture
alpha_tex.repeat.set(0.6, 2);
alpha_tex.offset.x = (1 - alpha_tex.repeat.x) / 2;
alpha_tex.wrapT = THREE.RepeatWrapping;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 1);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Geometry & Materials
const image_ratio = 687 / 1031;
const geom = new THREE.PlaneGeometry(image_ratio * 2, 2);
const mat = new THREE.MeshLambertMaterial({ map: image_tex, alphaMap: alpha_tex, alphaTest: 0.15 });
const mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

// Wall Object (for God Rays)
const wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ map: image_tex, alphaMap: alpha_tex, alphaTest: 0.15 }));
wall.scale.setScalar(1.2);
wall.position.z = -0.1;
scene.add(wall);

// Post-Processing Effects
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const effect = new GodRaysEffect(camera, wall, { density: 1, decay: 0.96, weight: 1 });
const effectPass = new EffectPass(camera, effect);
composer.addPass(renderPass);
composer.addPass(effectPass);

// Animation Loop
function animate(t) {
  composer.render();
  controls.update();
  alpha_tex.offset.y = t * -0.001;
  requestAnimationFrame(animate);
}
animate(0);
