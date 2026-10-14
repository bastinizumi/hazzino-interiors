/**
 * HAZZINO INTERIORS — BESPOKE SIGNATURE DINING TABLE & SUITE 3D MODEL
 * Faithfully matches the exact reference photo:
 * - Solid sheesham / teak dining table with hand-carved open diamond jali lattice apron
 * - 4 tapered square solid wood corner legs
 * - 6 matching handcrafted dining chairs with diamond-lattice backrests & cream linen cushions
 * - Crystal wine goblets and ceramic plates place settings
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createGlassMaterial,
} from './modelMaterials';
import { createLatticeDiningChair } from './LatticeDiningChair';

export class SignatureDiningTableModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'SignatureDiningTableModel';

    // Materials
    this.woodMaterial = createFurnitureMaterial('natural_wood');
    this.mainMaterial = this.woodMaterial;
    this.brassMaterial = createBrassAccentMaterial();
    this.chairUpholsteryMaterial = new THREE.MeshStandardMaterial({
      color: 0xede8dd,
      roughness: 0.85,
      metalness: 0.02,
    });

    this.explodeProgress = 0;
    this.tableMeshes = [];
    this.woodMeshes = [];
    this.chairMeshes = [];
    this.chairGroups = [];

    this.buildModel();
  }

  buildModel() {
    const tableLength = 2.30;
    const tableWidth = 1.10;
    const tableHeight = 0.76;
    const topThickness = 0.040;
    const apronHeight = 0.11;
    const legThick = 0.075;

    // =========================================================================
    // 1. SOLID WOOD TABLETOP WITH SOFT RADIUS CORNERS
    // =========================================================================
    this.topGroup = new THREE.Group();
    this.topGroup.position.set(0, tableHeight - topThickness / 2, 0);

    const topGeom = new THREE.BoxGeometry(tableLength, topThickness, tableWidth, 12, 2, 12);
    // Chamfer corners
    const pos = topGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const absX = Math.abs(x) / (tableLength / 2);
      const absZ = Math.abs(z) / (tableWidth / 2);
      if (absX > 0.92 && absZ > 0.92) {
        pos.setX(i, x * 0.97);
        pos.setZ(i, z * 0.97);
      }
    }
    topGeom.computeVertexNormals();

    this.topMesh = new THREE.Mesh(topGeom, this.woodMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.topGroup.add(this.topMesh);
    this.tableMeshes.push(this.topMesh);
    this.woodMeshes.push(this.topMesh);

    // Centerpiece: Low carved stone bowl with delicate botanical accents
    const bowlMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.06, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d3835, roughness: 0.8 })
    );
    bowlMesh.position.set(0, topThickness / 2 + 0.03, 0);
    bowlMesh.castShadow = true;
    this.topGroup.add(bowlMesh);

    // Tableware Place Settings (6 places: 3 south, 3 north)
    const plateGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.015, 24);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.45 });
    const glassGeo = new THREE.CylinderGeometry(0.03, 0.018, 0.11, 16);
    const glassMat = createGlassMaterial(0.35);

    [-0.68, 0, 0.68].forEach((px) => {
      // South side settings
      const plateS = new THREE.Mesh(plateGeo, plateMat);
      plateS.position.set(px, topThickness / 2 + 0.008, 0.35);
      plateS.castShadow = true;
      this.topGroup.add(plateS);

      const glassS = new THREE.Mesh(glassGeo, glassMat);
      glassS.position.set(px + 0.14, topThickness / 2 + 0.055, 0.42);
      this.topGroup.add(glassS);

      // North side settings
      const plateN = new THREE.Mesh(plateGeo, plateMat);
      plateN.position.set(px, topThickness / 2 + 0.008, -0.35);
      plateN.castShadow = true;
      this.topGroup.add(plateN);

      const glassN = new THREE.Mesh(glassGeo, glassMat);
      glassN.position.set(px + 0.14, topThickness / 2 + 0.055, -0.42);
      this.topGroup.add(glassN);
    });

    this.root.add(this.topGroup);

    // =========================================================================
    // 2. CARVED DIAMOND LATTICE (JALI) APRON FRAME DIRECTLY UNDER TABLETOP
    // =========================================================================
    this.apronGroup = new THREE.Group();
    const apronY = tableHeight - topThickness - apronHeight / 2;
    this.apronGroup.position.set(0, apronY, 0);

    this.buildLatticeApron(this.apronGroup, tableLength - legThick * 2, tableWidth - legThick * 2, apronHeight);
    this.root.add(this.apronGroup);

    // =========================================================================
    // 3. FOUR TAPERED SQUARE SOLID WOOD CORNER LEGS
    // =========================================================================
    this.legsGroup = new THREE.Group();
    const legH = tableHeight - topThickness;
    const legGeo = new THREE.CylinderGeometry(legThick * 0.48, legThick * 0.34, legH, 4);
    legGeo.rotateY(Math.PI / 4);

    const legPosX = tableLength / 2 - legThick / 2 - 0.02;
    const legPosZ = tableWidth / 2 - legThick / 2 - 0.02;

    [
      { x: -legPosX, z: -legPosZ },
      { x: legPosX, z: -legPosZ },
      { x: -legPosX, z: legPosZ },
      { x: legPosX, z: legPosZ },
    ].forEach((lp) => {
      const legMesh = new THREE.Mesh(legGeo, this.woodMaterial);
      legMesh.position.set(lp.x, legH / 2, lp.z);
      legMesh.castShadow = true;
      legMesh.receiveShadow = true;
      this.legsGroup.add(legMesh);
      this.woodMeshes.push(legMesh);
      this.tableMeshes.push(legMesh);
    });
    this.root.add(this.legsGroup);

    // =========================================================================
    // 4. 6 MATCHING BESPOKE LATTICE CHAIRS ARRANGED AROUND TABLE
    // =========================================================================
    const chairsGroup = new THREE.Group();
    chairsGroup.name = 'DiningChairsGroup';

    const chairCoords = [
      // South side (facing north toward table, hero center chair slightly angled)
      { id: 's_mid', x: 0, z: 0.86, rotY: Math.PI - 0.32 },
      { id: 's_left', x: -0.72, z: 0.82, rotY: Math.PI - 0.06 },
      { id: 's_right', x: 0.72, z: 0.82, rotY: Math.PI + 0.06 },
      // North side (facing south toward table)
      { id: 'n_mid', x: 0, z: -0.80, rotY: 0 },
      { id: 'n_left', x: -0.72, z: -0.80, rotY: 0.06 },
      { id: 'n_right', x: 0.72, z: -0.80, rotY: -0.06 },
    ];

    chairCoords.forEach((coord) => {
      this.buildChairInstance(chairsGroup, coord);
    });

    this.chairsGroup = chairsGroup;
    this.root.add(this.chairsGroup);
  }

  buildLatticeApron(group, innerL, innerW, h) {
    const slatThick = 0.010;
    const slatDepth = 0.016;
    const spacing = 0.048;

    const buildFrieze = (panelLen, isZAxis, offsetCoord) => {
      const friezeGroup = new THREE.Group();
      if (isZAxis) {
        friezeGroup.rotation.y = Math.PI / 2;
        friezeGroup.position.set(offsetCoord, 0, 0);
      } else {
        friezeGroup.position.set(0, 0, offsetCoord);
      }

      const railH = 0.018;
      // Rails
      const topRail = new THREE.Mesh(
        new THREE.BoxGeometry(panelLen, railH, slatDepth * 1.2),
        this.woodMaterial
      );
      topRail.position.y = h / 2 - railH / 2;
      topRail.castShadow = true;
      friezeGroup.add(topRail);
      this.woodMeshes.push(topRail);

      const btmRail = new THREE.Mesh(
        new THREE.BoxGeometry(panelLen, railH, slatDepth * 1.2),
        this.woodMaterial
      );
      btmRail.position.y = -h / 2 + railH / 2;
      btmRail.castShadow = true;
      friezeGroup.add(btmRail);
      this.woodMeshes.push(btmRail);

      // Criss-cross slats strictly clipped
      const latticeH = h - railH * 2;
      const halfL = panelLen / 2;
      const halfH = latticeH / 2;

      // Set A: angle +45 deg
      const minA = -halfH - halfL;
      const maxA = halfH + halfL;
      const countA = Math.ceil((maxA - minA) / spacing);

      for (let i = 0; i <= countA; i++) {
        const c = minA + i * spacing;
        const xMin = Math.max(-halfL, -halfH - c);
        const xMax = Math.min(halfL, halfH - c);

        if (xMax - xMin > 0.015) {
          const len = Math.SQRT2 * (xMax - xMin);
          const cx = (xMin + xMax) / 2;
          const cy = cx + c;

          const s = new THREE.Mesh(
            new THREE.BoxGeometry(slatThick, len, slatDepth),
            this.woodMaterial
          );
          s.position.set(cx, cy, 0);
          s.rotation.z = -Math.PI / 4;
          s.castShadow = true;
          friezeGroup.add(s);
          this.woodMeshes.push(s);
        }
      }

      // Set B: angle -45 deg
      const minB = -halfH - halfL;
      const maxB = halfH + halfL;
      const countB = Math.ceil((maxB - minB) / spacing);

      for (let i = 0; i <= countB; i++) {
        const c = minB + i * spacing;
        const xMin = Math.max(-halfL, c - halfH);
        const xMax = Math.min(halfL, c + halfH);

        if (xMax - xMin > 0.015) {
          const len = Math.SQRT2 * (xMax - xMin);
          const cx = (xMin + xMax) / 2;
          const cy = -cx + c;

          const s = new THREE.Mesh(
            new THREE.BoxGeometry(slatThick, len, slatDepth),
            this.woodMaterial
          );
          s.position.set(cx, cy, 0);
          s.rotation.z = Math.PI / 4;
          s.castShadow = true;
          friezeGroup.add(s);
          this.woodMeshes.push(s);
        }
      }

      group.add(friezeGroup);
    };

    buildFrieze(innerL, false, innerW / 2);
    buildFrieze(innerL, false, -innerW / 2);
    buildFrieze(innerW, true, innerL / 2);
    buildFrieze(innerW, true, -innerL / 2);
  }

  buildChairInstance(parentGroup, coord) {
    const chairInst = createLatticeDiningChair(this.chairUpholsteryMaterial, this.woodMaterial);
    const chairRoot = new THREE.Group();
    chairRoot.position.set(coord.x, 0, coord.z);
    chairRoot.rotation.y = coord.rotY;
    chairRoot.add(chairInst.group);

    parentGroup.add(chairRoot);

    if (chairInst.cushionMeshes) {
      chairInst.cushionMeshes.forEach((m) => this.chairMeshes.push(m));
    }
    if (chairInst.woodMeshes) {
      chairInst.woodMeshes.forEach((m) => this.woodMeshes.push(m));
    }

    this.chairGroups.push({
      id: coord.id,
      baseX: coord.x,
      baseZ: coord.z,
      group: chairRoot,
      chairInst,
    });
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Tabletop rises smoothly
    this.topGroup.position.y = 0.76 - 0.040 / 2 + p * 0.75;

    // Apron reveals
    this.apronGroup.position.y = (0.76 - 0.040 - 0.11 / 2) + p * 0.35;

    // Legs scale outward
    this.legsGroup.scale.set(1 + p * 0.15, 1, 1 + p * 0.15);

    // Surrounding chairs glide outward
    this.chairGroups.forEach((cg) => {
      const isSouth = cg.baseZ > 0;
      const slideDir = isSouth ? 1 : -1;
      cg.group.position.z = cg.baseZ + slideDir * p * 0.65;

      if (cg.chairInst && cg.chairInst.seatGroup) {
        cg.chairInst.seatGroup.position.y = 0.46 + p * 0.35;
      }
    });
  }

  updateMaterials(tableMat, chairMat) {
    if (tableMat) {
      this.tableMeshes.forEach((mesh) => {
        mesh.material = tableMat;
      });
    }
    if (chairMat) {
      this.chairMeshes.forEach((mesh) => {
        mesh.material = chairMat;
      });
    }
  }

  reset() {
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.geometry.dispose();
      }
    });
  }
}
