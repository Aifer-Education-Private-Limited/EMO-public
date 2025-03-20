"use client";

import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={`navbar navbar-expand-md fixed-top bg-white py-2 px-md-4 ${styles.navbar}`}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <img
          className={styles.logo}
           src="https://emo.aifer.in/assets/logo-ScTepz6b.png" alt="emo" />
        </Link>

        <div className="d-md-none d-flex gap-2 ms-auto align-items-center">
          <button
            className={styles.loginBtn}
          >Log in</button>
          <button
            className={styles.freeTrialBtn}
          >Start Free Trial</button>
          <button
            className={`${styles.togglerIcon} ms-2`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <HiMenu size={30} />
          </button>
        </div>

        <div className="collapse navbar-collapse justify-content-center text-end" id="navbarNav">
          <ul className="navbar-nav py-md-0 py-3 me-md-0 me-3 gap-3">
            <li className="nav-item">
              <Link href="#features" className={styles.navLink}>Features</Link>
            </li>
            <li className="nav-item">
              <Link href="#pricing" className={styles.navLink}>Pricing</Link>
            </li>
            <li className="nav-item">
              <Link href="#about" className={styles.navLink}>About</Link>
            </li>
          </ul>
        </div>

        <div className="d-none d-md-flex">
          <button
            className={`${styles.loginBtn} me-md-3`}
          >Log in</button>
          <button
            className={styles.freeTrialBtn}
          >Start Free Trial</button>
        </div>
      </div>
    </nav>
  );
}
