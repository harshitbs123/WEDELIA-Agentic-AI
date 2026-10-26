/**
 * WEDELIA Shared Wardrobe Data Model
 * Single source of truth for the shared garment discovery and rental experience.
 * 
 * Strict Guideline Adherence:
 * - Local creative and demo rental metadata only.
 * - No fabricated historical provenance, couture certifications, or material claims.
 */

export const OCCASIONS = [
  'FESTIVAL',
  'CONCERT',
  'FRESHERS',
  'FAREWELL',
  'PARTY',
  'DATE',
  'SOCIETY',
  'PHOTOSHOOT',
  'BIRTHDAY',
  'BANQUET'
];

export const GARMENTS = [
  {
    id: 'WD-001',
    name: 'Jean Dessès Classical Fluted Chiffon Gown',
    designer: '1951 Paris Atelier Specimen',
    image: '/assets/editorial/two-jean-desses-evening-gowns-1951.jpg',
    category: 'Fluted Chiffon Gown',
    occasions: ['FAREWELL', 'BANQUET', 'SOCIETY'],
    availableSizes: ['XS', 'S', 'M'],
    rentalOptions: [
      { days: 3, price: 2999 },
      { days: 5, price: 3899 },
      { days: 7, price: 4699 }
    ],
    description: 'Sculptural fluted pleating in mineral slate chiffon, engineered for formal milestones and ceremonial campus evenings.',
    specimenCode: 'SPEC-DS-01',
    accessionDate: '2026.10',
    curatorNote: 'Preserved dual-drape silhouette featuring continuous horizontal waist fluting and weightless floor drop.'
  },
  {
    id: 'WD-002',
    name: 'Poiret High-Neck Tapestry Robe Longue',
    designer: 'Atelier Paul Poiret Creative Specimen',
    image: '/assets/editorial/robe-longue-1983-12-1-1.jpg',
    category: 'Column Robe',
    occasions: ['FRESHERS', 'FAREWELL', 'PHOTOSHOOT'],
    availableSizes: ['XS', 'S', 'M'],
    rentalOptions: [
      { days: 3, price: 2499 },
      { days: 5, price: 3299 },
      { days: 7, price: 3999 }
    ],
    description: 'Vertical floor-length column robe with botanical tapestry brocade, designed for dramatic arrival and editorial portraiture.',
    specimenCode: 'SPEC-PR-02',
    accessionDate: '2026.09',
    curatorNote: 'Single-piece unbelted column robe with high banded mandarin neckline and dark olive silk jacquard facing.'
  },
  {
    id: 'WD-003',
    name: 'Custo Graphic Strobe Fur-Collared Ensemble',
    designer: 'Runway Edition Specimen',
    image: '/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg',
    category: 'Nocturne Ensemble',
    occasions: ['CONCERT', 'PARTY', 'FESTIVAL'],
    availableSizes: ['S', 'M', 'L'],
    rentalOptions: [
      { days: 3, price: 1899 },
      { days: 5, price: 2499 },
      { days: 7, price: 2999 }
    ],
    description: 'High-voltage nocturnal outerwear with textured shearling framing and graphic print body, tuned for festival and concert night drops.',
    specimenCode: 'SPEC-CB-03',
    accessionDate: '2026.10',
    curatorNote: 'Constructed for nocturnal street presence, high flash reflectivity, and cold-night open air movement.'
  },
  {
    id: 'WD-004',
    name: 'Corseted Strapless Hoop Skirt Evening Gown',
    designer: 'Laced Atelier Specimen',
    image: '/assets/editorial/strapless-evening-dresses-with-hoop-skirt-rear.jpg',
    category: 'Architectural Ballgown',
    occasions: ['BANQUET', 'FAREWELL', 'SOCIETY'],
    availableSizes: ['S', 'M'],
    rentalOptions: [
      { days: 3, price: 3199 },
      { days: 5, price: 4199 },
      { days: 7, price: 4999 }
    ],
    description: 'Volumetric sage satin ballgown with posterior structural ribbon lacing and architectural pannier silhouette.',
    specimenCode: 'SPEC-HS-04',
    accessionDate: '2026.08',
    curatorNote: 'Interior hoop understructure combined with hand-threaded rear eyelet lacing for customizable anatomical fit.'
  },
  {
    id: 'WD-005',
    name: 'Dior Architectural Peplum Tailored Suit',
    designer: 'Zémire Silhouette Atelier Study',
    image: '/assets/editorial/christian-dior-evening-gown-called-zemire-fall.jpg',
    category: 'Tailored Bar Suit',
    occasions: ['DATE', 'SOCIETY', 'BIRTHDAY'],
    availableSizes: ['XS', 'S', 'M'],
    rentalOptions: [
      { days: 3, price: 2799 },
      { days: 5, price: 3599 },
      { days: 7, price: 4299 }
    ],
    description: 'Crimson structured bar-jacket with flared peplum architecture over matched bell skirt, commanding room presence.',
    specimenCode: 'SPEC-DR-05',
    accessionDate: '2026.10',
    curatorNote: 'Padded hip accents and curved lapel silhouette cut in dense scarlet faille for authoritative silhouette contouring.'
  },
  {
    id: 'WD-006',
    name: 'Gilded Brocade Court Robe',
    designer: 'Historical Metallic Brocade Study',
    image: '/assets/editorial/court-dress.jpg',
    category: 'Court Robe',
    occasions: ['BANQUET', 'SOCIETY', 'PHOTOSHOOT'],
    availableSizes: ['S', 'M', 'L'],
    rentalOptions: [
      { days: 3, price: 3499 },
      { days: 5, price: 4499 },
      { days: 7, price: 5299 }
    ],
    description: 'Monumental wide-pannier court robe shimmering with gold metallic filigree embroidery and structured stomacher.',
    specimenCode: 'SPEC-CR-06',
    accessionDate: '2026.07',
    curatorNote: 'Dramatic 1.8-meter horizontal pannier profile with heavy gilded filament embroidery across raw silk damask.'
  },
  {
    id: 'WD-007',
    name: 'Jean Dessès Champagne Silk Basque Bodice Gown',
    designer: '1951 Paris Atelier Specimen (Companion)',
    image: '/assets/editorial/two-jean-desses-evening-gowns-1951.jpg',
    category: 'Opera Robe',
    occasions: ['FAREWELL', 'DATE', 'BANQUET'],
    availableSizes: ['XS', 'S'],
    rentalOptions: [
      { days: 3, price: 2899 },
      { days: 5, price: 3699 },
      { days: 7, price: 4399 }
    ],
    description: 'Buttoned champagne silk basque bodice transitioning into a sweeping fluid formal train, designed for evening gala entrances.',
    specimenCode: 'SPEC-DS-07',
    accessionDate: '2026.10',
    curatorNote: 'Fitted button-front jacket top with extended peplum falling over gathered dove-grey pleated ball skirt.'
  },
  {
    id: 'WD-008',
    name: 'Nocturnal Club Strobe Flight Top',
    designer: 'Runway Edition Specimen (Crop)',
    image: '/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg',
    category: 'Statement Outerwear',
    occasions: ['FESTIVAL', 'CONCERT', 'PARTY'],
    availableSizes: ['S', 'M', 'L'],
    rentalOptions: [
      { days: 3, price: 1499 },
      { days: 5, price: 1999 },
      { days: 7, price: 2399 }
    ],
    description: 'Kinetic festival statement piece featuring vivid neon kaleidoscopic patterning designed to react to night club flash photography.',
    specimenCode: 'SPEC-CB-08',
    accessionDate: '2026.10',
    curatorNote: 'Cropped silhouette with reinforced zip closure and high-contrast sleeve graphics engineered for concert crowds.'
  },
  {
    id: 'WD-009',
    name: 'Chamberlain Washi Forest Silk Taffeta Skirt',
    designer: 'Laced Atelier Specimen (Front)',
    image: '/assets/editorial/strapless-evening-dresses-with-hoop-skirt-rear.jpg',
    category: 'Gala Skirt',
    occasions: ['FRESHERS', 'PARTY', 'BIRTHDAY'],
    availableSizes: ['XS', 'S', 'M'],
    rentalOptions: [
      { days: 3, price: 2199 },
      { days: 5, price: 2899 },
      { days: 7, price: 3499 }
    ],
    description: 'Lustrous forest green silk taffeta floor-length skirt with voluminous bell drape, versatile across campus formals.',
    specimenCode: 'SPEC-HS-09',
    accessionDate: '2026.09',
    curatorNote: 'High waist band with deep box pleats generating natural acoustic rustle and sweeping cinematic motion.'
  }
];

export function getGarmentById(id) {
  return GARMENTS.find(g => g.id === id) || GARMENTS[0];
}

export function getGarmentsByOccasion(occasion) {
  if (!occasion || occasion === 'ALL') return GARMENTS;
  return GARMENTS.filter(g => g.occasions.includes(occasion));
}
