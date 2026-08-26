import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, IndianRupee, TrendingUp, TrendingDown, Users, Save, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";

export default function AdminWallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Redirect non-superadmins
  useEffect(() => {
    if (user && user.role !== "superadmin") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const { data: transactionsData, isLoading: isTxLoading, refetch: refetchTx } = useQuery({
    queryKey: ["/api/admin/wallets/transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/wallets/transactions");
      return await res.json();
    },
  });

  const { data: ratesData, isLoading: isRatesLoading } = useQuery({
    queryKey: ["/api/rates"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/rates");
      return await res.json();
    },
  });

  const [rates, setRates] = useState({
    marketing: "0.80",
    utility: "0.30",
    authentication: "0.40",
    service: "0.50",
  });

  useEffect(() => {
    if (ratesData?.rates?.length) {
      const updated = { ...rates };
      ratesData.rates.forEach((r: any) => {
        const key = r.category.toLowerCase();
        if (key in updated) {
          (updated as any)[key] = parseFloat(r.price).toFixed(2);
        }
      });
      setRates(updated);
    }
  }, [ratesData]);

  const updateRatesMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        rates: Object.entries(rates).map(([category, price]) => ({ category, price })),
      };
      const res = await apiRequest("POST", "/api/admin/rates", payload);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "✅ Rates Updated!", description: "New rates are now active for ALL users immediately." });
        queryClient.invalidateQueries({ queryKey: ["/api/rates"] });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update rates", variant: "destructive" });
    },
  });

  // Stats
  const txList = transactionsData?.transactions || [];
  const totalCredit = txList.filter((t: any) => t.transaction?.type === "CREDIT").reduce((sum: number, t: any) => sum + parseFloat(t.transaction?.amount || "0"), 0);
  const totalDebit = txList.filter((t: any) => t.transaction?.type === "DEBIT").reduce((sum: number, t: any) => sum + Math.abs(parseFloat(t.transaction?.amount || "0")), 0);
  const uniqueUsers = new Set(txList.map((t: any) => t.user?.id)).size;

  if (!user || user.role !== "superadmin") return null;

  return (
    <div className="flex-1 min-h-screen bg-gray-50/50">
      <Header title="Wallet & Message Rates" subtitle="Manage user wallets and configure per-message pricing" />

      <main className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">₹{totalCredit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg"><TrendingDown className="w-5 h-5 text-red-500" /></div>
              <div>
                <p className="text-sm text-gray-500">Total Debits</p>
                <p className="text-2xl font-bold text-red-500">₹{totalDebit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{uniqueUsers}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MESSAGE RATES CONFIG */}
          <Card className="lg:col-span-1 border-0 shadow-sm h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IndianRupee className="w-4 h-4" />
                Message Rates (per message)
              </CardTitle>
              <CardDescription>Changes apply instantly to ALL users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isRatesLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <>
                  {(["marketing", "utility", "authentication", "service"] as const).map((cat) => (
                    <div key={cat} className="space-y-1">
                      <label className="text-sm font-medium capitalize text-gray-700">{cat}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <Input
                          className="pl-7"
                          value={rates[cat]}
                          onChange={(e) => setRates((prev) => ({ ...prev, [cat]: e.target.value }))}
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => updateRatesMutation.mutate()}
                    className="w-full mt-2"
                    disabled={updateRatesMutation.isPending}
                  >
                    {updateRatesMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save & Apply Rates
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Saved rates are used immediately when next message is sent
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* WALLET TRANSACTIONS */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">All User Transactions</CardTitle>
                  <CardDescription>{txList.length} total transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchTx()}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isTxLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!txList.length ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        txList.map((tx: any) => (
                          <TableRow key={tx.transaction?.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{tx.user?.username || "—"}</div>
                              <div className="text-xs text-muted-foreground">{tx.user?.email}</div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 max-w-[150px] truncate">
                              {tx.transaction?.description || "—"}
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                tx.transaction?.type === "CREDIT"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {tx.transaction?.type}
                              </span>
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${
                              parseFloat(tx.transaction?.amount || "0") >= 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}>
                              {parseFloat(tx.transaction?.amount || "0") >= 0 ? "+" : ""}₹{Math.abs(parseFloat(tx.transaction?.amount || "0")).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {new Date(tx.transaction?.createdAt).toLocaleString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
