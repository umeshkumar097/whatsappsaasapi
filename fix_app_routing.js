import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(!isAuthenticated\) \{[\s\S]*?return \([\s\S]*?<Header \/>[\s\S]*?<Footer \/>[\s\S]*?\);[\s\S]*?\}/,
  'if (!isAuthenticated) {\n    if (window.location.pathname !== "/login") {\n      window.location.href = "/login";\n    }\n    return null;\n  }'
);

code = code.replace(
  /<Route path="\/">[\s\S]*?<Home \/>[\s\S]*?<\/Route>/,
  '<Route path="/">\n          {() => {\n             window.location.href = "/login";\n             return null;\n          }}\n        </Route>'
);

fs.writeFileSync(file, code);
