import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import app from './server/app';

const PORT = 3000;

async function startServer() {
  try {
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });

      // Dedicated HTML routes for SEO & Google AdSense in development
      app.get(['/about', '/about.html'], async (req, res, next) => {
        try {
          const filePath = path.resolve(process.cwd(), 'about.html');
          const template = fs.readFileSync(filePath, 'utf-8');
          const html = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          next(e);
        }
      });

      app.get(['/news', '/beer-news', '/news.html', '/beer-news.html'], async (req, res, next) => {
        try {
          const filePath = path.resolve(process.cwd(), 'news.html');
          const template = fs.readFileSync(filePath, 'utf-8');
          const html = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          next(e);
        }
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));

      app.get(['/about', '/about.html'], (req, res) => {
        res.sendFile(path.join(distPath, 'about.html'));
      });

      app.get(['/news', '/beer-news', '/news.html', '/beer-news.html'], (req, res) => {
        res.sendFile(path.join(distPath, 'news.html'));
      });

      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`BrewHop server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

