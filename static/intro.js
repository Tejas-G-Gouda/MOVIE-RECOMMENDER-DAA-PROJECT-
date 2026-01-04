/**
 * CinemaVerse Cinematic Intro Animation
 * 
 * A premium cinematic intro that plays once on page load.
 * Uses Three.js for 3D geometry and GSAP for smooth animations.
 * Cleanly disposes and removes after animation completes.
 */

class CinemaVerseIntro {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textMesh = null;
        this.container = null;
        this.hasPlayed = false;
        this.animationFrameId = null;
        
        // Check if intro has already played in this session
        if (sessionStorage.getItem('cinemaverseIntroPlayed')) {
            this.hasPlayed = true;
        }
    }

    async init() {
        if (this.hasPlayed) {
            return; // Don't play intro again in same session
        }

        // Hide main content during intro
        this.hideMainContent();
        
        // Create intro container
        this.createContainer();
        
        // Initialize Three.js scene
        this.setupScene();
        
        // Create 3D text using TubeGeometry
        this.createTextMesh();
        
        // Add subtle lighting
        this.setupLighting();
        
        // Start animation loop
        this.animate();
        
        // Play GSAP timeline
        this.playIntroTimeline();
        
        // Mark as played
        sessionStorage.setItem('cinemaverseIntroPlayed', 'true');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'intro-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: linear-gradient(135deg, #050812 0%, #1a0033 100%);
            overflow: hidden;
            pointer-events: none;
            opacity: 1;
        `;
        document.body.appendChild(this.container);
    }

    setupScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        // Camera setup
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            60,
            w / h,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Secondary light for depth (cyan accent)
        const secondaryLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
        secondaryLight.position.set(-5, -5, 3);
        this.scene.add(secondaryLight);
    }

    createTextMesh() {
        // Create a simple 3D object using box geometries arranged as text
        // This avoids dependency on external font files
        
        const group = new THREE.Group();
        
        // Create a stylized logo using geometric shapes
        // Main shape: a floating box with gradient material
        const boxGeometry = new THREE.BoxGeometry(2, 1.5, 0.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.3
        });
        
        const mainBox = new THREE.Mesh(boxGeometry, material);
        group.add(mainBox);
        
        // Add decorative elements
        const sphereGeometry = new THREE.IcosahedronGeometry(0.3, 4);
        const sphere1 = new THREE.Mesh(sphereGeometry, material);
        sphere1.position.set(-1.5, 1.2, 0.5);
        group.add(sphere1);
        
        const sphere2 = new THREE.Mesh(sphereGeometry, material);
        sphere2.position.set(1.5, 1.2, 0.5);
        group.add(sphere2);
        
        // Add text label using canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#050812';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Welcome to', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = 'bold 72px Arial';
        ctx.fillText('CinemaVerse', canvas.width / 2, canvas.height / 2 + 50);
        
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            emissiveMap: texture,
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
            roughness: 0.3
        });
        
        const textGeometry = new THREE.PlaneGeometry(3, 1.5);
        const textPlane = new THREE.Mesh(textGeometry, textMaterial);
        textPlane.position.z = 0.3;
        group.add(textPlane);
        
        // Set initial state
        group.scale.set(0.3, 0.3, 0.3);
        group.rotation.x = Math.PI * 0.3;
        group.rotation.y = -Math.PI * 0.1;
        group.material = material; // fallback
        
        this.textMesh = group;
        this.scene.add(this.textMesh);
    }

    playIntroTimeline() {
        const tl = gsap.timeline({
            onComplete: () => this.completeIntro()
        });
        
        // Phase 1: Scale up and fade in (0-1.2s)
        tl.to(this.textMesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.2,
            ease: 'back.out'
        }, 0);
        
        // Phase 2: Gentle rotation (0.3-2.3s)
        tl.to(this.textMesh.rotation, {
            x: 0,
            y: Math.PI * 0.3,
            duration: 2,
            ease: 'sine.inOut'
        }, 0.3);
        
        // Phase 3: Camera zoom slightly (0-3s)
        tl.to(this.camera.position, {
            z: 4.5,
            duration: 3,
            ease: 'sine.inOut'
        }, 0);
        
        // Phase 4: Subtle floating motion (1-2.5s)
        tl.to(this.textMesh.position, {
            y: 0.3,
            duration: 1.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 1
        }, 1);
        
        // Phase 5: Scale back down and fade to transition (3.2-4.2s)
        tl.to(this.textMesh.scale, {
            x: 0.7,
            y: 0.7,
            z: 0.7,
            duration: 1,
            ease: 'back.in'
        }, 3.2);
        
        // Phase 6: Fade out overlay (3.5-4.5s)
        tl.to(this.container, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, 3.5);
    }

    animate() {
        const animationFrame = () => {
            this.animationFrameId = requestAnimationFrame(animationFrame);
            
            // Subtle continuous rotation
            if (this.textMesh) {
                this.textMesh.rotation.y += 0.0008;
            }
            
            if (this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        
        animationFrame();
    }

    completeIntro() {
        // Clean up and show main content
        this.showMainContent();
        this.dispose();
    }

    dispose() {
        // Stop animation loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Clean up Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode === this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        // Dispose geometries and materials in the group
        if (this.textMesh) {
            this.textMesh.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        // Remove container from DOM
        if (this.container && this.container.parentNode === document.body) {
            document.body.removeChild(this.container);
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textMesh = null;
        this.container = null;
    }

    hideMainContent() {
        const elements = [
            document.querySelector('header'),
            document.querySelector('.control-panel'),
            document.querySelector('.results-section'),
            document.querySelector('.watchlist-section'),
            document.querySelector('.add-movie-section'),
            document.querySelector('.update-movie-section'),
            document.getElementById('particles')
        ];
        
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            }
        });
    }

    showMainContent() {
        const elements = [
            document.querySelector('header'),
            document.querySelector('.control-panel'),
            document.querySelector('.results-section'),
            document.querySelector('.watchlist-section'),
            document.querySelector('.add-movie-section'),
            document.querySelector('.update-movie-section'),
            document.getElementById('particles')
        ];
        
        // Use GSAP to fade in main content
        gsap.to(elements.filter(el => el !== null), {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Re-enable pointer events
        elements.forEach(el => {
            if (el) {
                el.style.pointerEvents = 'auto';
            }
        });
    }

    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        if (this.camera) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }
        
        if (this.renderer) {
            this.renderer.setSize(w, h);
        }
    }
}

// Auto-initialize intro when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js and GSAP to load
    if (typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
        const intro = new CinemaVerseIntro();
        intro.init().catch(err => {
            console.warn('Intro failed to initialize, continuing without it:', err);
        });
    }
});
