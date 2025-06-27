
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Mail, MapPin, Calendar, Crown, Settings, Bell, Shield, LogOut, Trash2, Upload, Camera } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDays: 0,
    avgOrderValue: 0
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      fetchUserStats();
    }
  }, [profile, user]);

  const fetchUserStats = async () => {
    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch transactions
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('type', 'income');

      const totalOrders = orders?.length || 0;
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate active days (days since account creation)
      const joinDate = new Date(user?.created_at || '');
      const today = new Date();
      const activeDays = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

      setStats({
        totalOrders,
        totalRevenue,
        activeDays: Math.max(1, activeDays),
        avgOrderValue: Math.round(avgOrderValue)
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await updateProfile({ name });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // First delete user's data
      await supabase.from('orders').delete().eq('user_id', user?.id);
      await supabase.from('products').delete().eq('user_id', user?.id);
      await supabase.from('financial_transactions').delete().eq('user_id', user?.id);
      await supabase.from('profiles').delete().eq('id', user?.id);
      
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted",
        variant: "destructive"
      });
      
      // Sign out after deletion
      await signOut();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
      </div>

      {/* Profile Overview */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={profileImage || "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=150&h=150&fit=crop&crop=face"} />
                <AvatarFallback className="bg-business text-white text-4xl">
                  {profile.name?.charAt(0) || '👤'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="w-8 h-8 bg-business text-white rounded-full flex items-center justify-center hover:bg-business-dark transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <Badge className="bg-business text-white border-business hover:bg-business-dark gap-1 w-fit mx-auto sm:mx-0">
                  <Crown className="w-4 h-4" />
                  Free Plan
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
            <p className="text-2xl font-bold text-business">{stats.totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-profit">{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-business">{stats.activeDays}</p>
            <p className="text-sm text-gray-600">Active Days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.avgOrderValue}</p>
            <p className="text-sm text-gray-600">Avg Order Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Personal Information</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profile.email || ''} disabled />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-business hover:bg-business-dark"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-business-light rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-business" />
                  </div>
                  <div>
                    <p className="font-medium">Join Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-business-light rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-business" />
                  </div>
                  <div>
                    <p className="font-medium">Subscription Type</p>
                    <p className="text-sm text-gray-600">Free Plan</p>
                  </div>
                </div>
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
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "orders", label: "New order notifications", checked: true },
                { id: "inventory", label: "Low stock alerts", checked: true },
                { id: "reports", label: "Weekly reports", checked: false },
                { id: "marketing", label: "Offers and discounts", checked: true }
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
                Security and Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-blue-600 hover:bg-blue-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
