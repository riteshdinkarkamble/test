import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';

let scene, camera, renderer, clock;
let lionGroup, legs = [];
let trees = [];

function init() {
    clock = new THREE.Clock();

    // --- Scene Setup ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1a0b); // Deep jungle night/evening tone
    scene.fog = new THREE.FogExp2(0x0b1a0b, 0.035);

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 1.5, 0);

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x2d4a2d, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4e0c1, 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // --- Jungle Ground ---
    const groundGeo = new THREE.PlaneGeometry(150, 150);
    const groundMat = new THREE.MeshStandardMaterial({ 
        color: 0x1b2e13, 
        roughness: 0.9,
        metalness: 0.1 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Procedural Realistic Lion ---
    lionGroup = new THREE.Group();
    
    const lionMat = new THREE.MeshStandardMaterial({ color: 0xc68b59, roughness: 0.7 });
    const maneMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x221100 });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(1.4, 0.8, 2.2);
    const torso = new THREE.Mesh(torsoGeo, lionMat);
    torso.position.y = 1.2;
    torso.castShadow = true;
    lionGroup.add(torso);

    // Head & Mane
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const head = new THREE.Mesh(headGeo, lionMat);
    head.position.set(0, 1.5, 1.3);
    head.castShadow = true;
    lionGroup.add(head);

    const maneGeo = new THREE.BoxGeometry(1.1, 1.1, 0.7);
    const mane = new THREE.Mesh(maneGeo, maneMat);
    mane.position.set(0, 1.5, 1.0);
    mane.castShadow = true;
    lionGroup.add(mane);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.04, 0.02, 1.5);
    const tail = new THREE.Mesh(tailGeo, lionMat);
    tail.rotation.x = Math.PI / 4;
    tail.position.set(0, 1.4, -1.3);
    lionGroup.add(tail);

    // Legs (Animated walk cycle parts)
    legs = [];
    const legGeo = new THREE.BoxGeometry(0.25, 1.0, 0.25);
    const positions = [
        [-0.5, 0.5, 0.8],  // Front Left
        [0.5, 0.5, 0.8],   // Front Right
        [-0.5, 0.5, -0.8], // Back Left
        [0.5, 0.5, -0.8]   // Back Right
    ];

    positions.forEach((pos, idx) => {
        const legPivot = new THREE.Group();
        legPivot.position.set(pos[0], pos[1] + 0.5, pos[2]);
        
        const leg = new THREE.Mesh(legGeo, lionMat);
        leg.position.y = -0.5;
        leg.castShadow = true;
        legPivot.add(leg);
        
        lionGroup.add(legPivot);
        legs.push({ pivot: legPivot, index: idx });
    });

    lionGroup.position.set(0, 0, 0);
    scene.add(lionGroup);

    // --- Procedural Lush Jungle Trees ---
    const createTree = (x, z, scale) => {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.4 * scale, 0.7 * scale, 5 * scale, 7);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = (2.5 * scale);
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Canopy foliage clusters
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1e4620, roughness: 0.8 });
        for (let j = 0; j < 4; j++) {
            const sphereGeo = new THREE.SphereGeometry((1.5 + Math.random() * 0.8) * scale, 6, 6);
            const cluster = new THREE.Mesh(sphereGeo, foliageMat);
            cluster.position.set(
                (Math.random() - 0.5) * 1.5 * scale,
                (4.5 + j * 0.8) * scale,
                (Math.random() - 0.5) * 1.5 * scale
            );
            cluster.castShadow = true;
            treeGroup.add(cluster);
        }

        treeGroup.position.set(x, 0, z);
        scene.add(treeGroup);
        trees.push({ group: treeGroup, baseScale: scale });
    };

    // Scatter trees around the clearing
    for (let i = 0; i < 25; i++) {
        const x = (Math.random() - 0.5) * 50;
        const z = -5 - Math.random() * 35;
        const scale = 0.8 + Math.random() * 1.2;
        createTree(x, z, scale);
    }

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // --- Wind Simulation on Trees ---
    trees.forEach((treeObj, i) => {
        const windFactor = Math.sin(elapsedTime * 1.5 + i) * 0.04;
        treeObj.group.rotation.z = windFactor * treeObj.baseScale;
        treeObj.group.rotation.x = Math.cos(elapsedTime * 1.2 + i) * 0.02;
    });

    // --- Lion Wandering & Leg Animation ---
    if (lionGroup) {
        // Patrol path back and forth
        lionGroup.position.x = Math.sin(elapsedTime * 0.5) * 6;
        
        // Face direction of movement
        lionGroup.rotation.y = Math.cos(elapsedTime * 0.5) > 0 ? Math.PI / 2 : -Math.PI / 2;

        // Animate walking leg swings
        legs.forEach((legObj) => {
            const sign = (legObj.index % 2 === 0) ? 1 : -1;
            const wave = Math.sin(elapsedTime * 6 + (legObj.index * Math.PI / 2));
            legObj.pivot.rotation.x = wave * 0.5 * sign;
        });
    }

    renderer.render(scene, camera);
}

init();
animate();
