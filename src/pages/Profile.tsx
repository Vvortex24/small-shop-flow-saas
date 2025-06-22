
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Mail, MapPin, Calendar, Crown, Settings, Bell, Shield } from "lucide-react";

const Profile = () => {
  const userInfo = {
    name: "أحمد محمد السعدي",
    email: "ahmed.mohammed@email.com",
    phone: "0551234567",
    location: "الرياض، المملكة العربية السعودية",
    joinDate: "2024-01-01",
    subscription: "Premium",
    subscriptionExpiry: "2024-12-31"
  };

  const businessStats = {
    totalOrders: 145,
    totalRevenue: 23500,
    activeDays: 45,
    avgOrderValue: 162
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
        <p className="text-gray-600 mt-1">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
      </div>

      {/* Profile Overview */}
      <Card className="overflow-hidden">
        <div className="h-24 gradient-business"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="bg-business text-white text-2xl font-bold">أح</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-right space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userInfo.name}</h2>
                  <p className="text-gray-600">{userInfo.email}</p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 gap-1 w-fit mx-auto sm:mx-0">
                  <Crown className="w-4 h-4" />
                  {userInfo.subscription}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-business">{businessStats.totalOrders}</p>
            <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-profit">{businessStats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-business">{businessStats.activeDays}</p>
            <p className="text-sm text-gray-600">أيام النشاط</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{businessStats.avgOrderValue}</p>
            <p className="text-sm text-gray-600">متوسط قيمة الطلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" value={userInfo.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" value={userInfo.email} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" value={userInfo.phone} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input id="location" value={userInfo.location} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-business hover:bg-business-dark">
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-business-light rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-business" />
                  </div>
                  <div>
                    <p className="font-medium">تاريخ الانضمام</p>
                    <p className="text-sm text-gray-600">{userInfo.joinDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-profit-light rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-profit" />
                  </div>
                  <div>
                    <p className="font-medium">نوع الاشتراك</p>
                    <p className="text-sm text-gray-600">{userInfo.subscription}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">اشتراك Premium</h3>
                    <p className="text-gray-600">جميع الميزات متاحة</p>
                  </div>
                </div>
                <Badge className="bg-profit text-white">نشط</Badge>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">تاريخ انتهاء الاشتراك</p>
                  <p className="font-semibold">{userInfo.subscriptionExpiry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الفترة المتبقية</p>
                  <p className="font-semibold text-profit">11 شهر و 20 يوم</p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button className="bg-business hover:bg-business-dark">
                  تجديد الاشتراك
                </Button>
                <Button variant="outline">
                  عرض الفواتير
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ميزات الاشتراك المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "طلبات غير محدودة",
                  "منتجات غير محدودة",
                  "تقارير مفصلة",
                  "ربط مع Google Sheets",
                  "دعم فني متقدم",
                  "نسخ احتياطية تلقائية"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-profit rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "orders", label: "إشعارات الطلبات الجديدة", checked: true },
                { id: "inventory", label: "تنبيهات نفاد المخزون", checked: true },
                { id: "reports", label: "التقارير الأسبوعية", checked: false },
                { id: "marketing", label: "العروض والتخفيضات", checked: true }
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <Label htmlFor={setting.id}>{setting.label}</Label>
                  <Switch id={setting.id} checked={setting.checked} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                الأمان والخصوصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                تغيير كلمة المرور
              </Button>
              <Button variant="outline" className="w-full justify-start">
                التحقق بخطوتين
              </Button>
              <Button variant="outline" className="w-full justify-start">
                تصدير البيانات
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
                حذف الحساب
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
