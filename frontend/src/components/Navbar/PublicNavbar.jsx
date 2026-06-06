import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

export default function PublicNavbar() {
  return (
    <Disclosure as="nav" className="glass-dark border-b border-white/5 sticky top-0 z-40">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
              {/*  <FaWallet className="text-[#e8dcc8] text-xl" /> */}
                <span className="text-[#f5f0e8] font-bold text-lg">Expense Tracker</span>
              </Link>

              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-8 py-3 border border-white/5 hover:border-[#e8dcc8]/50 text-[#a89f91] hover:text-[#f5f0e8] font-semibold rounded-xl transition duration-200">
                  Sign In
                </Link>
               
              </div>

              <div className="md:hidden">
                <Disclosure.Button className="text-[#a89f91] hover:text-[#f5f0e8]">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden border-t border-white/5">
            <div className="px-4 py-3 space-y-2">
              <Link to="/login" className="block py-2 text-[#a89f91] hover:text-[#f5f0e8] text-sm">Sign In</Link>
            
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}