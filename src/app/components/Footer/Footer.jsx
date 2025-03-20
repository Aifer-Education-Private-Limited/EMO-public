import styles from './Footer.module.css';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <img src="/" alt="Emo" className={styles.logo} />
            <p className={styles.description}>
              AI-powered exam preparation platform helping students achieve their dreams
            </p>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className={styles.title}>Product</h4>
            <a href="#" className={styles.link}>Features</a>
            <a href="#" className={styles.link}>Pricing</a>
            <a href="#" className={styles.link}>Testimonials</a>
            <a href="#" className={styles.link}>FAQ</a>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className={styles.title}>Company</h4>
            <a href="#" className={styles.link}>About</a>
            <a href="#" className={styles.link}>Careers</a>
            <a href="#" className={styles.link}>Blog</a>
            <a href="#" className={styles.link}>Contact</a>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className={styles.title}>Legal</h4>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Cookie Policy</a>
          </div>
        </div>

        <div className={`${styles.copyright} py-3`}>
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <p className="mb-0">&copy; 2025 Emo AI. All rights reserved.</p>

              <div className="d-flex gap-3">
                <a href="#" className={styles.socialIcon}><FaXTwitter /></a>
                <a href="#" className={styles.socialIcon}><FaGithub /></a>
                <a href="#" className={styles.socialIcon}><FaLinkedin /></a>
              </div>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;