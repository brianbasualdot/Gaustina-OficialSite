import React from 'react';
import { Helmet } from 'react-helmet-async';


const SeoHead = ({ title, description, image, url, type = "website" }) => {
    const siteUrl = "https://gaustina.com.ar";
    const absoluteUrl = url ? `${siteUrl}${url}` : siteUrl;
    const ogImage = image || "https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/faviconn.png";

    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            <link rel="canonical" href={absoluteUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SeoHead;
