'use client'

import React, { useEffect, useState } from 'react';
import axios from '../../constants/axios';
import { useParams, useRouter } from 'next/navigation';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
    const [paymentDetails, setPaymentDetails] = useState(null);
    const { orderId } = useParams();
    const router = useRouter()

    const getPaymentDetails = async () => {
        try {
            const { data } = await axios.get(`/getInvoice/${orderId}`);
            if (data) {
                setPaymentDetails(data.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPaymentDetails();
    }, []);

    return (
        <div className={`${styles.paymentSuccessWrapper} d-flex flex-column align-items-center justify-content-center`}>
            {/* Logo */}
            <img
                src="https://cdn-icons-png.flaticon.com/512/17002/17002169.png"
                alt="Success"
                className={`${styles.logoImg} mb-4`}
            />

            {/* Title and Icon */}
            <h2 className={`${styles.title}`}>
                Payment Successful
            </h2>

            {/* Info Card */}
            {paymentDetails && (
                <div className={`${styles.paymentCard} shadow`}>
                    <h5>Hello, <span className="text-primary">{paymentDetails.name}</span></h5>
                    <p className={styles.premiumMsg}>Your <strong>Premium Account</strong> has been activated!</p>
                    <hr />
                    <p><strong>Oder ID:</strong> {paymentDetails.txn_id}</p>
                    <p><strong>Amount Paid:</strong> ₹{paymentDetails.paid}</p>
                    <p className={`${paymentDetails.status === 'success' ? styles.successBadge : styles.failedBadge}`}><strong>Status:</strong> <span>  {paymentDetails.status.toUpperCase()} </span></p>
                    <p className="text-muted">
                        <small>Txn Time: {new Date(paymentDetails._time).toLocaleString()}</small>
                    </p>
                    <p className="text-muted">
                        <small>
                            Expiry Date: {new Date(new Date(paymentDetails._time).setMonth(new Date(paymentDetails._time).getMonth() + 1)).toLocaleDateString()}
                        </small>
                    </p>
                </div>
            )}

            <button
                onClick={() => router.push("/chat")}
                className={`primary-btn mt-4`}>
                Click to Start Chat
            </button>
        </div>
    );
};

export default PaymentSuccess;
