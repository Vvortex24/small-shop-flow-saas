
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  // Sample data for display - showing a negative balance scenario
  const totalBalance = -500000; // All-time store balance (affected by buying, selling, withdrawing)
  const totalProfit = 4890000;
  const totalExpenses = 1615000;
  const ordersCount = 145;
  const inventoryCount = 67;
  const userName = "Ahmad"; // User's name

  // Determine if balance is negative
  const isNegativeBalance = totalBalance < 0;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigation = () => {
    // Scroll to top when navigating
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Message */}
      <div className="border-b pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome {userName}! 👋</h1>
          <p className="text-gray-600">Here's your store activity summary</p>
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className={`${isNegativeBalance ? 'bg-gradient-to-br from-red-500 to-red-600' : 'gradient-business'} text-white border-0 shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isNegativeBalance ? 'text-red-100' : 'text-blue-100'} text-sm mb-1`}>Total Balance</p>
              <p className={`text-3xl font-bold text-shadow ${isNegativeBalance ? 'text-red-50' : 'text-white'}`}>
                {isNegativeBalance ? '-' : ''}{Math.abs(totalBalance).toLocaleString()} SYP
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`${isNegativeBalance ? 'text-red-200' : 'text-blue-200'} text-sm`}>
                  All-time store balance
                </span>
              </div>
            </div>
            <div className={`w-16 h-16 ${isNegativeBalance ? 'bg-white/20' : 'bg-white/20'} rounded-full flex items-center justify-center`}>
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profit Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Profit</CardTitle>
            <div className="w-8 h-8 bg-profit-light rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-profit" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Syrian Lira in this month</p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expenses</CardTitle>
            <div className="w-8 h-8 bg-expense-light rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-expense" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-600 mt-1">Syrian Lira in this month</p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
            <div className="w-8 h-8 bg-business-light rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-business" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-business">{ordersCount}</div>
            <p className="text-xs text-blue-600 mt-1">orders this month</p>
          </CardContent>
        </Card>

        {/* Inventory Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inventory</CardTitle>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inventoryCount}</div>
            <p className="text-xs text-orange-600 mt-1">items available</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col gap-2 bg-profit hover:bg-profit-dark" onClick={handleNavigation}>
              <Link to="/orders">
                <ShoppingCart className="w-6 h-6" />
                <span>Add New Order</span>
              </Link>
            </Button>
            
            <Button asChild className="h-20 flex-col gap-2 bg-purple-600 hover:bg-purple-700 border-purple-600 text-white" onClick={handleNavigation}>
              <Link to="/inventory">
                <Package className="w-6 h-6" />
                <span>Add Product</span>
              </Link>
            </Button>
            
            <Button asChild className="h-20 flex-col gap-2 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={handleNavigation}>
              <Link to="/balance">
                <DollarSign className="w-6 h-6" />
                <span>View Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'order', customer: 'Sara Ahmed', amount: 177000, time: '2 hours ago' },
              { type: 'expense', item: 'Raw materials', amount: 41700, time: '4 hours ago' },
              { type: 'order', customer: 'Mohammed Ali', amount: 250000, time: 'Yesterday' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'order' ? 'bg-profit-light' : 'bg-expense-light'
                  }`}>
                    {activity.type === 'order' ? 
                      <ShoppingCart className="w-4 h-4 text-profit" /> : 
                      <TrendingDown className="w-4 h-4 text-expense" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {activity.type === 'order' ? `Order from ${activity.customer}` : activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  activity.type === 'order' ? 'text-profit' : 'text-expense'
                }`}>
                  {activity.type === 'order' ? '+' : '-'}{activity.amount.toLocaleString()} SYP
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
