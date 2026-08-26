import fs from 'fs';

const file = 'client/src/components/layout/sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

// I will just add the Wallet object near /dashboard for both admin and user/superadmin.
const walletItem = `{
                href: "/wallet",
                icon: Wallet,
                labelKey: "Wallet",
                color: "text-emerald-500",
                allowedRoles: ["superadmin", "admin", "user", "team"],
            },`;

if (!code.includes('href: "/wallet"')) {
    // Add Wallet icon import
    code = code.replace(
      'import {',
      'import { Wallet,'
    );
    // Add item after dashboard for all roles
    code = code.replace(
      /href: "\/dashboard",[\s\S]*?allowedRoles: \["superadmin", "admin", "user", "team"\],\s*\}/g,
      match => match + ",\n            " + walletItem
    );
    fs.writeFileSync(file, code);
    console.log("Sidebar patched");
}
