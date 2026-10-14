/**
 * HAZZINO INTERIORS — BESPOKE SCULPTURAL TUB DINING CHAIR
 * Exact 1:1 match to reference photo:
 * - Continuous curved horseshoe / barrel backrest & armrest rail
 * - Two front vertical rectangular legs meeting the arm tips seamlessly
 * - Two rear vertical rectangular legs supporting the back curve
 * - Open air gap between back rail and seat cushion
 * - Plush tailored warm ivory bouclé / linen cushioned seat with rounded corners
 * - Sturdy solid wood seat apron frame
 */
import * as THREE from 'three';

export function createSculpturalTubDiningChair(cushionMaterial, woodMaterial) {
  const group = new THREE.Group();
  group.name = 'SculpturalTubDiningChair';

  const cushionMeshes = [];
  const woodMeshes = [];

  // Proportions matching the reference photo
  const chairWidth = 0.54;       // 54cm wide
  const chairDepth = 0.50;       // 50cm deep
  const seatH = 0.44;            // 44cm seat height
  const railTopH = 0.71;         // 71cm top of curved back rail
  const railThick = 0.040;       // 4.0cm rail width
  const railHeight = 0.065;      // 6.5cm rail height
  const legW = 0.046;            // 4.6cm leg width
  const legD = 0.040;            // 4.0cm leg depth
  const cushionThick = 0.072;    // 7.2cm plush cushion

  const armRadiusX = (chairWidth - legW) / 2; // ~0.247m
  const backRadiusZ = (chairDepth - legD) / 2; // ~0.230m

  // =========================================================================
  // 1. CONTINUOUS CURVED HORSESHOE / BARREL-BACK RAIL
  // =========================================================================
  const segments = 32;
  const curvePoints = [];

  // Horseshoe curve from front-right (+X, +Z) around back to front-left (-X, +Z)
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = -Math.PI * 0.08 + t * (Math.PI * 1.16);
    const x = Math.sin(angle) * armRadiusX;
    const z = -Math.cos(angle) * backRadiusZ * 0.95 + 0.01;
    const crown = Math.sin(t * Math.PI) * 0.015;
    const y = railTopH - railHeight / 2 + crown;

    curvePoints.push(new THREE.Vector3(x, y, z));
  }

  const railCurve = new THREE.CatmullRomCurve3(curvePoints);

  // Softly rounded rectangular cross-section for the curved rail
  const railShape = new THREE.Shape();
  const rw = railThick;
  const rh = railHeight;
  const rRad = 0.008;

  railShape.moveTo(-rw / 2 + rRad, -rh / 2);
  railShape.lineTo(rw / 2 - rRad, -rh / 2);
  railShape.quadraticCurveTo(rw / 2, -rh / 2, rw / 2, -rh / 2 + rRad);
  railShape.lineTo(rw / 2, rh / 2 - rRad);
  railShape.quadraticCurveTo(rw / 2, rh / 2, rw / 2 - rRad, rh / 2);
  railShape.lineTo(-rw / 2 + rRad, rh / 2);
  railShape.quadraticCurveTo(-rw / 2, rh / 2, -rw / 2, rh / 2 - rRad);
  railShape.lineTo(-rw / 2, -rh / 2 + rRad);
  railShape.quadraticCurveTo(-rw / 2, -rh / 2, -rw / 2 + rRad, -rh / 2);

  const railGeo = new THREE.ExtrudeGeometry(railShape, {
    steps: 40,
    bevelEnabled: false,
    extrudePath: railCurve,
  });
  railGeo.computeVertexNormals();

  const railMesh = new THREE.Mesh(railGeo, woodMaterial);
  railMesh.castShadow = true;
  railMesh.receiveShadow = true;
  group.add(railMesh);
  woodMeshes.push(railMesh);

  // Front arm tip caps
  const rightArmEnd = curvePoints[0];
  const leftArmEnd = curvePoints[curvePoints.length - 1];

  const capGeo = new THREE.CylinderGeometry(rh * 0.48, rh * 0.48, rw * 0.98, 16);
  capGeo.rotateZ(Math.PI / 2);

  const rightCap = new THREE.Mesh(capGeo, woodMaterial);
  rightCap.position.copy(rightArmEnd);
  rightCap.position.z += 0.006;
  rightCap.castShadow = true;
  group.add(rightCap);
  woodMeshes.push(rightCap);

  const leftCap = new THREE.Mesh(capGeo, woodMaterial);
  leftCap.position.copy(leftArmEnd);
  leftCap.position.z += 0.006;
  leftCap.castShadow = true;
  group.add(leftCap);
  woodMeshes.push(leftCap);

  // =========================================================================
  // 2. FOUR CLEAN ARCHITECTURAL LEGS
  // =========================================================================
  // 2.1 Front Legs (Under the front arm tips)
  const frontLegH = railTopH - railHeight / 2 - 0.005;
  const frontLegGeo = new THREE.BoxGeometry(legW, frontLegH, legD);

  const frontRightLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  frontRightLeg.position.set(rightArmEnd.x, frontLegH / 2, rightArmEnd.z - 0.01);
  frontRightLeg.castShadow = true;
  frontRightLeg.receiveShadow = true;
  group.add(frontRightLeg);
  woodMeshes.push(frontRightLeg);

  const frontLeftLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  frontLeftLeg.position.set(leftArmEnd.x, frontLegH / 2, leftArmEnd.z - 0.01);
  frontLeftLeg.castShadow = true;
  frontLeftLeg.receiveShadow = true;
  group.add(frontLeftLeg);
  woodMeshes.push(frontLeftLeg);

  // 2.2 Rear Legs (Under rear corners of the curved rail)
  const backLegH = railTopH - 0.015;
  const backLegGeo = new THREE.BoxGeometry(legW, backLegH, legD);

  const rearRightPoint = curvePoints[Math.floor(segments * 0.18)];
  const rearLeftPoint = curvePoints[Math.floor(segments * 0.82)];

  const rearRightLeg = new THREE.Mesh(backLegGeo, woodMaterial);
  rearRightLeg.position.set(rearRightPoint.x, backLegH / 2, rearRightPoint.z);
  rearRightLeg.castShadow = true;
  rearRightLeg.receiveShadow = true;
  group.add(rearRightLeg);
  woodMeshes.push(rearRightLeg);

  const rearLeftLeg = new THREE.Mesh(backLegGeo, woodMaterial);
  rearLeftLeg.position.set(rearLeftPoint.x, backLegH / 2, rearLeftPoint.z);
  rearLeftLeg.castShadow = true;
  rearLeftLeg.receiveShadow = true;
  group.add(rearLeftLeg);
  woodMeshes.push(rearLeftLeg);

  // =========================================================================
  // 3. SOLID WOOD SEAT APRON FRAME (Under Cushion)
  // =========================================================================
  const apronGroup = new THREE.Group();
  const apronY = seatH - cushionThick / 2 - 0.02;
  apronGroup.position.set(0, apronY, 0);

  const apronH = 0.045;
  const apronThick = 0.022;
  const frontZ = rightArmEnd.z - 0.01;
  const backZ = curvePoints[Math.floor(segments * 0.5)].z;
  const midZ = (frontZ + backZ) / 2;
  const apronL = (frontZ - backZ) * 0.88;
  const innerW = chairWidth - legW * 1.5;

  // Front Rail
  const frontApron = new THREE.Mesh(
    new THREE.BoxGeometry(innerW, apronH, apronThick),
    woodMaterial
  );
  frontApron.position.set(0, 0, frontZ - legD * 0.8);
  frontApron.castShadow = true;
  apronGroup.add(frontApron);
  woodMeshes.push(frontApron);

  // Rear Rail
  const rearApron = new THREE.Mesh(
    new THREE.BoxGeometry(innerW * 0.80, apronH, apronThick),
    woodMaterial
  );
  rearApron.position.set(0, 0, backZ + legD * 1.2);
  rearApron.castShadow = true;
  apronGroup.add(rearApron);
  woodMeshes.push(rearApron);

  // Side Rails
  const sideRailGeo = new THREE.BoxGeometry(apronThick, apronH, apronL);

  const rightSideRail = new THREE.Mesh(sideRailGeo, woodMaterial);
  rightSideRail.position.set(armRadiusX - legW * 0.6, 0, midZ);
  rightSideRail.castShadow = true;
  apronGroup.add(rightSideRail);
  woodMeshes.push(rightSideRail);

  const leftSideRail = new THREE.Mesh(sideRailGeo, woodMaterial);
  leftSideRail.position.set(-armRadiusX + legW * 0.6, 0, midZ);
  leftSideRail.castShadow = true;
  apronGroup.add(leftSideRail);
  woodMeshes.push(leftSideRail);

  // Seat Deck
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(innerW * 0.94, 0.012, apronL * 0.94),
    woodMaterial
  );
  deck.position.set(0, apronH / 2 - 0.008, midZ);
  apronGroup.add(deck);
  woodMeshes.push(deck);

  group.add(apronGroup);

  // =========================================================================
  // 4. TAILORED WARM IVORY BOUCLÉ CUSHION
  // =========================================================================
  const seatGroup = new THREE.Group();
  seatGroup.name = 'SeatCushionGroup';
  seatGroup.position.set(0, seatH - cushionThick / 2, midZ + 0.01);

  const cW = innerW + 0.02;
  const cD = apronL + 0.025;
  const cRadius = 0.055;

  const cushionShape = new THREE.Shape();
  cushionShape.moveTo(-cW / 2 + cRadius, -cD / 2);
  cushionShape.lineTo(cW / 2 - cRadius, -cD / 2);
  cushionShape.quadraticCurveTo(cW / 2, -cD / 2, cW / 2, -cD / 2 + cRadius);
  cushionShape.lineTo(cW / 2, cD / 2 - cRadius * 1.4);
  cushionShape.quadraticCurveTo(cW / 2, cD / 2, cW / 2 - cRadius * 1.4, cD / 2);
  cushionShape.lineTo(-cW / 2 + cRadius * 1.4, cD / 2);
  cushionShape.quadraticCurveTo(-cW / 2, cD / 2, -cW / 2, cD / 2 - cRadius * 1.4);
  cushionShape.lineTo(-cW / 2, -cD / 2 + cRadius);
  cushionShape.quadraticCurveTo(-cW / 2, -cD / 2, -cW / 2 + cRadius, -cD / 2);

  const cushionGeo = new THREE.ExtrudeGeometry(cushionShape, {
    steps: 2,
    depth: cushionThick,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  cushionGeo.rotateX(Math.PI / 2);

  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMaterial);
  cushionMesh.position.set(0, cushionThick / 2, 0);
  cushionMesh.castShadow = true;
  cushionMesh.receiveShadow = true;
  seatGroup.add(cushionMesh);
  cushionMeshes.push(cushionMesh);

  group.add(seatGroup);

  return {
    group,
    seatGroup,
    railMesh,
    cushionMeshes,
    woodMeshes,
  };
}
