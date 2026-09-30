import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { recommendationService } from '../services/customerService';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, Check, ArrowRight, User } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>Smart Recommendation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized product and service suggestions generated from customer profile, interactions, and stated interests.
          </p>
        </div>

        {/* Customer Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Target Customer:</span>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCustomer && (
        <Card hover className="p-4 bg-indigo-600/10 border-indigo-500/20">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Selected Profile: </span>
              <span className="font-semibold text-white">{selectedCustomer.name}</span>
              <span className="text-slate-400"> • Industry: {selectedCustomer.preferences?.industry || 'Technology'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">Interests:</span>
              <div className="flex gap-1">
                {(selectedCustomer.preferences?.interests || []).map((int, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px] border border-slate-700">
                    {int}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-3 py-8 text-center">Generating smart recommendations...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-xs text-slate-400 col-span-3 py-8 text-center">No recommendations generated for this customer.</p>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} hover className="flex flex-col justify-between border-slate-800">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {rec.product?.category || 'Service Addon'}
                  </span>
                  <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{Math.round((rec.confidence_score || 0.85) * 100)}% Match</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{rec.product?.name}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.product?.description}</p>

                {/* Recommendation Reason */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                    AI Match Rationale:
                  </p>
                  <p className="text-xs text-slate-300 italic">{rec.reason}</p>
                </div>

                {/* Features list */}
                {rec.product?.features && (
                  <div className="mt-4 space-y-1.5">
                    {rec.product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(rec.product?.price || 199, rec.product?.currency || 'USD')}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                </div>

                <Button variant="primary" size="sm">
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
