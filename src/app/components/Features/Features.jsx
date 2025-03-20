import { FiGrid, FiTarget, FiRefreshCw } from 'react-icons/fi';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: <FiGrid />,
      title: 'AI-Powered Answers',
      description: 'Get instant, accurate responses to your exam-related questions'
    },
    {
      icon: <FiTarget />,
      title: 'Personalized Learning',
      description: 'Adaptive study plans tailored to your progress and goals'
    },
    {
      icon: <FiRefreshCw />,
      title: 'Smart Practice Tests',
      description: 'AI-generated practice questions based on your weak areas'
    }
  ];

  return (
    <section className={styles.features} id='features'>
      <div className="container">
        <h2 className="section-title">Supercharge Your Exam Preparation</h2>
        <div className="row g-3">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className={`card border-0 bg-light rounded-4 h-100 ${styles.card}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;