import styles from './Footer.module.css';
import { FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <img src="/emo-logo.png" alt="Emo" className={styles.logo} />
            <p className={styles.description}>
              AI-powered exam preparation platform helping students achieve their dreams
            </p>
          </div>

          <div className="col-lg-2 col-md-6"></div>
          <div className="col-lg-2 col-md-4 mb-4"></div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className={styles.title}>Product</h4>
            <a href="#features" className={styles.link}>Features</a>
            <a href="#pricing" className={styles.link}>Pricing</a>
            <a href="#testimonials" className={styles.link}>Testimonials</a>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className={styles.title}>Company</h4>
            <a href="https://aifer.in/aboutus" className={styles.link}>About</a>
            <a href="https://psybridge.in/" className={styles.link}>Careers</a>
            <a href="https://aifer.in/contact" className={styles.link}>Contact</a>
          </div>

        </div>

        <div className={`${styles.copyright} py-3`}>
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <p className="mb-0">&copy; 2025 Emo By Aifer. All rights reserved.</p>

              <div className="d-flex gap-3">
                <a href="https://twitter.com/AiferEducation" className={styles.socialIcon}><FaXTwitter /></a>
                <a href="https://www.linkedin.com/company/aifer-education/mycompany/" className={styles.socialIcon}><FaLinkedin /></a>
                <a href="https://www.youtube.com/channel/UCzepo3cTMA8mBmmUytp-hIA" className={styles.socialIcon}><FaYoutube /></a>
              </div>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;