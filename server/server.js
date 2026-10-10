const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const startServer = async () => {
  const isConnected = await connectDB();
  
  if (!isConnected) {
    console.error('Failed to connect to the database. Server is not starting.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
