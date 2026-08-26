const fs = require('fs');
const file = 'server/services/whatsapp-api.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    const headerHandle = uploadBinaryRes.data.h;

    console.log("Uploaded template media, header handle:", headerHandle);

    if (!headerHandle) {
      throw new Error("No header handle returned");
    }

    return headerHandle;`;

const replacement = `    const headerHandleRaw = uploadBinaryRes.data.h;
    if (!headerHandleRaw) {
      throw new Error("No header handle returned");
    }
    
    // Meta API sometimes returns multiple handles joined by newline
    const headerHandle = typeof headerHandleRaw === 'string' ? headerHandleRaw.split('\\n')[0].trim() : headerHandleRaw;

    console.log("Uploaded template media, header handle:", headerHandle);

    return headerHandle;`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
