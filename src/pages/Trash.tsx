
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Package, ShoppingCart, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

const Trash = () => {
  const [deletedOrders, setDeletedOrders] = useState([
    { id: 1, customer: "Sara Ahmed", product: "Blue Dress", amount: 177000, deletedAt: "2024-01-20" },
    { id: 2, customer: "Mohammed Ali", product: "Formal Suit", amount: 250000, deletedAt: "2024-01-19" },
  ]);

  const [deletedProducts, setDeletedProducts] = useState([
    { id: 1, name: "Red Dress", category: "Clothing", price: 125000, deletedAt: "2024-01-18" },
    { id: 2, name: "Black Shoes", category: "Footwear", price: 85000, deletedAt: "2024-01-17" },
  ]);

  const [deletedMaterials, setDeletedMaterials] = useState([
    { id: 1, name: "Cotton Fabric", quantity: "5 meters", cost: 41700, deletedAt: "2024-01-16" },
    { id: 2, name: "Silk Thread", quantity: "10 rolls", cost: 25000, deletedAt: "2024-01-15" },
  ]);

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
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trash</h1>
        <p className="text-gray-600">Manage deleted items and restore them if needed</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Raw Materials
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
              {deletedOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No deleted orders</p>
              ) : (
                <div className="space-y-4">
                  {deletedOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.customer} - {order.product}</p>
                        <p className="text-sm text-gray-500">Deleted on {order.deletedAt}</p>
                        <p className="text-sm font-medium text-profit">{order.amount.toLocaleString()} SYP</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreOrder(order.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => permanentlyDelete('order', order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {deletedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No deleted products</p>
              ) : (
                <div className="space-y-4">
                  {deletedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">Category: {product.category}</p>
                        <p className="text-sm text-gray-500">Deleted on {product.deletedAt}</p>
                        <p className="text-sm font-medium text-business">{product.price.toLocaleString()} SYP</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreProduct(product.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => permanentlyDelete('product', product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {deletedMaterials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No deleted raw materials</p>
              ) : (
                <div className="space-y-4">
                  {deletedMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {material.quantity}</p>
                        <p className="text-sm text-gray-500">Deleted on {material.deletedAt}</p>
                        <p className="text-sm font-medium text-expense">{material.cost.toLocaleString()} SYP</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreMaterial(material.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => permanentlyDelete('material', material.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Forever
                        </Button>
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

export default Trash;
