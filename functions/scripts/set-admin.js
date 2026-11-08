// Grants (or with --remove, revokes) admin access for an existing Firebase Auth user.
// Create the user first: Firebase console > Authentication > Users > Add user.
//
// Live project:  gcloud auth application-default login   (once), then
//                npm run set-admin -- you@example.com
// Emulator:      FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run set-admin -- you@example.com
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.argv.slice(2).find((a) => !a.startsWith("--"));
const remove = process.argv.includes("--remove");
if (!email) {
  console.error("Usage: npm run set-admin -- <email> [--remove]");
  process.exit(1);
}

const projectId = process.env.GCLOUD_PROJECT || "vio-gift";
initializeApp(process.env.FIREBASE_AUTH_EMULATOR_HOST ? { projectId } : { credential: applicationDefault(), projectId });

const user = await getAuth().getUserByEmail(email);
const claims = { ...(user.customClaims || {}) };
if (remove) delete claims.admin;
else claims.admin = true;

await getAuth().setCustomUserClaims(user.uid, claims);
// Forces existing sessions to pick up the change on their next token refresh.
await getAuth().revokeRefreshTokens(user.uid);
console.log(`${remove ? "Removed admin access from" : "Granted admin access to"} ${email}. They need to sign in again.`);
