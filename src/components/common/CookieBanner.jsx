---
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Note from '~/components/widgets/Note.astro';
import Features from '~/components/widgets/Features.astro';
import Features2 from '~/components/widgets/Features2.astro';
import Steps from '~/components/widgets/Steps.astro';
import Content from '~/components/widgets/Content.astro';
import BlogLatestPosts from '~/components/widgets/BlogLatestPosts.astro';
import FAQs from '~/components/widgets/FAQs.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'LS Web Agency — Creazione di Siti Web, App e Soluzioni Digitali',
  description: 'Scopri le nostre soluzioni digitali per siti web moderni, performanti e ottimizzati per SEO.',
  robots: 'index, follow',
  canonical: 'https://lswebagency.com/',
  openGraph: {
    title: 'LS Web Agency - Siti Web e Soluzioni Digitali',
    description: 'Creiamo siti web performanti, ottimizzati SEO e su misura per la tua attività.',
    image: 'https://lswebagency.com/images/og-image.jpg',
    url: 'https://lswebagency.com/',
    type: 'website'
  }
};
---

<Layout metadata={metadata}>
  <!-- SEO Schema JSON-LD -->
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "LS Web Agency",
      "url": "https://lswebagency.com/",
      "description": "Creiamo siti web, e-commerce e soluzioni digitali ottimizzate per SEO.",
      "publisher": {
        "@type": "Organization",
        "name": "LS Web Agency"
      }
    })}
  </script>

  <!-- Hero Section -->
  <Hero
    actions={[
      { variant: 'primary', text: 'Scopri i nostri servizi', href: '/servizi' },
      { text: 'Portfolio', href: '/portfolio' },
    ]}
    image={{ src: '~/assets/images/hero-image.png', alt: 'Immagine Hero LS Web Agency', loading: 'lazy' }}
  >
    <Fragment slot="title">
      Creazione siti web e app <span class="text-accent text-gradient dark:text-white highlight">professionali e performanti</span>
    </Fragment>
    <Fragment slot="subtitle">
      <span class="hidden sm:inline">
        <span class="font-semibold">LS Web Agency</span> realizza siti web, app e soluzioni digitali su misura, combinando performance, estetica e SEO avanzato.
      </span>
      <span class="block mb-1 sm:hidden font-bold text-blue-600">
        LS Web Agency: Creatività e tecnologia al servizio del tuo brand.
      </span>
      Ideali per aziende, professionisti ed e-commerce, trasformiamo la tua visione in una realtà digitale vincente.
    </Fragment>
  </Hero>

  <!-- Features Widget -->
  <Features id="features" tagline="Servizi" title="Cosa offriamo con LS Web Agency" />

  <!-- Blog Latest Posts Widget -->
  <BlogLatestPosts title="Ultimi Articoli" />

  <!-- Call To Action -->
  <CallToAction />
</Layout>
