import fs from 'fs';

const file = 'server/services/whatsapp-api.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/from "@shared\/db"/g, 'from "../../shared/db"');
code = code.replace(/from "@shared\/schema"/g, 'from "../../shared/schema"');

fs.writeFileSync(file, code);
console.log("Fixed relative imports in whatsapp-api.ts");
