import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package, Edit, Trash2, Upload, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  type: string;
  photo_url?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const [materialName, setMaterialName] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");
  const [materialStock, setMaterialStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'product' | 'material'>('product');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch ready products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .eq('type', 'ready_product')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      
      // Fetch raw materials  
      const { data: materialsData, error: materialsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .eq('type', 'raw_material')
        .order('created_at', { ascending: false });

      if (materialsError) throw materialsError;

      setProducts(productsData || []);
      setRawMaterials(materialsData || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProductPhoto(file);
    }
  };

  const handleAddProduct = async () => {
    if (!productName.trim() || !productPrice || !productStock || !productPhoto) {
      toast({
        title: "Error",
        description: "Please fill all fields and upload a product photo",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          user_id: user?.id,
          name: productName.trim(),
          price: parseFloat(productPrice),
          stock: parseInt(productStock),
          type: 'ready_product',
          photo_url: productPhoto.name // In a real app, you'd upload to storage first
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ready product added successfully"
      });

      setProductName("");
      setProductPrice("");
      setProductStock("");
      setProductPhoto(null);
      fetchInventory();
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

  const handleAddMaterial = async () => {
    if (!materialName.trim() || !materialPrice || !materialStock) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          user_id: user?.id,
          name: materialName.trim(),
          price: parseFloat(materialPrice),
          stock: parseInt(materialStock),
          type: 'raw_material'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Raw material added successfully"
      });

      setMaterialName("");
      setMaterialPrice("");
      setMaterialStock("");
      fetchInventory();
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: "Error",
        description: "Failed to add material",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = (item: Product, type: 'product' | 'material') => {
    setEditingItem(item);
    setEditType(type);
    if (type === 'product') {
      setProductName(item.name);
      setProductPrice(item.price.toString());
      setProductStock(item.stock.toString());
    } else {
      setMaterialName(item.name);
      setMaterialPrice(item.price.toString());
      setMaterialStock(item.stock.toString());
    }
    setIsEditDialogOpen(true);
  };

  const saveItemEdit = async () => {
    if (!editingItem) return;

    const name = editType === 'product' ? productName : materialName;
    const price = editType === 'product' ? productPrice : materialPrice;
    const stock = editType === 'product' ? productStock : materialStock;

    if (!name.trim() || !price || !stock) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          name: name.trim(),
          price: parseFloat(price),
          stock: parseInt(stock),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${editType === 'product' ? 'Product' : 'Material'} updated successfully`,
      });

      resetEditForm();
      fetchInventory();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: `Failed to update ${editType}`,
        variant: "destructive",
      });
    }
  };

  const resetEditForm = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setMaterialName("");
    setMaterialPrice("");
    setMaterialStock("");
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item moved to trash successfully",
      });

      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = rawMaterials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p className="text-gray-600 mt-1">Manage your products and raw materials</p>
        </div>
      </div>

      {/* Search - Only show if user has items */}
      {(products.length > 0 || rawMaterials.length > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Ready Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Raw Materials ({rawMaterials.length})
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          {/* Empty State for Products */}
          {products.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ready products yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first ready product</p>
                <p className="text-sm text-gray-500">Ready products require a photo upload</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          {/* Empty State for Materials */}
          {rawMaterials.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No raw materials yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first raw material</p>
                <p className="text-sm text-gray-500">Raw materials don't require photos</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editType === 'product' ? 'Product' : 'Raw Material'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={editType === 'product' ? productName : materialName}
                onChange={(e) => editType === 'product' ? setProductName(e.target.value) : setMaterialName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (SYP)</Label>
              <Input 
                id="edit-price" 
                type="number"
                value={editType === 'product' ? productPrice : materialPrice}
                onChange={(e) => editType === 'product' ? setProductPrice(e.target.value) : setMaterialPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input 
                id="edit-stock" 
                type="number"
                value={editType === 'product' ? productStock : materialStock}
                onChange={(e) => editType === 'product' ? setProductStock(e.target.value) : setMaterialStock(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={saveItemEdit}
                className="flex-1 bg-business hover:bg-business-dark"
              >
                Save Changes
              </Button>
              <Button 
                onClick={resetEditForm}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
