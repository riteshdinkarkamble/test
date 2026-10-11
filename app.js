import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, mixer, clock;
let lion;
let trees = [];

function init() {
    clock = new THREE.Clock();

    // --- Scene Setup ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x102010); // Dark jungle floor color
    scene.fog = new THREE.Fog(0x102010, 10, 50); // Add a simple fog for depth

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10); // Position it like a person viewing
    camera.lookAt(0, 1, 0);

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows for realism
    document.body.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // --- Ground ---
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x223311 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Loading Realistic 3D Models ---
    const loader = new GLTFLoader();

    // 1. Load the Lion (requires an animated model with a 'Walk' animation)
    // Placeholder URL - You would use a link to your actual model file.
    loader.load('https://threejs.org/examples/models/gltf/Lion/Lion.glb', (gltf) => {
        lion = gltf.scene;
        lion.scale.set(0.5, 0.5, 0.5);
        lion.traverse((node) => {
            if (node.isMesh) node.castShadow = true;
        });
        scene.add(lion);

        // Setup Animation Mixer
        mixer = new THREE.AnimationMixer(lion);
        const clips = gltf.animations;
        
        // Find and play the walk animation
        const walkClip = THREE.AnimationClip.findByName(clips, 'Walk');
        if (walkClip) {
            const action = mixer.clipAction(walkClip);
            action.play();
        }
    });

    // 2. Load and Position Multiple Trees
    // Placeholder URL - Use a link to a realistic tree model.
    loader.load('https://threejs.org/examples/models/gltf/Tree/Tree.glb', (gltf) => {
        for (let i = 0; i < 15; i++) {
            const tree = gltf.scene.clone();
            const scale = 1 + Math.random() * 2;
            tree.scale.set(scale, scale, scale);
            tree.position.set(Math.random() * 40 - 20, 0, Math.random() * 40 - 20);
            tree.rotation.y = Math.random() * Math.PI;
            tree.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            scene.add(tree);
            trees.push(tree); // Add to array for wind animation
        }
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- The Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Update Lion's Animation
    if (mixer) mixer.update(deltaTime);

    // Move the lion forward (simple example)
    if (lion) {
        lion.position.z -= 1 * deltaTime; // Move in -Z direction
        if (lion.position.z < -25) lion.position.z = 25; // Loop back
    }

    // 2. Realistic Wind Effect for Trees
    trees.forEach((tree, index) => {
        // Use sine wave to simulate gentle, swaying wind
        // Different offset/speed per tree based on its index
        const windSpeed = 0.5 + (index % 3) * 0.1;
        const windStrength = 0.02 + (index % 5) * 0.005;
        
        const swayX = Math.sin(elapsedTime * windSpeed + index) * windStrength;
        const swayZ = Math.cos(elapsedTime * windSpeed * 0.8 + index) * windStrength;

        // Apply rotation to simulate bending
        tree.rotation.x = swayX;
        tree.rotation.z = swayZ;
    });

    renderer.render(scene, camera);
}

init();
animate();
