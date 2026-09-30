import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createTicketSchema, updateTicketSchema, addTicketMessageSchema } from '../validators/allValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', validateRequest(createTicketSchema), ticketController.createTicket);
router.patch('/:id', validateRequest(updateTicketSchema), ticketController.updateTicket);
router.post('/:id/messages', validateRequest(addTicketMessageSchema), ticketController.addTicketMessage);

export default router;
