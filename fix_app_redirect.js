import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<Route path="\/">[\s\S]*?<\/Route>/,
  '<Route path="/">{() => { setTimeout(() => { window.location.href = "/login"; }, 0); return null; }}</Route>'
);

fs.writeFileSync(file, code);
