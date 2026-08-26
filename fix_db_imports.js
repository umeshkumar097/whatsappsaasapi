import fs from 'fs';

// fix whatsapp-api.ts
let code1 = fs.readFileSync('server/services/whatsapp-api.ts', 'utf8');
code1 = code1.replace(/from "\.\.\/\.\.\/shared\/db"/g, 'from "../db"');
fs.writeFileSync('server/services/whatsapp-api.ts', code1);

// fix wallet.controller.ts
let code2 = fs.readFileSync('server/controllers/wallet.controller.ts', 'utf8');
code2 = code2.replace(/from "\.\.\/\.\.\/shared\/db"/g, 'from "../db"');
fs.writeFileSync('server/controllers/wallet.controller.ts', code2);

console.log("Fixed db imports");
