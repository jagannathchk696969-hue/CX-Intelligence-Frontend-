import { Router } from 'express';
import * as customerController from '../controllers/customerController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createCustomerSchema, updateCustomerSchema } from '../validators/allValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('admin', 'support_agent', 'customer'), customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', requireRole('admin', 'support_agent'), validateRequest(createCustomerSchema), customerController.createCustomer);
router.put('/:id', requireRole('admin', 'support_agent'), validateRequest(updateCustomerSchema), customerController.updateCustomer);

export default router;
