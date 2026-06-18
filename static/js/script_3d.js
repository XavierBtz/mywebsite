document.addEventListener("DOMContentLoaded", () => {
    init3DScene();
});

function init3DScene() {
    const container = document.getElementById('guitar-scene');
    if (!container) return;

    // 1. Core Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4.5); // Backed out slightly for breathing room

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Warm Lofi Lighting Matrix
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Golden sheen highlight light
    const goldGlint = new THREE.DirectionalLight(0xD4AF37, 3);
    goldGlint.position.set(5, 5, 2);
    scene.add(goldGlint);

    // Warm orange atmosphere backlight
    const warmMoodLight = new THREE.PointLight(0xE67E22, 2, 10);
    warmMoodLight.position.set(-2, -2, 1);
    scene.add(warmMoodLight);

    // 3. Create the Main Group (Holds the entire record player assembly)
    const audioGroup = new THREE.Group();
    scene.add(audioGroup);

    // --- ELEMENT A: THE MIDNIGHT VINYL DISC ---
    // A ultra-thin cylinder representing the classic record format
    const vinylGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.015, 64);
    const vinylMat = new THREE.MeshStandardMaterial({
        color: 0x090909,       // Super deep charcoal wax
        roughness: 0.35,       // Smooth satin finish to catch lights
        metalness: 0.1
    });
    const vinylDisc = new THREE.Mesh(vinylGeo, vinylMat);
    audioGroup.add(vinylDisc);

    // --- ELEMENT B: THE GOLD ACCENT CENTER LABEL ---
    const labelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.018, 32);
    const labelMat = new THREE.MeshStandardMaterial({
        color: 0xbf953f,       // Matte luxury gold
        metalness: 0.8,
        roughness: 0.2
    });
    const centerLabel = new THREE.Mesh(labelGeo, labelMat);
    audioGroup.add(centerLabel);

    // --- ELEMENT C: GOLD REVERB SOUNDWAVE ORBIT ---
    // Creating a procedural ring of floating audio particles
    const particleCount = 180;
    const waveGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialRadii = new Float32Array(particleCount); // Store baseline layout tracking

    const baseRadius = 1.45; // Sits neatly right outside the spinning disc rim

    for (let i = 0; i < particleCount; i++) {
        const theta = (i / particleCount) * Math.PI * 2;

        positions[i * 3] = Math.cos(theta) * baseRadius;     // X Coordinate
        positions[i * 3] = 0;                                // Y Coordinate (Flat on plane initially)
        positions[i * 3 + 2] = Math.sin(theta) * baseRadius; // Z Coordinate

        initialRadii[i] = baseRadius;
    }

    waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Lofi Gold dust material configuration
    const waveMaterial = new THREE.PointsMaterial({
        color: 0xfcf6ba,
        size: 0.035,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const soundwaveParticles = new THREE.Points(waveGeometry, waveMaterial);
    audioGroup.add(soundwaveParticles);

    // Pre-tilt the entire cluster beautifully toward the reader/viewer layout
    audioGroup.rotation.x = Math.PI / 3.2; // Angle match to look down at the grooved system
    audioGroup.rotation.z = -0.2;

    // 4. Smooth, Ambient Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Slow, continuous rotation of the vinyl disc (33 RPM lofi energy)
        vinylDisc.rotation.y += 0.004;
        centerLabel.rotation.y += 0.004;

        // Subtle overall drifting float effect (music hanging in air)
        audioGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.08;

        // Animate the soundwave particles using a calm mathematical sine ripple
        const posAttribute = soundwaveParticles.geometry.attributes.position;

        for (let i = 0; i < particleCount; i++) {
            const theta = (i / particleCount) * Math.PI * 2;

            // Generate overlapping ripples to mimic frequency bouncing
            const waveValue1 = Math.sin(theta * 5 + elapsedTime * 1.5) * 0.05;
            const waveValue2 = Math.cos(theta * 2 - elapsedTime * 0.8) * 0.03;
            const finalRipple = waveValue1 + waveValue2;

            // Modulate the radius out and back based on the wave frequency calculation
            const currentRadius = initialRadii[i] + finalRipple;

            posAttribute.setX(i, Math.cos(theta) * currentRadius);
            posAttribute.setY(i, finalRipple * 1.2); // Give it a soft vertical bounce
            posAttribute.setZ(i, Math.sin(theta) * currentRadius);
        }

        posAttribute.needsUpdate = true; // Tell Three.js to re-draw positions
        soundwaveParticles.rotation.y -= 0.001; // Tiny secondary particle swirl

        renderer.render(scene, camera);
    }
    animate();

    // 5. Clean Window Resizing
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}