import fs from 'fs';

const file = 'client/src/components/layout/sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('import { Wallet,', 'import {');
code = code.replace('import { Users, ', 'import { Wallet, Users, ');

fs.writeFileSync(file, code);
console.log("Fixed sidebar");
