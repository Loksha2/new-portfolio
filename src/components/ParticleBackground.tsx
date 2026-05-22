import { useEffect, useRef, useCallback } from 'react';

// ─── SIMPLEX NOISE ───────────────────────────────────────────────────
const GRAD3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

class SimplexNoise {
  private perm: number[];

  constructor(seed = Math.random()) {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed * 256;
    for (let i = 255; i > 0; i--) {
      s = ((s * 16807) % 2147483647);
      const j = Math.floor((s / 2147483647) * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  noise2D(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t, Y0 = j - t;
    const x0 = x - X0, y0 = y - Y0;

    let i1: number, j1: number;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;

    const dot = (g: number[], dx: number, dy: number) => g[0] * dx + g[1] * dy;

    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot(GRAD3[this.perm[ii + this.perm[jj]] % 12], x0, y0); }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot(GRAD3[this.perm[ii + i1 + this.perm[jj + j1]] % 12], x1, y1); }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot(GRAD3[this.perm[ii + 1 + this.perm[jj + 1]] % 12], x2, y2); }

    return 70 * (n0 + n1 + n2);
  }
}

// ─── TYPES ───────────────────────────────────────────────────────────
interface Particle {
  x: number;      // 3D coordinates
  y: number;
  z: number;
  px: number;     // Projected 2D coordinates
  py: number;
  pvx: number;    // Velocity on projected 2D coordinates
  pvy: number;
  angle: number;  // Current dash angle
  depth: number;  // Normalized depth (0 = close, 1 = far)
}

