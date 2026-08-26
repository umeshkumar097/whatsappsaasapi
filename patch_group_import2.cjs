const fs = require('fs');
const file = 'client/src/components/groups/GroupMembersDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
const imports = `import ExcelJS from "exceljs";
import { FieldMappingDialog, type RawRow, type FieldMapping } from "../../pages/contacts/FieldMappingDialog";`;
content = content.replace('import Papa from "papaparse";', 'import Papa from "papaparse";\n' + imports);

// 2. Add mappingData state
const stateHook = `  const [importState, setImportState] = useState<{
    active: boolean;
    current: number;
    total: number;
    label: string;
  }>({ active: false, current: 0, total: 0, label: "" });`;

const newStates = `  const [mappingData, setMappingData] = useState<{
    headers: string[];
    rawRows: RawRow[];
  } | null>(null);`;
content = content.replace(stateHook, stateHook + '\n' + newStates);

// 3. Replace handleImportFile logic
const handleImportFileOld = `  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !group?.name) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Unsupported file",
        description: "Please upload a .csv file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await decodeFile(file);
      const results = Papa.parse(text, { header: true, skipEmptyLines: true });

      if (results.errors.length > 0) {
        const sample = results.errors
          .slice(0, 3)
          .map((e) => e.message)
          .join("; ");
        toast({
          title: "CSV parse warnings",
          description: \`\${results.errors.length} row(s) had parse issues and may be skipped. First: \${sample}\`,
        });
      }

      const all: ParsedRow[] = (results.data as any[])
        .map((row, idx) => ({ row, csvRow: idx + 2 })) // +1 for header, +1 for 1-based
        .filter(({ row }) => row && Object.keys(row).length > 0)
        .map(({ row, csvRow }) => {
          const groupsSet = new Set<string>(splitMulti(row?.groups));
          groupsSet.add(group.name);
          return {
            name: row?.name?.toString().trim() || "",
            phone: row?.phone ? String(row.phone).trim() : "",
            email: row?.email?.toString().trim() || "",
            groups: Array.from(groupsSet),
            tags: splitMulti(row?.tags),
            csvRow,
          };
        });

      const noPhone = all.filter((c) => !c.phone).length;
      const invalidFormat = all.filter((c) => c.phone && !isValidPhone(c.phone)).length;
      const valid = all.filter((c) => c.phone && isValidPhone(c.phone));

      if (valid.length === 0) {
        toast({
          title: "Nothing to import",
          description: "No rows with a valid phone number were found.",
          variant: "destructive",
        });
        return;
      }

      await uploadInChunks(valid, { noPhone, invalidFormat });
    } catch (err: any) {
      toast({
        title: "CSV parse error",
        description: err?.message || "Failed to read CSV file.",
        variant: "destructive",
      });
    }
  };`;

