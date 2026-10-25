import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidFabricCanvasProps {
  activeTextureUrl: string;
  nextTextureUrl?: string;
  transitionProgress?: number;
  className?: string;
}

export const LiquidFabricCanvas: React.FC<LiquidFabricCanvasProps> = ({
  activeTextureUrl,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    const loadedTexture = textureLoader.load(activeTextureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    });

    // 2. Custom Liquid Fabric GLSL Shaders
    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // Calculate aspect-ratio-corrected vector from mouse to UV
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 distVec = (uv - uMouse) * aspect;
        float dist = length(distVec);

        // Organic fabric ripple distortion influenced by cursor inertia and time
        float ripple = sin(dist * 18.0 - uTime * 2.5) * 0.5 + 0.5;
        float strength = smoothstep(0.45, 0.0, dist) * 0.045;

        // Subtle silk wave across the fabric surface
        float silkWave = sin(uv.x * 6.0 + uv.y * 4.0 + uTime * 0.8) * 0.012;

        vec2 distortedUv = uv + normalize(distVec + 0.0001) * (ripple * strength) + vec2(silkWave, -silkWave);

        // Chromatic aberration along the displacement edges for optical lens feel
        float r = texture2D(uTexture, distortedUv + vec2(strength * 0.6, 0.0)).r;
        float g = texture2D(uTexture, distortedUv).g;
        float b = texture2D(uTexture, distortedUv - vec2(strength * 0.6, 0.0)).b;

        // Subtle editorial grain
        float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;

        vec3 finalColor = vec3(r, g, b) + grain;

        // Soft vignette framing
        float vignette = smoothstep(1.2, 0.5, length((uv - 0.5) * vec2(1.1, 1.0)));
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: loadedTexture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 3. Mouse & Pointer Tracking with Smooth Inertia
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // invert for WebGL UV coordinates
      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        mouseRef.current.targetX = Math.max(0, Math.min(1, x));
        mouseRef.current.targetY = Math.max(0, Math.min(1, y));
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 4. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !material) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    });
    resizeObserver.observe(container);

    // 5. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsedTime;
        materialRef.current.uniforms.uMouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      loadedTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Update texture when prop changes
  useEffect(() => {
    if (!materialRef.current || !textureLoaderRef.current) return;
    const newTexture = textureLoaderRef.current.load(activeTextureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
    });
    materialRef.current.uniforms.uTexture.value = newTexture;
  }, [activeTextureUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-crosshair select-none ${className}`}
      aria-label="Interactive liquid silk shader canvas. Drag or hover cursor to feel fabric drape."
    />
  );
};
