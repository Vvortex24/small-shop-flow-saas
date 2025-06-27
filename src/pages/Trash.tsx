
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Package, ShoppingCart, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

const Trash = () => {
  // Start with empty arrays for new users
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [deletedMaterials, setDeletedMaterials] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const restoreOrder = (orderId: number) => {
    setDeletedOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const restoreProduct = (productId: number) => {
    setDeletedProducts(prev => prev.filter(product => product.id !== productId));
  };

  const restoreMaterial = (materialId: number) => {
    setDeletedMaterials(prev => prev.filter(material => material.id !== materialId));
  };

  const permanentlyDelete = (type: string, id: number) => {
    if (type === 'order') {
      setDeletedOrders(prev => prev.filter(item => item.id !== id));
    } else if (type === 'product') {
      setDeletedProducts(prev => prev.filter(item => item.id !== id));
    } else if (type === 'material') {
      setDeletedMaterials(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trash</h1>
        <p className="text-gray-600">Manage deleted items and restore them if needed</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2 text-xs sm:text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 text-xs sm:text-sm">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2 text-xs sm:text-sm">
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Materials</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Deleted Orders ({deletedOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted orders</h3>
                <p className="text-gray-500">Items you delete will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Deleted Products ({deletedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted products</h3>
                <p className="text-gray-500">Items you delete will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Deleted Raw Materials ({deletedMaterials.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted materials</h3>
                <p className="text-gray-500">Items you delete will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trash;
