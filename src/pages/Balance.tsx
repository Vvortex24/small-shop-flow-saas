
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Balance = () => {
  // Sample data
  const totalBalance = 3275000; // in Syrian Lira
  const totalProfit = 4890000;
  const totalExpenses = 1615000;
  const profitPercentage = 67.0;
  const expensePercentage = 33.0;

  // Financial transactions log
  const transactions = [
    {
      id: "1",
      type: "profit",
      amount: 177000,
      description: "Order from Sara Ahmed - Blue Dress",
      date: "2024-01-20",
      time: "14:30"
    },
    {
      id: "2", 
      type: "expense",
      amount: 41700,
      description: "Raw materials purchase - Cotton fabric",
      date: "2024-01-20", 
      time: "10:15"
    },
    {
      id: "3",
      type: "profit", 
      amount: 250000,
      description: "Order from Mohammed Ali - Formal suit",
      date: "2024-01-19",
      time: "16:45"
    },
    {
      id: "4",
      type: "expense",
      amount: 31300,
      description: "Shipping and delivery costs",
      date: "2024-01-19",
      time: "12:20"
    },
    {
      id: "5",
      type: "profit",
      amount: 135000,
      description: "Order from Fatima Khaled - Handbag",
      date: "2024-01-18",
      time: "09:30"
    }
  ];

  // Sample weekly analysis
  const weeklyAnalysis = {
    profitChange: +12.5,
    expenseChange: -8.3,
    comparison: "compared to last week"
  };

  const monthlyData = [
    { month: "January", profit: 4890000, expense: 1615000 },
    { month: "February", profit: 3788000, expense: 1333000 },
    { month: "March", profit: 5580000, expense: 1854000 },
    { month: "April", profit: 4475000, expense: 1500000 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Balance</h1>
          <p className="text-gray-600 mt-1">Track profits and expenses</p>
        </div>
        
        <Select defaultValue="current-month">
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="quarter">Last 3 Months</SelectItem>
            <SelectItem value="year">Current Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-business mb-2">{totalBalance.toLocaleString()} SYP</p>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-profit" />
                  <span className="text-sm text-profit font-medium">In profit</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-profit">Profit</span>
                  <span className="text-expense">Expenses</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-profit"
                    style={{ width: `${profitPercentage}%` }}
                  />
                  <div 
                    className="bg-expense"
                    style={{ width: `${expensePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{profitPercentage.toFixed(1)}%</span>
                  <span>{expensePercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card className="border-profit/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Profit</CardTitle>
              <div className="w-8 h-8 bg-profit-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-profit" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <p className="text-3xl font-bold text-profit mb-2">{totalProfit.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-profit" />
                <span className="text-sm text-profit font-medium">
                  +{weeklyAnalysis.profitChange}% {weeklyAnalysis.comparison}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="border-expense/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
              <div className="w-8 h-8 bg-expense-light rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <p className="text-3xl font-bold text-expense mb-2">{totalExpenses.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-profit" />
                <span className="text-sm text-profit font-medium">
                  {weeklyAnalysis.expenseChange}% {weeklyAnalysis.comparison}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Analysis Alert */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-business-light rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4 text-business" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-business">Weekly Analysis</h4>
              <p className="text-sm text-blue-700">
                Profits increased by <strong>{weeklyAnalysis.profitChange}%</strong> and expenses decreased by <strong>{Math.abs(weeklyAnalysis.expenseChange)}%</strong> compared to last week. Excellent performance! 🎉
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
          <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Financial Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'profit' ? 'bg-profit-light' : 'bg-expense-light'
                      }`}>
                        {transaction.type === 'profit' ? 
                          <TrendingUp className="w-5 h-5 text-profit" /> : 
                          <TrendingDown className="w-5 h-5 text-expense" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date} - {transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        transaction.type === 'profit' ? 'text-profit' : 'text-expense'
                      }`}>
                        {transaction.type === 'profit' ? '+' : '-'}{transaction.amount.toLocaleString()} SYP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((month, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{month.month}</h4>
                      <span className="text-lg font-bold text-business">
                        {(month.profit - month.expense).toLocaleString()} SYP
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-profit">Profit: {month.profit.toLocaleString()} SYP</span>
                        <span className="text-expense">Expenses: {month.expense.toLocaleString()} SYP</span>
                      </div>
                      
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-profit"
                          style={{ width: `${(month.profit / (month.profit + month.expense)) * 100}%` }}
                        />
                        <div 
                          className="bg-expense"
                          style={{ width: `${(month.expense / (month.profit + month.expense)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Balance;
