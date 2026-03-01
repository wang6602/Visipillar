/**
 * Mock API response — simulates the AI identification engine.
 *
 * Each entry represents a candidate part match returned by the
 * visual recognition + parts-database cross-reference pipeline.
 */

const MOCK_RESULTS = [
  {
    id: '1',
    partName: 'High-Pressure Hydraulic Hose',
    partNumber: 'CAT-98765',
    compatibleModel: 'Wheel Loader 950 GC',
    category: 'Hydraulics',
    fitmentCertainty: 92,
    description:
      'Reinforced 4-wire spiral hose rated to 6,000 PSI. Common failure point on 950 GC loaders operating in high-ambient-temperature environments.',
  },
  {
    id: '2',
    partName: 'Hydraulic Cylinder Seal Kit',
    partNumber: 'CAT-22410',
    compatibleModel: 'Wheel Loader 950 GC',
    category: 'Seals & O-Rings',
    fitmentCertainty: 78,
    description:
      'Complete polyurethane seal kit for the boom lift cylinder. Includes rod seal, piston seal, wiper, and buffer ring.',
  },
  {
    id: '3',
    partName: 'Quick-Connect Coupler (Flat Face)',
    partNumber: 'CAT-31087',
    compatibleModel: 'Excavator 320 GC',
    category: 'Couplers & Fittings',
    fitmentCertainty: 65,
    description:
      '1/2" flat-face coupler designed for zero-spillage disconnect. Commonly used on auxiliary hydraulic circuits.',
  },
  {
    id: '4',
    partName: 'Hose Clamp — Heavy Duty',
    partNumber: 'CAT-44921',
    compatibleModel: 'Bulldozer D6',
    category: 'Clamps & Fasteners',
    fitmentCertainty: 41,
    description:
      'Stainless-steel T-bolt clamp, 2.5" to 3" range. Used to secure coolant and low-pressure hydraulic hoses.',
  },
  {
    id: '5',
    partName: 'Pressure Relief Valve',
    partNumber: 'CAT-55038',
    compatibleModel: 'Motor Grader 140 GC',
    category: 'Valves',
    fitmentCertainty: 27,
    description:
      'Pilot-operated relief valve, factory set at 3,500 PSI. Protects the main hydraulic circuit from over-pressurization.',
  },
];

export default MOCK_RESULTS;
