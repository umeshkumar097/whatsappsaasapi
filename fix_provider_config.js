import fs from 'fs';
const file = 'server/services/payment-gateway.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('async function getProviderConfig(', 'export async function getProviderConfig(');

fs.writeFileSync(file, code);
