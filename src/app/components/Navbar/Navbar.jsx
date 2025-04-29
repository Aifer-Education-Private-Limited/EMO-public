"use client";

import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import styles from "./Navbar.module.css";
import Login from "../Login/Login";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "@/app/constants/features/user";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const userDetails = useSelector((state) => state.user.value);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter()

  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleShowLogin = () => setShowLogin(!showLogin)
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleRedux = async () => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      setUser(true);
      dispatch(fetchUserById());
    }
  };

  const userLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("Name");
    window.location.reload();
  };

  const scrollToHash = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  }

  useEffect(() => {
    handleRedux();
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-md bg-white py-2 px-md-4 ${styles.navbar}`}>
        <div className="container-fluid">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <img
              className={styles.logo}
              src="/emo-logo.png" alt="emo" />
          </Link>

          {/* MOBILE VIEW */}
          <div className="d-md-none d-flex gap-1 ms-auto align-items-center">
            <a href="#pricing"><button
              className={`${styles.freeTrialBtn}`}
            >Start Free Trial</button></a>
            {user && userDetails ? (
              <div className={styles.userDropdown}
                ref={dropdownRef}
              >
                <button className={styles.userBtn}
                  onClick={toggleUserDropdown}
                >
                  {userDetails.name?.split(" ")[0]} &nbsp;
                  {userDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {userDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    <li onMouseDown={(e) => {
                      e.stopPropagation()
                      userLogout()
                    }}>
                      <button className={styles.logoutBtn}>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={toggleShowLogin}>Log in</button>
            )}
            <button
              className={`${styles.togglerIcon}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <HiMenu />
            </button>
          </div>

          <div className="collapse navbar-collapse justify-content-center text-end" id="navbarNav">
            <ul className="navbar-nav py-md-0 py-3 me-md-0 me-3 gap-3">
              <li className="nav-item">
                <a
                  href="#features"
                  className={styles.navLink}
                  {...(isMobile && {
                    "data-bs-toggle": "collapse",
                    "data-bs-target": "#navbarNav",
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash("features");
                  }}
                >Features</a>
              </li>
              <li className="nav-item">
                <a
                  href="#pricing"
                  className={styles.navLink}
                  {...(isMobile && {
                    "data-bs-toggle": "collapse",
                    "data-bs-target": "#navbarNav",
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash("pricing");
                  }}
                >Pricing</a>
              </li>
              <li className="nav-item">
                <a
                  className={styles.navLink}
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  onClick={() => {
                    if (!user) {
                      setShowLogin(true)
                    } else {
                      router.push("/chat")
                    }
                  }}
                >Chat</a>
              </li>
            </ul>
          </div>

          {/* DESKTOP VIEW */}
          <div className="d-none d-md-flex">
            <a href="#pricing"><button
              className={`${styles.freeTrialBtn} me-1`}
            >Start Free Trial</button></a>
            {user && userDetails ? (
              <div className={styles.userDropdown} ref={dropdownRef}>
                <button className={styles.userBtn} onClick={toggleUserDropdown}>
                  {userDetails.name?.split(" ")[0]} &nbsp;
                  {userDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {userDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    <li onClick={userLogout}>
                      <button className={styles.logoutBtn}>Logout</button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button className={`${styles.loginBtn} d-none d-md-inline`} onClick={toggleShowLogin}>
                Log in
              </button>
            )}
          </div>

        </div>
      </nav>

      {showLogin && <Login handleClose={toggleShowLogin} />}
    </>
  );
}
