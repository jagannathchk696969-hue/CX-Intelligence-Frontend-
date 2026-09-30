import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, User, Tag, AlertCircle, FileText } from 'lucide-react';

export const TicketFormModal = ({ isOpen, onClose, onSubmit, customers = [] }) => {
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        customerId: customers[0]?.id || '',
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Support Ticket"
      subtitle="AI will automatically evaluate customer issue sentiment and suggest SLA urgency."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Customer</span>
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner cursor-pointer"
            required
          >
            <option value="">Select a customer profile</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Subject Line</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Production API Webhook Dispatches Failing"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner cursor-pointer"
            >
              <option value="general">General Support</option>
              <option value="billing">Billing & Subscriptions</option>
              <option value="technical">Technical & API</option>
              <option value="account">Account & Compliance</option>
              <option value="product">Product Features</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner cursor-pointer"
            >
              <option value="low">Low (Normal SLA)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="high">High (Elevated SLA)</option>
              <option value="urgent">Urgent (Immediate P1)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Issue Details & Reproduction Steps</span>
            <span className="text-[10px] text-cyan-400 font-normal flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI NLP Sentiment Analysis
            </span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the issue in detail. AI sentiment detection will run on submission..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
