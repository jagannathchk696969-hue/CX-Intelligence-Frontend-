import { customerService } from '../services/customerService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getCustomers = async (req, res) => {
  try {
    const list = await customerService.getCustomers(req.user.businessId, req.query.search);
    return sendSuccess(res, list, 'Customers retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    return sendSuccess(res, customer, 'Customer retrieved');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await customerService.createCustomer(req.user.businessId, req.body);
    return sendSuccess(res, newCustomer, 'Customer created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updated = await customerService.updateCustomer(req.params.id, req.body);
    return sendSuccess(res, updated, 'Customer updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};
