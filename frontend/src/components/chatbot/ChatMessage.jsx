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
      <div className="flex justify-center my-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 my-4 ${isCustomer ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
          isCustomer
            ? 'bg-indigo-600 text-white'
            : isAi
            ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}
      >
        {isCustomer && <User className="w-4 h-4" />}
        {isAi && <Bot className="w-4 h-4" />}
        {isAgent && <span className="text-xs font-bold">SA</span>}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isCustomer ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            {isCustomer ? 'You' : isAi ? 'CX AI Assistant' : 'Support Agent'}
          </span>
          <span>•</span>
          <span>{formatDate(message.created_at)}</span>

          {sentimentConf && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded border ${sentimentConf.color}`}>
              {sentimentConf.label}
            </span>
          )}
        </div>

        {/* Content Bubble */}
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isCustomer
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
              : 'glass-panel border border-slate-800 text-slate-100 rounded-tl-none shadow-md'
          }`}
        >
          {message.content}

          {/* Grounded Knowledge Base Citation */}
          {groundedSource && (
            <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center space-x-2 text-xs text-cyan-300">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">Source Verified: {groundedSource.title}</span>
            </div>
          )}

          {/* Suggested Escalation Prompt */}
          {message.metadata?.escalationSuggested && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center space-x-2 text-xs text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Support escalation recommended for this issue.</span>
            </div>
          )}
        </div>

        {/* Action feedback button for AI responses */}
        {isAi && onOpenFeedback && (
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
            <span>Was this helpful?</span>
            <button
              onClick={() => onOpenFeedback(message)}
              className="hover:text-emerald-400 transition-colors p-1"
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
    <div className="flex items-start gap-3 my-4">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
        <Bot className="w-4 h-4" />
      </div>
      <div className="glass-panel border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
        </div>
        <span className="text-xs text-slate-400 font-medium">Assistant analyzing knowledge base...</span>
      </div>
    </div>
  );
};
