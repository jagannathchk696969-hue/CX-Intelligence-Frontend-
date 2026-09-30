import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Star } from 'lucide-react';

export const FeedbackModal = ({ isOpen, onClose, onSubmit, conversationId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ rating, comment, conversationId });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How was your AI assistant experience?"
      subtitle="Your feedback helps us continuously ground and optimize automated support responses."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex items-center justify-center space-x-2 py-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="p-1 text-slate-600 hover:text-amber-400 transition-colors focus:outline-none"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Comments or additional details (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or what could be improved..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};
