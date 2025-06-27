
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Balance = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transactionData = data || [];
      setTransactions(transactionData);

      // Calculate balance
      const totalIncome = transactionData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalExpenses = transactionData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setBalance(totalIncome - totalExpenses);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || !description.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user?.id,
          type,
          amount: parseFloat(amount),
          description: description.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'income' ? 'Income' : 'Expense'} added successfully`
      });

      // Reset form and refresh data
      setAmount("");
      setDescription("");
      setType("income");
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-business"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Balance</h1>
          <p className="text-gray-600 mt-1">Track your income, expenses, and financial health</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-business hover:bg-business-dark gap-2">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type *</Label>
                <Select value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-amount">Amount (SYP) *</Label>
                <Input 
                  id="transaction-amount" 
                  type="number"
                  placeholder="0" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-description">Description *</Label>
                <Textarea 
                  id="transaction-description" 
                  placeholder="Enter transaction description..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-business hover:bg-business-dark"
                  disabled={!amount || !description.trim() || isSubmitting}
                  onClick={handleAddTransaction}
                >
                  {isSubmitting ? "Adding..." : "Add Transaction"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAmount("");
                    setDescription("");
                    setType("income");
                  }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-profit' : 'text-red-600'}`}>
              {balance.toLocaleString()} SYP
            </div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-profit" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{totalIncome.toLocaleString()} SYP</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} SYP</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-500">Start by adding your first income or expense</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? 
                            <TrendingUp className="w-5 h-5 text-profit" /> : 
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-profit' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{Number(transaction.amount).toLocaleString()} SYP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                Income Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === 'income').length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No income recorded</h3>
                  <p className="text-gray-500">Add your first income transaction</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.filter(t => t.type === 'income').map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-profit" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-profit">
                        +{Number(transaction.amount).toLocaleString()} SYP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Expense Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === 'expense').length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses recorded</h3>
                  <p className="text-gray-500">Add your first expense transaction</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.filter(t => t.type === 'expense').map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        -{Number(transaction.amount).toLocaleString()} SYP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Balance;
