import fs from 'fs';

const file = 'server/controllers/channels.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /\/\/ 9️⃣ Register phone number with Cloud API[\s\S]*?catch \(regErr\) \{[\s\S]*?\}/g;

const replaceWith = `// 9️⃣ Link to Gupshup Partner API
    try {
      const partnerToken = await getGupshupPartnerToken();
      if (partnerToken) {
        console.log(\`[EmbeddedSignup] Linking WABA \${wabaId} to Gupshup...\`);
        const gupshupAppRes = await fetch("https://partner.gupshup.io/partner/tpp/app", {
           method: "POST",
           headers: { "Authorization": partnerToken, "Content-Type": "application/x-www-form-urlencoded" },
           body: \`name=\${encodeURIComponent(displayPhoneNumber || "WhatsApp Channel")}&wabaId=\${wabaId}&phone=\${phoneNumberId}\`
        });
        const gupshupAppData = await gupshupAppRes.json();
        console.log("[EmbeddedSignup] Gupshup Link Response:", gupshupAppData);
        if (gupshupAppData.appId) {
           await storage.updateChannel(channel.id, { gupshupAppId: gupshupAppData.appId });
        }
      }
    } catch (gErr) {
      console.error("[EmbeddedSignup] Failed to link with Gupshup:", gErr);
    }`;

code = code.replace(regex, replaceWith);
fs.writeFileSync(file, code);
console.log("Patched!");
