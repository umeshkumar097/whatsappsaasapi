import fs from 'fs';

const file = 'server/controllers/user.controller.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/cashfreeCustomerId: users.cashfreeCustomerId,?\\n/g, '');

fs.writeFileSync(file, code);
