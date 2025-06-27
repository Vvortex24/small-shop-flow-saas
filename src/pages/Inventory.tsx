
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Package, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productName.trim() || !productPrice || !productStock) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          user_id: user?.id,
          name: productName.trim(),
          price: parseFloat(productPrice),
          stock: parseInt(productStock)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully"
      });

      // Reset form and refresh products
      setProductName("");
      setProductPrice("");
      setProductStock("");
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product moved to trash successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Low Stock</Badge>;
    }
    return <Badge className="bg-profit text-white">In Stock</Badge>;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and stock levels</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-business hover:bg-business-dark gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input 
                  id="product-name" 
                  placeholder="Enter product name" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-price">Price (SYP) *</Label>
                <Input 
                  id="product-price" 
                  type="number"
                  placeholder="0" 
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock Quantity *</Label>
                <Input 
                  id="product-stock" 
                  type="number"
                  placeholder="0" 
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-business hover:bg-business-dark"
                  disabled={!productName.trim() || !productPrice || !productStock || isSubmitting}
                  onClick={handleAddProduct}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProductName("");
                    setProductPrice("");
                    setProductStock("");
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

      {/* Search and Filters - Only show if user has products */}
      {products.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-business-light rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-business" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="text-sm text-gray-600">
                        Stock: {product.stock} units
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Added:</strong> {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  {getStockStatus(product.stock)}
                  <p className="text-2xl font-bold text-business">{product.price.toLocaleString()} SYP</p>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first product to your inventory</p>
            <p className="text-sm text-gray-500">Products you add will help you create orders more easily</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Inventory;
