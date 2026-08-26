import fs from 'fs';

const file = 'client/src/pages/Wallet.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add apiRequest import if missing
if (!code.includes('apiRequest')) {
  code = code.replace(
    'import { useQuery, useMutation } from "@tanstack/react-query";',
    'import { useQuery, useMutation } from "@tanstack/react-query";\nimport { apiRequest } from "@/lib/queryClient";'
  );
}

// Replace fetch with apiRequest
const badFetch = `const res = await fetch("/api/wallet/add-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description: "Wallet Recharge" }),
      });`;

const goodFetch = `const res = await apiRequest("POST", "/api/wallet/add-funds", { amount, description: "Wallet Recharge" });`;

code = code.replace(badFetch, goodFetch);

fs.writeFileSync(file, code);
console.log("Fixed Wallet CSRF");
