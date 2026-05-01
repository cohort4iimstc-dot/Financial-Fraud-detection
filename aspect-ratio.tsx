import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Shield, Activity, Bell, BarChart3, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import NotificationCenter from "./NotificationCenter";
import FraudAlertToast from "./FraudAlertToast";
import { Toaster } from "sonner";
import logoImage from '../../imports/image-2.png';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('trustx_auth');
    navigate('/login');
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Shield },
    { path: "/transactions", label: "Transactions", icon: Activity },
    { path: "/alerts", label: "Alerts", icon: Bell },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" expand={true} richColors />
      <FraudAlertToast />
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <img
                src={logoImage}
                alt="TrustX Logo"
                className="h-20 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1 items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-700"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="ml-2 flex items-center gap-1">
                <NotificationCenter />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button and Notification */}
            <div className="md:hidden flex items-center gap-1">
              <NotificationCenter />
              <button
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-700"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                src={logoImage}
                alt="TrustX Logo"
                className="h-24 w-auto mb-3"
              />
              <p className="text-sm text-gray-400">
                Advanced fraud detection and prevention powered by AI and machine learning.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Support</h3>
              <p className="text-xl font-bold text-blue-400">1-800-FRAUD-HELP</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Quick Links</h3>
              <div className="text-sm space-y-1">
                <Link to="/transactions" className="block text-gray-400 hover:text-white">
                  Monitor Transactions
                </Link>
                <Link to="/alerts" className="block text-gray-400 hover:text-white">
                  View Alerts
                </Link>
                <Link to="/analytics" className="block text-gray-400 hover:text-white">
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            © 2026 TrustX. Protecting your financial assets with intelligent fraud detection.
          </div>
        </div>
      </footer>
    </div>
  );
}
