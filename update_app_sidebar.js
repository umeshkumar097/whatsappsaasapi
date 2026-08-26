import fs from 'fs';

// 1. Update App.tsx
const appFile = 'client/src/App.tsx';
let appCode = fs.readFileSync(appFile, 'utf8');

if (!appCode.includes('import AdminWallet')) {
  appCode = appCode.replace(
    'import Wallet from "./pages/Wallet";',
    'import Wallet from "./pages/Wallet";\nimport AdminWallet from "./pages/admin-wallet";'
  );
  
  appCode = appCode.replace(
    '<PermissionRoute\n          path="/wallet"',
    '<PermissionRoute\n          path="/admin/wallet-management"\n          component={AdminWallet}\n          permissions={[]}\n        />\n        <PermissionRoute\n          path="/wallet"'
  );
  fs.writeFileSync(appFile, appCode);
}

// 2. Update sidebar.tsx
const sidebarFile = 'client/src/components/layout/sidebar.tsx';
let sidebarCode = fs.readFileSync(sidebarFile, 'utf8');

if (!sidebarCode.includes('/admin/wallet-management')) {
  sidebarCode = sidebarCode.replace(
    '    {\n        name: "navigation.subscription_plans",',
    '    {\n        name: "Wallet & Rates",\n        icon: Wallet,\n        path: "/admin/wallet-management",\n        color: "text-emerald-500",\n    },\n    {\n        name: "navigation.subscription_plans",'
  );
  fs.writeFileSync(sidebarFile, sidebarCode);
}
