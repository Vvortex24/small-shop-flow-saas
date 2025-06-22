
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Balance = () => {
  // بيانات وهمية
  const totalBalance = 15750;
  const totalProfit = 23500;
  const totalExpenses = 7750;
  const profitPercentage = 67.0;
  const expensePercentage = 33.0;

  // سجل العمليات المالية
  const transactions = [
    {
      id: "1",
      type: "profit",
      amount: 850,
      description: "طلب من سارة أحمد - فستان أزرق",
      date: "2024-01-20",
      time: "14:30"
    },
    {
      id: "2", 
      type: "expense",
      amount: 200,
      description: "شراء مواد خام - قماش قطني",
      date: "2024-01-20", 
      time: "10:15"
    },
    {
      id: "3",
      type: "profit", 
      amount: 1200,
      description: "طلب من محمد علي - بدلة رسمية",
      date: "2024-01-19",
      time: "16:45"
    },
    {
      id: "4",
      type: "expense",
      amount: 150,
      description: "مصروف شحن وتوصيل",
      date: "2024-01-19",
      time: "12:20"
    },
    {
      id: "5",
      type: "profit",
      amount: 650,
      description: "طلب من فاطمة خالد - حقيبة يد",
      date: "2024-01-18",
      time: "09:30"
    }
  ];

  // تحليل أسبوعي وهمي
  const weeklyAnalysis = {
    profitChange: +12.5,
    expenseChange: -8.3,
    comparison: "مقارنة بالأسبوع السابق"
  };

  const monthlyData = [
    { month: "يناير", profit: 23500, expense: 7750 },
    { month: "فبراير", profit: 18200, expense: 6400 },
    { month: "مارس", profit: 26800, expense: 8900 },
    { month: "أبريل", profit: 21500, expense: 7200 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الرصيد المالي</h1>
          <p className="text-gray-600 mt-1">تتبع الأرباح والمصاريف</p>
        </div>
        
        <Select defaultValue="current-month">
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 ml-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">الشهر الحالي</SelectItem>
            <SelectItem value="last-month">الشهر السابق</SelectItem>
            <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
            <SelectItem value="year">السنة الحالية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">الرصيد الإجمالي</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-business mb-2">{totalBalance.toLocaleString()} ريال</p>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-profit" />
                  <span className="text-sm text-profit font-medium">في الربح</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-profit">الأرباح</span>
                  <span className="text-expense">المصاريف</span>
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
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الأرباح</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المصاريف</CardTitle>
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
              <h4 className="font-semibold text-business">التحليل الأسبوعي</h4>
              <p className="text-sm text-blue-700">
                زادت الأرباح بنسبة <strong>{weeklyAnalysis.profitChange}%</strong> وانخفضت المصاريف بنسبة <strong>{Math.abs(weeklyAnalysis.expenseChange)}%</strong> مقارنة بالأسبوع السابق. أداء ممتاز! 🎉
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">سجل العمليات</TabsTrigger>
          <TabsTrigger value="reports">التقارير الشهرية</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">آخر العمليات المالية</CardTitle>
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
                    <div className="text-left">
                      <span className={`text-lg font-bold ${
                        transaction.type === 'profit' ? 'text-profit' : 'text-expense'
                      }`}>
                        {transaction.type === 'profit' ? '+' : '-'}{transaction.amount} ريال
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
              <CardTitle className="text-lg">التقرير الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((month, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{month.month}</h4>
                      <span className="text-lg font-bold text-business">
                        {(month.profit - month.expense).toLocaleString()} ريال
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-profit">أرباح: {month.profit.toLocaleString()} ريال</span>
                        <span className="text-expense">مصاريف: {month.expense.toLocaleString()} ريال</span>
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
