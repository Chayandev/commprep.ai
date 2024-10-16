import https from 'https';
import fs from 'fs';
import connectDB from './db/index.js';
import { app } from './app.js';

// SSL certificate and key using environment variables
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

// Connect to MongoDB
connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('Error:', error);
      throw error;
    });

    // Create HTTPS server
    https.createServer(sslOptions, app).listen(process.env.PORT || 443, () => {
      console.log(`HTTPS server is running at PORT: ${process.env.PORT || 443}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection failed!!!', error);
  });
