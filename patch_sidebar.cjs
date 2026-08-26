const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const injectNav = `            {
                href: "/channels-management",
                icon: Smartphone,
                labelKey: "navigation.channels",
                color: "text-blue-500",
                allowedRoles: ["superadmin", "admin"],
            },
            {
                href: "/meta-agent",
                icon: Bot,
                labelKey: "Meta AI",
                color: "text-purple-600",
                allowedRoles: ["superadmin", "admin"],
            },`;

content = content.replace(/\{\s*href:\s*"\/channels-management",[\s\S]*?allowedRoles:\s*\["superadmin",\s*"admin"\],\s*\},/, injectNav);
fs.writeFileSync(file, content);
