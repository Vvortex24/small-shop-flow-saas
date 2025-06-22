
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Phone, User, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // بيانات وهمية للطلبات
  const orders = [
    {
      id: "001",
      customer: "سارة أحمد",
      phone: "0551234567",
      total: 850,
      status: "completed",
      date: "2024-01-20",
      items: ["فستان أزرق", "حقيبة يد"],
      notes: "توصيل سريع"
    },
    {
      id: "002", 
      customer: "محمد علي",
      phone: "0559876543",
      total: 1200,
      status: "pending",
      date: "2024-01-19",
      items: ["بدلة رسمية", "حزام جلدي"],
      notes: ""
    },
    {
      id: "003",
      customer: "فاطمة خالد", 
      phone: "0552468135",
      total: 650,
      status: "cancelled",
      date: "2024-01-18",
      items: ["فستان أحمر"],
      notes: "لم تعد تريد المنتج"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-profit text-white">مكتمل</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">قيد المعالجة</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.includes(searchTerm) || order.phone.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600 mt-1">تتبع وإدارة جميع طلبات العملاء</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-profit hover:bg-profit-dark gap-2">
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">إضافة طلب جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="customer">اسم العميل</Label>
                <Input id="customer" placeholder="أدخل اسم العميل" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" placeholder="05xxxxxxxx" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="items">المنتجات</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنتجات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dress-blue">فستان أزرق - 250 ريال</SelectItem>
                    <SelectItem value="suit-formal">بدلة رسمية - 800 ريال</SelectItem>
                    <SelectItem value="bag-hand">حقيبة يد - 180 ريال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" placeholder="أي ملاحظات خاصة..." rows={3} />
              </div>
              
              <Button className="w-full bg-profit hover:bg-profit-dark">
                إضافة الطلب
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="pending">قيد المعالجة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-business-light rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-business" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{order.customer}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {order.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">المنتجات:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {order.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>ملاحظات:</strong> {order.notes}
                    </p>
                  )}
                </div>
                
                <div className="text-left lg:text-right space-y-2">
                  {getStatusBadge(order.status)}
                  <p className="text-2xl font-bold text-business">{order.total} ريال</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600">ابدأ بإضافة طلبك الأول</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
