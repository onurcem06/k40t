
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description,
    image = 'https://drive.google.com/uc?export=view&id=19gNN5Jnqz_Qy6qszIbdXR4lXXdJcXuPK',
    url = 'https://kafamdakirktilki.com',
    type = 'website'
}) => {
    const defaults = {
        title: 'Kafamda Kırk Tilki | Dijital Reklam ve Veri Ajansı',
        description: 'Geleneksel reklamcılığın sınırlarını yaratıcı zeka ve klinik veri ile aşıyoruz. Kafamda Kırk Tilki ile 360 derece dijital büyüme stratejileri.'
    };

    const finalTitle = title ? `${title} | Kafamda Kırk Tilki` : defaults.title;
    const finalDesc = description || defaults.description;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SeoHead;
