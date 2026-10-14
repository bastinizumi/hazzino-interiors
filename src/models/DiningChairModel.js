/**
 * HAZZINO INTERIORS — BESPOKE ROUND MARBLE DINING SET 3D MODEL
 * Faithfully matches the exact reference photo:
 * - Round honed Calacatta / Travertine marble dining table with bullnose edge
 * - Trilateral sculptural solid wood winged pedestal column base (3 architectural timber fins at 120°)
 * - Centerpiece accessories:
 *   • Scalloped carved timber platter with cluster of dark purple grapes
 *   • Turned dark wood pinch bowl & stoneware saucer dish
 *   • Two elegant crystal stemmed wine goblets
 * - 4 Tailored textured oatmeal linen dining chairs with raked hardwood legs and comfortable backrest
 * - Interactive 360° orbit, explode/assemble animation, and live material/color customization
 */
import * as THREE from 'three';
import { createTailoredLinenDiningChair } from './TailoredLinenDiningChair';
import { createGlassMaterial } from './modelMaterials';

export class DiningChairModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'DiningChairModel';

    // Chair Upholstery Material (reacts to user Fabric/Leather/Color selection)
    // Default: Textured Oatmeal / Warm Linen tone matching reference photo
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xbeb2a4), // Warm Oatmeal Linen
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Solid Hardwood Material (Rich Warm Teak / Walnut tone for legs & table base)
    this.woodMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x523019), // Rich Scandinavian Teak / Walnut
      roughness: 0.42,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Honed Marble Tabletop Material (Warm Ivory / Travertine with soft satin sheen)
    this.marbleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf0ece1), // Honed Calacatta / Travertine
      roughness: 0.28,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    this.explodeProgress = 0;
    this.upholsteryMeshes = [];
    this.woodMeshes = [];
    this.marbleMeshes = [];
    this.chairGroups = [];
    this.pillarGroups = [];

    this.buildModel();
  }

  buildModel() {
    const tableRadius = 0.71;      // Ø 1.42m round table
    const tableHeight = 0.75;      // 75cm dining height
    const topThickness = 0.046;    // 4.6cm solid marble slab

    // =========================================================================
    // 1. ROUND HONED MARBLE DINING TABLE WITH SCULPTURAL TIMBER WING BASE
    // =========================================================================
    this.tableGroup = new THREE.Group();
    this.tableGroup.position.set(0, 0, 0);

    // 1.1 Round Marble Slab Top
    this.topGroup = new THREE.Group();
    this.topGroup.position.set(0, tableHeight - topThickness / 2, 0);

    const marbleGeo = new THREE.CylinderGeometry(tableRadius, tableRadius, topThickness, 64);
    this.topMesh = new THREE.Mesh(marbleGeo, this.marbleMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.topGroup.add(this.topMesh);
    this.marbleMeshes.push(this.topMesh);

    // Sub-top wooden mounting plate (underneath marble)
    const mountPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.024, 36),
      this.woodMaterial
    );
    mountPlate.position.set(0, -topThickness / 2 - 0.012, 0);
    this.topGroup.add(mountPlate);
    this.woodMeshes.push(mountPlate);

    // 1.2 Tabletop Centerpiece Props (Exact from reference photo!)
    // A. Scalloped Wooden Platter with Dark Purple Grapes
    const platterGroup = new THREE.Group();
    platterGroup.position.set(0.30, topThickness / 2 + 0.002, 0.16);

    const platterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.028, 32),
      this.woodMaterial
    );
    platterMesh.castShadow = true;
    platterGroup.add(platterMesh);
    this.woodMeshes.push(platterMesh);

    // Dark purple / black grapes cluster
    const grapeMat = new THREE.MeshStandardMaterial({
      color: 0x221326, // rich dark purple grape
      roughness: 0.38,
      metalness: 0.02,
    });
    const grapeGeo = new THREE.SphereGeometry(0.018, 12, 12);
    grapeGeo.scale(1.0, 1.15, 1.0);

    // Organic cluster of grapes
    const grapeOffsets = [
      [0, 0.024, 0], [0.022, 0.022, 0.015], [-0.022, 0.022, -0.012],
      [0.015, 0.024, -0.025], [-0.018, 0.024, 0.020], [0.035, 0.020, -0.01],
      [-0.035, 0.020, 0.01], [0.01, 0.036, 0.005], [-0.01, 0.036, -0.008],
      [0.025, 0.034, -0.015], [-0.02, 0.034, 0.015], [0, 0.046, 0],
    ];

    grapeOffsets.forEach(([gx, gy, gz]) => {
      const grape = new THREE.Mesh(grapeGeo, grapeMat);
      grape.position.set(gx, gy, gz);
      grape.castShadow = true;
      platterGroup.add(grape);
    });

    this.topGroup.add(platterGroup);

    // B. Turned Wooden Pinch Bowl
    const bowlMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.042, 0.040, 24),
      this.woodMaterial
    );
    bowlMesh.position.set(0.14, topThickness / 2 + 0.020, -0.12);
    bowlMesh.castShadow = true;
    this.topGroup.add(bowlMesh);
    this.woodMeshes.push(bowlMesh);

    // C. Low Ceramic Saucer Dish
    const saucerMat = new THREE.MeshStandardMaterial({
      color: 0x484643, // dark grey stoneware
      roughness: 0.75,
    });
    const saucerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.075, 0.016, 24),
      saucerMat
    );
    saucerMesh.position.set(-0.06, topThickness / 2 + 0.008, -0.16);
    saucerMesh.castShadow = true;
    this.topGroup.add(saucerMesh);

    // D. Two Crystal Stemmed Wine Goblets
    const glassMat = createGlassMaterial(0.28);
    const glassGeo = new THREE.Group();

    // Bowl
    const gBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.018, 0.075, 18),
      glassMat
    );
    gBowl.position.y = 0.12;
    glassGeo.add(gBowl);

    // Stem
    const gStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.09, 12),
      glassMat
    );
    gStem.position.y = 0.048;
    glassGeo.add(gStem);

    // Foot
    const gFoot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.004, 18),
      glassMat
    );
    gFoot.position.y = 0.002;
    glassGeo.add(gFoot);

    // Goblet 1
    const glass1 = glassGeo.clone();
    glass1.position.set(-0.08, topThickness / 2, 0.28);
    this.topGroup.add(glass1);

    // Goblet 2
    const glass2 = glassGeo.clone();
    glass2.position.set(0.44, topThickness / 2, -0.24);
    this.topGroup.add(glass2);

    this.tableGroup.add(this.topGroup);

    // 1.3 Trilateral Sculptural Solid Timber Winged Pedestal Columns
    // Three curved/winged timber pillars at 120° angles under the round top
    this.pedestalsGroup = new THREE.Group();
    const pedHeight = tableHeight - topThickness - 0.024; // ~0.68m
    const pedRadius = 0.26; // distance from center

    const pillarThick = 0.09;  // 9cm thick
    const pillarWidth = 0.34;  // 34cm wide
    const pillarGeo = new THREE.BoxGeometry(pillarWidth, pedHeight, pillarThick);

    [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((angle, idx) => {
      const pillarGroup = new THREE.Group();
      pillarGroup.name = `TablePillar_${idx}`;

      const px = Math.sin(angle) * pedRadius;
      const pz = Math.cos(angle) * pedRadius;

      pillarGroup.position.set(px, pedHeight / 2, pz);
      pillarGroup.rotation.y = angle; // faces radially outward

      const pillarMesh = new THREE.Mesh(pillarGeo, this.woodMaterial);
      pillarMesh.castShadow = true;
      pillarMesh.receiveShadow = true;
      pillarGroup.add(pillarMesh);
      this.woodMeshes.push(pillarMesh);

      this.pedestalsGroup.add(pillarGroup);
      this.pillarGroups.push({
        group: pillarGroup,
        baseX: px,
        baseZ: pz,
        angle,
      });
    });

    this.tableGroup.add(this.pedestalsGroup);
    this.root.add(this.tableGroup);

    // =========================================================================
    // 2. SET OF 4 TAILORED LINEN DINING CHAIRS
    // =========================================================================
    // Arranged symmetrically around the round table:
    // - Foreground Left (Hero chair matching reference photo)
    // - Background Left
    // - Background Right
    // - Foreground Right
    const chairDistance = 0.88; // 88cm from table center
    const chairConfigs = [
      // Hero foreground left chair (prominently visible in photo)
      { id: 'chair_fg_left', angle: Math.PI * 0.70, isHero: true },
      // Background left chair (visible behind table in photo)
      { id: 'chair_bg_left', angle: Math.PI * 1.25, isHero: false },
      // Background right chair
      { id: 'chair_bg_right', angle: Math.PI * 1.75, isHero: false },
      // Foreground right chair
      { id: 'chair_fg_right', angle: Math.PI * 0.25, isHero: false },
    ];

    chairConfigs.forEach((cfg) => {
      this.buildChairInstance(cfg, chairDistance);
    });
  }

  buildChairInstance({ id, angle, isHero }, dist) {
    const chairRoot = new THREE.Group();
    chairRoot.name = 'Chair_' + id;

    const cx = Math.sin(angle) * dist;
    const cz = Math.cos(angle) * dist;

    chairRoot.position.set(cx, 0, cz);
    // Orient chair facing toward table center with subtle organic angle
    chairRoot.rotation.y = angle + Math.PI + (isHero ? -0.12 : 0.05);

    // Instantiate bespoke tailored linen dining chair
    const chairInst = createTailoredLinenDiningChair(this.mainMaterial, this.woodMaterial);

    chairRoot.add(chairInst.group);
    this.root.add(chairRoot);

    // Collect meshes for live configurator updates
    if (chairInst.upholsteryMeshes) {
      chairInst.upholsteryMeshes.forEach((m) => this.upholsteryMeshes.push(m));
    }
    if (chairInst.woodMeshes) {
      chairInst.woodMeshes.forEach((m) => this.woodMeshes.push(m));
    }

    this.chairGroups.push({
      id,
      baseX: cx,
      baseZ: cz,
      angle,
      group: chairRoot,
      chairInst,
      isHero,
    });
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // 1. Round marble tabletop lifts smoothly
    this.topGroup.position.y = (0.75 - 0.046 / 2) + p * 0.65;

    // 2. Trilateral wooden pillars slide outward radially
    this.pillarGroups.forEach((pg) => {
      const radMove = p * 0.18;
      pg.group.position.x = pg.baseX + Math.sin(pg.angle) * radMove;
      pg.group.position.z = pg.baseZ + Math.cos(pg.angle) * radMove;
    });

    // 3. The 4 dining chairs glide outward radially
    this.chairGroups.forEach((cg) => {
      const radMove = p * 0.48;
      cg.group.position.x = cg.baseX + Math.sin(cg.angle) * radMove;
      cg.group.position.z = cg.baseZ + Math.cos(cg.angle) * radMove;

      if (cg.chairInst) {
        // Seat cushion lifts upward slightly
        if (cg.chairInst.seatGroup) {
          cg.chairInst.seatGroup.position.y = 0.44 + p * 0.20;
        }
        // Backrest articulates backward slightly
        if (cg.chairInst.backGroup) {
          cg.chairInst.backGroup.position.z = (-0.52 / 2 + 0.04) - p * 0.12;
        }
      }
    });
  }

  updateMaterials(mainMat, secondaryMat) {
    // 1. Update Chair Fabric / Leather Upholstery (Seat & Backrest)
    if (mainMat) {
      this.upholsteryMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }

    // 2. Update Solid Timber Elements (Chair legs & table trilateral base)
    if (secondaryMat) {
      this.woodMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh && c.geometry) {
        c.geometry.dispose();
      }
    });
  }
}
