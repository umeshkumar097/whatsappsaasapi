const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update useAuth destructing
content = content.replace(
  'const { user, logout } = useAuth();',
  'const { user, logout, userPlans } = useAuth();\\n    const hasMetaAi = isSuper || (userPlans && userPlans.some(p => {\\n        const val = p.plan?.permissions?.meta_ai;\\n        return val && String(val).toLowerCase() === "yes";\\n    }));'
);

// Filter navItems and superAdminNavigation
content = content.replace(
  'const navItems = getNavItems(user?.role || "");',
  'let navItems = getNavItems(user?.role || "");\\n    if (!hasMetaAi) {\\n        navItems = navItems.filter(item => item.href !== "/meta-agent");\\n    }'
);

content = content.replace(
  'const filteredSuperAdminNav = superAdminNavigation.filter',
  'let filteredSuperAdminNav = superAdminNavigation;\\n    if (!hasMetaAi) {\\n        filteredSuperAdminNav = filteredSuperAdminNav.filter(item => item.path !== "/meta-agent");\\n    }\\n    filteredSuperAdminNav = filteredSuperAdminNav.filter'
);

fs.writeFileSync(file, content);
