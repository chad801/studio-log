import assert from "node:assert/strict";
import { seedRecords } from "./seed";
import { searchableText } from "./models";

const requiredTypes = new Set([
  "inventory",
  "recipe",
  "firing",
  "project",
  "piece",
  "pricing",
  "socialAsset",
  "inspiration"
]);

for (const type of requiredTypes) {
  assert.ok(seedRecords.some((record) => record.type === type), `Missing seed type ${type}`);
}

for (const record of seedRecords) {
  assert.ok(record.id, "Record id is required");
  assert.ok(record.title, `Record title is required for ${record.id}`);
  assert.ok(record.createdAt, `createdAt is required for ${record.id}`);
  assert.ok(record.updatedAt, `updatedAt is required for ${record.id}`);
  assert.ok(searchableText(record).includes(record.title.toLowerCase()), `Search text should include title for ${record.id}`);
}

const recipe = seedRecords.find((record) => record.type === "recipe");
assert.ok(recipe?.ingredients?.length, "Recipe seed needs ingredients");

const firing = seedRecords.find((record) => record.type === "firing");
assert.ok(firing?.rampHoldSteps?.length, "Firing seed needs ramp/hold steps");

console.log(`Model smoke test passed with ${seedRecords.length} records.`);
