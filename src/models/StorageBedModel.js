/**
 * HAZZINO INTERIORS — BESPOKE LOW-PROFILE PLATFORM STORAGE BED
 * Faithfully matches the exact reference photo:
 * - Solid warm honey teak/oak low platform bed frame
 * - 4 exposed slatted timber crate under-bed storage drawers with stacked books & folded linens
 * - 2-row x 5-column (10-tile) grid-tufted cream/white upholstered headboard
 * - Wide architectural vertical wood slat backboard with warm LED cove backlight below dark charcoal wall
 * - Twin curved fluted nightstands with brown stitched leather pull handles & brass studs
 * - Modern loop pendant light with glowing frosted sphere orb
 * - Multi-layer designer bedding: crisp white linens, taupe/brown folded throw runner, and 5 layered accent pillows
 * - Interactive drawer opening, 360° rotation, and real-time material/color customisation
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createInteriorLiningMaterial,
  createEmissiveWarmGlowMaterial,
  createGlassMaterial,
} from './modelMaterials';

export class StorageBedModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'StorageBedModel';

    // Main Upholstery Material (Grid-tufted headboard & bedding - reacts to user material/color)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xf2ede4),
      roughness: 0.90,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Solid Wood Material (Warm honey natural teak/oak)
    this.woodMaterial = createFurnitureMaterial('natural_wood');
    this.woodMaterial.side = THREE.DoubleSide;

    // Bedding & Accent Materials
    this.sheetMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f8f5,
      roughness: 0.85,
    });
    this.throwMaterial = new THREE.MeshStandardMaterial({
      color: 0x765c49, // warm taupe brown throw blanket
      roughness: 0.95,
    });
    this.darkPillowMaterial = new THREE.MeshStandardMaterial({
      color: 0x423227, // dark textured brown pillow
      roughness: 0.92,
    });
    this.patternPillowMaterial = new THREE.MeshStandardMaterial({
      color: 0x6e706e, // grey patterned cushion
      roughness: 0.88,
    });

    // Nightstand materials
    this.nightstandCaseMat = new THREE.MeshStandardMaterial({
      color: 0x2e2b28, // charcoal casing
      roughness: 0.75,
    });
    this.flutedFrontMat = new THREE.MeshStandardMaterial({
      color: 0xd6cebe, // cream fluted front
      roughness: 0.65,
    });
    this.leatherMat = new THREE.MeshStandardMaterial({
      color: 0x7c4728, // saddle brown leather
      roughness: 0.7,
    });

    this.brassMaterial = createBrassAccentMaterial();
    this.coveGlowMaterial = createEmissiveWarmGlowMaterial(2.4);
    this.interiorMaterial = createInteriorLiningMaterial();

    this.storageOpenProgress = 0;
    this.explodeProgress = 0;

    this.upholsteryMeshes = [];
    this.woodMeshes = [];
    this.drawerGroups = [];
    this.pillowGroups = [];

    this.buildModel();
  }

  // ---------------------------------------------------------------------------
  // PROCEDURAL SOFT FORMS
  // ---------------------------------------------------------------------------
  createPuffyPillowGeometry(w, h, d, segments = 16) {
    const geo = new THREE.BoxGeometry(w, h, d, segments, 8, segments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const nx = x / (w / 2);
      const nz = z / (d / 2);

      const falloff = Math.max(0, (1 - nx * nx) * (1 - nz * nz));
      y *= 0.42 + 0.58 * Math.pow(falloff, 0.65);
      x *= 0.94 + 0.06 * (1 - Math.abs(nz) * 0.35);
      z *= 0.94 + 0.06 * (1 - Math.abs(nx) * 0.35);

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // ---------------------------------------------------------------------------
  // MAIN MODEL BUILDER
  // ---------------------------------------------------------------------------
  buildModel() {
    const bedW = 2.10;
    const bedL = 2.20;
    const frameH = 0.28;

    // =========================================================================
    // 1. ARCHITECTURAL WOOD SLAT BACKBOARD & GRID-TUFTED HEADBOARD
    // =========================================================================
    this.hbSuiteGroup = new THREE.Group();
    this.hbSuiteGroup.position.set(0, 0, -bedL / 2 + 0.04);

    const backplateW = 3.30;
    const backplateH = 1.25;
    const backplateD = 0.06;

    // 1.1 Charcoal Upper Wall Panel above wood slats
    const upperWall = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW + 0.2, 0.55, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x222120, roughness: 0.85 })
    );
    upperWall.position.set(0, backplateH + 0.275, -0.01);
    this.hbSuiteGroup.add(upperWall);

    // Warm LED Cove Lighting Strip illuminating the wood slats from above
    const coveLight = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW, 0.025, 0.04),
      this.coveGlowMaterial
    );
    coveLight.position.set(0, backplateH + 0.01, 0.02);
    this.hbSuiteGroup.add(coveLight);

    // 1.2 Wide Natural Wood Vertical Slat Panel
    const slatBackplate = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW, backplateH, backplateD),
      this.woodMaterial
    );
    slatBackplate.position.set(0, backplateH / 2, 0);
    slatBackplate.castShadow = true;
    slatBackplate.receiveShadow = true;
    this.hbSuiteGroup.add(slatBackplate);
    this.woodMeshes.push(slatBackplate);

    // Subtle 3D vertical timber slat relief on backboard
    const numSlats = 42;
    const slatStep = backplateW / numSlats;
    for (let i = 0; i < numSlats; i++) {
      const sx = -backplateW / 2 + slatStep * (i + 0.5);
      const slatMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, backplateH - 0.02, 0.012),
        this.woodMaterial
      );
      slatMesh.position.set(sx, backplateH / 2, backplateD / 2 + 0.006);
      this.hbSuiteGroup.add(slatMesh);
      this.woodMeshes.push(slatMesh);
    }

    // 1.3 Centered Grid-Tufted Cream/White Upholstered Headboard (2 Rows x 5 Columns = 10 Tiles)
    const headboardW = 1.95;
    const headboardH = 0.65;
    const headboardD = 0.10;

    this.gridHeadboardGroup = new THREE.Group();
    this.gridHeadboardGroup.position.set(0, frameH + headboardH / 2 + 0.08, backplateD / 2 + headboardD / 2);

    // Solid base backing
    const hbBase = new THREE.Mesh(
      new THREE.BoxGeometry(headboardW, headboardH, headboardD * 0.6),
      this.mainMaterial
    );
    this.gridHeadboardGroup.add(hbBase);
    this.upholsteryMeshes.push(hbBase);

    // 10 puffy tufted rectangular tiles
    const cols = 5;
    const rows = 2;
    const tileW = (headboardW - 0.04) / cols;
    const tileH = (headboardH - 0.04) / rows;
    const tileD = 0.055;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = -headboardW / 2 + 0.02 + tileW * (c + 0.5);
        const ty = -headboardH / 2 + 0.02 + tileH * (r + 0.5);

        const tileGeo = this.createPuffyPillowGeometry(tileW * 0.94, tileH * 0.94, tileD, 12);
        const tileMesh = new THREE.Mesh(tileGeo, this.mainMaterial);
        tileMesh.position.set(tx, ty, headboardD / 2 + tileD / 2 - 0.01);
        tileMesh.castShadow = true;
        tileMesh.receiveShadow = true;
        this.gridHeadboardGroup.add(tileMesh);
        this.upholsteryMeshes.push(tileMesh);
      }
    }

    this.hbSuiteGroup.add(this.gridHeadboardGroup);

    // 1.4 Twin Curved Fluted Nightstands with Leather Pull Handles
    this.nightstandLeft = new THREE.Group();
    this.nightstandLeft.position.set(-1.38, 0.22, 0.18);
    this.buildFlutedNightstand(this.nightstandLeft, true);
    this.hbSuiteGroup.add(this.nightstandLeft);

    this.nightstandRight = new THREE.Group();
    this.nightstandRight.position.set(1.38, 0.22, 0.18);
    this.buildFlutedNightstand(this.nightstandRight, false);
    this.hbSuiteGroup.add(this.nightstandRight);

    // 1.5 Modern Loop Pendant Light Suspended Over Right Nightstand
    const pendantGroup = new THREE.Group();
    pendantGroup.position.set(1.38, 1.45, 0.25);

    // Slender cord
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
    );
    cord.position.y = 0.4;
    pendantGroup.add(cord);

    // Elongated black/brass oval loop
    const loopGeo = new THREE.TorusGeometry(0.14, 0.008, 12, 32);
    loopGeo.scale(0.8, 1.6, 1.0);
    const loopMesh = new THREE.Mesh(
      loopGeo,
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.85, roughness: 0.25 })
    );
    loopMesh.position.y = 0;
    pendantGroup.add(loopMesh);

    // Glowing warm frosted glass sphere orb
    const orbMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 24, 24),
      createEmissiveWarmGlowMaterial(2.6)
    );
    orbMesh.position.set(0, -0.06, 0);
    pendantGroup.add(orbMesh);

    this.hbSuiteGroup.add(pendantGroup);
    this.root.add(this.hbSuiteGroup);

    // =========================================================================
    // 2. LOW-PROFILE SOLID NATURAL WOOD PLATFORM CHASSIS WITH RECESSED CAVITIES
    // =========================================================================
    this.chassisGroup = new THREE.Group();
    this.chassisGroup.position.set(0, frameH / 2, 0);

    const frameInnerH = frameH - 0.04;

    // A. Top mattress support deck / deck perimeter
    const topDeck = new THREE.Mesh(
      new THREE.BoxGeometry(bedW, 0.035, bedL),
      this.woodMaterial
    );
    topDeck.position.set(0, frameH / 2 - 0.0175, 0);
    topDeck.castShadow = true;
    topDeck.receiveShadow = true;
    this.chassisGroup.add(topDeck);
    this.woodMeshes.push(topDeck);

    // B. Recessed shadow plinth underneath
    const basePlinth = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.22, 0.05, bedL - 0.22),
      new THREE.MeshStandardMaterial({ color: 0x161514, roughness: 0.9 })
    );
    basePlinth.position.set(0, -frameH / 2 + 0.025, 0);
    this.chassisGroup.add(basePlinth);

    // C. Internal bottom support panels for drawer cavities
    const cavityFloor = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.12, 0.018, bedL - 0.12),
      this.woodMaterial
    );
    cavityFloor.position.set(0, -frameH / 2 + 0.055, 0);
    this.chassisGroup.add(cavityFloor);
    this.woodMeshes.push(cavityFloor);

    // D. Structural Frame Posts & Partitions:
    // 1) Solid Headboard Rear Platform Rail
    const rearRail = new THREE.Mesh(
      new THREE.BoxGeometry(bedW, frameInnerH, 0.24),
      this.woodMaterial
    );
    rearRail.position.set(0, -0.01, -bedL / 2 + 0.12);
    rearRail.castShadow = true;
    rearRail.receiveShadow = true;
    this.chassisGroup.add(rearRail);
    this.woodMeshes.push(rearRail);

    // 2) Right-side Solid Platform Rail
    const rightRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, frameInnerH, bedL - 0.26),
      this.woodMaterial
    );
    rightRail.position.set(bedW / 2 - 0.09, -0.01, 0.05);
    rightRail.castShadow = true;
    rightRail.receiveShadow = true;
    this.chassisGroup.add(rightRail);
    this.woodMeshes.push(rightRail);

    // 3) Left-Front Corner Post
    const leftFrontPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, frameInnerH, 0.20),
      this.woodMaterial
    );
    leftFrontPost.position.set(-bedW / 2 + 0.12, -0.01, bedL / 2 - 0.10);
    leftFrontPost.castShadow = true;
    this.chassisGroup.add(leftFrontPost);
    this.woodMeshes.push(leftFrontPost);

    // 4) Left Mid-Side Divider Post
    const leftMidDivider = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, frameInnerH, 0.08),
      this.woodMaterial
    );
    leftMidDivider.position.set(-bedW / 2 + 0.11, -0.01, 0.04);
    this.chassisGroup.add(leftMidDivider);
    this.woodMeshes.push(leftMidDivider);

    // 5) Right-Front Corner Post
    const rightFrontPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, frameInnerH, 0.20),
      this.woodMaterial
    );
    rightFrontPost.position.set(bedW / 2 - 0.12, -0.01, bedL / 2 - 0.10);
    rightFrontPost.castShadow = true;
    this.chassisGroup.add(rightFrontPost);
    this.woodMeshes.push(rightFrontPost);

    // 6) Center Foot Divider Pillar (between the two foot storage drawers)
    const centerDividerPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, frameInnerH, 0.40),
      this.woodMaterial
    );
    centerDividerPillar.position.set(0, -0.01, bedL / 2 - 0.20);
    centerDividerPillar.castShadow = true;
    centerDividerPillar.receiveShadow = true;
    this.chassisGroup.add(centerDividerPillar);
    this.woodMeshes.push(centerDividerPillar);

    this.root.add(this.chassisGroup);

    // =========================================================================
    // 3. FOUR EXPOSED SLATTED TIMBER CRATE STORAGE DRAWERS (ATTACHED MECHANICS)
    // =========================================================================
    const drawerH = frameH - 0.07;

    // Drawer 1: Front-Left Side Drawer
    // When closed, outer face is at -bedW/2 (-1.075); when opened, slides out 22cm
    const d1BoxW = 0.60;
    const d1BaseX = -bedW / 2 + d1BoxW / 2 + 0.02; // -0.755 (inset 2cm inside frame)
    const d1BaseZ = 0.32;
    this.drawerLeftFront = new THREE.Group();
    this.drawerLeftFront.position.set(d1BaseX, 0.035, d1BaseZ);
    this.buildSlattedCrateDrawer(this.drawerLeftFront, 0.68, drawerH, d1BoxW, 'side', 'blanket');
    this.root.add(this.drawerLeftFront);
    this.drawerGroups.push({ group: this.drawerLeftFront, baseX: d1BaseX, baseZ: d1BaseZ, dir: [-0.22, 0, 0] });

    // Drawer 2: Mid-Left Side Drawer
    const d2BaseX = d1BaseX;
    const d2BaseZ = -0.26;
    this.drawerLeftMid = new THREE.Group();
    this.drawerLeftMid.position.set(d2BaseX, 0.035, d2BaseZ);
    this.buildSlattedCrateDrawer(this.drawerLeftMid, 0.68, drawerH, d1BoxW, 'side', 'linens');
    this.root.add(this.drawerLeftMid);
    this.drawerGroups.push({ group: this.drawerLeftMid, baseX: d2BaseX, baseZ: d2BaseZ, dir: [-0.22, 0, 0] });

    // Drawer 3: Foot Left Drawer
    // When closed, front face is at bedL/2 - 0.02 (inset 2cm); when opened, slides forward 24cm
    const footBoxD = 0.70;
    const footBaseZ = bedL / 2 - footBoxD / 2 - 0.02; // 0.73
    const d3BaseX = -0.42;
    this.drawerFootLeft = new THREE.Group();
    this.drawerFootLeft.position.set(d3BaseX, 0.035, footBaseZ);
    this.buildSlattedCrateDrawer(this.drawerFootLeft, 0.62, drawerH, footBoxD, 'foot', 'books');
    this.root.add(this.drawerFootLeft);
    this.drawerGroups.push({ group: this.drawerFootLeft, baseX: d3BaseX, baseZ: footBaseZ, dir: [0, 0, 0.24] });

    // Drawer 4: Foot Right Drawer
    const d4BaseX = 0.42;
    this.drawerFootRight = new THREE.Group();
    this.drawerFootRight.position.set(d4BaseX, 0.035, footBaseZ);
    this.buildSlattedCrateDrawer(this.drawerFootRight, 0.62, drawerH, footBoxD, 'foot', 'magazines');
    this.root.add(this.drawerFootRight);
    this.drawerGroups.push({ group: this.drawerFootRight, baseX: d4BaseX, baseZ: footBaseZ, dir: [0, 0, 0.24] });

    // =========================================================================
    // 4. DEEP MATTRESS, WHITE LINENS, TAUPE THROW & 5 LAYERED PILLOWS
    // =========================================================================
    this.mattressGroup = new THREE.Group();
    this.mattressGroup.position.set(0, frameH + 0.01, 0.04);

    const matW = bedW - 0.14;
    const matL = bedL - 0.16;
    const matH = 0.28;

    // Deep plush mattress
    const matGeo = new THREE.BoxGeometry(matW, matH, matL, 20, 6, 20);
    const mPos = matGeo.attributes.position;
    for (let i = 0; i < mPos.count; i++) {
      let x = mPos.getX(i);
      let y = mPos.getY(i);
      let z = mPos.getZ(i);
      const nx = x / (matW / 2);
      const nz = z / (matL / 2);
      if (Math.abs(nx) > 0.8 && Math.abs(nz) > 0.8) {
        x *= 0.96;
        z *= 0.96;
      }
      if (y > 0) {
        const crown = Math.max(0, (1 - nx * nx) * (1 - nz * nz));
        y += crown * 0.028;
      }
      mPos.setXYZ(i, x, y, z);
    }
    matGeo.computeVertexNormals();

    this.mattressMesh = new THREE.Mesh(matGeo, this.sheetMaterial);
    this.mattressMesh.position.set(0, matH / 2, 0);
    this.mattressMesh.castShadow = true;
    this.mattressMesh.receiveShadow = true;
    this.mattressGroup.add(this.mattressMesh);

    // Folded Taupe/Brown Textured Throw Blanket draped across lower bed
    const throwW = matW + 0.12;
    const throwL = matL * 0.52;
    const throwH = 0.045;
    const throwGeo = new THREE.BoxGeometry(throwW, throwH, throwL, 16, 4, 16);
    const tPos = throwGeo.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      let x = tPos.getX(i);
      let y = tPos.getY(i);
      let z = tPos.getZ(i);
      const nx = x / (throwW / 2);
      if (Math.abs(nx) > 0.85) {
        y -= Math.pow((Math.abs(nx) - 0.85) / 0.15, 1.5) * 0.10; // drape down side
      }
      tPos.setXYZ(i, x, y, z);
    }
    throwGeo.computeVertexNormals();

    const throwMesh = new THREE.Mesh(throwGeo, this.throwMaterial);
    throwMesh.position.set(0, matH + throwH / 2, 0.42);
    throwMesh.castShadow = true;
    throwMesh.receiveShadow = true;
    this.mattressGroup.add(throwMesh);

    // 5 Layered Designer Accent Pillows
    this.buildLayeredPillows(this.mattressGroup, matH);

    this.root.add(this.mattressGroup);
  }

  // ---------------------------------------------------------------------------
  // SLATTED TIMBER CRATE STORAGE DRAWER (WITH BOOKS & FOLDED LINENS)
  // ---------------------------------------------------------------------------
  buildSlattedCrateDrawer(group, w, h, d, type, propType) {
    const isSide = type === 'side';
    const boxW = isSide ? d : w;
    const boxD = isSide ? w : d;
    const slatH = h / 3.4;
    const slatThick = 0.016;

    const crateGroup = new THREE.Group();

    // Solid Bottom Board
    const bottomMesh = new THREE.Mesh(
      new THREE.BoxGeometry(boxW - 0.04, 0.014, boxD - 0.04),
      this.woodMaterial
    );
    bottomMesh.position.set(0, 0.007, 0);
    crateGroup.add(bottomMesh);
    this.woodMeshes.push(bottomMesh);

    // 3 Horizontal Open Timber Slats on Front Face
    [-slatH * 1.05, 0, slatH * 1.05].forEach((sy) => {
      const frontSlat = new THREE.Mesh(
        new THREE.BoxGeometry(isSide ? slatThick : boxW, slatH * 0.85, isSide ? boxD : slatThick),
        this.woodMaterial
      );
      frontSlat.position.set(
        isSide ? -boxW / 2 + slatThick / 2 : 0,
        h / 2 + sy,
        isSide ? 0 : boxD / 2 - slatThick / 2
      );
      frontSlat.castShadow = true;
      crateGroup.add(frontSlat);
      this.woodMeshes.push(frontSlat);
    });

    // 3 Horizontal Open Timber Slats on Back Face
    [-slatH * 1.05, 0, slatH * 1.05].forEach((sy) => {
      const backSlat = new THREE.Mesh(
        new THREE.BoxGeometry(isSide ? slatThick : boxW, slatH * 0.85, isSide ? boxD : slatThick),
        this.woodMaterial
      );
      backSlat.position.set(
        isSide ? boxW / 2 - slatThick / 2 : 0,
        h / 2 + sy,
        isSide ? 0 : -boxD / 2 + slatThick / 2
      );
      backSlat.castShadow = true;
      crateGroup.add(backSlat);
      this.woodMeshes.push(backSlat);
    });

    // Side Timber Rails
    const sideSlatGeo = new THREE.BoxGeometry(
      isSide ? boxW - 0.03 : slatThick,
      h - 0.02,
      isSide ? slatThick : boxD - 0.03
    );
    const side1 = new THREE.Mesh(sideSlatGeo, this.woodMaterial);
    side1.position.set(
      isSide ? 0 : -boxW / 2 + slatThick / 2,
      h / 2,
      isSide ? -boxD / 2 + slatThick / 2 : 0
    );
    crateGroup.add(side1);
    this.woodMeshes.push(side1);

    const side2 = new THREE.Mesh(sideSlatGeo, this.woodMaterial);
    side2.position.set(
      isSide ? 0 : boxW / 2 - slatThick / 2,
      h / 2,
      isSide ? boxD / 2 - slatThick / 2 : 0
    );
    crateGroup.add(side2);
    this.woodMeshes.push(side2);

    // Heavy-duty telescopic metal slide runners attached to sides, extending into bed cavity
    const runnerL = (isSide ? boxW : boxD) * 1.15;
    const runnerGeo = new THREE.BoxGeometry(
      isSide ? runnerL : 0.012,
      0.022,
      isSide ? 0.012 : runnerL
    );
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0x2e2d2b,
      metalness: 0.85,
      roughness: 0.35,
    });
    const runner1 = new THREE.Mesh(runnerGeo, runnerMat);
    const runner2 = new THREE.Mesh(runnerGeo, runnerMat);
    if (isSide) {
      runner1.position.set(0.12, 0.04, -boxD / 2 - 0.006);
      runner2.position.set(0.12, 0.04, boxD / 2 + 0.006);
    } else {
      runner1.position.set(-boxW / 2 - 0.006, 0.04, -0.14);
      runner2.position.set(boxW / 2 + 0.006, 0.04, -0.14);
    }
    crateGroup.add(runner1);
    crateGroup.add(runner2);

    // Realistic Props Inside Drawer:
    if (propType === 'books' || propType === 'magazines') {
      // Stack of design books with colorful spines
      const colors = [0x9e382d, 0x2d5a88, 0xcaa258, 0x2d684f, 0xdedede];
      colors.forEach((col, idx) => {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.032, 0.24),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 })
        );
        book.position.set(
          (idx - 2) * 0.06,
          0.04 + idx * 0.015,
          (idx % 2 === 0 ? 0.03 : -0.03)
        );
        book.rotation.y = (idx - 2) * 0.08;
        book.castShadow = true;
        crateGroup.add(book);
      });
    } else {
      // Folded fluffy wool blankets & pillows
      const blanket1 = new THREE.Mesh(
        new THREE.BoxGeometry(boxW * 0.55, 0.075, boxD * 0.6),
        new THREE.MeshStandardMaterial({ color: 0x44413d, roughness: 0.95 })
      );
      blanket1.position.set(-boxW * 0.15, 0.05, 0);
      crateGroup.add(blanket1);

      const blanket2 = new THREE.Mesh(
        new THREE.BoxGeometry(boxW * 0.45, 0.065, boxD * 0.55),
        new THREE.MeshStandardMaterial({ color: 0xdbd7cc, roughness: 0.95 })
      );
      blanket2.position.set(boxW * 0.18, 0.045, 0);
      crateGroup.add(blanket2);
    }

    group.add(crateGroup);
  }

  // ---------------------------------------------------------------------------
  // CURVED FLUTED NIGHTSTAND WITH SADDLE LEATHER PULL HANDLE
  // ---------------------------------------------------------------------------
  buildFlutedNightstand(group, isLeft) {
    const nsW = 0.56;
    const nsH = 0.38;
    const nsD = 0.42;

    // Rounded outer casing (dark charcoal / anthracite)
    const caseGeom = new THREE.BoxGeometry(nsW, nsH, nsD);
    const caseMesh = new THREE.Mesh(caseGeom, this.nightstandCaseMat);
    caseMesh.castShadow = true;
    caseMesh.receiveShadow = true;
    group.add(caseMesh);

    // Front Fluted / Ribbed Drawer Panel (Cream/Tan)
    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(nsW - 0.06, nsH - 0.08, 0.03),
      this.flutedFrontMat
    );
    frontPanel.position.set(0, 0, nsD / 2 + 0.01);
    group.add(frontPanel);

    // Vertical ribbed flutes on drawer front
    const numRibs = 14;
    const rStep = (nsW - 0.08) / numRibs;
    for (let i = 0; i < numRibs; i++) {
      const rx = -(nsW - 0.08) / 2 + rStep * (i + 0.5);
      const rib = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, nsH - 0.10, 8),
        this.flutedFrontMat
      );
      rib.position.set(rx, 0, nsD / 2 + 0.026);
      group.add(rib);
    }

    // Horizontal Saddle Brown Leather Loop Pull Handle with Brass Rivets
    const pullGroup = new THREE.Group();
    pullGroup.position.set(0, 0, nsD / 2 + 0.038);

    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.024, 0.015),
      this.leatherMat
    );
    pullGroup.add(strap);

    // Brass Rivet studs at left and right of leather pull
    [-0.055, 0.055].forEach((bx) => {
      const rivet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.018, 12),
        this.brassMaterial
      );
      rivet.rotation.x = Math.PI / 2;
      rivet.position.set(bx, 0, 0.008);
      pullGroup.add(rivet);
    });
    group.add(pullGroup);

    // Top Props on Nightstands:
    if (isLeft) {
      // Left Nightstand: Designer Sphere Lamp
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.04, 16),
        this.brassMaterial
      );
      lampBase.position.set(0, nsH / 2 + 0.02, 0);
      group.add(lampBase);

      const lampSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 20, 20),
        createEmissiveWarmGlowMaterial(1.8)
      );
      lampSphere.position.set(0, nsH / 2 + 0.10, 0);
      group.add(lampSphere);
    } else {
      // Right Nightstand: Two Upright Gold Photo Frames
      const frame1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.13, 0.01),
        this.brassMaterial
      );
      frame1.position.set(-0.06, nsH / 2 + 0.07, 0.04);
      frame1.rotation.y = 0.22;
      group.add(frame1);

      const frame2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.11, 0.01),
        this.brassMaterial
      );
      frame2.position.set(0.06, nsH / 2 + 0.06, 0.02);
      frame2.rotation.y = -0.15;
      group.add(frame2);
    }
  }

  // ---------------------------------------------------------------------------
  // 5 LAYERED PILLOWS (2 WHITE BACK, 1 BROWN ACCENT, 1 GREY PATTERN, 1 BOLSTER)
  // ---------------------------------------------------------------------------
  buildLayeredPillows(parent, matH) {
    // 1. Two Large White European Sleeping Pillows against tufted headboard
    const euroGeo = this.createPuffyPillowGeometry(0.70, 0.36, 0.16);
    [-0.52, 0.52].forEach((px, idx) => {
      const euro = new THREE.Mesh(euroGeo, this.sheetMaterial);
      euro.position.set(px, matH + 0.24, -0.68);
      euro.rotation.x = -0.28;
      euro.rotation.y = idx === 0 ? 0.04 : -0.04;
      euro.castShadow = true;
      euro.receiveShadow = true;
      parent.add(euro);
      this.pillowGroups.push(euro);
    });

    // 2. Dark Textured Brown Accent Pillow (Left)
    const brownGeo = this.createPuffyPillowGeometry(0.38, 0.20, 0.38);
    const brownPillow = new THREE.Mesh(brownGeo, this.darkPillowMaterial);
    brownPillow.position.set(-0.46, matH + 0.14, -0.38);
    brownPillow.rotation.x = -0.20;
    brownPillow.rotation.y = 0.12;
    brownPillow.castShadow = true;
    parent.add(brownPillow);
    this.pillowGroups.push(brownPillow);

    // 3. Patterned Grey Decorative Pillow (Right)
    const greyGeo = this.createPuffyPillowGeometry(0.48, 0.22, 0.32);
    const greyPillow = new THREE.Mesh(greyGeo, this.patternPillowMaterial);
    greyPillow.position.set(0.42, matH + 0.14, -0.38);
    greyPillow.rotation.x = -0.18;
    greyPillow.rotation.y = -0.10;
    greyPillow.castShadow = true;
    parent.add(greyPillow);
    this.pillowGroups.push(greyPillow);

    // 4. White Cylindrical Bolster Pillow on far right
    const bolsterGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.52, 20);
    const bolster = new THREE.Mesh(bolsterGeo, this.sheetMaterial);
    bolster.rotation.z = Math.PI / 2;
    bolster.rotation.y = 0.25;
    bolster.position.set(0.68, matH + 0.08, -0.28);
    bolster.castShadow = true;
    parent.add(bolster);
    this.pillowGroups.push(bolster);
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: STORAGE DRAWER SLIDE OPEN
  // ---------------------------------------------------------------------------
  setStorageOpen(progress) {
    this.storageOpenProgress = progress;
    const p = progress;

    // Slide all 4 slatted crate drawers out smoothly
    this.drawerGroups.forEach((dg) => {
      dg.group.position.x = dg.baseX + dg.dir[0] * p;
      dg.group.position.z = dg.baseZ + dg.dir[2] * p;
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: EXPLODE VIEW
  // ---------------------------------------------------------------------------
  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Headboard slides backward
    this.hbSuiteGroup.position.z = -2.20 / 2 + 0.04 - p * 0.85;

    // Grid tufted headboard lifts slightly
    this.gridHeadboardGroup.position.y = (0.28 + 0.65 / 2 + 0.08) + p * 0.25;

    // Mattress & bedding suite floats smoothly upward
    this.mattressGroup.position.y = 0.28 + 0.01 + p * 0.85;

    // Pillows articulate
    this.pillowGroups.forEach((pill, idx) => {
      pill.position.y += p * (0.12 + idx * 0.04);
    });

    // Drawers slide outward cleanly
    this.drawerGroups.forEach((dg) => {
      dg.group.position.x = dg.baseX + dg.dir[0] * p * 1.5;
      dg.group.position.z = dg.baseZ + dg.dir[2] * p * 1.5;
    });
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC MATERIAL & COLOR SWITCHING
  // ---------------------------------------------------------------------------
  updateMaterials(mainMat, secondaryMat) {
    // Update Grid-tufted cushion
    if (mainMat) {
      this.upholsteryMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }

    // Update Wood Platform Chassis & Slatted Crate Drawers
    if (secondaryMat) {
      this.woodMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
    this.setStorageOpen(0);
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
