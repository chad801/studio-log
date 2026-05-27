export type EntityType =
  | "inventory"
  | "recipe"
  | "glazeTest"
  | "firing"
  | "project"
  | "piece"
  | "pricing"
  | "socialAsset"
  | "customer"
  | "sale"
  | "sharedRecipe"
  | "inspiration";

export type InventoryKind =
  | "clay"
  | "glaze_material"
  | "chemical"
  | "tool"
  | "equipment"
  | "consumable";

export type RecipeKind = "glaze" | "slip" | "clay_body" | "underglaze" | "stain" | "wash";
export type Atmosphere = "oxidation" | "reduction" | "neutral" | "raku" | "wood" | "soda" | "electric";
export type ProjectStage = "idea" | "in_progress" | "greenware" | "drying" | "bisque" | "glazed" | "fired" | "finished" | "sold";
export type FiringStatus = "planned" | "loaded" | "firing" | "cooling" | "unloaded" | "logged";
export type SaleStatus = "not_for_sale" | "available" | "reserved" | "sold" | "gifted";
export type SocialPlatform = "instagram" | "tiktok" | "facebook" | "pinterest" | "website" | "newsletter";
export type SocialPostStatus = "idea" | "draft" | "ready" | "scheduled" | "posted";

export interface MoneyAmount {
  currency: "USD";
  cents: number;
}

export interface RecipeIngredient {
  id: string;
  materialName: string;
  inventoryItemId?: string;
  percentage?: number;
  amount?: number;
  unit?: string;
  costCents?: number;
  notes?: string;
}

export interface RampHoldStep {
  id: string;
  order: number;
  targetTemperatureF: number;
  ratePerHourF: number;
  holdMinutes: number;
  notes?: string;
}

export interface StudioTask {
  id: string;
  title: string;
  dueAt?: string;
  completedAt?: string;
  reminderAt?: string;
}

export interface SocialPlan {
  platform: SocialPlatform;
  status: SocialPostStatus;
  scheduledFor?: string;
  captionDraft?: string;
  hashtags?: string[];
}

export interface StudioRecord {
  id: string;
  type: EntityType;
  title: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;

  inventoryKind?: InventoryKind;
  quantityOnHand?: number;
  unit?: string;
  reorderPoint?: number;
  vendorName?: string;
  unitCostCents?: number;
  storageLocation?: string;
  lotNumber?: string;
  barcode?: string;
  sdsNotes?: string;
  safetyNotes?: string;

  recipeKind?: RecipeKind;
  cone?: string;
  atmosphere?: Atmosphere;
  firingScheduleId?: string;
  ingredients?: RecipeIngredient[];
  batchSize?: number;
  batchUnit?: string;
  recipeVersion?: number;
  parentRecipeId?: string;
  defects?: string[];
  linkedGlazeTestIds?: string[];

  recipeId?: string;
  clayBody?: string;
  testDate?: string;
  surface?: string;
  application?: string;
  resultRating?: number;
  defectTags?: string[];

  kilnName?: string;
  startAt?: string;
  endAt?: string;
  firingStatus?: FiringStatus;
  rampHoldSteps?: RampHoldStep[];
  energyCostCents?: number;
  firingCostCents?: number;
  maintenanceNotes?: string;

  projectStage?: ProjectStage;
  tasks?: StudioTask[];
  dimensions?: string;
  materialIds?: string[];
  recipeIds?: string[];
  firingIds?: string[];
  pieceIds?: string[];

  collectionName?: string;
  priceCents?: number;
  wholesalePriceCents?: number;
  materialCostCents?: number;
  laborMinutes?: number;
  overheadCostCents?: number;
  marginPercent?: number;
  saleStatus?: SaleStatus;
  customerId?: string;
  commissionInfo?: string;

  socialPlans?: SocialPlan[];
  captionDraft?: string;
  hashtags?: string[];
  platformStatus?: Partial<Record<SocialPlatform, SocialPostStatus>>;

  source?: string;
  sourceUrl?: string;
  convertedProjectId?: string;

  email?: string;
  phone?: string;
  address?: string;

  saleDate?: string;
  marketplace?: string;
  consignmentPercent?: number;
  supportContact?: string;
  visibility?: "private" | "link" | "public";
  moderationStatus?: "private" | "pending" | "approved" | "rejected" | "reported";
}

export interface PhotoAsset {
  id: string;
  ownerId: string;
  ownerType: EntityType;
  uri: string;
  width?: number;
  height?: number;
  role: "reference" | "test_tile" | "process" | "kiln_load" | "before" | "after" | "final" | "social";
  caption?: string;
  createdAt: string;
}

export interface StudioBackup {
  app: "Studio Log";
  version: 1;
  exportedAt: string;
  records: StudioRecord[];
  photos: Array<PhotoAsset & { base64?: string }>;
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function createRecord(type: EntityType, input: Partial<StudioRecord>): StudioRecord {
  const timestamp = nowIso();
  return {
    id: input.id ?? createId(type),
    type,
    title: input.title?.trim() || "Untitled",
    notes: input.notes?.trim() || "",
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? timestamp,
    updatedAt: timestamp,
    ...input
  };
}

export function searchableText(record: StudioRecord): string {
  return [
    record.title,
    record.notes,
    record.tags.join(" "),
    record.vendorName,
    record.storageLocation,
    record.lotNumber,
    record.recipeKind,
    record.cone,
    record.atmosphere,
    record.clayBody,
    record.surface,
    record.kilnName,
    record.projectStage,
    record.collectionName,
    record.saleStatus,
    record.source,
    record.email
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatCents(cents?: number): string {
  if (cents === undefined || cents === null) {
    return "$0.00";
  }
  return `$${(cents / 100).toFixed(2)}`;
}
