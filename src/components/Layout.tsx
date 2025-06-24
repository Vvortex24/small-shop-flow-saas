
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Layout = () => {
  const handleSubscriptionClick = () => {
    // Handle subscription functionality
    console.log("Subscription clicked");
    // You can add subscription logic here or navigate to a subscription page
  };

  return (
    <>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-business">Mashaytak</h1>
              <p className="text-xs text-gray-400 opacity-60">store manager</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-business border-business hover:bg-business-light flex items-center gap-2"
              onClick={handleSubscriptionClick}
            >
              <Crown className="w-4 h-4" />
              Subscription
            </Button>
            <Link to="/profile">
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-4 hover:ring-business/20 transition-all duration-200">
                <AvatarImage src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback className="bg-business text-white">
                  🌳
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