// ─── CONFIG ──────────────────────────────────────────────────────────
const FOCAL_LENGTH = 700;
const MOUSE_RADIUS = 160;
const DAMPING = 0.84;

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const anglesRef = useRef({ x: 0, y: 0 }); // Current rotation angles
  const targetAnglesRef = useRef({ x: 0, y: 0 }); // Target rotation angles based on cursor
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const noiseRef = useRef(new SimplexNoise());

  // ── Pre-computed Color & Alpha Lookup to avoid string allocations in loop ──
  const rgbaCacheRef = useRef<string[][]>([]);
  if (rgbaCacheRef.current.length === 0) {
    const steps = 120;
    const alphaSteps = 21; // 0.0 to 1.0 in steps of 0.05
    for (let i = 0; i < steps; i++) {
      const pct = i / (steps - 1);
      let r = 0, g = 0, b = 0;
      if (pct < 0.35) {
        const t = pct / 0.35;
        r = 42 + (124 - 42) * t;
        g = 92 + (92 - 92) * t;
        b = 238 + (252 - 238) * t;
      } else if (pct < 0.65) {
        const t = (pct - 0.35) / 0.3;
        r = 124 + (235 - 124) * t;
        g = 92 + (64 - 92) * t;
        b = 252 + (120 - 252) * t;
      } else {
        const t = (pct - 0.65) / 0.35;
        r = 235 + (255 - 235) * t;
        g = 64 + (110 - 64) * t;
        b = 120 + (50 - 120) * t;
      }
      
      const rgbStr = `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;
      const row: string[] = [];
      for (let a = 0; a < alphaSteps; a++) {
        const alphaVal = a / (alphaSteps - 1);
        row.push(`rgba(${rgbStr}, ${alphaVal.toFixed(2)})`);
      }
      rgbaCacheRef.current.push(row);
    }
  }

  // ── Create 3D Sphere Particles ─────────────────────────────────────
  const createSphereParticles = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const R = Math.min(w, h) * (isMobile ? 0.5 : 0.45); // Sphere radius
    
    const latCount = isMobile ? 12 : 18; // Horizontal slices (Reduced for performance)
    const lonCount = isMobile ? 22 : 30; // Vertical slices (Reduced for performance)
    const particles: Particle[] = [];

    for (let i = 0; i < latCount; i++) {
      // Spherical coordinate phi (latitude)
      const phi = (i + 0.5) * Math.PI / latCount;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Reduce longitude count near poles to keep density uniform
      const numLons = Math.max(4, Math.round(lonCount * sinPhi));

      for (let j = 0; j < numLons; j++) {
        // Spherical coordinate theta (longitude)
        const theta = j * Math.PI * 2 / numLons;

        // 3D position
        const x = R * sinPhi * Math.cos(theta);
        const y = R * cosPhi;
        const z = R * sinPhi * Math.sin(theta);

        particles.push({
          x,
          y,
          z,
          px: 0,
          py: 0,
          pvx: 0,
          pvy: 0,
          angle: Math.random() * Math.PI * 2,
          depth: 0.5,
        });
      }
    }
    return particles;
  }, []);

  // ── Animation Loop ─────────────────────────────────────────────────
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const angles = anglesRef.current;
    const targetAngles = targetAnglesRef.current;

    timeRef.current += 1;
    const time = timeRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // ── Sphere Center Positioning & Playful Random Floating ──────────
    const isMobile = w < 768;
    const noise = noiseRef.current;
    
    // Increased range and speed to make the sphere float all over the screen dynamically
    const floatRangeX = isMobile ? w * 0.25 : w * 0.32; 
    const floatRangeY = h * 0.32;
    const driftX = noise.noise2D(time * 0.0018, 100) * floatRangeX;
    const driftY = noise.noise2D(200, time * 0.0018) * floatRangeY;

    // Base position is left-centered, drifting all over the left, center, and middle-right
    const baseCenterX = isMobile ? w * 0.5 : w * 0.35;
    const centerX = baseCenterX + driftX;
    const centerY = h * 0.5 + driftY;

    // ── Update Rotation Angles (Smooth lag + auto-spin) ──────────────
    if (mouse.active) {
      // Panning direction matches mouse movement (move right -> rotate right)
      targetAngles.y = (mouse.x - w / 2) * 0.0012;
      targetAngles.x = -(mouse.y - h / 2) * 0.0008;
    } else {
      targetAngles.y = 0;
      targetAngles.x = 0;
    }

    // Interpolate rotation angles
    angles.y += (targetAngles.y - angles.y) * 0.06;
    angles.x += (targetAngles.x - angles.x) * 0.06;

    // Constant rotation speed offset
    const autoAngleY = time * 0.0012;
    const currentRotY = angles.y + autoAngleY;
    const currentRotX = angles.x;

    const cosY = Math.cos(currentRotY);
    const sinY = Math.sin(currentRotY);
    const cosX = Math.cos(currentRotX);
    const sinX = Math.sin(currentRotX);

    // ── Rotate, Project, & Update Particles ──────────────────────────
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 1. 3D Rotation
      // Rotate around Y-axis
      let rx1 = p.x * cosY - p.z * sinY;
      let rz1 = p.x * sinY + p.z * cosY;

      // Rotate around X-axis
      let ry2 = p.y * cosX - rz1 * sinX;
      let rz2 = p.y * sinX + rz1 * cosX;

      // 2. Perspective Projection
      const R = Math.min(w, h) * (isMobile ? 0.5 : 0.45);
      const scale = FOCAL_LENGTH / (FOCAL_LENGTH + rz2);
      
      const targetProjX = centerX + rx1 * scale;
      const targetProjY = centerY + ry2 * scale;

      // Initialize 2D coordinates on first frame
      if (p.px === 0 && p.py === 0) {
        p.px = targetProjX;
        p.py = targetProjY;
      }

      // 3. Spring force to match 3D projected position
      const springK = 0.08;
      p.pvx += (targetProjX - p.px) * springK;
      p.pvy += (targetProjY - p.py) * springK;

      // 4. Mouse Repulsion on projected coordinates
      if (mouse.active) {
        const dx = p.px - mouse.x;
        const dy = p.py - mouse.y;
        const distSq = dx * dx + dy * dy;
        // Normalized depth (0 = closest, 1 = farthest)
        const depthNorm = (rz2 + R) / (2 * R);
        const repulsionRadius = MOUSE_RADIUS * (0.8 + (1 - depthNorm) * 0.4);
        const repulsionRadiusSq = repulsionRadius * repulsionRadius;

        if (distSq < repulsionRadiusSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const proximity = 1 - dist / repulsionRadius;
          const force = proximity * proximity * 4.2 * (1 - depthNorm * 0.4);
          
          p.pvx += (dx / dist) * force;
          p.pvy += (dy / dist) * force;
        }
      }

      // 5. Update coordinates & damping
      p.pvx *= DAMPING;
      p.pvy *= DAMPING;
      p.px += p.pvx;
      p.py += p.pvy;

      // 6. Color & alpha scaling based on depth
      const depthNorm = (rz2 + R) / (2 * R); // 0 = close, 1 = far
      const alpha = Math.max(0.08, (1 - depthNorm) * 0.75 + 0.1);
      const thickness = Math.max(1.0, (1 - depthNorm) * 2.2 + 0.8);

      // 7. Calculate oriented dash angle
      const speed = Math.sqrt(p.pvx * p.pvx + p.pvy * p.pvy);
      let angle = p.angle;
      if (speed > 0.15) {
        angle = Math.atan2(p.pvy, p.pvx);
        p.angle = angle;
      } else {
        // Fallback to tangent-like rotation angle
        angle = Math.atan2(ry2, rx1) + Math.PI / 2;
      }

      // 8. Draw oriented dash segment
      const dashLength = 3.5 + Math.min(10, speed * 2.5) + (1 - depthNorm) * 4;
      
      // Direct lookup from precomputed color cache to avoid string allocations
      const pct = Math.max(0, Math.min(1, p.px / w));
      const rgbIndex = Math.floor(pct * 119);
      const alphaIndex = Math.max(0, Math.min(20, Math.round(alpha * 20)));
      const strokeStyle = rgbaCacheRef.current[rgbIndex]?.[alphaIndex] || "rgba(124, 92, 252, 0.5)";

      ctx.beginPath();
      ctx.moveTo(p.px - Math.cos(angle) * (dashLength / 2), p.py - Math.sin(angle) * (dashLength / 2));
      ctx.lineTo(p.px + Math.cos(angle) * (dashLength / 2), p.py + Math.sin(angle) * (dashLength / 2));
      
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    ctx.restore();
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // ── Setup Resize & Events ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      particlesRef.current = createSphereParticles(
        window.innerWidth,
        window.innerHeight
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [animate, createSphereParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;
