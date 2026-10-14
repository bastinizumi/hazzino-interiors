/**
 * HAZZINO INTERIORS — ARCHITECTURAL 3D FURNITURE LABORATORY DATA
 * Master specification for the 10-product custom furniture collection:
 *
 * SEATING:
 * 01 — THE HAZZINO LOUNGE CHAIR (Approved mid-century sculpted walnut & bouclé armchair)
 * 07 — THE HAZZINO DINING CHAIR (Upholstered curved backrest & tapered solid wood legs)
 *
 * STORAGE:
 * 02 — THE HAZZINO ARCHIVE CABINET (Low architectural credenza with fluted doors & drawers)
 * 03 — THE HAZZINO GRAND WARDROBE (Floor-to-ceiling 4-door wardrobe with luxury interior storage)
 * 04 — THE HAZZINO MODULAR CUPBOARD (Medium-height open display & closed drawer storage)
 *
 * DINING:
 * 05 — THE HAZZINO TEA TABLE (Sculptural pebble stone top on asymmetric pedestal base)
 * 06 — THE HAZZINO SIGNATURE DINING TABLE (Architectural stone/timber top on fluted dual pedestals)
 *
 * BEDROOM:
 * 08 — THE HAZZINO STORAGE BED (King bed with upholstered headboard & left/right/front drawers)
 * 10 — THE HAZZINO NIGHT CONSOLE (Compact pill-curved bedside console with upper drawer)
 *
 * WORKSPACE:
 * 09 — THE HAZZINO ARCHITECT WRITING DESK (Executive desk with integrated drawer & cable management)
 */

