import fs from 'fs';
const file = 'client/src/pages/Wallet.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
fs.writeFileSync(file, code);
