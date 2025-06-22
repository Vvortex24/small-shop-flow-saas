
import { Home, ShoppingCart, Package, DollarSign, User, Trash2 } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory", 
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Balance",
    url: "/balance",
    icon: DollarSign,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-business flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-business">MyStore</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={cn(
                      "w-full h-12 rounded-lg transition-all duration-200 bg-white hover:bg-gray-100",
                      location.pathname === item.url 
                        ? "bg-business text-white shadow-md hover:bg-business-dark" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-4" onClick={handleLinkClick}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Trash Section */}
              <SidebarMenuItem className="mt-8">
                <SidebarMenuButton className="w-full h-12 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 bg-white">
                  <div className="flex items-center gap-3 px-4">
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Trash</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
