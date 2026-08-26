const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('    const hasMetaAi = isSuper || (userPlans && userPlans.some(p => {', '    const isSuper = user?.role === "superadmin";\\n    const hasMetaAi = isSuper || (userPlans && userPlans.some(p => {');
content = content.replace('    const isSuper = user?.role === "superadmin";\\n    const isAdmin', '    const isAdmin');

fs.writeFileSync(file, content);
