import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import bglogo from "../../assets/bglogo.png";
import auth from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const Navbar = ({ setSearchTerm }) => {
  const [log, setLog] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLog(true);
        setUserName(user.email);
      } else {
        setLog(false);
        setUserName("");
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      setLog(false);
      setUserName("");
      toast.error("User Logged out");
      navigate("/login");
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      {/* Main Navbar */}
      <nav className="bg-[#131921] fixed w-full z-50 top-0 flex items-center justify-between p-3">
        {/* Menu Button (only visible on small screens) */}
        <button className="p-2 text-white lg:hidden" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        {/* Logo (hidden on small screens) */}
        <Link to="/" className="hidden md:block">
          <img
            src={bglogo}
            alt="bglogo"
            className="h-10 md:h-11 border-2 border-transparent hover:border-white"
          />
        </Link>
        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-md py-2 px-2 mx-2 flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent focus:outline-none w-full px-2"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button className="px-2">
            <CiSearch size={20} />
          </button>
        </div>
        {/* User Details and Logout (hidden on small screens) */}
        {log ? (
          <div className="hidden md:flex items-center text-white space-x-2">
            <FaUser size={20} />
            <span className="hidden lg:block">{userName}</span>
            <button
              className="border-2 border-transparent hover:border-white p-2"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="hidden md:flex text-white border-2 border-transparent hover:border-white p-2"
            onClick={() => navigate("/login")}
          >
            <FaUser size={20} />
            <span className="hidden lg:block">Login</span>
          </button>
        )}
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="text-white flex items-center gap-1 relative border-2 border-transparent hover:border-white p-3"
        >
          <FaShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute top-0 left-4 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </nav>

      {/* Sidebar Menu */}

      <div
        className={`fixed top-0 left-0 w-64 bg-[#131921] h-full z-50 transition-transform duration-200 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="p-4 flex justify-between items-center">
          <button className="text-white" onClick={toggleMenu}>
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex flex-col items-start p-4 gap-4">
          {log ? (
            <div className="flex flex-col gap-2 text-white">
              <span>{userName}</span>
              <button
                className="bg-red-500 py-2 px-4 rounded-md"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
