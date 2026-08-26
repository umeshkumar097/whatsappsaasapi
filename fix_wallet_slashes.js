import fs from 'fs';
const file = 'server/controllers/wallet.controller.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync(file, code);
