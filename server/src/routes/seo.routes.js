import express from 'express';
import { getSitemap, getCatalogCsv } from '../controllers/seoController.js';

const router = express.Router();

// Dynamic Sitemap for Google
router.get('/sitemap.xml', getSitemap);

// Marketing Feed for Meta/Google Ads
router.get('/marketing/catalog.csv', getCatalogCsv);

export default router;
