import { use, useState, useEffect, containerRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import Auth context

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, login, logout, manualLogout, isManualLogin } = useAuth(); // Access Auth context if needed
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLogin = async () => {
    try {
      if (isManualLogin) {
        setLoading(true);
        await manualLogout();
      } else if (user){
        setLoading(true);
        await logout();
      } else {
        console.log("Logging in...");
      }
    } catch {
        console.log("succesfully logout");
    } finally {
      setLoading(false);
      navigate("/authform");
    }
  };

  useEffect(() => {
    // function handleClickOutside(event) {
    //   if (
    //     containerRef.current &&
    //     !containerRef.current.contains(event.target)
    //   ) {
    //     setIsOpen(false);
    //   }
    // }

    // if (isOpen) {
    //   document.addEventListener("mousedown", handleClickOutside);
    // } else {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // }

    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, [isOpen]);

  return (
    <>
      <div
        ref={containerRef}
        className="menu-toggle"
        style={{ left: isOpen ? "150px" : "20px" }}
        onClick={toggleMenu}
        onFocus={toggleMenu}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className={`sidenav ${isOpen ? "open" : ""}`}>
        <a onClick={() => navigate("/")}>🏠 Home</a>
        <a onClick={() => navigate("/cart")}>🛒 Cart</a>
        <a onClick={() => navigate("/orders")}>📦 Orders</a>
        <button onClick={toggleLogin}>
          {/* {isLoggedIn ? "🚪 Logout" : "🔐 Login"} */}
          {user ? "🚪 Logout" : isManualLogin ? "🚪 Logout" : "🔐 Login"}
          <div className={loading ? "spinner" : ""}></div>
        </button>
      </nav>
    </>
  );
};

export default SideNav;
