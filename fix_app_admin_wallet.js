import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('<Route path="/admin/wallet-management">')) {
  code = code.replace(
    '<Route path="/wallet">\n            <PermissionRoute component={Wallet} />\n          </Route>',
    '<Route path="/admin/wallet-management">\n            <PermissionRoute component={AdminWallet} />\n          </Route>\n          <Route path="/wallet">\n            <PermissionRoute component={Wallet} />\n          </Route>'
  );
  fs.writeFileSync(file, code);
}