export const LAB_OBJECTS = [
  // ---------------------------------------------------------------------------
  // 01 — LOUNGE CHAIR (SEATING)
  // ---------------------------------------------------------------------------
  {
    id: 'chair',
    num: '01',
    category: 'SEATING',
    name: 'HAZZINO LOUNGE CHAIR',
    subtitle: 'LOUNGE COLLECTION',
    tagline: 'Hand-sculpted continuous organic walnut armrests embracing channel-tufted bouclé cushions.',
    dimensions: 'W 78 × D 82 × H 84 CM',
    dimensionsMM: { w: 780, d: 820, h: 840 },
    defaultMaterial: 'fabric',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['fabric', 'leather', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [1.6, 0.85, 3.4], target: [0, 0.42, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT JOINERY',
    },
    specs: [
      { label: 'FRAME', value: 'Solid American Black Walnut with Mortise-and-Tenon Rails' },
      { label: 'UPHOLSTERY', value: 'Tactile Wool Bouclé over Multi-Density Natural Latex' },
      { label: 'ARMREST', value: 'Continuous CNC-Shaped Sculptural Ergonomic Arc' },
      { label: 'JOINERY', value: 'Exposed Hand-Chiseled Dowels & Soft Beveled Edges' },
    ],
    hotspots: [
      { id: 'armrest', label: 'SCULPTED ARMREST', text: 'INSPECT JOINERY', pos: [0.44, 0.42, 0.1] },
      { id: 'cushion', label: 'CHANNEL TUFT', text: 'VIEW MATERIAL', pos: [0, 0.65, -0.15] },
      { id: 'seat', label: 'BOUCLÉ SEAT', text: 'VIEW TEXTURE', pos: [0, 0.38, 0.12] },
      { id: 'legs', label: 'WALNUT STRETCHER', text: 'VIEW FRAME', pos: [-0.38, 0.12, 0.2] },
    ],
    explodeParts: [
      { id: 'backrest', label: 'CHANNEL BACKREST', dir: [0, 0.5, -0.7] },
      { id: 'seat', label: 'TAILORED SEAT CUSHION', dir: [0, 0.6, 0.3] },
      { id: 'armrests', label: 'SCULPTED WALNUT ARMS', dir: [0, 0.25, 0] },
      { id: 'base', label: 'JOINERY LEGS & STRETCHERS', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 02 — ARCHIVE CABINET (STORAGE)
  // ---------------------------------------------------------------------------
  {
    id: 'cabinet',
    num: '02',
    category: 'STORAGE',
    name: 'HAZZINO ARCHIVE CABINET',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Quarter-sawn architectural timber case with soft-close brass pivot doors and dovetail drawers.',
    dimensions: 'W 140 × D 48 × H 86 CM',
    dimensionsMM: { w: 1400, d: 480, h: 860 },
    defaultMaterial: 'walnut_wood',
    defaultColor: 'walnut_brown',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['walnut_wood', 'natural_wood', 'marble', 'beige_stone', 'metal'],
    cameraFocus: { pos: [1.8, 0.95, 3.8], target: [0, 0.48, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN CABINET',
    },
    specs: [
      { label: 'CASEWORK', value: '45° Mitred American Walnut Slab with Solid Core' },
      { label: 'DOORS', value: 'Acoustic CNC-Fluted Timber with 110° Concealed Soft-Close Pivots' },
      { label: 'DRAWERS', value: 'Solid Cedar Dovetail Boxes on Blum Undermount Runners' },
      { label: 'HARDWARE', value: 'Integrated Brushed Champagne Brass Edge Pulls' },
    ],
    hotspots: [
      { id: 'door_left', label: 'FLUTED PIVOT DOOR', text: 'OPEN DOOR', pos: [-0.48, 0.55, 0.25] },
      { id: 'door_right', label: 'FLUTED PIVOT DOOR', text: 'OPEN DOOR', pos: [0.48, 0.55, 0.25] },
      { id: 'drawer_top', label: 'CEDAR CUTLERY DRAWER', text: 'OPEN DRAWER', pos: [0, 0.65, 0.25] },
      { id: 'drawer_bottom', label: 'DEEP ACCESSORY DRAWER', text: 'OPEN DRAWER', pos: [0, 0.35, 0.25] },
      { id: 'plinth', label: 'BRASS SHADOW PLINTH', text: 'VIEW BASE', pos: [0, 0.08, 0.2] },
    ],
    explodeParts: [
      { id: 'top', label: 'MONOLITHIC TOP SLAB', dir: [0, 0.8, 0] },
      { id: 'door_l', label: 'LEFT PIVOT DOOR', dir: [-0.9, 0, 0.7] },
      { id: 'door_r', label: 'RIGHT PIVOT DOOR', dir: [0.9, 0, 0.7] },
      { id: 'drawer_1', label: 'UPPER DRAWER TIER', dir: [0, 0.3, 0.8] },
      { id: 'drawer_2', label: 'LOWER DRAWER TIER', dir: [0, -0.3, 0.8] },
      { id: 'plinth', label: 'RECESSED BASE PLINTH', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 03 — GRAND WARDROBE (STORAGE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'wardrobe',
    num: '03',
    category: 'STORAGE',
    name: 'HAZZINO GRAND WARDROBE',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Floor-to-ceiling 4-door architectural wardrobe with integrated bronze rails, suede drawers, and shoe gallery.',
    dimensions: 'W 220 × D 65 × H 255 CM',
    dimensionsMM: { w: 2200, d: 650, h: 2550 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'natural_oak',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'leather', 'metal'],
    cameraFocus: { pos: [2.0, 1.45, 5.0], target: [0, 1.25, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN WARDROBE',
    },
    specs: [
      { label: 'HEIGHT', value: '2550mm Full Floor-to-Ceiling Architectural Presence' },
      { label: 'DOORS', value: '4 × Full-Height Soft-Touch Lacquer Panels with Recessed J-Handles' },
      { label: 'INTERIOR', value: 'Smoked Oak Lining, Hanging Sections, Suede Drawers & Shoe Trays' },
      { label: 'ILLUMINATION', value: 'Integrated 2700K Vertical Diffused LED Grazers' },
    ],
    hotspots: [
      { id: 'doors', label: 'FULL-HEIGHT DOORS', text: 'OPEN WARDROBE', pos: [-0.55, 1.4, 0.35] },
      { id: 'interior_rail', label: 'BRONZE HANGER RAIL', text: 'VIEW INTERIOR', pos: [-0.55, 1.8, 0] },
      { id: 'drawers', label: 'SUEDE ACCESSORY DRAWERS', text: 'VIEW DRAWERS', pos: [0.55, 0.65, 0.1] },
      { id: 'shelves', label: 'UPPER COMPARTMENTS', text: 'VIEW STORAGE', pos: [0, 2.3, 0] },
    ],
    explodeParts: [
      { id: 'cornice', label: 'ARCHITECTURAL HEADER', dir: [0, 1.2, 0] },
      { id: 'door_1', label: 'OUTER LEFT DOOR', dir: [-1.4, 0, 0.8] },
      { id: 'door_2', label: 'INNER LEFT DOOR', dir: [-0.6, 0, 0.9] },
      { id: 'door_3', label: 'INNER RIGHT DOOR', dir: [0.6, 0, 0.9] },
      { id: 'door_4', label: 'OUTER RIGHT DOOR', dir: [1.4, 0, 0.8] },
      { id: 'interior_drawers', label: 'PULL-OUT SUEDE DRAWERS', dir: [0.5, -0.3, 1.1] },
      { id: 'shelves', label: 'ADJUSTABLE SHELVING', dir: [0, 0.3, 0.4] },
      { id: 'plinth', label: 'RECESSED SHADOW PLINTH', dir: [0, -0.7, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 04 — MODULAR CUPBOARD (STORAGE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'cupboard',
    num: '04',
    category: 'STORAGE',
    name: 'HAZZINO MODULAR CUPBOARD',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Architectural vitrine showcase & bar credenza with illuminated fluted glass and 3D acoustic slatted drawers.',
    dimensions: 'W 152 × D 48 × H 176 CM',
    dimensionsMM: { w: 1520, d: 480, h: 1760 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'forest_green',
    defaultFinish: 'matte',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'metal', 'marble'],
    cameraFocus: { pos: [2.0, 1.25, 4.0], target: [0, 0.88, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN DOORS & DRAWERS',
    },
    specs: [
      { label: 'SHOWCASE', value: 'Illuminated Fluted Glass Vitrine with Concealed LED Downlight Strips' },
      { label: 'CREDENZA', value: '3D Fluted Acoustic Slatted Storage Base with Satin Brass Pulls' },
      { label: 'COUNTERTOP', value: 'Honed Calacatta Gold Marble Inset Shelf Slab with Beveled Reveal' },
      { label: 'BASE', value: 'Architectural Trestle Chassis with Turned Champagne Brass Stiletto Ferrules' },
    ],
    hotspots: [
      { id: 'glass_doors', label: 'FLUTED GLASS VITRINE', text: 'VIEW SHOWCASE', pos: [0, 1.35, 0.26] },
      { id: 'interior_shelf', label: 'ILLUMINATED DISPLAY', text: 'VIEW LIGHTING', pos: [0, 1.15, 0.0] },
      { id: 'countertop', label: 'MARBLE COUNTERTOP', text: 'VIEW MARBLE', pos: [0, 0.78, 0.24] },
      { id: 'fluted_drawers', label: 'FLUTED DRAWERS', text: 'OPEN DRAWERS', pos: [0, 0.45, 0.26] },
    ],
    explodeParts: [
      { id: 'top_crown', label: 'CHAMFERED TOP CROWN', dir: [0, 0.85, 0] },
      { id: 'glass_doors', label: 'TWIN FLUTED GLASS DOORS', dir: [0, 0.2, 0.8] },
      { id: 'marble_shelf', label: 'CALACATTA MARBLE SLAB', dir: [0, 0.4, 0] },
      { id: 'fluted_drawers', label: 'FLUTED SLIDING DRAWERS', dir: [0, -0.3, 0.85] },
      { id: 'trestle_base', label: 'BRONZE TRESTLE BASE', dir: [0, -0.65, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 05 — TEA TABLE (DINING / LIVING) — SCANDINAVIAN MULTI-TIER COFFEE TABLE
  // ---------------------------------------------------------------------------
  {
    id: 'tea_table',
    num: '05',
    category: 'DINING',
    name: 'HAZZINO SCANDINAVIAN TEA TABLE',
    subtitle: 'OCCASIONAL COLLECTION',
    tagline: 'Dual-tier Scandinavian tea table with floating top, hinged cupboard, open center niche, sliding drawer, and splayed oak legs.',
    dimensions: 'W 122 × D 62 × H 45 CM',
    dimensionsMM: { w: 1220, d: 620, h: 450 },
    defaultMaterial: 'white_stone',
    defaultColor: 'pure_white',
    defaultFinish: 'satin',
    defaultWood: 'natural_oak',
    supportedMaterials: ['white_stone', 'natural_wood', 'walnut_wood', 'marble', 'beige_stone'],
    cameraFocus: { pos: [2.15, 1.25, 3.85], target: [0, 0.25, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN STORAGE',
    },
    specs: [
      { label: 'TABLETOP', value: 'Floating Rectangular Slab with Soft Radius Corner Fillets & Overhang' },
      { label: 'STORAGE', value: 'Left Hinged Cupboard + Center Open Display Cubby + Right Pull-Out Drawer' },
      { label: 'HANDLES', value: 'Organic Curved Solid Oak Arched Pull Handles' },
      { label: 'LEGS', value: '4 Tapered Splayed Solid Oak Stiletto Legs with Brass Glide Collars' },
    ],
    hotspots: [
      { id: 'top_slab', label: 'FLOATING TABLETOP', text: 'VIEW RADIUS CORNERS', pos: [0, 0.46, 0] },
      { id: 'cabinet', label: 'HINGED CUPBOARD', text: 'INSPECT DOOR', pos: [-0.38, 0.30, 0.28] },
      { id: 'drawer', label: 'STORAGE DRAWER', text: 'INSPECT DRAWER', pos: [0.34, 0.23, 0.28] },
      { id: 'splayed_legs', label: 'SPLAYED SCANDI LEGS', text: 'VIEW RAKE ANGLE', pos: [0.48, 0.07, 0.22] },
    ],
    explodeParts: [
      { id: 'top_slab', label: 'FLOATING TABLETOP SLAB', dir: [0, 0.85, 0] },
      { id: 'door', label: 'HINGED CUPBOARD DOOR', dir: [-0.4, 0.1, 0.6] },
      { id: 'drawer', label: 'STORAGE DRAWER', dir: [0, 0, 0.7] },
      { id: 'accessories', label: 'TABLETOP ACCESSORIES', dir: [0, 0.95, 0] },
      { id: 'deck_legs', label: 'BOTTOM CHASSIS & SPLAYED LEGS', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 06 — SIGNATURE DINING TABLE (DINING) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'dining_table',
    num: '06',
    category: 'DINING',
    name: 'HAZZINO SIGNATURE DINING SUITE',
    subtitle: 'DINING COLLECTION',
    tagline: 'Solid sheesham timber dining table with hand-carved open jali lattice apron, paired with 6 matching lattice-back upholstered dining chairs.',
    dimensions: 'TABLE: W 230 × D 110 CM | 6 SEATER SUITE',
    dimensionsMM: { w: 2300, d: 1100, h: 760 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'warm_honey',
    defaultFinish: 'natural',
    defaultWood: 'natural_wood',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'white_stone', 'marble'],
    cameraFocus: { pos: [2.9, 1.45, 4.2], target: [0, 0.44, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT TABLE',
    },
    specs: [
      { label: 'TABLETOP', value: 'Solid Sheesham Timber Slab with Softly Chamfered Rounded Corners' },
      { label: 'APRON FRIEZE', value: 'Hand-Carved Openwork Diamond Jali Lattice Apron Frame' },
      { label: 'CHAIRS', value: '6 Matching Solid Wood Dining Chairs with Diamond Jali Backrest & Tailored Cream Linen Cushions' },
      { label: 'LEGS & JOINERY', value: '4 Tapered Square Solid Hardwood Legs with Mortise & Tenon Joinery' },
    ],
    hotspots: [
      { id: 'top', label: 'SOLID TIMBER TOP', text: 'VIEW SLAB', pos: [0, 0.78, 0] },
      { id: 'lattice_apron', label: 'CARVED JALI APRON', text: 'VIEW FRETWORK', pos: [0, 0.68, 0.55] },
      { id: 'corner_legs', label: 'TAPERED HARDWOOD LEGS', text: 'VIEW STANCE', pos: [1.02, 0.35, 0.48] },
      { id: 'chairs', label: 'MATCHING LATTICE CHAIRS', text: 'VIEW CHAIRS', pos: [0, 0.48, 0.86] },
    ],
    explodeParts: [
      { id: 'top_slab', label: 'SOLID TIMBER TABLETOP', dir: [0, 0.75, 0] },
      { id: 'lattice_apron', label: 'CARVED JALI APRON FRIEZE', dir: [0, 0.35, 0] },
      { id: 'corner_legs', label: '4 TAPERED CORNER LEGS', dir: [0.8, -0.2, 0] },
      { id: 'chairs', label: 'SURROUNDING LATTICE CHAIRS', dir: [0, 0, 0.65] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 07 — DINING CHAIR (SEATING) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'dining_chair',
    num: '07',
    category: 'SEATING',
    name: 'HAZZINO ROUND MARBLE DINING SET',
    subtitle: 'DINING COLLECTION',
    tagline: 'Round honed Calacatta marble dining table with trilateral architectural timber wing pedestals, paired with tailored textured oatmeal linen dining chairs.',
    dimensions: 'TABLE: Ø 142 × H 75 CM | CHAIR: W 48 × D 52 × H 86 CM',
    dimensionsMM: { w: 1420, d: 1420, h: 860 },
    defaultMaterial: 'fabric',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'walnut_wood',
    supportedMaterials: ['fabric', 'leather', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [2.0, 1.25, 2.7], target: [0, 0.44, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT 360°',
    },
    specs: [
      { label: 'TABLETOP', value: 'Solid Honed Calacatta / Travertine Marble Slab with Smooth Bullnose Perimeter Edge' },
      { label: 'TABLE BASE', value: 'Trilateral Architectural Solid Timber Winged Columns Arranged in a 120° Radial Stance' },
      { label: 'CHAIR BACKREST', value: 'Fully Upholstered Ergonomic Backrest with Backward Rake & Softly Rounded Top Corners' },
      { label: 'CHAIR FRAME & LEGS', value: 'Solid Hardwood Raked Rear Stiles and Tapered Front Legs in Rich Walnut' },
    ],
    hotspots: [
      { id: 'marble_top', label: 'HONED MARBLE SLAB', text: 'VIEW CALACATTA TOP', pos: [0, 0.76, 0] },
      { id: 'timber_base', label: 'TRILATERAL TIMBER BASE', text: 'VIEW WINGED COLUMNS', pos: [0.26, 0.38, 0] },
      { id: 'linen_chair', label: 'TAILORED LINEN CHAIR', text: 'VIEW UPHOLSTERY', pos: [-0.66, 0.62, 0.62] },
      { id: 'tabletop_grapes', label: 'GRAPES ON SCALLOPED PLATTER', text: 'VIEW CENTERPIECE', pos: [0.30, 0.77, 0.16] },
    ],
    explodeParts: [
      { id: 'marble_top', label: 'HONED MARBLE SLAB', dir: [0, 0.65, 0] },
      { id: 'winged_base', label: 'TRILATERAL TIMBER BASE', dir: [0.18, 0, 0.18] },
      { id: 'linen_chairs', label: 'TAILORED DINING CHAIRS', dir: [0.48, 0, 0.48] },
      { id: 'cushions', label: 'SEAT CUSHIONS', dir: [0, 0.20, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 08 — STORAGE BED (BEDROOM) — LOW-PROFILE SUITE WITH 4 SLATTED DRAWERS
  // ---------------------------------------------------------------------------
  {
    id: 'storage_bed',
    num: '08',
    category: 'BEDROOM',
    name: 'HAZZINO STORAGE BED',
    subtitle: 'BEDROOM COLLECTION',
    tagline: 'Low-profile solid honey teak platform bed with 4 exposed slatted timber crate drawers, 10-tile grid-tufted headboard, and fluted nightstands.',
    dimensions: 'BED: W 215 × D 220 CM | SUITE: W 330 CM',
    dimensionsMM: { w: 3300, d: 2200, h: 1050 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'warm_wood',
    defaultFinish: 'matte',
    defaultWood: 'natural_oak',
    supportedMaterials: ['natural_wood', 'fabric', 'leather', 'walnut_wood'],
    cameraFocus: { pos: [2.3, 1.4, 4.4], target: [0, 0.52, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: true,
      interactLabel: 'OPEN BED STORAGE',
    },
    specs: [
      { label: 'HEADBOARD', value: '10-Tile Grid-Tufted Cream Upholstery with Vertical Slat Backing & Warm LED Cove' },
      { label: 'BEDDING', value: 'Crisp White Linens with Draped Taupe Runner & 5 Layered Designer Pillows' },
      { label: 'NIGHTSTANDS', value: 'Twin Curved Fluted Consoles with Saddle Leather Pulls & Suspended Loop Pendant' },
      { label: 'STORAGE', value: '4 Exposed Slatted Timber Crate Drawers (2 Side + 2 Foot) with Book & Linen Props' },
    ],
    hotspots: [
      { id: 'headboard', label: 'GRID HEADBOARD', text: '10-TILE TUFTED PANEL', pos: [0, 0.95, -1.05] },
      { id: 'drawer_left_f', label: 'SIDE CRATE (FRONT)', text: 'SLIDE TIMBER CRATE', pos: [-1.08, 0.18, -0.22] },
      { id: 'drawer_left_m', label: 'SIDE CRATE (MID)', text: 'SLIDE TIMBER CRATE', pos: [-1.08, 0.18, 0.44] },
      { id: 'drawer_foot_l', label: 'FOOT CRATE (LEFT)', text: 'SLIDE TIMBER CRATE', pos: [-0.48, 0.18, 1.12] },
      { id: 'drawer_foot_r', label: 'FOOT CRATE (RIGHT)', text: 'SLIDE TIMBER CRATE', pos: [0.48, 0.18, 1.12] },
      { id: 'nightstand', label: 'FLUTED NIGHTSTAND', text: 'LEATHER PULL & PENDANT', pos: [1.38, 0.42, 0.18] },
    ],
    explodeParts: [
      { id: 'headboard', label: 'GRID HEADBOARD & LED COVE', dir: [0, 0.8, -0.9] },
      { id: 'mattress', label: 'ORGANIC MATTRESS & RUNNER', dir: [0, 0.85, 0.2] },
      { id: 'drawer_l1', label: 'SIDE TIMBER CRATE 1', dir: [-1.1, 0, -0.2] },
      { id: 'drawer_l2', label: 'SIDE TIMBER CRATE 2', dir: [-1.1, 0, 0.4] },
      { id: 'drawer_f1', label: 'FOOT TIMBER CRATE 1', dir: [-0.4, 0, 1.1] },
      { id: 'drawer_f2', label: 'FOOT TIMBER CRATE 2', dir: [0.4, 0, 1.1] },
      { id: 'nightstands', label: 'TWIN FLUTED NIGHTSTANDS', dir: [1.3, 0, 0] },
      { id: 'bed_chassis', label: 'SOLID HONEY TEAK PLATFORM FRAME', dir: [0, -0.2, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 09 — ARCHITECT WRITING DESK (WORKSPACE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'writing_desk',
    num: '09',
    category: 'WORKSPACE',
    name: 'HAZZINO ARCHITECT WRITING DESK',
    subtitle: 'WORKSPACE COLLECTION',
    tagline: 'Sculptural executive workspace with raised rear gallery curb, cantilevered brass LED lamp, and 3D fluted storage drawers.',
    dimensions: 'W 168 × D 80 × H 76 CM',
    dimensionsMM: { w: 1680, d: 800, h: 760 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'walnut_brown',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'leather', 'marble', 'metal'],
    cameraFocus: { pos: [2.1, 1.3, 3.9], target: [0, 0.50, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN DRAWERS',
    },
    specs: [
      { label: 'WORKTOP', value: 'Sculpted Beveled Desktop with Raised Rear Gallery & Brass Protective Lip' },
      { label: 'DESK BLOTTER', value: 'Inlaid Full-Grain Saddle Leather Pad with Perimeter Satin Brass Reveal' },
      { label: 'LIGHTING', value: 'Cantilevered Satin Brass Arch Lamp with Concealed Warm LED Downlight' },
      { label: 'STORAGE', value: 'Center Lap Drawer + 3D Fluted Acoustic Slatted Pedestal with Cedar Lining' },
      { label: 'BASE', value: 'Tapered Stiletto Trestle Legs with Turned Champagne Brass Ferrules & Tie Rod' },
    ],
    hotspots: [
      { id: 'blotter', label: 'LEATHER BLOTTER', text: 'VIEW SADDLE INLAY', pos: [-0.14, 0.78, 0.04] },
      { id: 'lamp', label: 'CANTILEVER BRASS LAMP', text: 'VIEW LED LIGHTING', pos: [-0.64, 0.95, -0.15] },
      { id: 'drawers', label: 'FLUTED DRAWERS', text: 'SLIDE DRAWERS', pos: [0.55, 0.55, 0.32] },
      { id: 'trestle', label: 'STILETTO TRESTLE BASE', text: 'VIEW JOINERY', pos: [-0.70, 0.25, 0] },
    ],
    explodeParts: [
      { id: 'top_slab', label: 'SCULPTED DESKTOP SLAB', dir: [0, 0.65, 0] },
      { id: 'gallery_lamp', label: 'RAISED GALLERY & BRASS LAMP', dir: [0, 0.95, -0.2] },
      { id: 'lap_drawer', label: 'SLIMLINE LAP DRAWER', dir: [0, 0.25, 0.75] },
      { id: 'pedestal', label: 'FLUTED STORAGE PEDESTAL', dir: [0.65, 0, 0.35] },
      { id: 'legs_base', label: 'STILETTO TRESTLE BASE', dir: [0, -0.4, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 10 — NIGHT CONSOLE (BEDROOM) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'night_console',
    num: '10',
    category: 'BEDROOM',
    name: 'HAZZINO NIGHT CONSOLE',
    subtitle: 'BEDROOM COLLECTION',
    tagline: 'Pill-curved architectural bedside console with upper push-release drawer and open display gallery.',
    dimensions: 'W 58 × D 42 × H 52 CM',
    dimensionsMM: { w: 580, d: 420, h: 520 },
    defaultMaterial: 'walnut_wood',
    defaultColor: 'deep_walnut',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['walnut_wood', 'natural_wood', 'marble', 'beige_stone', 'metal'],
    cameraFocus: { pos: [1.3, 0.8, 2.5], target: [0, 0.32, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN DRAWER',
    },
    specs: [
      { label: 'CARCASS', value: 'Mitred Solid American Walnut with Gentle Continuous Radius Corners' },
      { label: 'DRAWER', value: 'Felt-Lined Upper Storage Tray with Concealed Touch-To-Open Runner' },
      { label: 'LOWER SHELF', value: 'Open Display Niche for Architectural Monographs & Essentials' },
      { label: 'FOOTING', value: 'Recessed 20mm Shadow Base with Brushed Brass Trim Collar' },
    ],
    hotspots: [
      { id: 'drawer', label: 'FELT-LINED DRAWER', text: 'OPEN DRAWER', pos: [0, 0.42, 0.22] },
      { id: 'open_shelf', label: 'OPEN LOWER GALLERY', text: 'VIEW SHELF', pos: [0, 0.2, 0] },
      { id: 'casing', label: 'PILL-CURVED EDGES', text: 'VIEW JOINERY', pos: [-0.28, 0.35, 0] },
      { id: 'plinth', label: 'BRASS FOOTER TRIM', text: 'VIEW BASE', pos: [0, 0.05, 0.18] },
    ],
    explodeParts: [
      { id: 'top_panel', label: 'BEVELED TOP SURFACE', dir: [0, 0.6, 0] },
      { id: 'drawer', label: 'FELT-LINED SLIDING DRAWER', dir: [0, 0.1, 0.7] },
      { id: 'shelf', label: 'LOWER DISPLAY SHELF', dir: [0, -0.2, 0.2] },
      { id: 'outer_case', label: 'PILL-CURVED BODY', dir: [0, 0, 0] },
      { id: 'plinth', label: 'BRASS SHADOW BASE', dir: [0, -0.5, 0] },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLEAR MATERIAL CLASSIFICATION (UNDERSTANDABLE CUSTOMER NAMES)
// ---------------------------------------------------------------------------
export const LAB_MATERIALS = [
  { id: 'natural_wood', name: 'Natural Wood', textureDetail: 'Quarter-sawn natural timber grain', roughness: 0.72, metalness: 0.02 },
  { id: 'walnut_wood', name: 'Walnut Wood', textureDetail: 'Deep espresso linear grain patina', roughness: 0.68, metalness: 0.02 },
  { id: 'white_stone', name: 'White Stone', textureDetail: 'Honed mineral cast matte surface', roughness: 0.82, metalness: 0.02 },
  { id: 'beige_stone', name: 'Beige Stone', textureDetail: 'Roman Navona travertine open pores', roughness: 0.88, metalness: 0.02 },
  { id: 'marble', name: 'Marble', textureDetail: 'Calacatta gold organic honed veins', roughness: 0.28, metalness: 0.04 },
  { id: 'fabric', name: 'Fabric', textureDetail: 'Tactile organic loop yarn bouclé', roughness: 0.92, metalness: 0.0 },
  { id: 'leather', name: 'Leather', textureDetail: 'Full-grain vegetable-tanned aniline', roughness: 0.38, metalness: 0.05 },
  { id: 'metal', name: 'Metal', textureDetail: 'Solid brushed champagne brass', roughness: 0.32, metalness: 0.88 },
];

export const LAB_FINISHES = [
  { id: 'matte', name: 'Matte', roughnessMod: 0.2 },
  { id: 'satin', name: 'Satin', roughnessMod: 0.0 },
  { id: 'natural', name: 'Natural', roughnessMod: 0.1 },
  { id: 'polished', name: 'Polished', roughnessMod: -0.25 },
  { id: 'brushed', name: 'Brushed', roughnessMod: -0.1 },
];

export const LAB_WOOD_TYPES = [
  { id: 'natural_oak', name: 'Natural Oak', hex: '#d4ba96' },
  { id: 'warm_walnut', name: 'Warm Walnut', hex: '#5a3826' },
  { id: 'dark_walnut', name: 'Dark Walnut', hex: '#382417' },
  { id: 'teak', name: 'Teak', hex: '#7a4f2b' },
];

export const LAB_UPHOLSTERY = [
  { id: 'cream_fabric', name: 'Cream Fabric', hex: '#ede8dd' },
  { id: 'sand_fabric', name: 'Sand Fabric', hex: '#d9cdbe' },
  { id: 'olive_fabric', name: 'Olive Fabric', hex: '#30483c' },
  { id: 'charcoal_fabric', name: 'Charcoal Fabric', hex: '#222120' },
  { id: 'warm_beige_fabric', name: 'Warm Beige Fabric', hex: '#c8bba8' },
  { id: 'cognac_leather', name: 'Cognac Leather', hex: '#8a4b2a' },
];

export const LAB_METALS = [
  { id: 'brushed_brass', name: 'Brushed Brass', hex: '#b89452' },
  { id: 'matte_black', name: 'Matte Black', hex: '#1a1918' },
  { id: 'champagne_metal', name: 'Champagne Metal', hex: '#c5a878' },
];

// ---------------------------------------------------------------------------
// 10 HAZZINO LUXURY COLOR PALETTE
// ---------------------------------------------------------------------------
export const LAB_COLORS = [
  { id: 'cloud_white', num: '01', name: 'Cloud White', hex: '#f8f8f6', threeColor: 0xf8f8f6 },
  { id: 'warm_ivory', num: '02', name: 'Warm Ivory', hex: '#ede8dd', threeColor: 0xede8dd },
  { id: 'sand_beige', num: '03', name: 'Sand Beige', hex: '#d9cdbe', threeColor: 0xd9cdbe },
  { id: 'taupe', num: '04', name: 'Taupe', hex: '#9e9282', threeColor: 0x9e9282 },
  { id: 'walnut_brown', num: '05', name: 'Walnut Brown', hex: '#5a3826', threeColor: 0x5a3826 },
  { id: 'deep_walnut', num: '06', name: 'Deep Walnut', hex: '#382417', threeColor: 0x382417 },
  { id: 'forest_green', num: '07', name: 'Forest Green', hex: '#30483c', threeColor: 0x30483c },
  { id: 'terracotta', num: '08', name: 'Terracotta', hex: '#8b4a3e', threeColor: 0x8b4a3e },
  { id: 'charcoal', num: '09', name: 'Charcoal', hex: '#222120', threeColor: 0x222120 },
  { id: 'champagne_gold', num: '10', name: 'Champagne Gold', hex: '#b89452', threeColor: 0xb89452 },
];

// ---------------------------------------------------------------------------
// CATEGORIES FOR PRODUCT NAVIGATION
// ---------------------------------------------------------------------------
export const LAB_CATEGORIES = [
  { id: 'ALL', name: 'ALL PIECES' },
  { id: 'SEATING', name: 'SEATING' },
  { id: 'STORAGE', name: 'STORAGE' },
  { id: 'DINING', name: 'DINING' },
  { id: 'BEDROOM', name: 'BEDROOM' },
  { id: 'WORKSPACE', name: 'WORKSPACE' },
];

// ---------------------------------------------------------------------------
// CINEMATIC STUDIO CAMERA PRESETS
// ---------------------------------------------------------------------------
export const CAMERA_PRESETS = [
  { id: 'hero', name: 'HERO', pos: [0, 0.85, 4.4], target: [0, 0.45, 0] },
  { id: 'front', name: 'FRONT', pos: [0, 0.6, 4.2], target: [0, 0.5, 0] },
  { id: 'side', name: 'SIDE', pos: [4.4, 0.6, 0], target: [0, 0.5, 0] },
  { id: 'back', name: 'BACK', pos: [0, 0.7, -4.4], target: [0, 0.5, 0] },
  { id: 'top', name: 'TOP', pos: [0, 5.2, 0.1], target: [0, 0, 0] },
  { id: 'detail', name: 'DETAIL', pos: [0.6, 0.7, 1.8], target: [0, 0.45, 0] },
  { id: 'exploded', name: 'EXPLODED', pos: [0.8, 1.4, 5.2], target: [0, 0.5, 0] },
];
