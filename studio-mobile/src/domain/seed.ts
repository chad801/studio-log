import { StudioRecord } from "./models";

const now = new Date().toISOString();

export const seedRecords: StudioRecord[] = [
  {
    id: "inventory-speckled-stoneware",
    type: "inventory",
    title: "Speckled stoneware",
    inventoryKind: "clay",
    quantityOnHand: 42,
    unit: "lb",
    reorderPoint: 25,
    vendorName: "Local ceramic supply",
    unitCostCents: 135,
    storageLocation: "Clay shelf",
    lotNumber: "SST-0426",
    sdsNotes: "Use dust control when reclaiming or sanding dry clay.",
    notes: "Good body for mugs, bowls, and planters.",
    tags: ["clay", "cone 6"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "inventory-copper-carbonate",
    type: "inventory",
    title: "Copper carbonate",
    inventoryKind: "chemical",
    quantityOnHand: 1.7,
    unit: "lb",
    reorderPoint: 1,
    vendorName: "Ceramic Materials Co.",
    unitCostCents: 1890,
    storageLocation: "Chemical cabinet A",
    lotNumber: "CU-17",
    sdsNotes: "Wear respirator and gloves. Keep container closed.",
    notes: "Colorant for green/turquoise glazes.",
    tags: ["colorant", "safety"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "recipe-soft-ash-green",
    type: "recipe",
    title: "Soft ash green",
    recipeKind: "glaze",
    cone: "6",
    atmosphere: "oxidation",
    clayBody: "Speckled stoneware",
    batchSize: 100,
    batchUnit: "%",
    recipeVersion: 1,
    ingredients: [
      { id: "ing-1", materialName: "Feldspar", percentage: 45, unit: "%" },
      { id: "ing-2", materialName: "Whiting", percentage: 20, unit: "%" },
      { id: "ing-3", materialName: "Silica", percentage: 25, unit: "%" },
      { id: "ing-4", materialName: "Copper carbonate", percentage: 2, unit: "%" }
    ],
    defects: [],
    notes: "Satin green on speckled body. Needs a thicker second dip on vertical forms.",
    tags: ["green", "satin", "test tile"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "project-breakfast-mugs",
    type: "project",
    title: "Breakfast mug set",
    projectStage: "drying",
    clayBody: "Speckled stoneware",
    recipeIds: ["recipe-soft-ash-green"],
    dimensions: "12 oz mugs",
    tasks: [
      { id: "task-handle-cleanup", title: "Clean handle seams" },
      { id: "task-bisque", title: "Load for bisque", dueAt: now }
    ],
    notes: "Six thrown, handles attached. Track before and after glaze photos.",
    tags: ["mugs", "set"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "firing-bisque-may",
    type: "firing",
    title: "May bisque load",
    kilnName: "Skutt 1027",
    firingStatus: "planned",
    cone: "04",
    atmosphere: "electric",
    startAt: now,
    rampHoldSteps: [
      { id: "step-1", order: 1, targetTemperatureF: 180, ratePerHourF: 80, holdMinutes: 60, notes: "Candle" },
      { id: "step-2", order: 2, targetTemperatureF: 1945, ratePerHourF: 250, holdMinutes: 10, notes: "Cone 04" }
    ],
    energyCostCents: 950,
    firingCostCents: 1450,
    notes: "Leave extra room for mug set.",
    tags: ["bisque", "cone 04"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "piece-ridge-vase",
    type: "piece",
    title: "Ridge vase",
    projectStage: "finished",
    collectionName: "Spring table",
    dimensions: "8 in x 4 in",
    clayBody: "Speckled stoneware",
    recipeIds: ["recipe-soft-ash-green"],
    priceCents: 6800,
    materialCostCents: 850,
    laborMinutes: 95,
    overheadCostCents: 700,
    saleStatus: "available",
    notes: "Final gallery record seed.",
    tags: ["vase", "gallery"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "inspiration-carved-rim",
    type: "inspiration",
    title: "Carved rim reference",
    source: "Studio notebook",
    sourceUrl: "",
    notes: "Convert into a bowl project after current mug set.",
    tags: ["carving", "rim", "future"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "pricing-default-retail",
    type: "pricing",
    title: "Default retail calculator",
    materialCostCents: 0,
    laborMinutes: 0,
    overheadCostCents: 0,
    marginPercent: 55,
    notes: "Milestone 2 will turn this model into an interactive calculator.",
    tags: ["pricing"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "social-process-reel",
    type: "socialAsset",
    title: "Mug handle process reel",
    socialPlans: [
      {
        platform: "instagram",
        status: "draft",
        captionDraft: "Handle day in the studio.",
        hashtags: ["pottery", "ceramics", "handmade"]
      }
    ],
    captionDraft: "Handle day in the studio.",
    hashtags: ["pottery", "ceramics", "handmade"],
    notes: "Planning/export workflow only. No direct platform posting in milestone 1.",
    tags: ["social", "process"],
    createdAt: now,
    updatedAt: now
  }
];
