import React from 'react'
import styles from './CallToAction.module.css'

const CallToAction = () => {
    return (
        <section className={`${styles.ctaSection} text-center py`}>
            <div className="container">
                <h2 className="fw-bold">Ready to Transform Your Exam Preparation?</h2>
                <p className="text-muted">
                    Join thousands of successful students who trust Emo for their exam preparation
                </p>
                <button
                    style={{ fontSize: "1.1rem" }}
                    className={`primary-btn px-4 py-3 ${styles.freeTrialBtn}`}
                >Start Your Free Trial Today
                </button>
            </div>
        </section>
    )
}

export default CallToAction
