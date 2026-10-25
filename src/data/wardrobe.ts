export interface LookItem {
  id: string;
  name: string;
  designer: string;
  occasion: 'fest' | 'concert' | 'farewell' | 'freshers' | 'afterdark';
  occasionLabel: string;
  retailPrice: number;
  rentalBasePrice: number;
  image: string;
  silhouette: string;
  fabric: string;
  details: string;
  sizes: string[];
  stylingTips: string;
  tag: string;
}

export const WARDROBE_COLLECTION: LookItem[] = [
  {
    id: 'look-01',
    name: 'Liquid Obsidian Sculpted Slip',
    designer: 'Atelier Noir Archives',
    occasion: 'farewell',
    occasionLabel: 'Farewell Gala & Black Tie',
    retailPrice: 34000,
    rentalBasePrice: 2499,
    image: '/assets/editorial/christian-dior-evening-gown-called-zemire-fall.jpg',
    silhouette: 'Architectural peplum with structured hourglass waist and flare train',
    fabric: 'Heavyweight matte silk faille & woven horsehair hem',
    details: 'Concealed corset boning, micro-hook rear closure, fluid floor sweep.',
    sizes: ['XS', 'S', 'M', 'L'],
    stylingTips: 'Pair with sculptural chrome cuffs and slicked-back high ponytail. Built for ballroom lighting.',
    tag: 'MOST REQUESTED FAREWELL LOOK'
  },
  {
    id: 'look-02',
    name: 'Couture Pleated Duet Gown',
    designer: 'Draped Modernity',
    occasion: 'freshers',
    occasionLabel: 'Freshers Debut & Society Ball',
    retailPrice: 42000,
    rentalBasePrice: 2899,
    image: '/assets/editorial/two-jean-desses-evening-gowns-1951.jpg',
    silhouette: 'Classical micro-pleated asymmetric Grecian wrap with draped shoulder trail',
    fabric: '100% Pure silk chiffon & weighted georgette lining',
    details: 'Hand-tucked bodice pleating, floating drape wing, invisible side zipper.',
    sizes: ['S', 'M', 'L'],
    stylingTips: 'Minimalist metallic kitten heels and dewy skin. Movement looks breathtaking on dancefloor flash.',
    tag: 'EDITORIAL EXCLUSIVE'
  },
  {
    id: 'look-03',
    name: 'Asymmetrical High-Voltage Column',
    designer: 'Vanguard Runway Archive',
    occasion: 'fest',
    occasionLabel: 'College Fest Star Night',
    retailPrice: 28000,
    rentalBasePrice: 1999,
    image: '/assets/editorial/robe-longue-1983-12-1-1.jpg',
    silhouette: 'Floor-length bias-cut column with sculpted graphic shoulder statement',
    fabric: 'Liquid crepe with metallic fiber weave',
    details: 'High slit with reinforced bar-tack, interior waist stay ribbon, fluid bias drape.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stylingTips: 'Chunky lug-sole boots or silver platforms. Cut to move through mosh pits and stage crowds.',
    tag: 'STAGE & HEADLINER'
  },
  {
    id: 'look-04',
    name: 'Corseted Structural Bell Ballgown',
    designer: 'Heritage Haute Line',
    occasion: 'farewell',
    occasionLabel: 'Department Farewell Night',
    retailPrice: 48000,
    rentalBasePrice: 3299,
    image: '/assets/editorial/strapless-evening-dresses-with-hoop-skirt-rear.jpg',
    silhouette: 'Strapless basque waist with dramatic rear lacing and full architectural bell',
    fabric: 'Lustrous duchess satin with structured tulle petticoat layer',
    details: 'Traditional rear grommet eyelet lacing, padded inner bustier, reinforced hoop perimeter.',
    sizes: ['S', 'M', 'L'],
    stylingTips: 'Chandelier earrings and bare décolletage. When your graduating class needs an unforgettable exit.',
    tag: 'MAXIMUM DRAMA'
  },
  {
    id: 'look-05',
    name: 'Graphic Kinetic Shift & Wrap',
    designer: 'Barcelona Runway Lab',
    occasion: 'concert',
    occasionLabel: 'Concert & Music Festival',
    retailPrice: 22000,
    rentalBasePrice: 1699,
    image: '/assets/editorial/custo-barcelona-at-the-brandery-summer-edition.jpg',
    silhouette: 'Micro-mini graphic shift with layered contrasting metallic print panels',
    fabric: 'Technical stretch jacquard & engineered lurex knit',
    details: 'Unlined hyper-breathable body, contrast piped binding, athletic raglan cut.',
    sizes: ['XS', 'S', 'M', 'L'],
    stylingTips: 'Knee-high leather boots, mini metallic bag, and winged eyeliner. Sweat-proof, rave-ready.',
    tag: 'FESTIVAL READY'
  },
  {
    id: 'look-06',
    name: 'Gilded Metallic Brocade Robe',
    designer: 'Imperial Archive Atelier',
    occasion: 'afterdark',
    occasionLabel: 'Theme Formal & Imperial Gala',
    retailPrice: 65000,
    rentalBasePrice: 3899,
    image: '/assets/editorial/court-dress.jpg',
    silhouette: 'Expansive wide-pannier court silhouette with sculpted metallic stomacher',
    fabric: 'Heavy metallic gold thread woven on pure silk damask ground',
    details: 'Laced inner corset, hand-loomed gold brocade florets, scalloped lace sleeve cuffs.',
    sizes: ['XS', 'S', 'M'],
    stylingTips: 'Sculptural brass jewelry and micro sunglasses. High-fashion royal avant-garde.',
    tag: 'RARE ARCHIVE COLLECTIBLE'
  }
];

export const OCCASIONS = [
  { id: 'all', label: 'All Curations', count: 6 },
  { id: 'fest', label: 'College Fests', count: 1 },
  { id: 'concert', label: 'Concerts & Raves', count: 1 },
  { id: 'farewell', label: 'Farewells & Galas', count: 2 },
  { id: 'freshers', label: 'Freshers & Society', count: 1 },
  { id: 'afterdark', label: 'After-Dark Theme', count: 1 }
];

export const CAMPUS_PERKS = [
  {
    title: 'Free Backup Size Included',
    description: 'Every rental includes a second size of your choice at ₹0 so fit is 100% guaranteed on event day.'
  },
  {
    title: 'Zero-Worry Damage Shield',
    description: 'Accidental beverage spills, broken zippers, and hem tears are fully covered. Dance freely.'
  },
  {
    title: 'Doorstep Campus Delivery',
    description: 'Delivered to your hostel gate, PG, or home 24 hours prior to call time. Return unwashed.'
  }
];
