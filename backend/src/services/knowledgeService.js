import { db } from '../models/database.js';

export const knowledgeService = {
  async getArticles(businessId, { category, search, published } = {}) {
    let articles = await db.findMany('knowledge_articles', { business_id: businessId });

    if (published !== undefined) {
      const isPub = published === 'true' || published === true;
      articles = articles.filter(a => a.published === isPub);
    }

    if (category) {
      articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getArticleById(id) {
    const article = await db.findOne('knowledge_articles', { id });
    if (!article) throw new Error('Knowledge article not found');

    // Increment view count
    await db.update('knowledge_articles', id, { views_count: (article.views_count || 0) + 1 });
    return article;
  },

  async createArticle(businessId, data) {
    return await db.insert('knowledge_articles', {
      business_id: businessId,
      title: data.title,
      content: data.content,
      category: data.category || 'general',
      published: data.published ?? true,
      tags: data.tags || [],
      views_count: 0,
    });
  },

  async updateArticle(id, updates) {
    const updated = await db.update('knowledge_articles', id, updates);
    if (!updated) throw new Error('Article not found');
    return updated;
  },

  async deleteArticle(id) {
    const deleted = await db.delete('knowledge_articles', id);
    if (!deleted) throw new Error('Article not found');
    return true;
  }
};
