
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات وهمية للمنتجات الجاهزة
  const readyProducts = [
    {
      id: "1",
      name: "فستان أزرق أنيق",
      price: 250,
      quantity: 5,
      description: "فستان صيفي أنيق للمناسبات",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300",
      addedDate: "2024-01-15"
    },
    {
      id: "2", 
      name: "بدلة رسمية رجالي",
      price: 800,
      quantity: 3,
      description: "بدلة رسمية عالية الجودة",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      addedDate: "2024-01-10"
    },
    {
      id: "3",
      name: "حقيبة يد نسائية",
      price: 180,
      quantity: 8,
      description: "حقيبة أنيقة للاستخدام اليومي",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      addedDate: "2024-01-12"
    }
  ];

  // بيانات وهمية للمواد الخام
  const rawMaterials = [
    {
      id: "1",
      name: "قماش قطني",
      cost: 45,
      quantity: 20,
      unit: "متر",
      supplier: "شركة النسيج الذهبي",
      addedDate: "2024-01-18"
    },
    {
      id: "2",
      name: "أزرار معدنية", 
      cost: 25,
      quantity: 100,
      unit: "قطعة",
      supplier: "مصنع الإكسسوارات",
      addedDate: "2024-01-16"
    }
  ];

  const filteredReadyProducts = readyProducts.filter(product => 
    product.name.includes(searchTerm)
  );

  const filteredRawMaterials = rawMaterials.filter(material => 
    material.name.includes(searchTerm)
  );

  const getStockBadge = (quantity: number) => {
    if (quantity > 10) return <Badge className="bg-profit text-white">متوفر</Badge>;
    if (quantity > 0) return <Badge className="bg-yellow-500 text-white">قليل</Badge>;
    return <Badge variant="destructive">نفذ</Badge>;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-600 mt-1">تتبع المنتجات والمواد الخام</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في المخزون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Products vs Raw Materials */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">المنتجات الجاهزة</TabsTrigger>
          <TabsTrigger value="materials">المواد الخام</TabsTrigger>
        </TabsList>
        
        {/* Ready Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">المنتجات الجاهزة للبيع</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-profit hover:bg-profit-dark gap-2">
                  <Plus className="w-4 h-4" />
                  منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة منتج جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">اسم المنتج</Label>
                    <Input id="product-name" placeholder="أدخل اسم المنتج" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر</Label>
                      <Input id="price" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">الكمية</Label>
                      <Input id="quantity" type="number" placeholder="0" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea id="description" placeholder="وصف المنتج..." rows={3} />
                  </div>
                  
                  <Button className="w-full bg-profit hover:bg-profit-dark">
                    إضافة المنتج
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadyProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                      {getStockBadge(product.quantity)}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-business">{product.price} ريال</span>
                      <span className="text-sm text-gray-500">{product.quantity} قطعة</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Raw Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">المواد الخام والمستوردة</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-expense hover:bg-expense-dark gap-2">
                  <Plus className="w-4 h-4" />
                  مادة خام جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة مادة خام</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-name">اسم المادة</Label>
                    <Input id="material-name" placeholder="أدخل اسم المادة" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost">التكلفة</Label>
                      <Input id="cost" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-quantity">الكمية</Label>
                      <Input id="material-quantity" type="number" placeholder="0" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier">المورد</Label>
                    <Input id="supplier" placeholder="اسم المورد" />
                  </div>
                  
                  <Button className="w-full bg-expense hover:bg-expense-dark">
                    إضافة المادة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredRawMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-expense-light rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-expense" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{material.name}</h3>
                        <p className="text-sm text-gray-600">المورد: {material.supplier}</p>
                        <p className="text-xs text-gray-500">تم الإضافة: {material.addedDate}</p>
                      </div>
                    </div>
                    
                    <div className="text-left space-y-1">
                      <p className="text-2xl font-bold text-expense">{material.cost} ريال</p>
                      <p className="text-sm text-gray-600">{material.quantity} {material.unit}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredReadyProducts.length === 0 && filteredRawMaterials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">ابدأ بإضافة منتجاتك الأولى</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Inventory;
