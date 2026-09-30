import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { knowledgeService } from '../services/knowledgeService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { BookOpen, Plus, Search, Edit3, Trash2, Eye, Tag, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Authoritative Grounding Corpus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Business <span className="text-gradient-primary">Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified policies, integration guides, and service documents that ground the AI chatbot's responses.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate} className="self-start sm:self-auto">
          Add Knowledge Article
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-88">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title, keyword, or tag..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 hidden sm:inline">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
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
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-400">Loading knowledge base articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">No knowledge articles found.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Try clearing filters or add a new article.</p>
          </div>
        ) : (
          articles.map((art) => (
            <Card key={art.id} hover className="flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
                    {art.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 hover:text-indigo-400 hover:bg-slate-800/80 rounded-lg transition-all"
                      title="Edit article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-all"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 leading-snug group-hover:text-indigo-300 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {art.content}
                </p>

                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {art.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-2 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-500" />
                    {art.views_count || 0} views
                  </span>
                  <span>•</span>
                  <span>{formatDate(art.created_at)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Article Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise SLA and Escalation Framework"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner cursor-pointer"
              >
                <option value="general">General</option>
                <option value="billing">Billing & Plans</option>
                <option value="technical">Technical & API</option>
                <option value="compliance">Compliance & Security</option>
                <option value="support">Support SLAs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="sla, escalation, refund, api"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Authoritative Content</span>
              <span className="text-[10px] text-cyan-400 font-normal">Strict Grounding Applied</span>
            </label>
            <textarea
              required
              rows={7}
              placeholder="Provide exact policies, SLA timeframes, refund terms, and API limits..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
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
