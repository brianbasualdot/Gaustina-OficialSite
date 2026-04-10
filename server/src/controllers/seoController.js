import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SITE_URL = "https://gaustina.com.ar";

export const getSitemap = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { paused: false },
            select: { id: true, updatedAt: true }
        });

        const urls = [
            { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly' },
            { loc: `${SITE_URL}/productos`, priority: '0.9', changefreq: 'daily' },
            { loc: `${SITE_URL}/contacto`, priority: '0.7', changefreq: 'monthly' },
            ...products.map(p => ({
                loc: `${SITE_URL}/producto/${p.id}`,
                lastmod: p.updatedAt.toISOString().split('T')[0],
                priority: '0.8',
                changefreq: 'weekly'
            }))
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
};

export const getCatalogCsv = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { paused: false },
            include: { category: true }
        });

        // CSV Header (Standard for Meta/Google)
        const header = [
            'id',
            'title',
            'description',
            'availability',
            'condition',
            'price',
            'link',
            'image_link',
            'brand',
            'google_product_category'
        ];

        const rows = products.map(p => {
            const availability = p.stock > 0 ? 'in stock' : 'out of stock';
            const price = `${p.price} ARS`;
            const link = `${SITE_URL}/producto/${p.id}`;
            const image_link = p.images && p.images.length > 0 ? p.images[0] : '';
            const brand = 'Gaustina';
            const category = p.category ? p.category.name : 'Bolsos y Neceseres';

            return [
                p.id,
                `"${p.name.replace(/"/g, '""')}"`,
                `"${p.description.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                availability,
                'new',
                price,
                link,
                image_link,
                brand,
                `"${category}"`
            ];
        });

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('gaustina-catalog.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("Error generating CSV catalog:", error);
        res.status(500).send("Error generating catalog");
    }
};
