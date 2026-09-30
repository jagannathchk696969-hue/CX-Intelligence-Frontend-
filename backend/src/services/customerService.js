import { db } from '../models/database.js';

export const customerService = {
  async getCustomers(businessId, search = '') {
    let list = await db.findMany('customers', { business_id: businessId });
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getCustomerById(id) {
    const customer = await db.findOne('customers', { id });
    if (!customer) throw new Error('Customer not found');

    const conversations = await db.findMany('conversations', { customer_id: id });
    const tickets = await db.findMany('tickets', { customer_id: id });
    const recommendations = await db.findMany('recommendations', { customer_id: id });

    return {
      ...customer,
      stats: {
        conversationsCount: conversations.length,
        ticketsCount: tickets.length,
        recommendationsCount: recommendations.length,
      }
    };
  },

  async createCustomer(businessId, data) {
    return await db.insert('customers', {
      business_id: businessId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      preferences: data.preferences || { preferred_channel: 'chat', interests: [] },
    });
  },

  async updateCustomer(id, data) {
    const updated = await db.update('customers', id, data);
    if (!updated) throw new Error('Customer not found');
    return updated;
  }
};
