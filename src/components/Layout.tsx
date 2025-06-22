
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = () => {
  return (
    <>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="text-xl font-semibold text-business hidden lg:block">MyStore</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="text-business border-business hover:bg-business-light">
              My Plan
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-business text-white">AM</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">Ahmad Mohammed</span>
            </div>
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
