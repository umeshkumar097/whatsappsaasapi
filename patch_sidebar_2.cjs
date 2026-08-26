const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add to getNavItems("admin")
const metaAiNavItem = `
            {
                href: "/meta-agent",
                icon: Bot,
                labelKey: "Meta AI",
                color: "text-purple-600",
                allowedRoles: ["superadmin", "admin"],
            },
            {
                href: "/campaigns",`;
content = content.replace(/\{\s*href:\s*"\/campaigns",/, metaAiNavItem.trimStart());

// 2. Add to superAdminNavigation
const superAdminMetaAi = `
    {
        name: "Meta AI",
        icon: Bot,
        path: "/meta-agent",
        color: "text-purple-500",
    },
    {
        name: "navigation.master_campaigns",`;
content = content.replace(/\{\s*name:\s*"navigation\.master_campaigns",/, superAdminMetaAi.trimStart());

fs.writeFileSync(file, content);
