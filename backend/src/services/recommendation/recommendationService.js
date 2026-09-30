import { db } from '../../models/database.js';

export const recommendationService = {
  async getRecommendationsForCustomer(customerId, businessId) {
    const customer = await db.findOne('customers', { id: customerId });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const bId = businessId || customer.business_id;
    const products = await db.findMany('products', { business_id: bId, active: true });

    // Existing recommendations
    const existing = await db.findMany('recommendations', { customer_id: customerId });

    if (existing.length > 0) {
      // Enrich with product details
      const enriched = await Promise.all(existing.map(async (rec) => {
        const prod = products.find(p => p.id === rec.product_id) || await db.findOne('products', { id: rec.product_id });
        return {
          ...rec,
          product: prod,
        };
      }));
      return enriched;
    }

    // Generate smart recommendations based on customer preferences & industry
    const interests = customer.preferences?.interests || [];
    const generated = [];

    for (const prod of products) {
      let matched = false;
      let reason = '';

      if (interests.some(i => prod.name.toLowerCase().includes(i.toLowerCase()) || prod.category.toLowerCase().includes(i.toLowerCase()))) {
        matched = true;
        reason = `Matches your stated interest in ${interests.join(', ')} and optimizes your workflow.`;
      } else if (prod.category === 'Platform' || prod.category === 'AI Tools') {
        matched = true;
        reason = `Top rated by ${customer.preferences?.industry || 'enterprise'} organizations for boosting customer retention.`;
      }

      if (matched && generated.length < 3) {
        const rec = await db.insert('recommendations', {
          customer_id: customerId,
          product_id: prod.id,
          reason,
          confidence_score: 0.92,
        });

        generated.push({
          ...rec,
          product: prod,
        });
      }
    }

    return generated;
  }
};
