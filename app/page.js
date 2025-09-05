'use client'

import About from "./components/About";
import Features from "./components/Features";
import Intro from "./components/Intro";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (!token) {
      router.push('/authentication/login');
    }
  }, [])
  return (
    <div>
        <Navbar />
        <Intro />
        <Features />
        <Services />
        <About />
        <Footer />
    </div>
  );
}