const handleImportFileNew = `  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !group?.name) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      try {
        const text = await decodeFile(file);
        const results = Papa.parse(text, { header: true, skipEmptyLines: true });
        
        if (results.errors.length > 0) {
          const sample = results.errors.slice(0, 3).map((e) => e.message).join("; ");
          toast({
            title: "CSV parse warnings",
            description: \`\${results.errors.length} row(s) had parse issues. First: \${sample}\`,
          });
        }
        
        const rawRows = (results.data as RawRow[]).filter((row) => row && Object.keys(row).length > 0);
        if (rawRows.length === 0) {
          toast({ title: "Error", description: "No data rows found.", variant: "destructive" });
          return;
        }
        
        const headers = results.meta.fields || Object.keys(rawRows[0] || {});
        setMappingData({ headers, rawRows });
      } catch (err: any) {
        toast({ title: "Parse Error", description: err.message || "Failed to parse CSV file.", variant: "destructive" });
      }
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      try {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);
        
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          toast({ title: "Error", description: "No worksheet found.", variant: "destructive" });
          return;
        }
        
        const headerRow = worksheet.getRow(1);
        if (!headerRow || !headerRow.values) {
          toast({ title: "Error", description: "No header row found.", variant: "destructive" });
          return;
        }
        
        const originalHeaders: string[] = Array.isArray(headerRow.values)
          ? headerRow.values.slice(1).map((h: any) => typeof h === "string" ? h.trim() : typeof h === "number" ? String(h) : "").filter(Boolean)
          : [];
          
        const rawRows: RawRow[] = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const rowData: RawRow = {};
          if (row.values && Array.isArray(row.values)) {
            row.values.slice(1).forEach((cell: any, idx: number) => {
              const key = originalHeaders[idx];
              if (key) {
                if (typeof cell === "string") rowData[key] = cell.trim();
                else if (typeof cell === "number") rowData[key] = String(cell);
                else if (cell && typeof cell === "object" && "text" in cell) rowData[key] = String((cell as any).text);
                else rowData[key] = "";
              }
            });
          }
          if (Object.values(rowData).some((v) => v)) rawRows.push(rowData);
        });
        
        if (rawRows.length === 0) {
          toast({ title: "Error", description: "No data rows found.", variant: "destructive" });
          return;
        }
        
        setMappingData({ headers: originalHeaders, rawRows });
      } catch (err: any) {
        toast({ title: "Parse Error", description: "Failed to read Excel file.", variant: "destructive" });
      }
    } else {
      toast({ title: "Unsupported file", description: "Please upload .csv or .xlsx file.", variant: "destructive" });
    }
  };

  const handleConfirmMapping = async (fieldMapping: FieldMapping) => {
    if (!mappingData || !group?.name) return;
    setMappingData(null);

    const all: ParsedRow[] = mappingData.rawRows.map((row, idx) => {
      const groupsSet = new Set<string>();
      if (fieldMapping.groups && row[fieldMapping.groups]) {
        row[fieldMapping.groups].split(",").map(g => g.trim()).filter(Boolean).forEach(g => groupsSet.add(g));
      }
      groupsSet.add(group.name);
      
      return {
        name: fieldMapping.name ? row[fieldMapping.name]?.toString().trim() || "" : "",
        phone: fieldMapping.phone ? String(row[fieldMapping.phone] || "").trim() : "",
        email: fieldMapping.email ? row[fieldMapping.email]?.toString().trim() || "" : "",
        groups: Array.from(groupsSet),
        tags: fieldMapping.tags && row[fieldMapping.tags] ? row[fieldMapping.tags].split(",").map(g => g.trim()).filter(Boolean) : [],
        csvRow: idx + 2,
      };
    });

    const noPhone = all.filter((c) => !c.phone).length;
    const invalidFormat = all.filter((c) => c.phone && !isValidPhone(c.phone)).length;
    const valid = all.filter((c) => c.phone && isValidPhone(c.phone));

    if (valid.length === 0) {
      toast({
        title: "Nothing to import",
        description: "No rows with a valid phone number were found.",
        variant: "destructive",
      });
      return;
    }

    await uploadInChunks(valid, { noPhone, invalidFormat });
  };`;

content = content.replace(handleImportFileOld, handleImportFileNew);

// 4. Update the input accept string and button text
content = content.replace('accept=".csv"', 'accept=".csv,.xlsx,.xls"');
content = content.replace('Import CSV', 'Import File');
content = content.replace('Import CSV', 'Import File');

// 5. Add FieldMappingDialog component to render
const dialogRender = `      {/* Field Mapping Dialog */}
      <FieldMappingDialog
        open={!!mappingData}
        csvHeaders={mappingData?.headers || []}
        previewRows={mappingData?.rawRows || []}
        totalRows={mappingData?.rawRows.length || 0}
        onConfirm={handleConfirmMapping}
        onCancel={() => setMappingData(null)}
      />`;

const targetAnchor = `      <SheetContent
        className="w-[90%] sm:max-w-2xl sm:w-[600px] flex flex-col p-0 border-l"
        onInteractOutside={(e) => {
          if (movingToGroup) e.preventDefault();
        }}
      >`;

content = content.replace(targetAnchor, targetAnchor + '\n' + dialogRender);

fs.writeFileSync(file, content);
