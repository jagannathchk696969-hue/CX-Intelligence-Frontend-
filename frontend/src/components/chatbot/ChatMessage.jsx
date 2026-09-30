import React from 'react';
import { Bot, User, ShieldAlert, Sparkles, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { SENTIMENT_CONFIG } from '../../utils/constants';

export const ChatMessage = ({ message, onOpenFeedback }) => {
  const isCustomer = message.sender_type === 'customer';
  const isAi = message.sender_type === 'ai_assistant';
  const isSystem = message.sender_type === 'system';
  const isAgent = message.sender_type === 'support_agent';

  const sentiment = message.sentiment;
  const sentimentConf = sentiment ? SENTIMENT_CONFIG[sentiment] : null;
  const groundedSource = message.metadata?.sourceArticle;

  if (isSystem) {
    return (
      <div className="flex justify-center my-3.5 animate-fade-in">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 shadow-md shadow-amber-500/5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-medium">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in ${isCustomer ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 ${
          isCustomer
            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-indigo-600/25'
            : isAi
            ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 text-white shadow-cyan-500/20'
            : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-600/20'
        }`}
      >
        {isCustomer && <User className="w-4 h-4" />}
        {isAi && <Bot className="w-4 h-4" />}
        {isAgent && <span className="text-[11px] font-bold">SA</span>}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isCustomer ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center space-x-2 text-[11px] text-slate-400 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
          <span className="font-bold text-slate-200">
            {isCustomer ? 'You' : isAi ? 'CX Copilot' : 'Support Specialist'}
          </span>
          <span>•</span>
          <span className="text-[10px]">{formatDate(message.created_at)}</span>

          {sentimentConf && (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${sentimentConf.color}`}>
              {sentimentConf.label}
            </span>
          )}
        </div>

        {/* Content Bubble */}
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line relative overflow-hidden transition-all ${
            isCustomer
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white rounded-tr-sm shadow-xl shadow-indigo-600/25 border border-indigo-400/30'
              : 'glass-panel-elevated text-slate-100 rounded-tl-sm border border-slate-700/80 shadow-xl'
          }`}
        >
          {message.content}

          {/* Grounded Knowledge Base Citation */}
          {groundedSource && (
            <div className="mt-3 pt-2.5 border-t border-slate-700/70 flex items-center space-x-2 text-xs text-cyan-300">
              <span className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              </span>
              <span className="font-semibold truncate">Verified: {groundedSource.title}</span>
            </div>
          )}

          {/* Suggested Escalation Prompt */}
          {message.metadata?.escalationSuggested && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/70 flex items-center space-x-2 text-xs text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-medium">Live specialist escalation recommended for prompt resolution.</span>
            </div>
          )}
        </div>

        {/* Action feedback button for AI responses */}
        {isAi && onOpenFeedback && (
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-0.5 pl-1">
            <span>Was this helpful?</span>
            <button
              onClick={() => onOpenFeedback(message)}
              className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 p-1 rounded-md transition-colors"
              title="Give response feedback"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 my-4 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md border border-white/10">
        <Bot className="w-4 h-4" />
      </div>
      <div className="glass-panel-elevated border border-slate-700/80 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center space-x-2.5 shadow-lg">
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
        </div>
        <span className="text-xs text-slate-300 font-medium">Assistant reasoning with verified knowledge base...</span>
      </div>
    </div>
  );
};
