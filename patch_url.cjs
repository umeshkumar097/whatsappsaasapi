const fs = require('fs');
const file = 'server/services/whatsapp-api.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'console.log("🌐 Sending to WhatsApp API:", JSON.stringify(body, null, 2));',
  'console.log("🌐 Sending to WhatsApp API URL:", `${this.baseUrl}/${this.channel.whatsappBusinessAccountId}/message_templates`);\n    console.log("🌐 Sending to WhatsApp API:", JSON.stringify(body, null, 2));'
);

fs.writeFileSync(file, content);
