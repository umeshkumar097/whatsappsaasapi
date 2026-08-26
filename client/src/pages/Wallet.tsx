import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WalletIcon, PlusCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function Wallet() {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

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


  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["/api/wallet/transactions"],
  });

  const addFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/wallet/add-funds", { amount, description: "Wallet Recharge" });
      if (!res.ok) throw new Error("Failed to add funds");
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.payment_session_id) {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.onload = () => {
          const cashfree = (window as any).Cashfree({
            mode: data.isLive ? "production" : "sandbox", 
          });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: "_self"
          });
        };
        document.body.appendChild(script);
      } else {
        toast({ title: "Funds added successfully" });
        setAmount("");
        queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
        queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      }
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const balance = walletData?.wallet?.balance || "0.00";

  return (
    <div className="space-y-6 max-w-5xl mx-auto mt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wallet & Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <WalletIcon className="w-5 h-5" /> Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-6">
              ₹{parseFloat(balance).toFixed(2)}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Funds (₹)</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000"
                />
                <Button 
                  onClick={() => addFundsMutation.mutate(Number(amount))}
                  disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || addFundsMutation.isPending}
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest deductions and recharges</CardDescription>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div>Loading transactions...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txData?.transactions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    txData?.transactions?.slice(0, 10).map((tx: any) => (
                      <TableRow key={tx.id} className={tx.status === "failed" ? "opacity-60" : ""}>
                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                          {tx.type === "CREDIT" ? (
                            <span className="flex items-center text-green-600"><ArrowDownRight className="w-4 h-4 mr-1"/> Credit</span>
                          ) : (
                            <span className="flex items-center text-red-600"><ArrowUpRight className="w-4 h-4 mr-1"/> Debit</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.status === "completed" ? (
                            <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-1 rounded">Success</span>
                          ) : tx.status === "failed" ? (
                            <span className="text-red-600 font-medium text-xs bg-red-100 px-2 py-1 rounded">Failed</span>
                          ) : (
                            <span className="text-yellow-600 font-medium text-xs bg-yellow-100 px-2 py-1 rounded capitalize">{tx.status}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={tx.status === "failed" ? "line-through text-muted-foreground" : ""}>
                            {tx.type === "CREDIT" ? "+" : ""}{parseFloat(tx.amount).toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
