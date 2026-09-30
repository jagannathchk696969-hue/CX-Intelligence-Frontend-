import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { Users, Search, Mail, Phone, Tag, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer accounts, preferences, profile context, and individualized recommendation profiles.
          </p>
        </div>
      </div>

      <Card hover className="p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-3 py-8 text-center">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="text-xs text-slate-400 col-span-3 py-8 text-center">No customers found.</p>
        ) : (
          customers.map((c) => (
            <Card key={c.id} hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                    {c.name?.[0] || 'C'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                    <span className="text-[11px] text-cyan-400">{c.preferences?.plan || 'Standard Plan'}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stated Interests */}
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5">Profile Interests:</p>
                  <div className="flex flex-wrap gap-1">
                    {(c.preferences?.interests || ['General Support']).map((int, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Joined {formatDate(c.created_at)}</span>
                <Link
                  to={`/dashboard/recommendations?customerId=${c.id}`}
                  className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Recommendations</span>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
