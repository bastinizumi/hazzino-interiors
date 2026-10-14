/**
 * HAZZINO INTERIORS — INTERACTIVE 3D KITCHEN VIEWER
 * Full Three.js kitchen: orbit camera, explode/assemble, drawer/door controls,
 * hotspots, material picker, and premium UI.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { X, RotateCcw, ZoomIn, ZoomOut, Layers, Maximize2, RefreshCw } from 'lucide-react';
import {
  KitchenModel,
  KITCHEN_CABINET_COLORS,
  KITCHEN_COUNTERTOP_COLORS,
  KITCHEN_HARDWARE_COLORS,
} from '../../models/KitchenModel';

// ─── Assembly status labels ───────────────────────────────────────────────────
const STATUS = {
  idle:         '',
  exploring:    'EXPLORING COMPONENTS',
  assembling:   'ASSEMBLY IN PROGRESS',
  assembled:    'ASSEMBLY COMPLETE',
  opening_doors:'OPENING DOORS',
  opening_draw: 'OPENING DRAWERS',
};

// ─── Kitchen hotspot definitions (3-D positions) ──────────────────────────────
const KITCHEN_HOTSPOTS = [
  { id: 'upper_cabs',  label: 'UPPER CABINETS',  pos: [-0.8,  2.0, -0.55], action: 'door' },
  { id: 'lower_draw',  label: 'DRAWERS',          pos: [-0.45, 0.55, -0.20], action: 'drawer' },
  { id: 'countertop',  label: 'COUNTERTOP',        pos: [ 0.0,  0.90, -0.40], action: 'material' },
  { id: 'island',      label: 'ISLAND STORAGE',   pos: [ 0.60, 0.94,  1.95], action: 'island_draw' },
  { id: 'lighting',    label: 'UNDER-CABINET LED', pos: [-1.0,  1.30, -0.38], action: 'led' },
];

export default function KitchenViewer() {
  const mountRef     = useRef(null);
  const sceneRef     = useRef(null);
  const cameraRef    = useRef(null);
  const rendererRef  = useRef(null);
  const kitchenRef   = useRef(null);
  const rafRef       = useRef(null);

  // Camera orbit (framed with comfortable view of both wall counter and forward island at z=1.95)
  const azimRef    = useRef(-0.38);
  const elevRef    = useRef(0.28);
  const radiusRef  = useRef(6.2);
  const tAzimRef   = useRef(-0.38);
  const tElevRef   = useRef(0.28);
  const tRadRef    = useRef(6.2);
  const targetRef  = useRef(new THREE.Vector3(0.15, 0.95, 0.70));
  const velRef     = useRef(0);
  const draggingRef= useRef(false);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const frameCount = useRef(0);

  // Refs that mirror UI state so callbacks don't capture stale closures
  const doorsOpenRef   = useRef(false);
  const drawersOpenRef = useRef(false);
  const isExplodedRef  = useRef(false);

  // UI state
  const [isExploded,    setIsExploded]    = useState(false);
  const [doorsOpen,     setDoorsOpen]     = useState(false);
  const [drawersOpen,   setDrawersOpen]   = useState(false);
  const [ledsOn,        setLedsOn]        = useState(true);
  const [islandDist,    setIslandDist]    = useState(1.95);
  const [status,        setStatus]        = useState('');
  const [animating,     setAnimating]     = useState(false);
  const animatingRef   = useRef(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [projHotspots,  setProjHotspots]  = useState([]);
  const [showPanel,     setShowPanel]     = useState(false);
  const [cabinetColor,  setCabinetColor]  = useState(KITCHEN_CABINET_COLORS[0]);  // Champagne Cream / Sand Beige
  const [counterColor,  setCounterColor]  = useState(KITCHEN_COUNTERTOP_COLORS[0]);
  const [hardwareColor, setHardwareColor] = useState(KITCHEN_HARDWARE_COLORS[0]);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showAntiGravityCard, setShowAntiGravityCard] = useState(typeof window !== 'undefined' && window.innerWidth >= 768);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isTouchHorizontalRef = useRef(false);

  // Keep animatingRef in sync so callbacks can read it without stale closure
  const setAnimatingSync = (v) => { animatingRef.current = v; setAnimating(v); };

  // ── Scene Init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    // Responsive camera framing: on mobile portrait, 50deg FOV & 8.5m radius centers entire kitchen
    const isMobile = W < 768 || (W / H) < 1.0;
    const fov = isMobile ? 50 : 38;
    const initialRadius = isMobile ? 8.5 : 6.2;
    radiusRef.current = initialRadius;
    tRadRef.current = initialRadius;

    if (isMobile) {
      targetRef.current.set(0.10, 1.15, 0.55);
      azimRef.current = -0.22;
      tAzimRef.current = -0.22;
      elevRef.current = 0.20;
      tElevRef.current = 0.20;
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f0d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 60);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.className = 'kitchen-viewer-canvas';
    container.appendChild(canvas);
    rendererRef.current = renderer;

    // Lighting rig — balanced for both desktop and mobile viewports
    scene.add(new THREE.AmbientLight(0xfff5e4, 1.6));

    const key = new THREE.DirectionalLight(0xffeedd, 2.6);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far  = 20;
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top   =  5;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xd5e8f8, 0.9);
    fill.position.set(-5, 3, -2);
    scene.add(fill);

    const frontFill = new THREE.DirectionalLight(0xfff5e6, 1.3);
    frontFill.position.set(0, 3, 7);
    scene.add(frontFill);

    const rim = new THREE.DirectionalLight(0xfff8ee, 1.1);
    rim.position.set(0, 5, -5);
    scene.add(rim);

    // Floor plane
    const floorGeom = new THREE.PlaneGeometry(24, 24);
    const floorMat  = new THREE.MeshStandardMaterial({ color: 0x141614, roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide });
    const floor      = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Wall (double-sided so camera orbit never views culled invisible geometry)
    const wallGeom = new THREE.PlaneGeometry(14, 6);
    const wallMat  = new THREE.MeshStandardMaterial({ color: 0x1a201c, roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide });
    const wall     = new THREE.Mesh(wallGeom, wallMat);
    wall.position.set(0, 2.5, -1.1);
    wall.receiveShadow = true;
    scene.add(wall);

    // Build kitchen model
    const kitchen = new KitchenModel({
      cabinetColor:  cabinetColor.color,
      counterColor:  counterColor.color,
      hardwareColor: hardwareColor.color,
    });
    kitchen.setLEDs(true);
    scene.add(kitchen.root);
    kitchenRef.current = kitchen;

    // Render loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      // Auto-inertia
      if (!draggingRef.current) {
        tAzimRef.current += velRef.current;
        velRef.current   *= 0.88;
      }

      // Safe showroom viewing bounds: clamp azimuth, elevation and radius so user stays in the showroom
      tAzimRef.current = Math.max(-1.15, Math.min(1.15, tAzimRef.current));
      tElevRef.current = Math.max(0.06, Math.min(0.65, tElevRef.current));
      tRadRef.current  = Math.max(3.8, Math.min(11.0, tRadRef.current));

      azimRef.current   += (tAzimRef.current   - azimRef.current)   * 0.10;
      elevRef.current   += (tElevRef.current   - elevRef.current)   * 0.10;
      radiusRef.current += (tRadRef.current    - radiusRef.current)  * 0.10;

      const t = targetRef.current;
      const r = radiusRef.current;
      const el = elevRef.current;
      const az = azimRef.current;

      camera.position.set(
        t.x + r * Math.cos(el) * Math.sin(az),
        t.y + r * Math.sin(el),
        t.z + r * Math.cos(el) * Math.cos(az)
      );
      camera.lookAt(t);
      renderer.render(scene, camera);

      // Project hotspots — throttled to every 6 frames (~10fps) to avoid React perf hit
      frameCount.current++;
      if (frameCount.current % 6 === 0 && renderer.domElement) {
        const proj = KITCHEN_HOTSPOTS.map(hs => {
          const v = new THREE.Vector3(...hs.pos);
          v.project(camera);
          const sx = ((v.x + 1) / 2) * 100;
          const sy = ((-v.y + 1) / 2) * 100;
          const isInside = sx >= 6 && sx <= 94 && sy >= 6 && sy <= 94;
          return {
            ...hs,
            sx,
            sy,
            visible: v.z < 1 && isInside,
          };
        });
        setProjHotspots(proj);
      }
    };
    animate();

    // Dynamic Responsive Resize
    const updateSize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width > 0 ? rect.width : window.innerWidth);
      const h = Math.round(rect.height > 0 ? rect.height : window.innerHeight);
      if (w <= 0 || h <= 0) return;

      const isMob = w < 768 || (w / h) < 1.0;
      const cam = cameraRef.current;
      const rend = rendererRef.current;

      cam.aspect = w / h;
      cam.fov = isMob ? 50 : 38;
      cam.updateProjectionMatrix();

      // Adapt target & radius seamlessly across viewport shifts
      if (isMob) {
        targetRef.current.set(0.10, 1.15, 0.55);
        if (radiusRef.current < 7.5) {
          tRadRef.current = 8.5;
        }
      } else {
        targetRef.current.set(0.15, 0.95, 0.70);
        if (radiusRef.current > 7.5) {
          tRadRef.current = 6.2;
        }
      }

      rend.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      rend.setSize(w, h, false);
    };

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(container);
    }

    const onResize = () => {
      updateSize();
      requestAnimationFrame(updateSize);
      setTimeout(updateSize, 120);
      setTimeout(updateSize, 350);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      kitchenRef.current?.dispose();
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  // ── Material updates ──────────────────────────────────────────────────────
  useEffect(() => {
    kitchenRef.current?.updateCabinetColor(cabinetColor.hex);
  }, [cabinetColor]);
  useEffect(() => {
    kitchenRef.current?.updateCountertopColor(counterColor.hex);
  }, [counterColor]);
  useEffect(() => {
    kitchenRef.current?.updateHardwareColor(hardwareColor.hex);
  }, [hardwareColor]);

  // ── Pointer drag ──────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.no-drag')) return;
    draggingRef.current = true;
    prevPosRef.current  = { x: e.clientX, y: e.clientY };
    touchStartPosRef.current = { x: e.clientX, y: e.clientY };
    isTouchHorizontalRef.current = e.pointerType === 'mouse';
    velRef.current = 0;
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    
    // For mobile touch, ignore vertical page scrolling motions
    if (e.pointerType === 'touch') {
      const diffX = Math.abs(e.clientX - touchStartPosRef.current.x);
      const diffY = Math.abs(e.clientY - touchStartPosRef.current.y);
      if (!isTouchHorizontalRef.current) {
        if (diffX > 8 && diffX > diffY * 1.2) {
          isTouchHorizontalRef.current = true;
        } else if (diffY > 8 && diffY > diffX) {
          draggingRef.current = false;
          return;
        } else {
          return;
        }
      }
    }

    const dx = e.clientX - prevPosRef.current.x;
    const dy = e.clientY - prevPosRef.current.y;
    prevPosRef.current = { x: e.clientX, y: e.clientY };
    const speed = 0.0048;
    tAzimRef.current -= dx * speed;
    velRef.current    = -dx * speed * 0.4;
    tElevRef.current  = Math.max(0.06, Math.min(0.65, tElevRef.current + dy * 0.003));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    isTouchHorizontalRef.current = false;
  };

  // ── Animation helpers ─────────────────────────────────────────────────────
  const animateKitchen = useCallback((fn, statusKey, durationEstimate, onDone) => {
    if (animatingRef.current) return;
    setAnimatingSync(true);
    setStatus(STATUS[statusKey]);
    const obj = { t: 0 };
    gsap.to(obj, {
      t: 1, duration: durationEstimate, ease: 'power3.inOut',
      onUpdate: () => fn(obj.t),
      onComplete: () => {
        setAnimatingSync(false);
        if (onDone) onDone();
      },
    });
  }, []);

  // Explode / Assemble
  const handleExplode = useCallback(() => {
    if (animatingRef.current) return;
    const next = !isExplodedRef.current;
    isExplodedRef.current = next;
    setIsExploded(next);
    setStatus(next ? STATUS.exploring : STATUS.assembling);
    setAnimatingSync(true);

    // Close doors and drawers first if open
    if (doorsOpenRef.current)   { kitchenRef.current?.setDoorOpen(0);   doorsOpenRef.current = false; setDoorsOpen(false); }
    if (drawersOpenRef.current) { kitchenRef.current?.setDrawerOpen(0); drawersOpenRef.current = false; setDrawersOpen(false); }

    const obj = { p: next ? 0 : 1 };
    gsap.to(obj, {
      p: next ? 1 : 0,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => kitchenRef.current?.setExplode(obj.p),
      onComplete: () => {
        setAnimatingSync(false);
        setStatus(next ? '' : STATUS.assembled);
        if (!next) setTimeout(() => setStatus(''), 2500);
        tRadRef.current = next ? 7.5 : 4.8;
      },
    });
  }, []);

  // Doors
  const handleToggleDoors = useCallback(() => {
    if (animatingRef.current) return;
    const next = !doorsOpenRef.current;
    doorsOpenRef.current = next;
    setDoorsOpen(next);
    animateKitchen(
      p => kitchenRef.current?.setDoorOpen(next ? p : 1 - p),
      'opening_doors', 1.6,
      () => setStatus('')
    );
  }, [animateKitchen]);

  const handleToggleDrawers = useCallback(() => {
    if (animatingRef.current) return;
    const next = !drawersOpenRef.current;
    drawersOpenRef.current = next;
    setDrawersOpen(next);
    animateKitchen(
      p => kitchenRef.current?.setDrawerOpen(next ? p : 1 - p),
      'opening_draw', 1.6,
      () => setStatus('')
    );
  }, [animateKitchen]);

  // Open All
  const handleOpenAll = useCallback(() => {
    if (animatingRef.current) return;
    doorsOpenRef.current = true; drawersOpenRef.current = true;
    setDoorsOpen(true); setDrawersOpen(true);
    setStatus('OPENING ALL STORAGE'); setAnimatingSync(true);
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 1, duration: 2.0, ease: 'power2.inOut',
      onUpdate: () => {
        kitchenRef.current?.setDoorOpen(obj.p);
        kitchenRef.current?.setDrawerOpen(obj.p);
      },
      onComplete: () => { setAnimatingSync(false); setStatus(''); },
    });
  }, []);

  const handleCloseAll = useCallback(() => {
    if (animatingRef.current) return;
    doorsOpenRef.current = false; drawersOpenRef.current = false;
    setDoorsOpen(false); setDrawersOpen(false);
    setAnimatingSync(true); setStatus('CLOSING ALL STORAGE');
    const obj = { p: 1 };
    gsap.to(obj, {
      p: 0, duration: 1.8, ease: 'power2.inOut',
      onUpdate: () => {
        kitchenRef.current?.setDoorOpen(obj.p);
        kitchenRef.current?.setDrawerOpen(obj.p);
      },
      onComplete: () => { setAnimatingSync(false); setStatus(''); },
    });
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    if (animatingRef.current) return;
    // Force-close everything via direct model calls
    kitchenRef.current?.setDoorOpen(0);
    kitchenRef.current?.setDrawerOpen(0);
    kitchenRef.current?.setExplode(0);
    kitchenRef.current?.setIslandZ(1.95);
    setIslandDist(1.95);
    doorsOpenRef.current = false; drawersOpenRef.current = false; isExplodedRef.current = false;
    const isMobile = window.innerWidth < 768;
    tAzimRef.current  = isMobile ? -0.22 : -0.38;
    tElevRef.current  = isMobile ? 0.20 : 0.28;
    tRadRef.current   = isMobile ? 8.5 : 6.2;
    if (isMobile) {
      targetRef.current.set(0.10, 1.15, 0.55);
    } else {
      targetRef.current.set(0.15, 0.95, 0.70);
    }
    setSelectedHotspot(null);
    setShowColorPanel(false);
    setStatus('');
  }, []);

  // Toggle island clearance distance smoothly
  const handleToggleIslandDist = useCallback(() => {
    if (animatingRef.current) return;
    const nextZ = islandDist >= 2.25 ? 1.95 : 2.30;
    setIslandDist(nextZ);
    const currentZ = kitchenRef.current?.islandGroup?.position.z || 1.95;
    const obj = { z: currentZ };
    gsap.to(obj, {
      z: nextZ,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        kitchenRef.current?.setIslandZ(obj.z);
      },
    });
    const islandHs = KITCHEN_HOTSPOTS.find(h => h.id === 'island');
    if (islandHs) islandHs.pos[2] = nextZ;
  }, [islandDist]);

  // Hotspot click
  const handleHotspot = (hs) => {
    setSelectedHotspot(hs);
    setShowPanel(true);
    if (hs.action === 'door')        handleToggleDoors();
    else if (hs.action === 'drawer' || hs.action === 'island_draw') handleToggleDrawers();
    else if (hs.action === 'led')    {
      const nextLed = !ledsOn;
      setLedsOn(nextLed);
      kitchenRef.current?.setLEDs(nextLed);
    }
    else if (hs.action === 'material') setShowColorPanel(true);
  };

  // Zoom
  const zoom = (dir) => { tRadRef.current = Math.max(2.2, Math.min(8.0, tRadRef.current + dir * 0.6)); };

  // ── Styles ────────────────────────────────────────────────────────────────
  const btnBase = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', border: 'none', cursor: animating ? 'not-allowed' : 'pointer',
    fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
    borderRadius: '2px', transition: 'all 0.2s ease', opacity: animating ? 0.5 : 1,
  };
  const btnDark  = { ...btnBase, backgroundColor: 'rgba(20,20,18,0.88)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' };
  const btnLight = { ...btnBase, backgroundColor: 'rgba(248,245,240,0.92)', color: '#121110', border: '1px solid rgba(20,20,18,0.15)' };
  const btnGold  = { ...btnBase, backgroundColor: '#c9a84c', color: '#1a1108', border: 'none' };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0c0f0d' }}>

      {/* ── Three.js Canvas ─────────────────────────────────────────────────── */}
      <div
        ref={mountRef}
        className="no-select"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          cursor: draggingRef.current ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          overflow: 'hidden',
        }}
      />

      {/* ── Section tag ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 'clamp(70px, 9vh, 88px)',
        left: 'clamp(14px, 4vw, 28px)',
        zIndex: 30,
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 120px)',
      }}>
        <div style={{
          fontSize: 'clamp(8px, 1.8vw, 9px)',
          letterSpacing: '0.34em',
          fontWeight: 600,
          color: '#a3be8c',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}>
          SHOWROOM • KITCHEN ARCHITECTURE
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(18px, 4.2vw, 36px)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: '#fff',
            margin: 0,
            lineHeight: 1.08,
            textShadow: '0 4px 24px rgba(0,0,0,0.85)',
          }}
        >
          THE CULINARY ATELIER.
        </h2>
        <div style={{
          fontSize: 'clamp(8px, 1.8vw, 10px)',
          color: '#ffffff',
          fontWeight: 600,
          opacity: 0.92,
          letterSpacing: '0.16em',
          marginTop: 3,
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}>
          LIVE 3D INTERACTIVE SHOWROOM
        </div>
      </div>

      {/* ── Status label ───────────────────────────────────────────────────── */}
      {status && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          backgroundColor: 'rgba(12,15,13,0.88)', backdropFilter: 'blur(12px)',
          color: '#a3be8c', padding: '10px 24px', borderRadius: '2px',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
          border: '1px solid rgba(163,190,140,0.3)', zIndex: 60, pointerEvents: 'none',
          animation: 'kitchenFadeIn 0.3s ease-out',
        }}>
          {status}
        </div>
      )}

      {/* ── Hotspot overlays ────────────────────────────────────────────────── */}
      {projHotspots.map(hs => hs.visible && (
        <div key={hs.id} style={{ position: 'absolute', left: `${hs.sx}%`, top: `${hs.sy}%`, transform: 'translate(-50%,-50%)', zIndex: 40 }}>
          <button
            className="no-drag"
            onClick={() => handleHotspot(hs)}
            aria-label={`Inspect ${hs.label}`}
            style={{
              width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff',
              backgroundColor: selectedHotspot?.id === hs.id ? '#a3be8c' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', boxShadow: '0 0 12px rgba(255,255,255,0.6), 0 0 28px rgba(163,190,140,0.4)',
              animation: 'kitchenHotspotPulse 2s ease-in-out infinite',
              transition: 'all 0.2s ease',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(12,15,13,0.9)', backdropFilter: 'blur(8px)',
            color: '#fff', padding: '4px 8px', borderRadius: '2px',
            fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.16em', whiteSpace: 'nowrap',
            border: '1px solid rgba(163,190,140,0.3)', pointerEvents: 'none',
          }}>
            {hs.label}
          </div>
        </div>
      ))}

      {/* ── Main Control Bar ────────────────────────────────────────────────── */}
      <div
        className="no-drag kitchen-control-bar"
        style={{
          position: 'absolute',
          bottom: 'clamp(10px, 2vh, 24px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50,
          padding: '4px 8px',
          maxWidth: 'calc(100vw - 16px)',
          width: 'max-content',
        }}
      >
        <button style={drawersOpen ? { ...btnGold } : btnDark} onClick={handleToggleDrawers} disabled={animating}>
          {drawersOpen ? 'CLOSE DRAWERS' : 'OPEN DRAWERS'}
        </button>
        <button style={doorsOpen ? { ...btnGold } : btnDark} onClick={handleToggleDoors} disabled={animating}>
          {doorsOpen ? 'CLOSE DOORS' : 'OPEN DOORS'}
        </button>
        <button style={btnDark} onClick={handleOpenAll} disabled={animating}>OPEN ALL</button>
        <button style={btnDark} onClick={handleCloseAll} disabled={animating}>CLOSE ALL</button>
        <button
          style={islandDist >= 2.25 ? { ...btnGold } : { ...btnDark, border: '1px solid rgba(163,190,140,0.5)' }}
          onClick={handleToggleIslandDist}
          disabled={animating}
          title="Toggle front island table distance"
        >
          {islandDist >= 2.25 ? 'TABLE: 2.30M (WIDE)' : 'TABLE: 1.95M'}
        </button>
        <button
          style={isExploded ? { ...btnGold } : { ...btnDark, border: '1px solid rgba(163,190,140,0.5)' }}
          onClick={handleExplode} disabled={animating}
        >
          {isExploded ? '⬡ ASSEMBLE' : '⬡ EXPLODE'}
        </button>
        <button style={btnDark} onClick={() => setShowColorPanel(v => !v)}>
          MATERIALS
        </button>
        <button style={btnLight} onClick={handleReset} disabled={animating}>
          <RefreshCw size={10} /> RESET
        </button>
      </div>

      {/* ── Anti-Gravity Open State Card ────────────────────────────────────── */}
      {showAntiGravityCard && (
        <div
          className="no-drag kitchen-state-card"
          style={{
            position: 'absolute',
            bottom: 'clamp(56px, 9vh, 76px)',
            right: 'clamp(10px, 2.5vw, 16px)',
            width: 'min(260px, calc(100vw - 20px))',
            maxWidth: 'calc(100vw - 20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            color: '#121110',
            padding: '10px 14px',
            borderRadius: '2px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            zIndex: 45,
            border: '1px solid rgba(20, 20, 20, 0.12)',
            animation: 'kitchenFadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#121110' }}>
              SPACIOUS ISLAND CLEARANCE
            </span>
            <button
              onClick={() => setShowAntiGravityCard(false)}
              aria-label="Close clearance info"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#121110', fontSize: '13px', padding: '0 4px', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '9.5px', color: '#1a1917', fontWeight: 500, lineHeight: 1.4, margin: '0 0 6px 0', fontFamily: 'var(--font-sans)' }}>
            Island table at {islandDist}m forward offset. All doors swing open freely with over 95cm clear walkway without hitting the table.
          </p>
          <div style={{ fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#121110', textTransform: 'uppercase' }}>
            STATE: {doorsOpen && drawersOpen ? 'FULLY OPEN (NO CLASH).' : drawersOpen ? 'DRAWERS OPEN.' : doorsOpen ? 'DOORS OPEN (CLEAR).' : isExploded ? 'EXPLODED.' : 'ASSEMBLED.'}
          </div>
        </div>
      )}

      {/* ── Zoom controls ───────────────────────────────────────────────────── */}
      <div
        className="no-drag"
        style={{
          position: 'absolute',
          right: 'clamp(10px, 2.5vw, 20px)',
          top: '44%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 50,
        }}
      >
        {[{ Icon: ZoomIn, d: -1 }, { Icon: ZoomOut, d: 1 }].map(({ Icon, d }) => (
          <button
            key={d}
            onClick={() => zoom(d)}
            aria-label={d === -1 ? 'Zoom in' : 'Zoom out'}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)',
              backgroundColor: 'rgba(12,15,13,0.85)', backdropFilter: 'blur(8px)', color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* ── Drag hint ───────────────────────────────────────────────────────── */}
      <div
        className="viewer-hint-overlay"
        style={{
          position: 'absolute',
          bottom: 'clamp(54px, 8vh, 80px)',
          left: 'clamp(14px, 4vw, 28px)',
          fontSize: '8.5px',
          letterSpacing: '0.18em',
          fontWeight: 700,
          color: '#ffffff',
          opacity: 0.88,
          textShadow: '0 2px 6px rgba(0,0,0,0.95)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        ↻ SWIPE TO ROTATE
      </div>

      {/* ── LED toggle ──────────────────────────────────────────────────────── */}
      <button
        className="no-drag"
        onClick={() => { setLedsOn(v => { kitchenRef.current?.setLEDs(!v); return !v; }); }}
        style={{
          ...btnDark,
          position: 'absolute',
          top: 'clamp(70px, 9vh, 88px)',
          right: 'clamp(12px, 3vw, 20px)',
          padding: '6px 12px',
          fontSize: '8px',
          zIndex: 50,
          border: `1px solid ${ledsOn ? 'rgba(163,190,140,0.5)' : 'rgba(255,255,255,0.12)'}`,
          color: ledsOn ? '#a3be8c' : '#fff',
        }}
      >
        {ledsOn ? '● LED ON' : '○ LED OFF'}
      </button>

      {/* ── Material / Color Panel ───────────────────────────────────────────── */}
      {showColorPanel && (
        <div
          className="no-drag kitchen-color-panel"
          style={{
            position: 'absolute',
            right: 'clamp(10px, 3vw, 20px)',
            top: 'clamp(55px, 8vh, 70px)',
            width: 'min(280px, calc(100vw - 20px))',
            maxHeight: 'calc(100vh - 130px)',
            overflowY: 'auto',
            backgroundColor: 'rgba(248,246,240,0.98)',
            backdropFilter: 'blur(16px)',
            color: '#121110',
            padding: '18px 20px',
            borderRadius: 2,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            zIndex: 65,
            animation: 'kitchenFadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#a3be8c' }}>
              MATERIAL SELECTION
            </span>
            <button onClick={() => setShowColorPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a756c' }}>
              <X size={15} />
            </button>
          </div>

          {/* Cabinet Colors */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2c2925', marginBottom: 8 }}>
              CABINET COLOUR
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {KITCHEN_CABINET_COLORS.map(c => (
                <button key={c.id} onClick={() => setCabinetColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: cabinetColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#121110', fontWeight: 600, marginTop: 5 }}>{cabinetColor.name}</div>
          </div>

          {/* Countertop Colors */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2c2925', marginBottom: 8 }}>
              COUNTERTOP MATERIAL
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {KITCHEN_COUNTERTOP_COLORS.map(c => (
                <button key={c.id} onClick={() => setCounterColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: counterColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#121110', fontWeight: 600, marginTop: 5 }}>{counterColor.name}</div>
          </div>

          {/* Hardware Finishes */}
          <div>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2c2925', marginBottom: 8 }}>
              HARDWARE FINISH
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {KITCHEN_HARDWARE_COLORS.map(c => (
                <button key={c.id} onClick={() => setHardwareColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: hardwareColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#121110', fontWeight: 600, marginTop: 5 }}>{hardwareColor.name}</div>
          </div>
        </div>
      )}

      {/* ── Hotspot inspection panel ─────────────────────────────────────────── */}
      {showPanel && selectedHotspot && (
        <div
          className="no-drag kitchen-hotspot-panel"
          style={{
            position: 'absolute',
            bottom: 'clamp(56px, 9vh, 80px)',
            right: 'clamp(10px, 2.5vw, 20px)',
            width: 'min(300px, calc(100vw - 20px))',
            backgroundColor: 'rgba(248,246,240,0.98)',
            backdropFilter: 'blur(16px)',
            color: '#121110',
            padding: '16px 18px',
            borderRadius: 2,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            zIndex: 65,
            animation: 'kitchenFadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.28em', color: '#a3be8c', textTransform: 'uppercase' }}>
              {selectedHotspot.label}
            </span>
            <button onClick={() => { setShowPanel(false); setSelectedHotspot(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#121110' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: '10.5px', color: '#1a1917', fontWeight: 500, lineHeight: 1.55, fontFamily: 'var(--font-sans)' }}>
            {selectedHotspot.action === 'door'       && 'Upper cabinet doors rotate on architectural hinge pivots. Click OPEN DOORS or tap the hotspot.'}
            {selectedHotspot.action === 'drawer'     && 'Lower cabinet drawers slide along precision steel runners. Each drawer opens independently.'}
            {selectedHotspot.action === 'island_draw'&& 'Three full-extension island drawers with brass hardware. Click OPEN DRAWERS to reveal storage.'}
            {selectedHotspot.action === 'material'   && 'Calacatta quartzite countertop with honed finish. Use the MATERIALS panel to change finishes.'}
            {selectedHotspot.action === 'led'        && 'High-CRI 2700K under-cabinet LED strip lighting. Toggle with the LED button above.'}
          </div>
          <div style={{ marginTop: 10, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', color: '#a3be8c', textTransform: 'uppercase' }}>
            STATE: {selectedHotspot.action === 'door' ? (doorsOpen ? 'OPEN' : 'CLOSED') : selectedHotspot.action === 'led' ? (ledsOn ? 'ON' : 'OFF') : (drawersOpen ? 'OPEN' : 'CLOSED')}
          </div>
        </div>
      )}

      {/* Explode label when active */}
      {isExploded && (
        <div style={{
          position: 'absolute', top: 'clamp(50px, 7vh, 60px)', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(12,15,13,0.85)', backdropFilter: 'blur(10px)',
          color: 'rgba(163,190,140,0.95)', padding: '5px 16px', borderRadius: '2px',
          fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
          border: '1px solid rgba(163,190,140,0.25)', zIndex: 45, pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          KITCHEN ASSEMBLY — COMPONENT VIEW
        </div>
      )}

      <style>{`
        @keyframes kitchenFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kitchenHotspotPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 22px rgba(163,190,140,0.3); }
          50%       { box-shadow: 0 0 18px rgba(255,255,255,0.9), 0 0 40px rgba(163,190,140,0.6); }
        }
        @media (max-width: 768px) {
          .kitchen-control-bar {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            padding: 6px 10px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            background: rgba(12, 15, 13, 0.88);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.12);
          }
          .kitchen-control-bar::-webkit-scrollbar {
            display: none;
          }
          .kitchen-control-bar button {
            flex-shrink: 0 !important;
            padding: 6px 11px !important;
            font-size: 8px !important;
            white-space: nowrap !important;
          }
        }
      `}</style>
    </div>
  );
}
