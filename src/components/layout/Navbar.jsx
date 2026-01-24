// src/components/layout/Navbar.jsx - COMPLETE FIXED VERSION
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import { useState, useEffect } from "react";
import { BiX, BiMenu, BiPlus, BiMessageDetail, BiBell, BiUser } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { normalizeUser } from "../../utils/userHelper";

export default function Navbar() {
  const { user, logout } = useAuth();
  const messageContext = useMessages(); // Get message data safely
  
  // Safely destructure from messageContext (it might be undefined initially)
  const unreadCount = messageContext?.unreadCount || 0;
  const notifications = messageContext?.notifications || [];
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const displayUser = normalizeUser(user);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notifications-dropdown') && 
          !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
    };
    
    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse-items?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Logo Component
  const Logo = () => (
    <NavLink to="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-[#28a745]">Garage</span>
      <span className="text-2xl font-bold text-[#007bff]">Sale</span>
      <span className="text-xs text-gray-500 hidden md:block">
        Donate First • Swap Second • Sell Last
      </span>
    </NavLink>
  );

  // SearchBar Component
  const SearchBar = () => (
    <div className="hidden md:flex flex-1 max-w-md mx-6">
      <form onSubmit={handleSearch} className="w-full relative">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
        >
          <FiSearch size={20} />
        </button>
      </form>
    </div>
  );

  // Notifications Dropdown Component
  const NotificationsDropdown = () => (
    <div className="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <button 
              onClick={() => {}}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {notifications.map((notification, index) => (
              <div 
                key={index} 
                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setShowNotifications(false)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {notification.type === 'message' ? (
                      <BiMessageDetail className="text-blue-600" size={16} />
                    ) : (
                      <BiBell className="text-green-600" size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp 
                        ? new Date(notification.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <BiBell className="text-gray-300 mx-auto mb-2" size={24} />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-2 border-t">
          <NavLink 
            to="/notifications" 
            className="block text-center text-sm text-blue-600 hover:text-blue-800 p-2"
            onClick={() => setShowNotifications(false)}
          >
            View all notifications
          </NavLink>
        </div>
      )}
    </div>
  );

  // Visitor Menu (Not logged in)
  const VisitorMenu = () => (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink
        to="/browse-items"
        className={({ isActive }) =>
          `px-3 py-2 font-medium transition-colors ${
            isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
          }`
        }
      >
        Browse Items
      </NavLink>
      <NavLink
        to="/how-it-works"
        className="px-3 py-2 font-medium text-gray-700 hover:text-green-600 transition-colors"
      >
        How It Works
      </NavLink>
      <NavLink
        to="/login"
        className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
      >
        Sign Up Free
      </NavLink>
    </div>
  );

  // User Menu (Logged in - Normal User)
  const UserMenu = () => (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink
        to="/browse-items"
        className={({ isActive }) =>
          `px-3 py-2 font-medium transition-colors ${
            isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
          }`
        }
      >
        Browse
      </NavLink>
      
      <NavLink 
        to="/add-item" 
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
      >
        <BiPlus size={18} />
        Add Item
      </NavLink>

      {/* Messages Link with Badge */}
      <div className="relative">
        <NavLink
          to="/messages"
          className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <BiMessageDetail size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>
      </div>

      {/* Notifications Bell with Dropdown */}
      <div className="relative notifications-button">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <BiBell size={22} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>
        
        {showNotifications && <NotificationsDropdown />}
      </div>

      {/* User Profile Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.fullName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <BiUser size={18} className="text-green-600" />
            )}
          </div>
          <span className="text-sm font-medium">{user?.fullName || "User"}</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {user?.ecoScore || 0} pts
          </span>
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b">
            <p className="font-medium text-sm">{user?.fullName || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs">EcoScore:</span>
              <span className="text-sm font-bold text-green-600">
                {user?.ecoScore || 0} points
              </span>
            </div>
          </div>

          <div className="p-2">
            <NavLink to="/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              Dashboard
            </NavLink>
            <NavLink to="/my-items" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              My Items
            </NavLink>
            <NavLink to="/messages" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between items-center">
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              My Profile
            </NavLink>
            <NavLink to="/notifications" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              Notifications
            </NavLink>
            
            {displayUser?.displayUserType === "Admin" && (
              <NavLink to="/admin" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-red-600">
                Admin Panel
              </NavLink>
            )}
            
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-red-600 mt-2 border-t"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

{displayUser?.displayUserType === "Admin" && (
  <NavLink to="/admin" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-red-600">
    Admin Panel
  </NavLink>
)}

{/* ADD THIS SECTION: */}
{user?.verificationStatus && (
  <div className="border-t pt-2 mt-2">
    <div className="px-3 py-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">Verification:</span>
        <span className={`px-2 py-1 rounded-full ${
          user.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
          user.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.verificationStatus}
        </span>
      </div>
      {user.priorityLevel > 0 && (
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="font-medium">Priority Level:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {user.priorityLevel}/10
          </span>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );

  // Mobile Menu Toggle
  const MobileToggle = () => (
    <button
      className="md:hidden text-gray-700 focus:outline-none"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <BiX size={28} /> : <BiMenu size={28} />}
    </button>
  );

  // Mobile Drawer Menu
  const MobileDrawer = () => (
    <div className="md:hidden fixed inset-0 z-40 bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <Logo />
        <button onClick={() => setMobileMenuOpen(false)}>
          <BiX size={28} />
        </button>
      </div>
      
      {/* Mobile Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <FiSearch size={20} />
          </button>
        </form>
      </div>
      
      <div className="space-y-1">
        <NavLink 
          to="/" 
          className="block py-3 px-4 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink 
          to="/browse-items" 
          className="block py-3 px-4 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Browse Items
        </NavLink>
        <NavLink 
          to="/how-it-works" 
          className="block py-3 px-4 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          How It Works
        </NavLink>
        
        {user ? (
          <>
            <div className="border-t my-2"></div>
            <NavLink 
              to="/add-item" 
              className="flex items-center gap-2 py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BiPlus size={18} />
              Add Item
            </NavLink>
            <NavLink 
              to="/messages" 
              className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <BiMessageDetail size={18} />
                Messages
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/notifications" 
              className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <BiBell size={18} />
                Notifications
              </span>
              {notifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {notifications.length}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className="block py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/profile" 
              className="block py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </NavLink>
            {displayUser?.displayUserType === "Admin" && (
              <NavLink 
                to="/admin" 
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 text-red-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </NavLink>
            )}
            <button 
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100 text-red-600 border-t mt-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="border-t my-2"></div>
            <NavLink 
              to="/login" 
              className="block py-3 px-4 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className="block py-3 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up Free
            </NavLink>
          </>
        )}
      </div>
    </div>
  );

  return (
    <nav className="z-40 w-full shadow-md bg-white sticky top-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Search bar visible to all */}
          <SearchBar />
          
          {/* Show appropriate menu based on login status */}
          {user ? <UserMenu /> : <VisitorMenu />}
          
          <MobileToggle />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && <MobileDrawer />}
      
      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}