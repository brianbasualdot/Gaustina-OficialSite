import React from 'react';
import { Helmet } from 'react-helmet-async';


const SeoHead = ({ title, description, structuredData }) => {
    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SeoHead;
