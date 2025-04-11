import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Your AI Study Partner for Competitive Exams
              </h1>
              <p className={styles.heroText}>
                Get instant answers, personalized study plans, and expert guidance powered by AI
              </p>
              <a href="#pricing">
                <button
                  style={{ fontSize: "1rem" }}
                  className={`primary-btn px-md-4 py-md-3 ${styles.freeTrialBtn}`}
                >Start Free Trial</button></a>
              <p className={styles.noCredit}>* No credit card required</p>
            </div>
          </div>
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Student studying"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;