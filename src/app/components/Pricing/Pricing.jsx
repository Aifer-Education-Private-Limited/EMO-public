'use client';

import { FaCircleCheck } from "react-icons/fa6";
import styles from './Pricing.module.css';
import { useEffect, useState } from "react";
import { fetchUserById } from "@/app/constants/features/user";
import Login from "../Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HandleRazorpayPyment } from "@/app/constants/RazorpayPayment";
import Script from "next/script";
import axios from '../../constants/axios'

const Pricing = () => {
  const [user, setUser] = useState(false)
  const userDetails = useSelector((state) => state.user.value);
  const [loginToChat, setLoginToChat] = useState(false)
  const [login, setLogin] = useState(false)
  const [showPincodeModal, setShowPincodeModal] = useState(false)
  const [pincode, setPincode] = useState();
  const [pincodeResponse, setPincodeResponse] = useState(false);
  const [district, setDistrict] = useState()
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const router = useRouter()

  const dispatch = useDispatch()

  const handleClose = () => {
    setShowPincodeModal(false);
    setPincodeResponse(false);
    setPincode("");
    setDistrict("");
    setIsTermsChecked(false);
  }

  const handleRedux = async () => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      setUser(true);
      dispatch(fetchUserById());
    }
  };

  const handleGetStarted = () => {    
    if (!userDetails) {
      setLoginToChat(true)
    } else {
      router.push("/chat")
    }
  }

  const handleUpgrade = () => {
    console.log(userDetails);
    if (!userDetails || !userDetails.firebase_uid) {
      setLogin(true)
    } else {
      setShowPincodeModal(true)
    }
  }

  const HandlePyment = async (event) => {
    try {
      event.preventDefault();
      handleClose();
      if (!pincodeResponse) {
        console.log("no pincode");
        return;
      }
      if (userDetails.firebase_uid) {
        setShowPincodeModal(false);
        let key = await axios.get("/getKey");
        key = key.data.key;

        const orderData = {
          payfee: 1711,
          firebase_uid: userDetails.firebase_uid,
          name: userDetails.name,
          email: userDetails.email,
          course_id: "EMO Aifer",
          title: "Emo Aifer",
          payable: 1711,
          terms: "1",
          project: "EMO",
          state: userDetails.state,
          discount: "",
          promoCode: "",
          offerType: "",
          erpCode: 0,
          featured_title: "Emo Aifer",
          mobile: userDetails.mobile,
          pincode: pincode
        };

        await HandleRazorpayPyment(orderData);

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setIsModal(true);
      }
    } catch (err) {
      console.log(err);

    }
  };

  const handlePincode = (e) => {
    const inputValue = e.target.value;

    // Allow only numbers and limit to 3 digits
    if (
      inputValue === "" ||
      (inputValue.match(/^\d*$/) && inputValue.length <= 6)
    ) {
      let config = {
        method: "get",
        url: `https://api.postalpincode.in/pincode/${inputValue}`,
      };

      axios.request(config).then((response) => {
        if (response.data[0].Status === "Success") {
          setPincodeResponse(true);
          if (response.data[0].PostOffice[0].District) {
            setDistrict(response.data[0].PostOffice[0].District);
          }
        } else {
          setPincodeResponse(false);
        }
      });
      setPincode(inputValue);
    }
  };

  const handleTermsChange = () => {
    setIsTermsChecked(!isTermsChecked); // Toggle the state when radio button is clicked
  };

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
                <button
                  onClick={handleUpgrade}
                  className="primary-btn w-100">Upgrade Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loginToChat && <Login
        URL="/chat"
        handleClose={() => setLoginToChat(!loginToChat)}
      />}

      {login && <Login
        handleClose={() => setLogin(!login)}
      />}

      {showPincodeModal && (
        <div className="popup-overlay d-flex justify-content-center align-items-center">
          <div
            className="popup-content rounded p-4"
          >
            <div className="image-container text-center">
              {/* <img
                src="/Ai Teachers/AI Teachers.jpg"
                alt="Offer Poster"
                className="img-fluid rounded mb-3"
                style={{ maxWidth: "100%", height: "auto" }}
              /> */}
              <div className="submitContainer">
                <div className="row">
                  <div className="col-12 d-flex align-items-center flex-wrap">
                    <input
                      type="number"
                      className="form-control flex-grow-1 me-2 mb-2 mb-md-0 no-spinner"
                      placeholder="Enter pincode"
                      required
                      value={pincode}
                      onChange={handlePincode}
                    />

                    {pincode && pincode.length === 6 && pincodeResponse === true && (
                      <FaCircleCheck color="green" size="20" className="ms-2" />
                    )}
                    <span className="regular-text ms-2">{district}</span>
                  </div>
                  {pincode && pincode.length <= 6 && pincodeResponse === false && (
                    <div className="col-12">
                      <p className="text-danger">Please enter a valid Indian pincode.</p>
                    </div>
                  )}
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        checked={isTermsChecked}
                        onChange={handleTermsChange}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        I do accept the
                        <a href="/terms-and-conditions" className="ms-1">
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button
                      className="btn poster-btn w-100"
                      onClick={HandlePyment}
                      disabled={!isTermsChecked || !pincodeResponse}
                    >
                      PROCEED TO PAY
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <span
              className="close-btn"
              style={{ cursor: "pointer", fontSize: "2.5rem" }}
              onClick={handleClose}
            >
              &times;
            </span>
          </div>
        </div>
      )}


      <style jsx>{`
      .no-spinner {
  appearance: none;
  -moz-appearance: textfield;
  -webkit-appearance: none;
}

.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  display: none;
  margin: 0;
}

.no-spinner:hover {
  cursor: text; /* Prevent default pointer behavior */
}

                .div-2 {
            box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.15);
            background-color: var(
              --www_openlearning_com__1470x781_default-Nero,
              #fff
            );
            align-self: stretch;
            display: flex;
            width: 100%;
            justify-content: space-between;
            gap: 20px;
            font-size: 16px;
            color: var(--Primary-color, #244c9c);
            font-weight: 700;
            white-space: nowrap;
            text-align: center;
            line-height: 150%;
            padding: 0 80px;
          }
          @media (max-width: 991px) {
            .div-2 {
              max-width: 100%;
              flex-wrap: wrap;
              white-space: initial;
              padding: 0 20px;
            }
          }
        .joinNow{
            font-family: Mulish, sans-serif;
            justify-content: center;
            border-radius: 34px;
            border: 2px solid var(--Primary-color, #003f3f);
            color: #008080;
            box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
            margin: auto 0;
            padding: 10px 45px;
        }
        @media (max-width: 400px) {
            .joinNow{
                padding: 7px 15px;
            }
        }
 .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure it stays above other content */
    transition: all 500ms ease-in-out;
}

.popup-content {
    padding: 10px;
    border-radius: 10px;
    position: relative;
    text-align: center;
    background: #fff;
    max-width: fit-content;
    height: fit-content;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Subtle shadow for elevation */
    animation: fadeIn 0.3s ease-in-out;
}

.close-btn {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 30px;
    font-weight: bold;
    color: black !important; /* Change to match a consistent theme */
    cursor: pointer;
    transition: color 0.3s ease-in-out;
}

.close-btn:hover {
    color: #ff0000; /* Red color for hover */
}

.image-container {
    position: relative;
    display: inline-block;
    width: 100%; /* Responsive container */
    max-width: 600px;
    height: auto; /* Maintain aspect ratio */
    margin: 0 auto; /* Center the content */
}

.popup-image {
    width: 100%;
    max-width: 800px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add depth */
}

.poster-btn {
    margin: 1rem auto 0;
    width: 250px;
    height: 50px;
    background: white;
    border: 2px solid #008080;
    border-radius: 1rem;
    font-size: 16px;
    font-weight: bold;
    color: #008080;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.poster-btn:hover {
    background-color: #008080;
    color: white;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.poster-btn:disabled {
    background: #cceeee; /* A muted teal shade */
    color: #66a1a1;      /* A soft grayish-teal */
    border: 2px solid #b3d9d9; /* A subtle teal-gray border */
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.7;
}



.pincodeInput {
    width: 100%;
    max-width: 300px; /* Restrict input width */
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.pincodeInput:focus {
    border-color: #008080; /* Focus color */
    outline: none;
}

.submitContainer {
    margin: 20px auto 0;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
}

.submitNow {
    text-align: right;
    margin-top: 20px;
}

.formCheckLabel {
    font-weight: 500;
    font-size: 1rem;
    color: #333; /* Adjusted color for better visibility */
    display: flex;
    align-items: center;
}

.text-danger {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@media (max-width: 1024px){
.popup-content {
         height: 50vh;
    // width: 40%;   
}
.image-container {
    position: relative;
    display: inline-block;
    width: 360px;
    height: 230px;
}
    .poster-btn{
        width: 140px;
        height: 30px;
        font-size: 12px;
    }
}

@media (min-width: 768px){
.popup-content {
         height: 75vh;
    // width: 60%;   
}
.image-container {
    position: relative;
    display: inline-block;
    width: 400px;
    height: 330px;
}
    .poster-btn{
        width: 140px;
        height: 30px;
        font-size: 12px;
    }
}

@media (max-width: 576px){
.popup-content {
  height: 60vh;
    // width: 80%;   
}
.image-container {
    position: relative;
    display: inline-block;
    width: 300px;
    height: 255px;
}
    .poster-btn{
    top
        width: 120px;
        height: 30px;
        font-size: 9px;
    }
}
    @media (max-width: 375px){
.popup-content {
  // height: 60vh;
    // width: 90%;   
}
.image-container {
    position: relative;
    display: inline-block;
    width: 300px;
    height: 255px;
}
    .poster-btn{
    top
        width: 120px;
        height: 30px;
        font-size: 9px;
    }
}
      `}</style>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive"></Script>
    </>
  );
};

export default Pricing;
