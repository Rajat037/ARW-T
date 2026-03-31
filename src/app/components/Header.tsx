import { Link } from 'react-router';
import { ChevronDown, User, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

const productsMenu = [
  "File Your Return",
  "Upload Form 16",
  "CA Assisted Tax Filing",
  "Tax Planning Optimiser",
  "TDS Solution",
  "NRI Taxes & ITR Filing",
  "Tax Advisory Services",
  "Capital Gain Tax Filing",
  "Income Tax Notices",
  "Revised Return Filing",
  "Belated Return Filing",
  "ITR U (Updated Return)",
];

const toolsMenu = [
  { name: "Tax Refund Status", col: 1 },
  { name: "Income Tax Calculator", col: 2 },
  { name: "Form 12BB", col: 1 },
  { name: "HRA Calculator", col: 2 },
  { name: "Gratuity Calculator", col: 1 },
  { name: "Rent Receipt Generator", col: 2 },
  { name: "TDS Calculator", col: 1 },
  { name: "ITR Eligibility Checker", col: 2 },
  { name: "Transport Allowance Calculator", col: 1 },
  { name: "Calculator on Section 234F", col: 2 },
  { name: "Leave Encashment Calculator", col: 1 },
  { name: "80C Calculator", col: 2 },
  { name: "House Property Calculator", col: 1 },
  { name: "Cryptocurrency Tax Calculator", col: 2 },
  { name: "80D Calculator", col: 1 },
  { name: "Simple Interest Calculator", col: 2 },
  { name: "80TTA Calculator", col: 1 },
  { name: "80DD Calculator", col: 2 },
  { name: "80U Calculator", col: 1 },
  { name: "Compound Interest Calculator", col: 2 },
  { name: "Old vs New Tax Slab Regime Calculator", col: 1 },
  { name: "Sukanya Samriddhi Yojana Calculator", col: 2 },
  { name: "IFSC Code Search", col: 1 },
];

const knowledgeCenterMenu = [
  "FAQ",
  "Tax Glossary",
  "Video Tutorials",
];

const guidesMenu = {
  "Income Tax Guides": [
    "Aadhar",
    "Capital Gains Income",
    "E-filing of ITR",
    "House Property",
    "Income Tax Calendar",
    "Income Tax Notices",
    "Income Tax Slabs",
    "Income Tax Verification",
    "Pan Card",
    "Salary Income",
    "Section 80 Deductions",
    "TDS",
  ],
  "GST Guides": [
    "GST",
    "GST System",
    "GST Registration",
    "Input Tax Credit",
    "GST Procedure",
    "GST Returns",
    "GST eWay Bill",
    "GST Rates",
  ],
};

interface DropdownProps {
  label: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  alignRight?: boolean;
}

function Dropdown({ label, isOpen, onToggle, children, alignRight }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 hover:text-green-600 transition-colors"
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={onToggle}
          />
          <div className={`absolute top-full ${alignRight ? 'right-0' : 'left-0'} mt-2 bg-white rounded-lg shadow-lg z-20 min-w-[240px] max-h-[80vh] overflow-y-auto`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" onClick={closeDropdowns}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-2xl font-semibold text-gray-800">
                A.R. Wealth & Tax Co.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Dropdown
              label="Products"
              isOpen={openDropdown === 'products'}
              onToggle={() => toggleDropdown('products')}
            >
              <div className="py-2">
                {productsMenu.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeDropdowns}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown
              label="Tools"
              isOpen={openDropdown === 'tools'}
              onToggle={() => toggleDropdown('tools')}
            >
              <div className="py-2 grid grid-cols-2 gap-x-4 min-w-[480px]">
                {[1, 2].map((col) => (
                  <div key={col}>
                    {toolsMenu
                      .filter((item) => item.col === col)
                      .map((item) => (
                        <button
                          key={item.name}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors text-sm"
                          onClick={closeDropdowns}
                        >
                          {item.name}
                        </button>
                      ))}
                  </div>
                ))}
                <button
                  className="col-span-2 text-center px-4 py-3 text-green-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  onClick={closeDropdowns}
                >
                  More Tax Tools
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              </div>
            </Dropdown>

            <Dropdown
              label="Knowledge Center"
              isOpen={openDropdown === 'knowledge'}
              onToggle={() => toggleDropdown('knowledge')}
            >
              <div className="py-2">
                {knowledgeCenterMenu.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeDropdowns}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown
              label="Guides"
              isOpen={openDropdown === 'guides'}
              onToggle={() => toggleDropdown('guides')}
            >
              <div className="py-2 grid grid-cols-2 gap-x-4 min-w-[480px]">
                {Object.entries(guidesMenu).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 font-semibold text-gray-900">{category}</div>
                    {items.map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors text-sm"
                        onClick={closeDropdowns}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
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

            {localStorage.getItem('token') ? (
              <Dropdown
                label={<User className="w-5 h-5" />}
                isOpen={openDropdown === 'profile'}
                onToggle={() => toggleDropdown('profile')}
                alignRight={true}
              >
                <div className="py-2 min-w-[200px]">
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors w-full text-left" onClick={closeDropdowns}>
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors w-full text-left" onClick={closeDropdowns}>
                    <UserCircle className="w-4 h-4" /> My Profile
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </Dropdown>
            ) : (
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
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}