import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute';
import subscriptionRoutes from './routes/subscriptionRoute';
import { errorHandler } from './middleware/errorHandler';


dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);


app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));