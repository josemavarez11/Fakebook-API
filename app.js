/**
 * This file represents the main entry point of the Fakebook API application.
 * It imports necessary modules, sets up the Express application, connects to the database,
 * defines routes, and starts the server.
 * @author José Mavárez
 */ 

import express from 'express';
import connectDB from './src/db/connectDB.js';
import router from './src/routing/index.js';
import reqReceivedMiddleware from './src/middlewares/reqReceivedMiddleware.js';
import corsMiddleware from './src/middlewares/corsMiddleware.js';

try {
    /**
     * Instance of the Express application. 
     * @const
     * @type {express.Application}
     */
    const app = express();
    
    //Connect to MongoDB
    await connectDB();
    
    //Middlewares to parse JSON and form requests.
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //Middleware to log and show incoming requests.
    app.use(reqReceivedMiddleware);

    //Middleware to enable CORS.
    app.use(corsMiddleware);

    // Index router implementation.
    app.use('/api', router);
    
    /**
     * Port where the server will listen.
     * @const
     * @type {number}
     */
    const PORT = process.env.PORT

    // Start the server and show a message in the console.
    app.listen(PORT, () => console.log(`API started at http://localhost:${PORT}`));
} catch (error) {
    console.log(`API crashed: ${error.message}`);
}