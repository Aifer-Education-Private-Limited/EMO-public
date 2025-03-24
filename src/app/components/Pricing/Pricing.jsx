'use client';

import { FaCircleCheck } from "react-icons/fa6";
import styles from './Pricing.module.css';
import { useEffect, useState } from "react";
import { fetchUserById } from "@/app/constants/features/user";
import Login from "../Login/Login";
import { useDispatch } from "react-redux";

const Pricing = () => {
  const [user, setUser] = useState(false)
  const [login, setLogin] = useState(false)

  const dispatch = useDispatch()

  const handleRedux = async () => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      setUser(true);
      dispatch(fetchUserById());
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      setLogin(true)
    } else {
      console.log("get started")
    }
  }

  useEffect(() => {
    handleRedux()
  }, [])

  return (
    <>
      <section className={styles.pricing} id="pricing">
        <div className="container">
          <h2 className="section-title text-center mb-4 mb-md-5">Choose Your Plan</h2>

          {/* Center the cards and bring them closer */}
          <div className="row d-flex justify-content-center g-3">
            <div className="col-lg-5 col-md-6">
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h3>Free Trial</h3>
                  <div className={styles.price}>
                    $0 <span className={styles.period}></span>
                  </div>
                  <ul className={styles.featureList}>
                    <li className={styles.featureItem}>
                      <FaCircleCheck className={styles.featureIcon} /> 20 free searches
                    </li>
                    <li className={styles.featureItem}>
                      <FaCircleCheck className={styles.featureIcon} /> Basic study materials
                    </li>
                    <li className={styles.featureItem}>
                      <FaCircleCheck className={styles.featureIcon} /> Limited practice tests
                    </li>
                    <li className={styles.featureItem}>
                      <FaCircleCheck className={styles.featureIcon} /> Email support
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handleGetStarted}
                  className="primary-btn w-100"
                >Get Started</button>
              </div>
            </div>


            <div className="col-lg-5 col-md-6">
              <div className={`${styles.card} ${styles.cardPopular}`}>
                <span className={styles.popularBadge}>Most popular</span>
                <h3>Premium</h3>
                <div className={styles.price}>
                  $19.99 <span className={styles.period}>/month</span>
                </div>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Unlimited searches
                  </li>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Advanced study materials
                  </li>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Unlimited practice tests
                  </li>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Priority support
                  </li>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Progress tracking
                  </li>
                  <li className={styles.featureItem}>
                    <FaCircleCheck className={styles.featureIcon} /> Custom study plans
                  </li>
                </ul>
                <button className="primary-btn w-100">Upgrade Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {login && <Login
        URL="#pricing"
        handleClose={() => setLogin(!login)}
      />}
    </>
  );
};

export default Pricing;
