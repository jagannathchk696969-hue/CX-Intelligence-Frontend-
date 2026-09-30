import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { Users, Search, Mail, Phone, Tag, Sparkles, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const toast = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await customerService.getCustomers(search);
        setCustomers(data);
      } catch (err) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Customer Intelligence Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer <span className="text-gradient-primary">Accounts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage customer context, stated product interests, sentiment history, and personalized recommendation profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{customers.length} Profiles Synced</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="relative w-full sm:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, company, or email..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading customer profiles...</span>
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">No customer profiles match your search criteria.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Try clearing the search query.</p>
          </div>
        ) : (
          customers.map((c) => (
            <Card key={c.id} hover className="flex flex-col justify-between group">
              <div>
                {/* Header with avatar & plan */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-white text-sm">
                        {c.name?.[0] || 'C'}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-500" />
                        <span>{c.preferences?.industry || 'Enterprise'}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm whitespace-nowrap">
                    {c.preferences?.plan || 'Standard Plan'}
                  </span>
                </div>

                {/* Contact info rows */}
                <div className="space-y-2 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate text-slate-300 font-mono text-[11px]">{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-300 font-mono text-[11px]">{c.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stated Interests */}
                <div className="mt-3.5">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    Profile Interests:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(c.preferences?.interests || ['General Support']).map((int, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:border-slate-600 transition-colors"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Since {formatDate(c.created_at)}</span>
                <Link
                  to={`/dashboard/recommendations?customerId=${c.id}`}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold border border-indigo-500/20 hover:border-indigo-500/40 transition-all inline-flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Smart Offers</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
