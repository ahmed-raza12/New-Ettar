import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateStructuredData, renderStructuredData } from '../utils/structuredData';

/**
 * SEO component that handles all SEO-related meta tags
 * @param {Object} props - Component props
 * @param {string} [props.title='Ettar - Premium Fragrances Collection'] - Page title
 * @param {string} [props.description='Discover our exclusive collection of premium fragrances. Shop the finest Ettar perfumes with authentic scents and long-lasting fragrance experience.'] - Meta description
 * @param {string} [props.canonical='https://ettar-fragrances.com'] - Canonical URL
 * @param {string} [props.ogImage='https://ettar-fragrances.com/og-image.jpg'] - Open Graph image URL
 * @param {string} [props.twitterImage='https://ettar-fragrances.com/twitter-card.jpg'] - Twitter card image URL
 * @param {string} [props.type='website'] - Page type (website, article, etc.)
 * @param {string} [props.locale='en_US'] - Page locale
 * @param {string} [props.siteName='Ettar Fragrances'] - Site name for social cards
 * @param {Object} [props.structuredData] - Optional structured data to be included as JSON-LD
 * @returns {JSX.Element} - Helmet component with SEO meta tags
 */
const SEO = ({
  title = 'AlMala Fragrance - Premium Fragrances Collection',
  description = 'Discover our exclusive collection of premium fragrances. Shop the finest Ettar perfumes with authentic scents and long-lasting fragrance experience.',
  canonical = 'https://almalafragrance.com',
  ogImage = 'https://almalafragrance.com/og-image.jpg',
  twitterImage = 'https://almalafragrance.com/twitter-card.jpg',
  type = 'website',
  locale = 'en_US',
  siteName = 'AlMala Fragrance',
  structuredData,
}) => {
  const fullTitle = title.includes('AlMala') ? title : `${title} | AlMala Fragrance`;
  
  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Language and Region */}
      <html lang="en" />
      
      {/* Structured Data */}
      {structuredData && renderStructuredData(structuredData)}
      
      {/* Default Structured Data */}
      {!structuredData && (
        <>
          {renderStructuredData(
            generateStructuredData({
              type: 'WebSite',
              data: {
                name: 'Ettar Fragrances',
                url: canonical,
              },
            })
          )}
          {renderStructuredData(
            generateStructuredData({
              type: 'Organization',
              data: {
                name: 'Ettar Fragrances',
                url: canonical,
                logo: `${canonical}/logo.png`,
                phone: '+92-317-1775644',
                email: 'contact@ettar-fragrances.com',
              },
            })
          )}
        </>
      )}
    </Helmet>
  );
};

export default SEO;
