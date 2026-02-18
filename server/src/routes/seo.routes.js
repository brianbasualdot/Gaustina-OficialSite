import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            select: { id: true, updatedAt: true }
        });

        const baseUrl = process.env.BASE_URL || 'https://tudominio.com';

        const staticRoutes = [
            '',
            '/nosotros',
            '/contact'
        ];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        // Add dynamic product routes
        products.forEach(product => {
            sitemap += `
  <url>
    <loc>${baseUrl}/producto/${product.id}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
        });

        sitemap += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
