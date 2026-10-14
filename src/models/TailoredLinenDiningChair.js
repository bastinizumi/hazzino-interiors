/**
 * HAZZINO INTERIORS — BESPOKE TAILORED LINEN DINING CHAIR
 * Exact 1:1 match to reference photo:
 * - Fully upholstered ergonomic backrest with gentle backward rake and softly rounded top corners
 * - Tailored thick cushioned seat in textured oatmeal linen / bouclé
 * - Solid warm walnut / teak hardwood frame
 * - Tapered square front legs and raked rear legs
 * - Clean, timeless architectural dining chair
 */
import * as THREE from 'three';

export function createTailoredLinenDiningChair(upholsteryMaterial, woodMaterial) {
  const group = new THREE.Group();
  group.name = 'TailoredLinenDiningChair';

  const upholsteryMeshes = [];
  const woodMeshes = [];

  // Ergonomic Dimensions
  const chairW = 0.48;          // 48cm wide
  const chairD = 0.52;          // 52cm deep
  const seatH = 0.44;           // 44cm seat height
  const totalH = 0.86;          // 86cm total backrest height
  const seatThick = 0.065;      // 6.5cm seat cushion
  const backThick = 0.055;      // 5.5cm backrest cushion
  const legW = 0.040;           // 4cm square leg
  const legTap = 0.030;         // 3cm tapered bottom

  // =========================================================================
  // 1. SOLID HARDWOOD FRAME & LEGS
  // =========================================================================
  const frameGroup = new THREE.Group();
  frameGroup.name = 'ChairFrame';

  const apronH = 0.048;
  const apronThick = 0.022;
  const apronY = seatH - seatThick / 2 - apronH / 2;

  // Front Apron Rail
  const frontApron = new THREE.Mesh(
    new THREE.BoxGeometry(chairW - legW * 1.6, apronH, apronThick),
    woodMaterial
  );
  frontApron.position.set(0, apronY, chairD / 2 - legW * 0.9);
  frontApron.castShadow = true;
  frameGroup.add(frontApron);
  woodMeshes.push(frontApron);

  // Rear Apron Rail
  const rearApron = new THREE.Mesh(
    new THREE.BoxGeometry(chairW - legW * 2.2, apronH, apronThick),
    woodMaterial
  );
  rearApron.position.set(0, apronY, -chairD / 2 + legW * 1.1);
  rearApron.castShadow = true;
  frameGroup.add(rearApron);
  woodMeshes.push(rearApron);

  // Side Apron Rails
  const sideL = chairD - legW * 2;
  const sideRailGeo = new THREE.BoxGeometry(apronThick, apronH, sideL);

  const rightSideRail = new THREE.Mesh(sideRailGeo, woodMaterial);
  rightSideRail.position.set(chairW / 2 - legW * 0.9, apronY, 0);
  rightSideRail.castShadow = true;
  frameGroup.add(rightSideRail);
  woodMeshes.push(rightSideRail);

  const leftSideRail = new THREE.Mesh(sideRailGeo, woodMaterial);
  leftSideRail.position.set(-chairW / 2 + legW * 0.9, apronY, 0);
  leftSideRail.castShadow = true;
  frameGroup.add(leftSideRail);
  woodMeshes.push(leftSideRail);

  // Seat Deck
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(chairW - legW * 2, 0.012, sideL * 0.95),
    woodMaterial
  );
  deck.position.set(0, apronY + apronH / 2 - 0.006, 0);
  frameGroup.add(deck);
  woodMeshes.push(deck);

  // 1.2 Tapered Front Legs
  const frontLegH = seatH - seatThick / 2;
  const frontLegGeo = new THREE.CylinderGeometry(legW * 0.48, legTap * 0.48, frontLegH, 4);
  frontLegGeo.rotateY(Math.PI / 4); // square section

  const frontRightLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  frontRightLeg.position.set(chairW / 2 - legW * 0.9, frontLegH / 2, chairD / 2 - legW * 0.9);
  frontRightLeg.castShadow = true;
  frontRightLeg.receiveShadow = true;
  frameGroup.add(frontRightLeg);
  woodMeshes.push(frontRightLeg);

  const frontLeftLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
  frontLeftLeg.position.set(-chairW / 2 + legW * 0.9, frontLegH / 2, chairD / 2 - legW * 0.9);
  frontLeftLeg.castShadow = true;
  frontLeftLeg.receiveShadow = true;
  frameGroup.add(frontLeftLeg);
  woodMeshes.push(frontLeftLeg);

  // 1.3 Raked Rear Legs (Angle backward ~7° for authentic stance)
  const rearLegH = seatH - seatThick / 2 + 0.02;
  const rearLegGeo = new THREE.CylinderGeometry(legW * 0.48, legTap * 0.48, rearLegH, 4);
  rearLegGeo.rotateY(Math.PI / 4);

  const rearRightLeg = new THREE.Mesh(rearLegGeo, woodMaterial);
  rearRightLeg.position.set(chairW / 2 - legW * 1.1, rearLegH / 2 - 0.01, -chairD / 2 + legW * 0.9);
  rearRightLeg.rotation.x = -0.11; // backward rake
  rearRightLeg.castShadow = true;
  rearRightLeg.receiveShadow = true;
  frameGroup.add(rearRightLeg);
  woodMeshes.push(rearRightLeg);

  const rearLeftLeg = new THREE.Mesh(rearLegGeo, woodMaterial);
  rearLeftLeg.position.set(-chairW / 2 + legW * 1.1, rearLegH / 2 - 0.01, -chairD / 2 + legW * 0.9);
  rearLeftLeg.rotation.x = -0.11; // backward rake
  rearLeftLeg.castShadow = true;
  rearLeftLeg.receiveShadow = true;
  frameGroup.add(rearLeftLeg);
  woodMeshes.push(rearLeftLeg);

  group.add(frameGroup);

  // =========================================================================
  // 2. TAILORED UPHOLSTERED SEAT CUSHION
  // =========================================================================
  const seatGroup = new THREE.Group();
  seatGroup.name = 'SeatCushion';
  seatGroup.position.set(0, seatH, 0.01);

  const sW = chairW - 0.015;
  const sD = chairD - 0.02;
  const sCornerR = 0.035;

  const seatShape = new THREE.Shape();
  seatShape.moveTo(-sW / 2 + sCornerR, -sD / 2);
  seatShape.lineTo(sW / 2 - sCornerR, -sD / 2);
  seatShape.quadraticCurveTo(sW / 2, -sD / 2, sW / 2, -sD / 2 + sCornerR);
  seatShape.lineTo(sW / 2, sD / 2 - sCornerR);
  seatShape.quadraticCurveTo(sW / 2, sD / 2, sW / 2 - sCornerR, sD / 2);
  seatShape.lineTo(-sW / 2 + sCornerR, sD / 2);
  seatShape.quadraticCurveTo(-sW / 2, sD / 2, -sW / 2, sD / 2 - sCornerR);
  seatShape.lineTo(-sW / 2, -sD / 2 + sCornerR);
  seatShape.quadraticCurveTo(-sW / 2, -sD / 2, -sW / 2 + sCornerR, -sD / 2);

  const seatExtrude = {
    steps: 2,
    depth: seatThick,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 4,
  };

  const seatGeo = new THREE.ExtrudeGeometry(seatShape, seatExtrude);
  seatGeo.rotateX(Math.PI / 2);
  seatGeo.computeVertexNormals();

  const seatMesh = new THREE.Mesh(seatGeo, upholsteryMaterial);
  seatMesh.position.set(0, seatThick / 2, 0);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  seatGroup.add(seatMesh);
  upholsteryMeshes.push(seatMesh);

  group.add(seatGroup);

  // =========================================================================
  // 3. TAILORED UPHOLSTERED BACKREST WITH BACKWARD RAKE
  // =========================================================================
  const backGroup = new THREE.Group();
  backGroup.name = 'UpholsteredBackrest';

  const backH = totalH - seatH; // ~0.42m tall backrest
  const backW = chairW - 0.04;  // ~0.44m wide
  const backCornerR = 0.04;

  const backShape = new THREE.Shape();
  backShape.moveTo(-backW / 2, -backH / 2);
  backShape.lineTo(backW / 2, -backH / 2);
  backShape.lineTo(backW / 2, backH / 2 - backCornerR);
  backShape.quadraticCurveTo(backW / 2, backH / 2, backW / 2 - backCornerR, backH / 2);
  backShape.lineTo(-backW / 2 + backCornerR, backH / 2);
  backShape.quadraticCurveTo(-backW / 2, backH / 2, -backW / 2, backH / 2 - backCornerR);
  backShape.lineTo(-backW / 2, -backH / 2);

  const backExtrude = {
    steps: 2,
    depth: backThick,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 4,
  };

  const backGeo = new THREE.ExtrudeGeometry(backShape, backExtrude);
  backGeo.computeVertexNormals();

  const backMesh = new THREE.Mesh(backGeo, upholsteryMaterial);
  backMesh.position.set(0, 0, -backThick / 2);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  backGroup.add(backMesh);
  upholsteryMeshes.push(backMesh);

  // Position and tilt backrest backward ~8°
  const backY = seatH + backH / 2 - 0.02;
  const backZ = -chairD / 2 + 0.04;
  backGroup.position.set(0, backY, backZ);
  backGroup.rotation.x = -0.13; // backward rake

  group.add(backGroup);

  return {
    group,
    seatGroup,
    backGroup,
    upholsteryMeshes,
    woodMeshes,
  };
}
