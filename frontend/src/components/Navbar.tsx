import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsOpen]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  return (
    <>
      {isMobile && (
        <div className="top-navbar d-flex justify-content-between align-items-center px-3 py-2">
          <button
            className="btn btn-light"
            onClick={toggleNavbar}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
          <span className="text-brown fw-bold">POS System</span>
          <div></div>
        </div>
      )}

      {isMobile && isOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <nav
        className={`sidebar ${isOpen ? "open" : "closed"} ${
          isMobile ? "drawer" : ""
        }`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-header">
          <span className={`brand-text ${isOpen ? "show" : "hide"}`}>
            POS System
          </span>
          {!isMobile && (
            <button
              className="btn toggle-btn"
              onClick={toggleNavbar}
              aria-label="Toggle sidebar"
              aria-expanded={isOpen}
            >
              <i
                className={`fas ${isOpen ? "fa-times" : "fa-bars"} icon-brown`}
              ></i>
            </button>
          )}
        </div>

        <ul className="sidebar-nav list-unstyled">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={handleLinkClick}>
              <i className="fas fa-home icon-brown"></i>
              <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                Dashboard
              </span>
            </Link>
          </li>

          {(isManager || isAdmin) && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/products"
                  onClick={handleLinkClick}
                >
                  <i className="fas fa-box icon-brown"></i>
                  <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                    Products
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/categories"
                  onClick={handleLinkClick}
                >
                  <i className="fas fa-folder icon-brown"></i>
                  <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                    Categories
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/reports"
                  onClick={handleLinkClick}
                >
                  <i className="fas fa-chart-bar icon-brown"></i>
                  <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                    Reports
                  </span>
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <li className="nav-item">
              <Link className="nav-link" to="/users" onClick={handleLinkClick}>
                <i className="fas fa-users icon-brown"></i>
                <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                  Users
                </span>
              </Link>
            </li>
          )}

          <li
            className="nav-item user-info mt-auto px-3"
            style={{ color: "#FFFFFF" }}
          >
            <div className={`nav-text ${isOpen ? "show" : "hide"}`}>
              <strong>User:</strong> {user ? `${user.first_name}` : "Guest"} (
              {user?.role || "No role"})
            </div>
          </li>

          <li className="nav-item mt-2">
            <button
              className="nav-link btn w-100 text-start border-0"
              onClick={() => {
                logout();
                handleLinkClick();
              }}
            >
              <i className="fas fa-sign-out-alt icon-brown"></i>
              <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <style>{`
        .sidebar {
          background-color: #7B5E3C; /* Softer medium brown */
          color: #FFFFFF; /* White text */
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 1050;
          box-shadow: 3px 0 10px rgba(0, 0, 0, 0.4);
        }

        .sidebar.open {
          width: 280px;
        }

        .sidebar.closed {
          width: 70px;
        }

        .sidebar.drawer {
          transform: translateX(-100%);
        }

        .sidebar.drawer.open {
          transform: translateX(0);
          width: 280px;
        }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(123, 94, 60, 0.75); /* Darker brown overlay with transparency */
          z-index: 1040;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background-color: #5C482B; /* Darker brown header */
          color: #FFFFFF; /* White text */
        }

        .brand-text.show {
          display: inline;
          margin-left: 0.5rem;
          opacity: 1;
          transition: opacity 0.3s ease;
          font-weight: 700;
          font-size: 1.3rem;
          color: #FFFFFF; /* White */
        }

        .brand-text.hide {
          display: none;
          opacity: 0;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .toggle-btn:hover {
          color: #D9B382; /* Light gold for hover */
        }

        .sidebar-nav {
          list-style: none;
          padding-left: 0;
          margin: 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .nav-link {
          color: #FFFFFF;
          display: flex;
          align-items: center;
          padding: 0.85rem 1.5rem;
          font-size: 1rem;
          text-decoration: none;
          transition: background-color 0.25s ease, color 0.25s ease;
          border-radius: 6px;
        }

        .nav-link:hover,
        .nav-link:focus {
          background-color: #A67C4F; /* Light warm brown on hover */
          color: #3B2F2F; /* Darker brown text on hover for contrast */
          outline: none;
        }

        .nav-link.btn {
          background: none;
          color: #FFFFFF;
          text-align: left;
          border: none;
          padding-left: 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .nav-link.btn:hover {
          background-color: #A67C4F;
          color: #3B2F2F;
        }

        .nav-link i {
          min-width: 24px;
          font-size: 1.25rem;
          color: #D9B382; /* Light gold */
          transition: color 0.3s ease;
        }

        .nav-link:hover i,
        .nav-link:focus i {
          color: #855E42; /* Darker brown on hover */
        }

        .icon-brown {
          color: #D9B382; /* Light gold */
        }

        .nav-text.show {
          margin-left: 1rem;
          display: inline;
          opacity: 1;
        }

        .nav-text.hide {
          display: none;
          opacity: 0;
        }

        .top-navbar {
          background-color: #5C482B; /* Darker brown */
          height: 50px;
          color: #FFFFFF; /* White text */
          user-select: none;
        }

        .top-navbar .btn {
          color: #FFFFFF;
          font-size: 1.3rem;
        }

        .top-navbar .btn:hover,
        .top-navbar .btn:focus {
          color: #D9B382;
          outline: none;
        }

        .user-info {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default Navbar;
