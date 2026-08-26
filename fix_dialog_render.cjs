const fs = require('fs');
const file = 'client/src/components/groups/GroupMembersDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');

const dialogRender = `
      {/* Field Mapping Dialog */}
      <FieldMappingDialog
        open={!!mappingData}
        csvHeaders={mappingData?.headers || []}
        previewRows={mappingData?.rawRows || []}
        totalRows={mappingData?.rawRows.length || 0}
        onConfirm={handleConfirmMapping}
        onCancel={() => setMappingData(null)}
      />
`;

// Insert right before `<Sheet open={open}`
content = content.replace('<Sheet open={open} onOpenChange={onOpenChange}>', dialogRender + '      <Sheet open={open} onOpenChange={onOpenChange}>');

fs.writeFileSync(file, content);
