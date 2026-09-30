import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { knowledgeService } from '../services/knowledgeService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { BookOpen, Plus, Search, Edit3, Trash2, Eye, Tag, CheckCircle2 } from 'lucide-react';

export const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: '',
    tags: '',
    published: true,
  });

  const toast = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await knowledgeService.getArticles({
        category: categoryFilter || undefined,
        search: search || undefined,
      });
      setArticles(data);
    } catch (err) {
      toast.error('Failed to load knowledge base articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [categoryFilter, search]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'general',
      content: '',
      tags: '',
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      content: art.content,
      tags: (art.tags || []).join(', '),
      published: art.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags: tagsArray,
        published: formData.published,
      };

      if (editingArticle) {
        await knowledgeService.updateArticle(editingArticle.id, payload);
        toast.success('Knowledge article updated');
      } else {
        await knowledgeService.createArticle(payload);
        toast.success('Knowledge article published and grounded for AI');
      }

      setModalOpen(false);
      fetchArticles();
    } catch (err) {
      toast.error(err.message || 'Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this knowledge article?')) return;
    try {
      await knowledgeService.deleteArticle(id);
      toast.success('Article deleted');
      fetchArticles();
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Business Knowledge Base</h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified policies, integration guides, and service documents that ground the AI chatbot's responses.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Knowledge Article
        </Button>
      </div>

      {/* Search and Filters */}
      <Card hover className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title, keyword, or tag..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="billing">Billing & Plans</option>
              <option value="technical">Technical & API</option>
              <option value="compliance">Compliance & Security</option>
              <option value="support">Support SLAs</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-2 py-8 text-center">Loading knowledge articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-xs text-slate-400 col-span-2 py-8 text-center">No knowledge articles found.</p>
        ) : (
          articles.map((art) => (
            <Card key={art.id} hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 pb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {art.category}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1 hover:text-indigo-400 rounded transition-colors"
                      title="Edit article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1 hover:text-rose-400 rounded transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-1 leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{art.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {art.views_count || 0} views
                  </span>
                  <span>•</span>
                  <span>{formatDate(art.created_at)}</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Grounding Active</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create / Edit Article Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingArticle ? 'Edit Knowledge Base Article' : 'Publish New Knowledge Article'}
        subtitle="This document will become an immediate authoritative source for the AI chatbot."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Article Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise SLA and Escalation Framework"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="general">General</option>
                <option value="billing">Billing & Plans</option>
                <option value="technical">Technical & API</option>
                <option value="compliance">Compliance & Security</option>
                <option value="support">Support SLAs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="sla, escalation, refund, api"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Article Content</label>
            <textarea
              required
              rows={6}
              placeholder="Provide exact facts, numbers, policies, and instructions. The AI assistant relies strictly on this content."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingArticle ? 'Update Article' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
