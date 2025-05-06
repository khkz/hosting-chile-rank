
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import HostingRanking from '../components/HostingRanking';
import Methodology from '../components/Methodology';
import Testimonial from '../components/Testimonial';
import Categories from '../components/Categories';
import FAQ from '../components/FAQ';
import CompareSection from '../components/CompareSection';
import BlogTeaser from '../components/BlogTeaser';
import FinalCTA from '../components/FinalCTA';
import StatsTicker from '../components/StatsTicker';
import StickyCTA from '../components/StickyCTA';
import Footer from '../components/Footer';
import UltimasBusquedas from '../components/UltimasBusquedas';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EligeTuHosting.cl - Ranking de Hosting en Chile 2025</title>
        <meta name="description" content="Comparativa de los mejores proveedores de hosting en Chile 2025. Analizamos precios, velocidad, soporte y más. ¡Encuentra tu hosting ideal!" />
      </Helmet>

      <Navbar />
      <Hero />
      <StatsTicker />
      <Benefits />
      <HostingRanking />
      <CompareSection />
      <Methodology />
      <Testimonial />
      <Categories />
      <UltimasBusquedas />
      <BlogTeaser />
      <FAQ />
      <FinalCTA />
      <StickyCTA />
      <Footer />
    </>
  );
};

export default Index;
