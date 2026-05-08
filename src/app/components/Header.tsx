import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LayoutDashboard,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const knowledgeCenterMenu = [
  { name: "FAQ", path: "/faq" },
];

interface DropdownProps {
  label: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  alignRight?: boolean;
  id: string;
}

function Dropdown({
  label,
  isOpen,
  onToggle,
  children,
  alignRight,
  id,
}: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 hover:text-green-600 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div
            id={`dropdown-${id}`}
            role="menu"
            className={`absolute top-full ${alignRight ? "right-0" : "left-0"} mt-2 bg-white rounded-lg shadow-lg z-20 min-w-[240px] max-h-[80vh] overflow-y-auto`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// --- Mobile Accordion ---
interface MobileAccordionProps {
  label: string;
  children: React.ReactNode;
}

function MobileAccordion({ label, children }: MobileAccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:text-green-600"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="pb-2 px-2">{children}</div>}
    </div>
  );
}

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => {
              closeDropdowns();
              closeMobile();
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-2xl font-semibold text-gray-800">
                A.R. Wealth & Tax Co.
              </span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Dropdown
              id="knowledge"
              label="Knowledge Center"
              isOpen={openDropdown === "knowledge"}
              onToggle={() => toggleDropdown("knowledge")}
            >
              <div className="py-2">
                {knowledgeCenterMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    role="menuitem"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeDropdowns}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Dropdown>

            <Link
              to="/pricing"
              className="px-3 py-2 hover:text-green-600 transition-colors"
              onClick={closeDropdowns}
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2 hover:text-green-600 transition-colors"
              onClick={closeDropdowns}
            >
              Contact
            </Link>

            {!loading && user ? (
              <Dropdown
                id="profile"
                label={<User className="w-5 h-5" aria-hidden="true" />}
                isOpen={openDropdown === "profile"}
                onToggle={() => toggleDropdown("profile")}
                alignRight={true}
              >
                <div className="py-2 min-w-[200px]">
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors w-full text-left"
                    onClick={closeDropdowns}
                  >
                    <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> My Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors w-full text-left"
                    onClick={closeDropdowns}
                  >
                    <UserCircle className="w-4 h-4" aria-hidden="true" /> My Profile
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      closeDropdowns();
                      logout();
                    }}
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
                  </button>
                </div>
              </Dropdown>
            ) : !loading ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 hover:text-green-600 transition-colors"
                  onClick={closeDropdowns}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={closeDropdowns}
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            className="fixed top-0 right-0 h-full w-[85vw] max-w-[360px] bg-white z-50 shadow-2xl overflow-y-auto md:hidden animate-in slide-in-from-right"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-800">Menu</span>
              <button
                onClick={closeMobile}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <MobileAccordion label="Knowledge Center">
                {knowledgeCenterMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                    onClick={closeMobile}
                  >
                    {item.name}
                  </Link>
                ))}
              </MobileAccordion>

              <div className="border-b border-gray-100">
                <Link
                  to="/pricing"
                  className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600"
                  onClick={closeMobile}
                >
                  Pricing
                </Link>
              </div>

              <div className="border-b border-gray-100">
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600"
                  onClick={closeMobile}
                >
                  Contact
                </Link>
              </div>

              {!loading && user ? (
                <>
                  <div className="border-b border-gray-100">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:text-green-600"
                      onClick={closeMobile}
                    >
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> My Dashboard
                    </Link>
                  </div>
                  <div className="border-b border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:text-green-600"
                      onClick={closeMobile}
                    >
                      <UserCircle className="w-4 h-4" aria-hidden="true" /> My Profile
                    </Link>
                  </div>
                  <div className="px-4 py-3">
                    <button
                      onClick={() => {
                        closeMobile();
                        logout();
                      }}
                      className="flex items-center gap-3 text-red-600 font-medium hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
                    </button>
                  </div>
                </>
              ) : !loading ? (
                <div className="p-4 space-y-3">
                  <Link
                    to="/login"
                    className="block text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors"
                    onClick={closeMobile}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    onClick={closeMobile}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
