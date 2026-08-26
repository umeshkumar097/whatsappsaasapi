import fs from 'fs';

const file = 'client/src/pages/Wallet.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add order_id verification effect
if (!code.includes('verifyFundsMutation')) {
  const verifyLogic = `
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order_id = params.get("order_id");
    if (order_id) {
      setVerifying(true);
      apiRequest("POST", "/api/wallet/verify-funds", { order_id })
        .then(() => {
          toast({ title: "Funds added successfully!" });
          queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
          queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          toast({ title: "Verification failed", description: err.message, variant: "destructive" });
        })
        .finally(() => {
          setVerifying(false);
        });
    }
  }, []);
`;
  code = code.replace(
    'const [amount, setAmount] = useState("");',
    'const [amount, setAmount] = useState("");\n' + verifyLogic
  );
}

// 2. Modify addFundsMutation success
const addSuccessOld = `    onSuccess: () => {
      toast({ title: "Funds added successfully" });
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
    },`;

const addSuccessNew = `    onSuccess: (data: any) => {
      if (data.payment_link) {
        window.location.href = data.payment_link;
      } else {
        toast({ title: "Funds added successfully" });
        setAmount("");
        queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
        queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      }
    },`;

code = code.replace(addSuccessOld, addSuccessNew);

fs.writeFileSync(file, code);
console.log("Updated Wallet frontend");
