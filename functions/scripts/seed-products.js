// One-off: copies the starter catalogue in src/data/products.js into Firestore.
// Existing products with the same id are left untouched unless you pass --overwrite.
//
// Live project:  gcloud auth application-default login   (once), then  npm run seed
// Emulator:      FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { seedProducts } from "../../src/data/products.js";

const overwrite = process.argv.includes("--overwrite");
const projectId = process.env.GCLOUD_PROJECT || "vio-gift";

initializeApp(process.env.FIRESTORE_EMULATOR_HOST ? { projectId } : { credential: applicationDefault(), projectId });
const db = getFirestore();

let written = 0;
let skipped = 0;
const batch = db.batch();

for (const [index, { id, ...product }] of seedProducts.entries()) {
  const ref = db.collection("products").doc(id);
  if (!overwrite && (await ref.get()).exists) {
    skipped++;
    continue;
  }
  batch.set(ref, {
    ...product,
    visible: true,
    sortOrder: index,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  written++;
}

await batch.commit();
console.log(`Seeded ${written} products into "${projectId}" (${skipped} already existed).`);
