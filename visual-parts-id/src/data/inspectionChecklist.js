export const REPORT_DISCLAIMER =
  'For more information, please refer to the Operation and Maintenance Manual or any other applicable manuals and instructions for this product. If you have questions, please contact your local Caterpillar dealer.';

export const INSPECTION_SECTIONS = [
  {
    title: 'FROM THE GROUND',
    rows: [
      {
        id: 'overall-machine',
        inspect: 'Overall Machine',
        lookFor: 'Loose Or Missing Nuts & Bolts, Loose Guards, Cleanliness',
        keywords: ['loose', 'missing', 'nut', 'bolt', 'guard', 'dirty', 'cleanliness'],
      },
      {
        id: 'lights-ground',
        inspect: 'Lights',
        lookFor: 'Broken lamps, lenses, operation',
        keywords: ['light', 'lamp', 'lens', 'broken', 'not working'],
      },
      {
        id: 'grab-irons',
        inspect: 'Grab Irons, Steps, Handholds',
        lookFor: 'Condition And Cleanliness',
        keywords: ['step', 'handhold', 'grab', 'dirty', 'damage', 'worn'],
      },
      {
        id: 'brakes-suspension',
        inspect: 'Brakes, Suspension',
        lookFor: 'Leaks, Damage, Wear',
        keywords: ['brake', 'suspension', 'leak', 'damage', 'wear'],
      },
      {
        id: 'tires-rims',
        inspect: 'Tires, rims, hub, stem caps',
        lookFor: 'Inflation, Leaks, Damage, Wear',
        keywords: ['tire', 'rim', 'hub', 'stem', 'inflation', 'leak', 'damage', 'wear'],
      },
      {
        id: 'underneath-machine',
        inspect: 'Underneath Machine',
        lookFor: 'Leaks, Damage, People Working',
        keywords: ['under', 'leak', 'damage', 'people working'],
      },
      {
        id: 'steering-hydraulic',
        inspect: 'Steering hydraulic system',
        lookFor: 'Leaks, worn hoses, damaged lines',
        keywords: ['steering', 'hydraulic', 'leak', 'hose', 'line', 'worn', 'damage'],
      },
      {
        id: 'body',
        inspect: 'Body',
        lookFor: 'Damage, wear, distortion',
        keywords: ['body', 'damage', 'wear', 'distortion', 'dent'],
      },
      {
        id: 'fuel-hydraulic-tank',
        inspect: 'Fuel tank, hydraulic tank',
        lookFor: 'Level, Leaks',
        keywords: ['fuel tank', 'hydraulic tank', 'level', 'leak'],
      },
      {
        id: 'transmission-oil',
        inspect: 'Transmission Oil level',
        lookFor: 'Fluid level',
        keywords: ['transmission', 'oil', 'fluid level', 'low fluid'],
      },
      {
        id: 'suspension-cylinders',
        inspect: 'Suspension Cylinders',
        lookFor: 'Leaks, Measure cylinder height',
        keywords: ['suspension cylinder', 'leak', 'cylinder'],
      },
      {
        id: 'frame-hoist-cylinders',
        inspect: 'Frame & Hoist Cylinders',
        lookFor: 'Cracks, Leaks, Damage, Wear',
        keywords: ['frame', 'hoist', 'cylinder', 'crack', 'leak', 'damage', 'wear'],
      },
      {
        id: 'all-axles',
        inspect: 'All Axles',
        lookFor: 'Leaks, Damage, Wear',
        keywords: ['axle', 'leak', 'damage', 'wear'],
      },
      {
        id: 'welds-castings',
        inspect: 'Welds, castings; mounting bolts and pads',
        lookFor: 'Cracks; damaged bolts or pads',
        keywords: ['weld', 'casting', 'bolt', 'pad', 'crack', 'damage'],
      },
    ],
  },
  {
    title: 'ENGINE COMPARTMENT',
    rows: [
      {
        id: 'engine-oil',
        inspect: 'Engine Oil',
        lookFor: 'Fluid Level',
        keywords: ['engine oil', 'fluid level', 'low oil', 'oil leak'],
      },
      {
        id: 'engine-coolant',
        inspect: 'Engine Coolant',
        lookFor: 'Fluid Level',
        keywords: ['coolant', 'fluid level', 'low coolant', 'coolant leak'],
      },
      {
        id: 'all-hoses',
        inspect: 'All Hoses',
        lookFor: 'Cracks, Wear Spots, Leaks',
        keywords: ['hose', 'crack', 'wear', 'leak', 'split'],
      },
      {
        id: 'all-belts',
        inspect: 'All Belts',
        lookFor: 'Tightness, Wear, Cracks',
        keywords: ['belt', 'tightness', 'wear', 'crack', 'slip'],
      },
      {
        id: 'overall-engine-compartment',
        inspect: 'Overall Engine Compartment',
        lookFor: 'Trash Or Dirt Buildup, Leaks',
        keywords: ['engine compartment', 'trash', 'dirt', 'buildup', 'leak'],
      },
      {
        id: 'windshield-wipers',
        inspect: 'Windshield Wipers & Washers',
        lookFor: 'Wear, Damage, Fluid Level',
        keywords: ['wiper', 'washer', 'wear', 'damage', 'fluid level'],
      },
    ],
  },
  {
    title: 'ON THE MACHINE, OUTSIDE THE CAB',
    rows: [
      {
        id: 'battery-compartment',
        inspect: 'Battery Compartment',
        lookFor: 'Connections, Fluid level',
        keywords: ['battery', 'connection', 'fluid level', 'corrosion'],
      },
      {
        id: 'fire-extinguisher',
        inspect: 'Fire Extinguisher',
        lookFor: 'Charge, Damage',
        keywords: ['fire extinguisher', 'charge', 'damage', 'expired'],
      },
      {
        id: 'air-filter',
        inspect: 'Air Filter',
        lookFor: 'Restriction Indicator',
        keywords: ['air filter', 'restriction', 'clog', 'dirty filter'],
      },
    ],
  },
  {
    title: 'INSIDE THE CAB',
    rows: [
      {
        id: 'gauges-lights-switches',
        inspect: 'Gauges, lights, switches',
        lookFor: 'Damage, operation',
        keywords: ['gauge', 'light', 'switch', 'damage', 'not working'],
      },
      {
        id: 'seat',
        inspect: 'Seat',
        lookFor: 'Adjustment, Brake Travel',
        keywords: ['seat', 'adjustment', 'brake travel', 'damage'],
      },
      {
        id: 'seat-belt',
        inspect: 'Seat Belt, Buckle & Mounting',
        lookFor: 'Damage, Wear, Adjustment',
        keywords: ['seat belt', 'buckle', 'mount', 'damage', 'wear'],
      },
      {
        id: 'horn-backup-alarm',
        inspect: 'Horn, backup alarm, lights',
        lookFor: 'Proper Function',
        keywords: ['horn', 'backup alarm', 'light', 'function', 'not working'],
      },
      {
        id: 'windows-mirrors',
        inspect: 'Windows and Mirrors',
        lookFor: 'Condition, clean, adjust',
        keywords: ['window', 'mirror', 'clean', 'adjust', 'crack'],
      },
      {
        id: 'rops',
        inspect: 'ROPS',
        lookFor: 'Damage',
        keywords: ['rops', 'damage', 'crack', 'deform'],
      },
      {
        id: 'overall-cab',
        inspect: 'Overall Cab Interior',
        lookFor: 'Cleanliness',
        keywords: ['cab', 'interior', 'clean', 'cleanliness', 'dirty'],
      },
    ],
  },
];

export const ALL_INSPECTION_ROWS = INSPECTION_SECTIONS.flatMap((section) =>
  section.rows.map((row) => ({ ...row, sectionTitle: section.title })),
);
