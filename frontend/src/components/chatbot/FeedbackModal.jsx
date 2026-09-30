import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Star, MessageSquare } from 'lucide-react';

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
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-900/60 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300 mb-2">Rate Response Quality</span>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-700 hover:text-slate-500'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-[11px] text-amber-400 font-medium mt-2">
            {rating === 5 ? 'Excellent & Accurate' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Additional Feedback or Evaluation Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or what could be improved in this AI response..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
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
