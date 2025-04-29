import { Router } from 'express';
import { subscribeUser, getSubscription, updateSubscription, cancelSubscription } from '../controllers/subscriptionController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/subscribe', protect, subscribeUser);
router.get('/my-subscription', protect, getSubscription);
router.put('/update', protect, updateSubscription);
router.delete('/cancel', protect, cancelSubscription);

export default router;