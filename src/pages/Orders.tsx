import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Phone, User, ShoppingCart, Edit, Trash2, Upload, MapPin, Calendar, CheckCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<{id: string, quantity: number}[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingLocation, setShippingLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's products
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  // Fetch user's orders
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order marked as ${newStatus}`,
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setCustomerName(order.customer_name);
    setIsEditDialogOpen(true);
  };

  const saveOrderEdit = async () => {
    if (!editingOrder || !customerName.trim()) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          customer_name: customerName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingOrder.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingOrder(null);
      setCustomerName("");
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order moved to trash successfully",
      });

      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const addProductToOrder = () => {
    setSelectedProducts([...selectedProducts, { id: "", quantity: 1 }]);
  };

  const removeProductFromOrder = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateSelectedProduct = (index: number, productId: string, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index] = { id: productId, quantity };
    setSelectedProducts(updated);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (attachments.length + files.length <= 5) {
      setAttachments([...attachments, ...files]);
    } else {
      alert("Maximum 5 attachments allowed");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getProductStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock : 0;
  };

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, sp) => {
      const price = getProductPrice(sp.id);
      return total + (price * sp.quantity);
    }, 0);
  };

  const canPlaceOrder = () => {
    return customerName.trim() !== "" && 
           phoneNumber.trim() !== "" && 
           shippingLocation.trim() !== "" && 
           selectedProducts.length > 0 && 
           selectedProducts.every(sp => sp.id !== "" && sp.quantity > 0 && sp.quantity <= getProductStock(sp.id));
  };

  const sendWebhook = async (orderData: any) => {
    try {
      const webhookUrl = "https://a7mad227.app.n8n.cloud/webhook-test/Mashytak";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(orderData),
      });

      console.log("Webhook sent successfully:", orderData);
    } catch (error) {
      console.error("Error sending webhook:", error);
    }
  };

  const handleAddOrder = async () => {
    if (!canPlaceOrder()) return;

    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotalPrice();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          customer_name: customerName,
          amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const webhookData = {
        orderId: orderData.id,
        customerName,
        phoneNumber,
        shippingLocation,
        deadline: deadline || null,
        products: selectedProducts.map(sp => {
          const product = products.find(p => p.id === sp.id);
          return {
            id: sp.id,
            name: product?.name,
            price: product?.price,
            quantity: sp.quantity,
            total: (product?.price || 0) * sp.quantity
          };
        }),
        attachments: attachments.map(file => file.name),
        notes,
        totalPrice: totalAmount,
        timestamp: new Date().toISOString()
      };

      await sendWebhook(webhookData);
      
      toast({
        title: "Thank You!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Your order has been successfully submitted. We'll process it shortly.</span>
          </div>
        ),
        className: "border-green-200 bg-green-50",
      });

      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setPhoneNumber("");
    setShippingLocation("");
    setDeadline("");
    setSelectedProducts([]);
    setAttachments([]);
    setNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-profit text-white">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
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
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-profit hover:bg-profit-dark gap-2">
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Add New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name *</Label>
                  <Input 
                    id="customer" 
                    placeholder="Enter customer name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    placeholder="09xxxxxxxx" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">To Where *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="location" 
                    placeholder="Enter shipping location" 
                    value={shippingLocation}
                    onChange={(e) => setShippingLocation(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="deadline" 
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              {/* Products Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Products *</Label>
                  <Button type="button" onClick={addProductToOrder} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Product
                  </Button>
                </div>
                
                {products.length === 0 && (
                  <p className="text-sm text-gray-500">You need to add products to your inventory first before creating orders.</p>
                )}
                
                {selectedProducts.length === 0 && products.length > 0 && (
                  <p className="text-sm text-gray-500">Click "Add Product" to select products for this order.</p>
                )}

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedProducts.map((selectedProduct, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Product {index + 1}</Label>
                        <Button 
                          type="button"
                          onClick={() => removeProductFromOrder(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Select 
                          value={selectedProduct.id} 
                          onValueChange={(value) => updateSelectedProduct(index, value, selectedProduct.quantity)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem 
                                key={product.id} 
                                value={product.id} 
                                disabled={product.stock === 0}
                              >
                                {product.name} - {product.price.toLocaleString()} SYP (Stock: {product.stock})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input 
                          type="number" 
                          min="1" 
                          max={getProductStock(selectedProduct.id)}
                          value={selectedProduct.quantity}
                          onChange={(e) => updateSelectedProduct(index, selectedProduct.id, Number(e.target.value))}
                          placeholder="Qty"
                        />
                      </div>
                      
                      {selectedProduct.id && selectedProduct.quantity > getProductStock(selectedProduct.id) && (
                        <p className="text-red-500 text-xs">Quantity exceeds available stock!</p>
                      )}
                      
                      {selectedProduct.id && (
                        <p className="text-sm text-gray-600">
                          Subtotal: {(getProductPrice(selectedProduct.id) * selectedProduct.quantity).toLocaleString()} SYP
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Real-time Total Price */}
                {selectedProducts.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Total Order Price:</span>
                      <span className="text-xl font-bold text-blue-900">
                        {calculateTotalPrice().toLocaleString()} SYP
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label>Attachments (Max 5 files)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    multiple 
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" className="gap-2" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </span>
                    </Button>
                  </Label>
                  <span className="text-sm text-gray-500">{attachments.length}/5</span>
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special notes..." 
                  rows={3} 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-profit hover:bg-profit-dark"
                  disabled={!canPlaceOrder() || isSubmitting || products.length === 0}
                  onClick={handleAddOrder}
                >
                  {isSubmitting ? "Adding Order..." : "Add Order"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
              
              {products.length === 0 && (
                <p className="text-sm text-red-600 text-center">
                  Please add products to your inventory first before creating orders.
                </p>
              )}
              
              {products.length > 0 && !canPlaceOrder() && (
                <p className="text-sm text-red-600 text-center">
                  Please fill in all required fields: Customer Name, Phone Number, Shipping Location, and at least one Product.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-customer">Customer Name</Label>
              <Input 
                id="edit-customer" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={saveOrderEdit}
                className="flex-1 bg-business hover:bg-business-dark"
                disabled={!customerName.trim()}
              >
                Save Changes
              </Button>
              <Button 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingOrder(null);
                  setCustomerName("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters - Only show if user has orders */}
      {orders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

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
                      <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                      <div className="text-sm text-gray-600">
                        Order #{order.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Created:</strong> {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  {getStatusBadge(order.status)}
                  <p className="text-2xl font-bold text-business">{order.amount.toLocaleString()} SYP</p>
                  
                  {/* Status Actions */}
                  <div className="flex gap-1 justify-end mb-2">
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 hover:bg-green-50 px-2"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50 px-2"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {order.status === 'cancelled' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-yellow-600 hover:bg-yellow-50 px-2"
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                      >
                        Restore
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-yellow-600 hover:bg-yellow-50 px-2"
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteOrder(order.id)}
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
      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first order to track your business</p>
            {products.length === 0 && (
              <p className="text-sm text-gray-500">Tip: Add products to your inventory first to create orders more easily</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
