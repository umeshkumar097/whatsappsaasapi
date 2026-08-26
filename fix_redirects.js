import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix 1: Replace <Redirect to="/login" /> with a useEffect redirect in ProtectedRoutes
// The issue: Redirect is not imported from wouter v3
// Replace the inline Redirect usage with window.location
code = code.replace(
  'if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {\n      return <Redirect to="/login" />;\n    }\n    return null;',
  'if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {\n      window.location.replace("/login");\n    }\n    return null;'
);

// Fix 2: Replace <Route path="/"><Redirect to="/login" /></Route>
code = code.replace(
  '<Route path="/"><Redirect to="/login" /></Route>',
  '<Route path="/">{() => { window.location.replace("/login"); return null; }}</Route>'
);

fs.writeFileSync(file, code);
console.log('Done');
