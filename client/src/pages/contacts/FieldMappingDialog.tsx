import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export type RawRow = Record<string, string>;

export type FieldMapping = {
  phone: string;
  name: string;
  email: string;
  groups: string;
  tags: string;
};

type SystemField = {
  key: keyof FieldMapping;
  label: string;
  required: boolean;
  description: string;
  aliases: string[];
};

const SYSTEM_FIELDS: SystemField[] = [
  {
    key: "phone",
    label: "Phone Number",
    required: true,
    description: "WhatsApp number (e.g. 919205182984)",
    aliases: ["phone","mobile","cell","number","contact","whatsapp","ph","phone number","mobile number","cell number","contact number","mo.","mob","phonenumber","mobilenumber"],
  },
  {
    key: "name",
    label: "Name",
    required: false,
    description: "Contact full name",
    aliases: ["name","full name","contact name","customer name","fullname","first name","firstname","client name","client"],
  },
  {
    key: "email",
    label: "Email",
    required: false,
    description: "Email address",
    aliases: ["email","email address","e-mail","mail","emailid"],
  },
  {
    key: "groups",
    label: "Groups",
    required: false,
    description: "Comma-separated group names",
    aliases: ["groups","group","category","segment","list"],
  },
  {
    key: "tags",
    label: "Tags",
    required: false,
    description: "Comma-separated tags",
    aliases: ["tags","tag","label","labels"],
  },
];

function autoDetect(csvHeaders: string[]): FieldMapping {
  const mapping: FieldMapping = { phone: "", name: "", email: "", groups: "", tags: "" };
  const lowerHeaders = csvHeaders.map((h) => h.toLowerCase().trim());
  for (const field of SYSTEM_FIELDS) {
    for (const alias of field.aliases) {
      const idx = lowerHeaders.indexOf(alias);
      if (idx !== -1) { mapping[field.key] = csvHeaders[idx]; break; }
    }
  }
  return mapping;
}

type Props = {
  open: boolean;
  csvHeaders: string[];
  previewRows: RawRow[];
  totalRows: number;
  onConfirm: (mapping: FieldMapping) => void;
  onCancel: () => void;
};

export function FieldMappingDialog({ open, csvHeaders, previewRows, totalRows, onConfirm, onCancel }: Props) {
  const initialMapping = useMemo(() => autoDetect(csvHeaders), [csvHeaders]);
  const [mapping, setMapping] = useState<FieldMapping>(initialMapping);
  const setField = (key: keyof FieldMapping, value: string) =>
    setMapping((prev) => ({ ...prev, [key]: value }));
  const phoneOk = !!mapping.phone;
  const previewMapped = previewRows.slice(0, 3).map((row) => ({
    phone: mapping.phone ? row[mapping.phone] || "" : "",
    name: mapping.name ? row[mapping.name] || "" : "",
    email: mapping.email ? row[mapping.email] || "" : "",
  }));

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Map Your File Columns</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Found <span className="font-semibold text-gray-700">{totalRows} rows</span> in your file.
            Map your columns to system fields below.
          </p>
        </DialogHeader>

        <div className="space-y-3 my-2">
          {SYSTEM_FIELDS.map((field) => {
            const selectedCol = mapping[field.key];
            const preview = previewRows[0]?.[selectedCol] || "";
            return (
              <div key={field.key} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="w-36 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-800">{field.label}</span>
                    {field.required && <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">Required</Badge>}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{field.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div className="flex-1">
                  <select
                    value={mapping[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">— Skip this field —</option>
                    {csvHeaders.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  {selectedCol && preview && (
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">Preview: <span className="text-gray-600">{preview}</span></p>
                  )}
                </div>
                <div className="w-5 flex-shrink-0">
                  {field.required
                    ? selectedCol ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />
                    : selectedCol ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : null}
                </div>
              </div>
            );
          })}
        </div>

        {previewMapped.some((r) => r.phone || r.name) && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preview (first 3 rows)</p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Phone</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {previewMapped.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-1.5 text-gray-700 font-mono">{row.phone || <span className="text-red-400">—</span>}</td>
                      <td className="px-3 py-1.5 text-gray-700">{row.name || "—"}</td>
                      <td className="px-3 py-1.5 text-gray-600">{row.email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!phoneOk && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mt-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Please map the <strong className="mx-1">Phone Number</strong> field — it is required.
          </div>
        )}

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button disabled={!phoneOk} onClick={() => onConfirm(mapping)} className="bg-green-600 hover:bg-green-700 text-white">
            Import {totalRows.toLocaleString()} Contacts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
