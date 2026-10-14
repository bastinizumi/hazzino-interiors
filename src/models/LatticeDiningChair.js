/**
 * HAZZINO INTERIORS — BESPOKE CARVED LATTICE DINING CHAIR
 * Faithfully matches the exact reference photo:
 * - Upright solid wood back stiles extending from floor to arched crest rail
 * - Intricate openwork diamond / jali geometric lattice fretwork backrest panel (strictly clipped inside frame)
 * - Open air gap between lattice panel and seat
 * - Thick tailored cream linen / ivory upholstered seat cushion with rounded crown
 * - Solid hardwood seat perimeter apron frame
 * - Tapered square front legs and raked rear legs with authentic mortise-and-tenon stretchers
 */
import * as THREE from 'three';

export function createLatticeDiningChair(cushionMaterial, woodMaterial) {
  const chair = new THREE.Group();
  chair.name = 'LatticeDiningChair';

  const cushionMeshes = [];
  const woodMeshes = [];

  const chairWidth = 0.50;      // 50cm wide at front
  const chairWidthBack = 0.44;  // 44cm wide at rear
  const chairDepth = 0.50;      // 50cm deep
  const seatH = 0.46;           // 46cm seat height
  const totalH = 0.98;          // 98cm overall backrest height
  const legThick = 0.040;       // 4cm square leg

  // =========================================================================
  // 1. UPHOLSTERED SEAT CUSHION (Cream Linen / Tailored Fabric)
  // =========================================================================
  const seatGroup = new THREE.Group();
  seatGroup.name = 'SeatCushionGroup';
  seatGroup.position.set(0, seatH, 0);

  const seatThick = 0.075;
  const seatGeo = new THREE.BoxGeometry(chairWidth - 0.02, seatThick, chairDepth - 0.02, 16, 6, 16);
  
  // Sculpt cushion with organic crown dome and tapered sides
  const posAttr = seatGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    let x = posAttr.getX(i);
    let y = posAttr.getY(i);
    let z = posAttr.getZ(i);

    // Taper rear slightly narrower than front
    const taperFactor = 1.0 - ((z + chairDepth / 2) / chairDepth) * 0.10;
    x = x * taperFactor;
    posAttr.setX(i, x);

    // Cushion crown dome on top surface
    if (y > 0) {
      const normX = Math.abs(x) / ((chairWidth - 0.02) / 2);
      const normZ = Math.abs(z) / ((chairDepth - 0.02) / 2);
      const crown = Math.max(0, (1.0 - normX * normX) * (1.0 - normZ * normZ) * 0.025);
      posAttr.setY(i, y + crown);
    }
  }
  seatGeo.computeVertexNormals();

  const seatMesh = new THREE.Mesh(seatGeo, cushionMaterial);
  seatMesh.position.set(0, seatThick / 2, 0);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  seatGroup.add(seatMesh);
  cushionMeshes.push(seatMesh);

  // Seat Welt Piping Trim around cushion perimeter
  const weltGeo = new THREE.TorusGeometry(chairWidth * 0.38, 0.005, 8, 32);
  weltGeo.scale(1.2, 0.2, 1.25);
  const weltMesh = new THREE.Mesh(weltGeo, cushionMaterial);
  weltMesh.rotation.x = Math.PI / 2;
  weltMesh.position.set(0, 0.015, 0);
  seatGroup.add(weltMesh);
  cushionMeshes.push(weltMesh);

  chair.add(seatGroup);

  // =========================================================================
  // 2. SOLID WOOD SEAT APRON FRAME (Under Cushion)
  // =========================================================================
  const apronGroup = new THREE.Group();
  apronGroup.name = 'SeatApron';
  apronGroup.position.set(0, seatH - 0.03, 0);

  const apronH = 0.055;
  const apronThick = 0.022;

  // Front Apron Rail
  const frontApronGeo = new THREE.BoxGeometry(chairWidth - legThick * 1.5, apronH, apronThick);
  const frontApron = new THREE.Mesh(frontApronGeo, woodMaterial);
  frontApron.position.set(0, 0, chairDepth / 2 - apronThick / 2);
  frontApron.castShadow = true;
  apronGroup.add(frontApron);
  woodMeshes.push(frontApron);

  // Rear Apron Rail
  const rearApronGeo = new THREE.BoxGeometry(chairWidthBack - legThick * 1.5, apronH, apronThick);
  const rearApron = new THREE.Mesh(rearApronGeo, woodMaterial);
  rearApron.position.set(0, 0, -chairDepth / 2 + apronThick / 2);
  rearApron.castShadow = true;
  apronGroup.add(rearApron);
  woodMeshes.push(rearApron);

  // Left Apron Rail
  const leftApronGeo = new THREE.BoxGeometry(apronThick, apronH, chairDepth - legThick * 1.5);
  const leftApron = new THREE.Mesh(leftApronGeo, woodMaterial);
  leftApron.position.set(-chairWidth / 2 + apronThick / 2 + 0.01, 0, 0);
  leftApron.castShadow = true;
  apronGroup.add(leftApron);
  woodMeshes.push(leftApron);

  // Right Apron Rail
  const rightApron = new THREE.Mesh(leftApronGeo, woodMaterial);
  rightApron.position.set(chairWidth / 2 - apronThick / 2 - 0.01, 0, 0);
  rightApron.castShadow = true;
  apronGroup.add(rightApron);
  woodMeshes.push(rightApron);

  chair.add(apronGroup);

  // =========================================================================
  // 3. FRONT LEGS (Solid Square Tapered Hardwood)
  // =========================================================================
  const frontLegGeo = new THREE.CylinderGeometry(legThick * 0.44, legThick * 0.32, seatH, 4);
  frontLegGeo.rotateY(Math.PI / 4); // Turn box diagonal for square cross-section

  // Front Left Leg
  const flLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  flLeg.position.set(-chairWidth / 2 + legThick / 2, seatH / 2, chairDepth / 2 - legThick / 2);
  flLeg.castShadow = true;
  flLeg.receiveShadow = true;
  chair.add(flLeg);
  woodMeshes.push(flLeg);

  // Front Right Leg
  const frLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  frLeg.position.set(chairWidth / 2 - legThick / 2, seatH / 2, chairDepth / 2 - legThick / 2);
  frLeg.castShadow = true;
  frLeg.receiveShadow = true;
  chair.add(frLeg);
  woodMeshes.push(frLeg);

  // =========================================================================
  // 4. REAR STILES & BACKREST POSTS (Extend Floor to Crest Rail)
  // =========================================================================
  const rearLowerGeo = new THREE.BoxGeometry(legThick, seatH, legThick);
  
  // Rear Left Lower Leg
  const rlLeg = new THREE.Mesh(rearLowerGeo, woodMaterial);
  rlLeg.position.set(-chairWidthBack / 2 + legThick / 2, seatH / 2, -chairDepth / 2 + legThick / 2);
  rlLeg.rotation.x = -0.055;
  rlLeg.castShadow = true;
  rlLeg.receiveShadow = true;
  chair.add(rlLeg);
  woodMeshes.push(rlLeg);

  // Rear Right Lower Leg
  const rrLeg = new THREE.Mesh(rearLowerGeo, woodMaterial);
  rrLeg.position.set(chairWidthBack / 2 - legThick / 2, seatH / 2, -chairDepth / 2 + legThick / 2);
  rrLeg.rotation.x = -0.055;
  rrLeg.castShadow = true;
  rrLeg.receiveShadow = true;
  chair.add(rrLeg);
  woodMeshes.push(rrLeg);

  // Upper Backrest Stiles (from seat to crest rail, raked gently backward)
  const backUpperH = totalH - seatH;
  const backStileGeo = new THREE.BoxGeometry(legThick * 0.9, backUpperH, legThick * 0.85);

  const backGroup = new THREE.Group();
  backGroup.name = 'BackrestGroup';
  backGroup.position.set(0, seatH, -chairDepth / 2 + legThick / 2 - 0.01);
  backGroup.rotation.x = -0.07; // 4 deg ergonomic recline

  // Left Back Stile
  const blStile = new THREE.Mesh(backStileGeo, woodMaterial);
  blStile.position.set(-chairWidthBack / 2 + legThick / 2, backUpperH / 2, 0);
  blStile.castShadow = true;
  backGroup.add(blStile);
  woodMeshes.push(blStile);

  // Right Back Stile
  const brStile = new THREE.Mesh(backStileGeo, woodMaterial);
  brStile.position.set(chairWidthBack / 2 - legThick / 2, backUpperH / 2, 0);
  brStile.castShadow = true;
  backGroup.add(brStile);
  woodMeshes.push(brStile);

  // Top Crest Rail (Curved Solid Wood Crown)
  const crestRailGeo = new THREE.BoxGeometry(chairWidthBack, 0.055, legThick * 0.95);
  const crestRail = new THREE.Mesh(crestRailGeo, woodMaterial);
  crestRail.position.set(0, backUpperH - 0.027, 0);
  crestRail.castShadow = true;
  backGroup.add(crestRail);
  woodMeshes.push(crestRail);

  // Lower Back Crossbar (Forms bottom of framed lattice panel)
  const lowerCrossbarH = 0.035;
  const lowerCrossbar = new THREE.Mesh(
    new THREE.BoxGeometry(chairWidthBack - legThick * 1.2, lowerCrossbarH, legThick * 0.7),
    woodMaterial
  );
  // Placed so that there is an open air gap between seat and lattice panel (~15cm gap)
  const latticeBottomY = 0.16;
  lowerCrossbar.position.set(0, latticeBottomY - lowerCrossbarH / 2, 0);
  lowerCrossbar.castShadow = true;
  backGroup.add(lowerCrossbar);
  woodMeshes.push(lowerCrossbar);

  // =========================================================================
  // 5. CARVED DIAMOND / JALI OPENWORK LATTICE PANEL (Strictly Clipped)
  // =========================================================================
  const latticePanel = new THREE.Group();
  latticePanel.name = 'JaliLatticePanel';

  // Inside dimensions of the framed lattice opening
  const innerW = chairWidthBack - legThick * 2.1;
  const innerH = (backUpperH - 0.055) - latticeBottomY;
  const latticeCenterY = latticeBottomY + innerH / 2;
  latticePanel.position.set(0, latticeCenterY, 0);

  const halfW = innerW / 2;
  const halfH = innerH / 2;

  const slatThick = 0.009;
  const slatDepth = 0.016;
  const spacing = 0.038;

  // Set A: Slats along lines y - x = c (angle +45 deg)
  const minC_A = -halfH - halfW;
  const maxC_A = halfH + halfW;
  const numA = Math.ceil((maxC_A - minC_A) / spacing);

  for (let i = 0; i <= numA; i++) {
    const c = minC_A + i * spacing;
    const xMin = Math.max(-halfW, -halfH - c);
    const xMax = Math.min(halfW, halfH - c);

    if (xMax - xMin > 0.015) {
      const len = Math.SQRT2 * (xMax - xMin);
      const cx = (xMin + xMax) / 2;
      const cy = cx + c;

      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(slatThick, len, slatDepth),
        woodMaterial
      );
      slat.position.set(cx, cy, 0);
      slat.rotation.z = -Math.PI / 4; // Three.js rotation for dy/dx = 1
      slat.castShadow = true;
      latticePanel.add(slat);
      woodMeshes.push(slat);
    }
  }

  // Set B: Slats along lines y + x = c (angle -45 deg)
  const minC_B = -halfH - halfW;
  const maxC_B = halfH + halfW;
  const numB = Math.ceil((maxC_B - minC_B) / spacing);

  for (let i = 0; i <= numB; i++) {
    const c = minC_B + i * spacing;
    const xMin = Math.max(-halfW, c - halfH);
    const xMax = Math.min(halfW, c + halfH);

    if (xMax - xMin > 0.015) {
      const len = Math.SQRT2 * (xMax - xMin);
      const cx = (xMin + xMax) / 2;
      const cy = -cx + c;

      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(slatThick, len, slatDepth),
        woodMaterial
      );
      slat.position.set(cx, cy, 0);
      slat.rotation.z = Math.PI / 4; // Three.js rotation for dy/dx = -1
      slat.castShadow = true;
      latticePanel.add(slat);
      woodMeshes.push(slat);
    }
  }

  // Precision inner moulding borders
  const borderThick = 0.012;
  // Left border
  const bL = new THREE.Mesh(new THREE.BoxGeometry(borderThick, innerH, slatDepth * 1.15), woodMaterial);
  bL.position.set(-halfW + borderThick / 2, 0, 0);
  latticePanel.add(bL);
  woodMeshes.push(bL);

  // Right border
  const bR = new THREE.Mesh(new THREE.BoxGeometry(borderThick, innerH, slatDepth * 1.15), woodMaterial);
  bR.position.set(halfW - borderThick / 2, 0, 0);
  latticePanel.add(bR);
  woodMeshes.push(bR);

  // Top border
  const bT = new THREE.Mesh(new THREE.BoxGeometry(innerW, borderThick, slatDepth * 1.15), woodMaterial);
  bT.position.set(0, halfH - borderThick / 2, 0);
  latticePanel.add(bT);
  woodMeshes.push(bT);

  // Bottom border
  const bB = new THREE.Mesh(new THREE.BoxGeometry(innerW, borderThick, slatDepth * 1.15), woodMaterial);
  bB.position.set(0, -halfH + borderThick / 2, 0);
  latticePanel.add(bB);
  woodMeshes.push(bB);

  backGroup.add(latticePanel);
  chair.add(backGroup);

  // =========================================================================
  // 6. LOWER WOODEN STRETCHERS (Craftsman Mortise & Tenon Joinery)
  // =========================================================================
  const stretcherThick = 0.018;
  const stretcherH = 0.024;
  const stretcherY = 0.12;

  // Left Side Stretcher
  const leftStretcher = new THREE.Mesh(
    new THREE.BoxGeometry(stretcherThick, stretcherH, chairDepth - legThick * 2),
    woodMaterial
  );
  leftStretcher.position.set(-chairWidth / 2 + legThick / 2, stretcherY, 0);
  leftStretcher.castShadow = true;
  chair.add(leftStretcher);
  woodMeshes.push(leftStretcher);

  // Right Side Stretcher
  const rightStretcher = new THREE.Mesh(
    new THREE.BoxGeometry(stretcherThick, stretcherH, chairDepth - legThick * 2),
    woodMaterial
  );
  rightStretcher.position.set(chairWidth / 2 - legThick / 2, stretcherY, 0);
  rightStretcher.castShadow = true;
  chair.add(rightStretcher);
  woodMeshes.push(rightStretcher);

  // Rear Stretcher
  const rearStretcher = new THREE.Mesh(
    new THREE.BoxGeometry(chairWidthBack - legThick * 2, stretcherH, stretcherThick),
    woodMaterial
  );
  rearStretcher.position.set(0, stretcherY, -chairDepth / 2 + legThick / 2);
  rearStretcher.castShadow = true;
  chair.add(rearStretcher);
  woodMeshes.push(rearStretcher);

  return {
    group: chair,
    seatGroup,
    backGroup,
    latticePanel,
    cushionMeshes,
    woodMeshes,
  };
}
