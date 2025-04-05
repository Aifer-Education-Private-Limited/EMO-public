"use client";

import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { RiWhatsappFill, RiMessage3Fill } from "react-icons/ri";
import { MdEmail, MdPermPhoneMsg } from "react-icons/md";
import { IoMdArrowRoundBack } from 'react-icons/io'
import PhoneInput from "react-phone-input-2";
import axios from '../../constants/axios'
import { createUserWithEmailAndPassword, deleteUser, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/app/constants/firebase";
import { useDispatch } from "react-redux";
import { fetchUserById } from "@/app/constants/features/user";
import { useRouter } from "next/navigation";
import { PiKeyDuotone } from "react-icons/pi";
import { createErpLeadAndUpdate } from "@/app/constants/ErpApi";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const auth = getAuth(app)

const Login = ({ handleClose, URL }) => {

    const dispatch = useDispatch()
    const router = useRouter()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [isOtpSignin, setIsOtpSignin] = useState(true);
    const [channel, setChannel] = useState("SMS");
    const [isOtpSend, setIsOtpSend] = useState(false);
    const [mobile, setMobile] = useState()
    const [otp, setOtp] = useState("")

    const [originalMethod, setOriginalMethod] = useState("MOBILE") // AUTH TYPE (MOBILE / EMAIL)
    const [isEmailSignin, setIsEmailSignin] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isEmailSignup, setIsEmailSignup] = useState(false)
    const [name, setName] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [isEmailEntered, setIsEmailEntered] = useState(false)
    const [signupSecond, setSignupSecond] = useState(false)
    const [state, setState] = useState("")
    const [otpOrderId, setOtpOrderId] = useState("")
    const [showForgetPass, setShowForgetPass] = useState(false)
    const [isEmailSend, setIsEmailSend] = useState(false)

    const handleOtpSend = async (e) => {
        e.preventDefault()
        // function sent otp to coresponding mobile number
        try {
            setLoading(true);
            if (mobile === undefined || mobile === "") {
                setError("Please Enter Mobile Number");
                setLoading(false);
            } else {
                const number = "+" + mobile; // ? type number
                const Data = {
                    mobile: number,
                    isLogin: true,
                    channel,
                };
                let { data } = await axios.post("/api/generate-otp-byotpless", Data, {
                    headers: { autherisation: process.env.NEXT_PUBLIC_DEVELOPER_API_KEY },
                });

                if (data.orderId) {
                    setLoading(false);
                    setIsOtpSend(true)
                    setOtpOrderId(data.orderId);
                }
            }
        } catch (err) {
            setError("Error sending otp")
        } finally {
            setLoading(false)
        }
    };

    const handleSubmitOtp = (e) => {
        e.preventDefault()
        if (!otp) return setError("Please enter otp")
        setLoading(true);
        verifyCode();
    };

    const verifyCode = async () => {
        // function that verify entered OTP direct login or signup
        try {
            const number = "+" + mobile;
            const Data = {
                mobile: number,
                orderId: otpOrderId,
                otp,
            };
            let { data } = await axios.post("/api/verify-otp-byotpless", Data, {
                headers: { autherisation: process.env.NEXT_PUBLIC_DEVELOPER_API_KEY },
            });
            if (data.isOTPVerified) {
                const number = "+" + mobile;
                const data = {
                    mobile: number,
                };
                const res = await axios.post("/user-login", data);

                if (res.data.status) {
                    if (res.data.error) {
                        setError(res.data.error);
                    } else {
                        localStorage.setItem("studentToken", res.data.studentToken);
                        localStorage.setItem("Name", res.data.user[0].name);
                        localStorage.setItem("email", res.data.user[0].email);

                        dispatch(fetchUserById());
                        handleClose();
                        // if (campaign) {
                        //     erpupdateLogTolead(mobile, activity, project, subject, campaign);
                        // }
                        if (URL) {
                            router.push(URL);
                        } else {
                            window.location.reload()
                        }
                    }
                } else {
                    setIsEmailSignup(true);
                    setSignupSecond(true);
                    setIsEmailEntered(false)
                    setIsOtpSignin(false)
                }
            } else {
                setError(data.reason);
                setLoading(false);
            }
        } catch (err) {
            setError("Please check mobile number");
        } finally {
            setLoading(false)
        }
    };

    const handleSignupNext = () => {
        if (!email || !password || !confirmPass) {
            setError("Please fill all fields");
        } else if (password.length < 8) {
            setError("Password length should be at least 8 characters long");
        } else if (password !== confirmPass) {
            setError("Passwords do not match");
        } else {
            setError("");
            setSignupSecond(true);
            setIsEmailEntered(true);
        }
    };

    // function that handles registration
    const handleEmailSignup = async (e) => {
        e.preventDefault();
        try {

            const emailRegex = new RegExp(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/g
            );
            if (!mobile) {
                setError("Please enter mobile");
                return
            } else if (mobile.length < 10) {
                setError("Incorrect mobile")
                return
            } else if (!name) {
                setError("Please Enter Name");
                return
            } else if (!email) {
                setError("Please Enter Email");
                return
            } else if (emailRegex.test(email) === false) {
                setError("Please Enter valid Email Address");
                return
            } else if (!state) {
                setError("Please Select a State");
                return
            } else {
                setError("");

                const number = "+" + mobile;
                const d = new Date();

                const day = d.getDate();
                const year = d.getFullYear();
                const month = d.getMonth() + 1;
                const hour = d.getHours();
                const minutes = d.getMinutes();
                const seconds = d.getSeconds();
                const date =
                    year +
                    "-" +
                    month +
                    "-" +
                    day +
                    " " +
                    hour +
                    ":" +
                    minutes +
                    ":" +
                    seconds;
                let auth_type;
                if (originalMethod === "EMAIL") {
                    auth_type = "email"; //signup through email
                } else {
                    if (channel == "SMS") {
                        auth_type = "phone"; //signup through mobile with sms otp
                    } else {
                        auth_type = "whatsapp"; //signup through mobile with whatsapp otp
                    }
                }
                const userData = {
                    user_type: "emo_user",
                    name,
                    email,
                    number,
                    state,
                    date,
                    auth_type,
                };

                if (originalMethod === "EMAIL") {
                    setLoading(true)
                    createUserWithEmailAndPassword(auth, email, password)
                        .then(async (userCredential) => {
                            // Signed in 
                            const user = userCredential.user;
                            const firebaseUid = user.uid;
                            const user_type = "emo_user"

                            const Data = {
                                user_type,
                                name,
                                email,
                                number,
                                state,
                                date,
                                firebaseUid,
                                auth_type,
                            };
                            const response = await axios.post("/register", Data);

                            if (response.data.response.status) {
                                localStorage.setItem(
                                    "studentToken",
                                    response.data.response.studentToken
                                );

                                const onSource = "EMO Public"
                                createErpLeadAndUpdate(
                                    name,
                                    number,
                                    email,
                                    state,
                                    onSource,
                                    "Newbie",
                                    "New user registered",
                                );
                                dispatch(fetchUserById());

                                if (typeof URL === "string" && URL.trim() !== "") {
                                    router.push(URL);
                                } else {
                                    window.location.reload();
                                }
                            } else {
                                setError(response.data.response.message);
                                // Check if firebaseUid exists before deleting the user
                                if (firebaseUid) {
                                    const user = auth.currentUser;
                                    if (user) {
                                        try {
                                            await deleteUser(user);
                                        } catch (error) {
                                            setError("An error occured")
                                        }
                                    }
                                }
                            }
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            if (errorCode === "auth/email-already-in-use") {
                                setLoading(false)
                                setError("Email already registered.");
                            } else if (errorCode === undefined) {
                                setLoading(false)
                                setError(
                                    "You can't signup with email.Please login with mobile."
                                );
                            } else {
                                setLoading(false)
                                setError(
                                    "You can't signup with email.Please login with mobile."
                                );
                            }
                        });
                } else {
                    setLoading(true)
                    const response = await axios.post("/register-otp", userData);
                    if (response.data.response.status) {
                        if (response.data.response.user.message) {
                            setError(
                                "Mobile number is already registered. Try another mobile number."
                            );
                        } else {
                            localStorage.setItem(
                                "studentToken",
                                response.data.response.studentToken
                            );

                            const onSource = "EMO Public"
                            createErpLeadAndUpdate(
                                name,
                                number,
                                email,
                                state,
                                onSource,
                                "Newbie",
                                "New user registered",
                            );
                            dispatch(fetchUserById());

                            window.location.reload();

                        }
                    } else {
                        setLoading(false)
                        setError(response.data.err || response.data.response.message);
                    }
                }
            }
        } catch (err) {
            setLoading(false)
        }
    }

    const handleEmailSignin = (event) => {
        try {
            event.preventDefault();

            if (!email || !password) {
                return setError("Please enter Email and Password")
            }

            setLoading(true);
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;

                    if (user) {
                        const data = {
                            email,
                        };
                        const res = await axios.post("/user-loginWithEmail", data);

                        if (res.data.status) {
                            if (res.data.error) {
                                setError(res.data.error);
                            } else {
                                localStorage.setItem("studentToken", res.data.studentToken);
                                localStorage.setItem("Name", res.data.user[0].name);

                                dispatch(fetchUserById());
                                // if (campaign) {
                                //   erpupdateLogTolead(
                                //     res.data.user[0].mobile,
                                //     activity,
                                //     project,
                                //     subject,
                                //     campaign
                                //   );
                                // }
                                if (typeof URL === "string" && URL.trim() !== "") {
                                    router.push(URL);
                                } else {
                                    window.location.reload();
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === "auth/too-many-requests") {
                        setError("Too many failed login attempts!!.Please try again after sometimes.");
                        setLoading(false)
                        return
                    } else if (
                        errorCode === "auth/wrong-password"
                        || errorCode === "auth/invalid-login-credentials"
                        || errorCode === "auth/user-not-found"
                        || errorCode === "auth/invalid-credential"
                    ) {
                        setError("Incorrect Email or Password");
                        setLoading(false)
                        return
                    }
                    setLoading(false);
                });
        } catch (err) {
            setError("Incorrect Email or Password")
            setLoading(false)
        }
    };

    const handleForgetPassword = (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            sendPasswordResetEmail(auth, email)
                .then(() => {
                    setIsEmailSend(true);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === "auth/user-not-found") {
                        setError("There is no registered email address with Emo");
                    } else {
                        setError("Something went wrong. Please try again.");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });

        } catch (err) {
            setError("Unexpected error occurred.");
            setLoading(false);
        }
    };


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => document.body.style.overflow = "auto";
    }, []);

    useEffect(() => {
        setError("")
        setLoading(false)
    }, [isOtpSignin, isEmailSignin, channel, email, password, confirmPass, otp, mobile]);

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={`${styles.modalContent} shadow-lg`} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={handleClose}>&times;</button>

                <div className="text-center">
                    <img src="/emo-logo.png" alt="Emo" style={{ height: "40px", width: "auto" }} />
                    {isOtpSignin && (
                        <>
                            <h3 className="mt-3 fw-bold">
                                {isOtpSend ? "Verify Your OTP" : "Sign in with OTP"}
                            </h3>
                            <p className="text-muted fw-medium" style={{ fontSize: "14px" }}>
                                {isOtpSend
                                    ? "Enter the one-time password sent to your mobile to complete the sign-in process."
                                    : `Enter your mobile number to receive a one-time password via ${channel === "SMS" ? "SMS" : "WhatsApp"} for secure sign-in.`}
                            </p>
                        </>
                    )}
                    {isEmailSignin && <>
                        <h3 className="mt-3 fw-bold">Sign in with Email</h3>
                        <p className="text-muted fw-medium" style={{ fontSize: "14px" }}>Enter your email and password to access your Emo account.</p>
                    </>}
                    {isEmailSignup && !signupSecond && originalMethod === "EMAIL" && (
                        <>
                            <h3 className="mt-3 fw-bold">Create Your Emo Account</h3>
                            <p className="text-muted fw-medium" style={{ fontSize: "14px" }}>
                                Sign up with your email, set a password, and get started with Emo.
                            </p>
                        </>
                    )}
                    {signupSecond && (
                        <>
                            <h3 className="mt-3 fw-bold">Create Your Emo Account</h3>
                            <p className="text-muted fw-medium" style={{ fontSize: "14px" }}>
                                {originalMethod === "EMAIL"
                                    ? "Enter your name, mobile, and state to complete signup."
                                    : "Enter your name, email, and state to complete signup."}
                            </p>
                        </>
                    )}
                    {showForgetPass && !isEmailSend && <>
                        <h3 className="mt-3 fw-bold">Reset Password <PiKeyDuotone /> </h3>
                        <p className="text-muted fw-medium" style={{ fontSize: "14px" }}>Enter your email, and we'll send you instructions to reset your password.</p>
                    </>}
                    {showForgetPass && isEmailSend && <>
                        <p className="fw-medium mt-3" style={{ fontSize: "14px" }}>Email send to
                            <br /><span className="fw-bold">{email}</span><br />
                            Reset password and Login with new password</p>
                    </>}
                </div>

                {/* OTP SIGN IN / LOGIN */}
                {isOtpSignin && <>
                    {!isOtpSend ?
                        <form className="my-4" onSubmit={handleOtpSend}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold ms-3 mb-1">Mobile number</label>
                                <PhoneInput
                                    country={"in"}
                                    countryCodeEditable={false}
                                    onChange={(value) => setMobile(value)}
                                />
                            </div>
                            <button type="submit" disabled={loading} className={styles.submitButton}>
                                {!loading && (
                                    <>
                                        Get OTP &nbsp;
                                        <MdPermPhoneMsg size={20} />
                                    </>
                                )}
                                {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                            </button>
                            <p
                                style={{ fontSize: "15px", cursor: "pointer" }}
                                className="text-secondary fw-medium mb-0 text-center mt-3"
                                onClick={() => {
                                    setIsEmailSignin(false)
                                    setIsEmailSignup(true)
                                    setIsOtpSignin(false)
                                    setOriginalMethod("EMAIL")
                                    setMobile("")
                                }}
                            >New on platform? <span className="text-primary">Signup with email</span>
                            </p>
                            <p className="text-danger text-center">{error}</p>
                        </form>
                        :
                        <form className="my-4" onSubmit={handleSubmitOtp}>
                            <p className="fw-medium text-center">Otp send to your {channel} </p>
                            <div className="mb-3">
                                <label className="form-label fw-semibold ms-3 mb-1">OTP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter otp"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-100 mb-2 ${styles.submitButton}`}
                            >
                                {loading ? (<span className="spinner-border spinner-border-sm" aria-hidden="true"></span>) : "Verify Otp"}
                            </button>

                            <p className="text-danger text-center">{error}</p>
                        </form>}
                    <hr />
                    {!isOtpSend && (
                        <button
                            onClick={() => setChannel(channel === "WHATSAPP" ? "SMS" : "WHATSAPP")}
                            className={`${styles.signinOptionsBtn} mb-2 w-100 d-flex align-items-center justify-content-center`}
                        >
                            {channel === "WHATSAPP" ? (
                                <>
                                    <RiMessage3Fill size={20} className="me-2" /> Sign in with Mobile
                                </>
                            ) : (
                                <>
                                    <RiWhatsappFill size={20} className="me-2" /> Sign in with WhatsApp
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsOtpSignin(false)
                            setIsEmailSignin(true)
                            setOriginalMethod("EMAIL")
                        }}
                        className={`${styles.signinOptionsBtn} w-100 d-flex align-items-center justify-content-center`}>
                        <MdEmail size={20} className="me-2" /> Sign in with Email
                    </button>
                </>}
                {/* OTP SIGN IN / LOGIN */}


                {/* EMAIL SIGN IN */}
                {isEmailSignin &&
                    <>
                        <form className="mt-4 mb-2" onSubmit={handleEmailSignin}>
                            <div className="mb-2">
                                <label className="form-label fw-semibold ms-3 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="form-label fw-semibold ms-3 mb-1">Password</label>
                                <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control pe-5"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                </div>
                            </div>
                            <div className="mb-3 ms-2">
                                <p
                                    style={{ fontSize: "14px", cursor: "pointer" }}
                                    className="text-primary "
                                    onClick={() => {
                                        setShowForgetPass(true)
                                        setIsEmailSignin(false)
                                    }}
                                >Forget password?</p>
                            </div>
                            <button type="submit"
                                disabled={loading} className={styles.submitButton}>
                                {loading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    : "Sign in"}
                            </button>
                            <p className="text-danger text-center mt-2">{error}</p>
                        </form>
                        <div className="mb-3 ms-2 mt-0 text-center">
                            <p
                                style={{ fontSize: "15px", cursor: "pointer" }}
                                className="text-secondary fw-medium mb-2"
                                onClick={() => {
                                    setIsEmailSignin(false)
                                    setIsEmailSignup(true)
                                    setOriginalMethod("EMAIL")
                                    setEmail("")
                                    setPassword("")
                                }}
                            >New on platform? <span className="text-primary">Signup with email</span>
                            </p>
                            <p
                                style={{ fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => {
                                    setIsEmailSignin(false)
                                    setIsOtpSignin(true)
                                    setOriginalMethod("MOBILE")
                                    setChannel("SMS")
                                }}
                                className="fw-medium text-grey"
                            >Continue with Mobile
                            </p>
                        </div>
                    </>}
                {/* EMAIL SIGN IN */}


                {/* EMAIL SIGNUP */}
                {isEmailSignup && <>
                    <form className="mt-4 mb-2" onSubmit={handleEmailSignup}>
                        {!signupSecond ?
                            <>
                                <div className="mb-2">
                                    <label className="form-label fw-semibold ms-3 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-semibold ms-3 mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold ms-3 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm password"
                                        value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSignupNext}
                                    className={styles.submitButton}
                                >Next</button>
                            </>
                            :
                            <>
                                {originalMethod === "EMAIL" &&
                                    <div className="mb-2 mt-0 text-center">
                                        <h5
                                            onClick={() => setSignupSecond(false)}
                                            className={styles.backBtn}
                                        ><IoMdArrowRoundBack /> Back</h5>
                                    </div>
                                }
                                <div className="mb-2">
                                    <label className="form-label fw-semibold ms-3 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                {isEmailEntered ?
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold ms-3 mb-1">Mobile number</label>
                                        <PhoneInput
                                            country={"in"}
                                            countryCodeEditable={false}
                                            placeholder=" "
                                            onChange={(value) => setMobile(value)}
                                        />
                                    </div> :
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold ms-3 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                }
                                <div className="mb-3">
                                    <label className="form-label fw-semibold ms-3 mb-1">State</label>
                                    <select
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            setError("");
                                        }}
                                        title="State"
                                        name="state"
                                        id="statesignup"
                                    >
                                        <option value="">Select your State</option>
                                        <option value="Andaman and Nicobar Islands">
                                            Andaman and Nicobar Islands
                                        </option>
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        <option value="Arunachal Pradesh">
                                            Arunachal Pradesh
                                        </option>
                                        <option value="Assam">Assam</option>
                                        <option value="Bihar">Bihar</option>
                                        <option value="Chandigarh">Chandigarh</option>
                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                        <option value="Dadra and Nagar Haveli Daman and Diu">
                                            Dadra and Nagar Haveli Daman and Diu
                                        </option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Goa">Goa</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Haryana">Haryana</option>
                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                        <option value="Jammu and Kashmir">
                                            Jammu and Kashmir
                                        </option>
                                        <option value="Jharkhand">Jharkhand</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Ladakh">Ladakh</option>
                                        <option value="Lakshadweep Islands">Lakshadweep</option>
                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Manipur">Manipur</option>
                                        <option value="Meghalaya">Meghalaya</option>
                                        <option value="Mizoram">Mizoram</option>
                                        <option value="Nagaland">Nagaland</option>
                                        <option value="Odisha">Odisha</option>
                                        <option value="Other Territory">Other Territory</option>
                                        <option value="Puducherry">Puducherry</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Sikkim">Sikkim</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tripura">Tripura</option>
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Uttarakhand">Uttarakhand</option>
                                        <option value="West Bengal">West Bengal</option>{" "}
                                    </select>
                                </div>
                                <button type="submit" disabled={loading || !state} className={styles.submitButton}>
                                    {loading ?
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        : "Sign up"
                                    }
                                </button>
                            </>
                        }
                        <p className="text-danger text-center mt-2">{error}</p>
                    </form>
                    <div className="mb-3 ms-2 mt-0 text-center">
                        <p
                            style={{ fontSize: "15px", cursor: "pointer" }}
                            className="text-secondary fw-medium mb-2"

                        >Already have an account? <span
                            onClick={() => {
                                setIsEmailSignin(true)
                                setIsEmailSignup(false)
                                setEmail("")
                                setPassword("")
                                setConfirmPass("")
                            }}
                            className="text-primary">Sign in with email</span>
                        </p>
                        <p
                            style={{ fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => {
                                setEmail("")
                                setPassword("")
                                setConfirmPass("")
                                setIsEmailSignup(false)
                                setIsOtpSignin(true)
                                setChannel("SMS")
                                setSignupSecond(false)
                            }}
                            className="fw-medium text-grey"
                        >Continue with Mobile
                        </p>
                    </div>
                </>}
                {/* EMAIL SIGNUP */}

                {/* FORGET PASSWORD */}
                {showForgetPass && !isEmailSend &&
                    <form className="my-4" onSubmit={handleForgetPassword}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold ms-3 mb-1">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={styles.submitButton}>
                            {loading ?
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                : "Send"
                            }
                        </button>
                        <p className="text-danger text-center">{error}</p>
                        <p
                            style={{ fontSize: "15px", cursor: "pointer" }}
                            className="text-secondary fw-medium mb-0 text-center mt-3"
                            onClick={() => {
                                setShowForgetPass(false)
                                setIsEmailSignin(true)
                            }}
                        ><IoMdArrowRoundBack /> Back to signin
                        </p>
                    </form>
                }
                {showForgetPass && isEmailSend &&
                    <button
                        onClick={() => {
                            setShowForgetPass(false)
                            setIsEmailSignin(true)
                            setIsEmailSend(false)
                            setEmail("")
                        }}
                        type="submit"
                        disabled={loading}
                        className={`my-3 ${styles.submitButton}`}>
                        <IoMdArrowRoundBack /> Signin
                    </button>
                }
                {/* FORGET PASSWORD */}

            </div>
        </div>
    )
}

export default Login