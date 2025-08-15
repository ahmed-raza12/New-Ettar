/**
 * Generates structured data in JSON-LD format for SEO
 * @param {Object} options - Options for structured data
 * @param {string} options.type - Type of schema (e.g., 'WebSite', 'Product')
 * @param {Object} options.data - Data specific to the schema type
 * @returns {Object} - JSON-LD structured data
 */
export const generateStructuredData = ({ type, data }) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'WebSite':
      return {
        ...baseData,
        name: data.name || 'AlMala Fragrance',
        url: data.url || 'https://almalafragrance.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://almalafragrance.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Organization':
      return {
        ...baseData,
        name: data.name || 'AlMala Fragrance',
        url: data.url || 'https://almalafragrance.com',
        logo: data.logo || 'https://almalafragrance.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: data.phone || '+92-317-1775644',
          contactType: 'customer service',
          email: data.email || 'contact@almalafragrance.com',
          areaServed: 'PK',
          availableLanguage: ['English', 'Urdu'],
        },
        sameAs: [
          'https://www.facebook.com/almalafragrance',
          'https://www.instagram.com/almalafragrance',
          'https://wa.me/923171775644',
        ],
      };

    case 'BreadcrumbList':
      return {
        ...baseData,
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return baseData;
  }
};

/**
 * Renders structured data as a script tag
 * @param {Object} data - The structured data object
 * @returns {JSX.Element} - A script tag with the structured data
 */
export const renderStructuredData = (data) => {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data, null, 2)}
    </script>
  );
};
