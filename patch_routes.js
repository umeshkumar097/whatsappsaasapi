import fs from 'fs';

const file = 'server/routes/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /import \{ registerContactRoutes \} from "\.\/contacts\.routes";/,
  `import { registerContactRoutes } from "./contacts.routes";\nimport { setupWalletRoutes } from "./wallet.routes";`
);

code = code.replace(
  /registerContactRoutes\(app\);/,
  `registerContactRoutes(app);\n  setupWalletRoutes(app);`
);

fs.writeFileSync(file, code);
console.log("Patched server/routes/index.ts");
