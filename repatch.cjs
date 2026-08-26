const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add route to getNavItems("admin")
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

// 2. Add route to sidebarItemsCategories
const metaAiCategory = `
    {
        name: "Meta AI",
        icon: Bot,
        path: "/meta-agent",
        color: "text-purple-500",
    },
    {
        name: "navigation.master_campaigns",`;
content = content.replace(/\{\s*name:\s*"navigation\.master_campaigns",/, metaAiCategory.trimStart());

// 3. Destructure userPlans and add hasMetaAi flag
content = content.replace('const { user, logout } = useAuth();', `const { user, logout, userPlans } = useAuth();
    const isSuper = user?.role === "superadmin";
    const hasMetaAi = isSuper || (userPlans && userPlans.some(p => {
        const val = p.plan?.permissions?.meta_ai;
        return val && String(val).toLowerCase() === "yes";
    }));`);

content = content.replace('const isSuper = user?.role === "superadmin";\\n    const isAdmin', 'const isAdmin');

// 4. Filter navItems
content = content.replace('const navItems = getNavItems(user?.role || "");', `let navItems = getNavItems(user?.role || "");
    if (!hasMetaAi) {
        navItems = navItems.filter(item => item.href !== "/meta-agent");
    }`);

// 5. Filter sidebarItemsCategories
content = content.replace('isSuper ? sidebarItemsCategories.map((item) =>', `isSuper ? sidebarItemsCategories.filter(item => hasMetaAi || item.path !== "/meta-agent").map((item) =>`);

fs.writeFileSync(file, content);
