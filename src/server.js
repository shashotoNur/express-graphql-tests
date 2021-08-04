require('dotenv').config({ path: __dirname + '/config/config.env' });

const app = require('./config/app');
const connectToDatabase = require('./config/db');

const initializeServer = async () =>
    {
        const PORT = process.env.PORT || 5000;

        await connectToDatabase();
        app.listen(PORT, () => console.log(`Server running at localhost:${PORT}${process.env.GRAPHQL_ROUTE}`));
    };

initializeServer();