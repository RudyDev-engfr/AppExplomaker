import React from 'react'
import { Helmet } from 'react-helmet'

import favicon from '../../images/icons/favicon.svg'

const Head = ({
  title = 'Explomaker',
  description,
  url = 'https://app.explomaker.fr',
  thumbnail,
}) => (
  <Helmet>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href={favicon} />
    <title>{title} | Explomaker</title>
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    {description && <meta name="description" content={description} />}
    {description && <meta property="og:description" content={description} />}
    <meta property="og:url" content={url} />
    <meta property="og:image" content={favicon} />
    {thumbnail && <meta property="og:image" content={thumbnail} />}
    <meta property="og:site_name" content="Explomaker" />
    <script>
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T9QHC84');
          `}
        </script>
  </Helmet> 
)

export default Head
