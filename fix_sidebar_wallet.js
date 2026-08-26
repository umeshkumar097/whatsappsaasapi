import fs from 'fs';

const file = 'client/src/components/layout/sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '} from "lucide-react";',
  '  Wallet,\n} from "lucide-react";'
);

fs.writeFileSync(file, code);
console.log("Fixed sidebar Wallet import forcefully");
