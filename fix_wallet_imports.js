import fs from 'fs';

const file = 'server/controllers/wallet.controller.ts';
let code = fs.readFileSync(file, 'utf8');

// Remove imports from the middle
code = code.replace('import { getProviderConfig } from "../services/payment-gateway.service";\nimport axios from "axios";\n\nexport const addFunds', 'export const addFunds');

// Add imports to the top
code = 'import { getProviderConfig } from "../services/payment-gateway.service";\nimport axios from "axios";\n' + code;

fs.writeFileSync(file, code);
console.log("Fixed imports");
