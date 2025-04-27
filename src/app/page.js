'use client';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Pricing from './components/Pricing/Pricing';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import CallToAction from './components/CallToAction/CallToAction';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function Home() {
  const userDetails = useSelector((state) => state.user.value);
  const router = useRouter();

  useEffect(() => {
    if (userDetails && userDetails.premium === 'active')
      router.push('/chat');
  }, [userDetails])

  return (
    <>
      {userDetails && userDetails.premium === 'expired' &&
        <div className="alert alert-dark alert-dismissible fade show" role="alert">
          Your premium plan has expired. Please <a href='#pricing' className='alert-link'>Renew plan</a> to continue to premium
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        }

      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
