import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('Redirect')) {
  code = code.replace(
    'import { Switch, Route, useLocation } from "wouter";',
    'import { Switch, Route, useLocation, Redirect } from "wouter";'
  );
}

// And fix the Route path="/"
code = code.replace(
  /<Route path="\/">[\s\S]*?<\/Route>/,
  '<Route path="/"><Redirect to="/login" /></Route>'
);

// ALSO fix Priority 3!
code = code.replace(
  /if \(!isAuthenticated\) \{[\s\S]*?if \(window\.location\.pathname !== "\/login"\) \{[\s\S]*?window\.location\.href = "\/login";[\s\S]*?\}[\s\S]*?return null;[\s\S]*?\}/,
  'if (!isAuthenticated) {\n    if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {\n      return <Redirect to="/login" />;\n    }\n    return null;\n  }'
);

fs.writeFileSync(file, code);
