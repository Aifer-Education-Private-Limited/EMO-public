import styles from './Testimonials.module.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Emo helped me crack my competitive exam with personalized study plans and instant doubt resolution.",
      name: "Sarah Johnson",
      role: "UPSC Aspirant",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "The AI-powered practice tests were game-changers in my preparation. Highly recommended!",
      name: "Michael Chen",
      role: "Medical Student",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      quote: "Best investment for my exam preparation. The 24/7 AI support is incredibly helpful.",
      name: "Priya Patel",
      role: "CAT Aspirant",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  ];

  return (
    <section id='testimonials' className={styles.testimonials}>
      <div className="container">
        <h2 className="section-title text-center">What Our Users Say</h2>
        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className={styles.testimonialCard}>
                <p className={styles.quote}>{testimonial.quote}</p>
                <div className={styles.userInfo}>
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className={styles.avatar}
                  />
                  <div>
                    <div className={styles.userName}>{testimonial.name}</div>
                    <div className={styles.userRole}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;