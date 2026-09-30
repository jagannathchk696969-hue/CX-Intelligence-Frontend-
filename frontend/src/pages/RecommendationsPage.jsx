import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { recommendationService } from '../services/customerService';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, Check, ArrowRight, User, Building, Send, Zap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const RecommendationsPage = () => {
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    customerService.getCustomers().then((data) => {
      setCustomers(data);
      const queryId = searchParams.get('customerId');
      if (queryId && data.some(c => c.id === queryId)) {
        setSelectedCustomerId(queryId);
      } else if (data.length > 0) {
        setSelectedCustomerId(data[0].id);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (!selectedCustomerId) return;
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const data = await recommendationService.getRecommendations(selectedCustomerId);
        setRecommendations(data);
      } catch (err) {
        toast.error('Failed to load personalized recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [selectedCustomerId]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleSendOffer = (productName) => {
    toast.success(`Personalized offer for "${productName}" dispatched to customer!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Hyper-Personalization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart <span className="text-gradient-primary">Recommendations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tailored product, tier upgrade, and add-on suggestions generated from customer profile telemetry and conversation history.
          </p>
        </div>

        {/* Customer Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-900 border border-slate-800 p-1.5 rounded-xl shadow-sm">
          <span className="text-xs text-slate-400 px-2 font-medium">Customer:</span>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-inner font-medium"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Customer Profile Highlight */}
      {selectedCustomer && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/60 border border-indigo-500/30 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              {selectedCustomer.name?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{selectedCustomer.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  {selectedCustomer.preferences?.plan || 'Standard'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {selectedCustomer.email} • Industry: {selectedCustomer.preferences?.industry || 'Technology'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Profile Interests:</span>
            <div className="flex flex-wrap gap-1">
              {(selectedCustomer.preferences?.interests || []).map((int, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-indigo-300 text-[10px] font-medium border border-slate-700">
                  {int}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-400">Evaluating affinity models and generating recommendations...</span>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">No recommendations available for this customer.</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} hover className="flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                    {rec.product?.category || 'Service Addon'}
                  </span>
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{Math.round((rec.confidence_score || 0.85) * 100)}% Match</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-3.5 group-hover:text-indigo-300 transition-colors">
                  {rec.product?.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {rec.product?.description}
                </p>

                {/* AI Match Rationale */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    AI Match Rationale:
                  </p>
                  <p className="text-xs text-slate-300 italic leading-relaxed">{rec.reason}</p>
                </div>

                {/* Features list */}
                {rec.product?.features && (
                  <div className="mt-4 space-y-2">
                    {rec.product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Subscription</span>
                  <span className="text-xl font-black text-white font-mono">
                    {formatCurrency(rec.product?.price || 199, rec.product?.currency || 'USD')}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={() => handleSendOffer(rec.product?.name)}
                >
                  Send Offer
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
