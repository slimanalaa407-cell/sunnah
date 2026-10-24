const admin = require("firebase-admin");
const S = require("./sunnah.json");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = admin.firestore();
const SITE = "https://slimanalaa407-cell.github.io/sunnah/";
(async () => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
  const [y, m, d] = today.split("-").map(Number);
  const day = Math.max(0, Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 24)) / 864e5));
  const s = S[day % S.length];
  const snap = await db.collection("tokens").get();
  const tokens = snap.docs.map((x) => x.id);
  if (!tokens.length) { console.log("no tokens yet"); return; }
  for (let i = 0; i < tokens.length; i += 500) {
    const chunk = tokens.slice(i, i + 500);
    const r = await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      notification: { title: "سنة اليوم · " + s[0], body: s[1] },
      webpush: { fcmOptions: { link: SITE }, notification: { icon: SITE + "icon-192.png" } },
    });
    await Promise.all(r.responses.map((x, j) => {
      const c = x.error && x.error.code;
      if (!x.success && c && /not-registered|invalid-argument|invalid-registration/.test(c)) return db.collection("tokens").doc(chunk[j]).delete();
    }));
    console.log("sent", r.successCount, "failed", r.failureCount);
  }
  console.log("day", day, s[1]);
})().catch((e) => { console.error(e); process.exit(1); });
