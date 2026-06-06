import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaWallet, FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Fragment } from "react";
import { logoutAction } from "../../redux/slice/authSlice";

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);

  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Disclosure as="nav" className="glass-dark border-b border-white/5 sticky top-0 z-40">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">

              
              <Link to="/dashboard" className="flex items-center gap-2">
               
                <span className="text-[#f5f0e8] font-bold text-lg">Expense Tracker</span>
              </Link>

              
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-[#a89f91] hover:text-[#f5f0e8] text-sm font-medium transition">
                  Dashboard
                </Link>
                <Link to="/categories" className="text-[#a89f91] hover:text-[#f5f0e8] text-sm font-medium transition">
                  Categories
                </Link>

                
                <Menu as="div" className="relative">
                  <Menu.Button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#e8dcc8] hover:bg-[#e8dcc8]/20 transition">
                    <FaUser className="text-sm" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#0d1825]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 focus:outline-none overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-[#a89f91]">Signed in as</p>
                        <p className="text-sm font-medium text-[#f5f0e8] truncate">{user?.username || "User"}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block px-4 py-2.5 text-sm transition ${active ? "bg-white/5 text-[#f5f0e8]" : "text-[#a89f91]"}`}
                          >
                            Profile Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logoutHandler}
                            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm transition ${active ? "bg-white/5 text-red-400" : "text-[#a89f91]"}`}
                          >
                            <IoLogOutOutline className="text-base" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
              <Link to="/dashboard" className="block py-2 text-[#a89f91] hover:text-[#f5f0e8] text-sm">Dashboard</Link>
              <Link to="/categories" className="block py-2 text-[#a89f91] hover:text-[#f5f0e8] text-sm">Categories</Link>
              <Link to="/profile" className="block py-2 text-[#a89f91] hover:text-[#f5f0e8] text-sm">Profile Settings</Link>
              <button onClick={logoutHandler} className="block py-2 text-red-400 text-sm">Sign Out</button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}