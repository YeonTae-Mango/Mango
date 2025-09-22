import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Smartphone, Map } from "lucide-react";

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: "/",
      icon: Home,
      label: "랜딩"
    },
    {
      path: "/admin",
      icon: BarChart3,
      label: "관리자"
    },
    {
      path: "/webView",
      icon: Smartphone,
      label: "웹뷰"
    },
    {
      path: "/kakaoMap",
      icon: Map,
      label: "카카오맵"
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-orange-500">mango</div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? "bg-orange-100 text-orange-600" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
