import React, { useState, useMemo } from 'react';
import { 
  Mail, Inbox, Send, Star, Trash2, Search, Plus, 
  AlertCircle, User, Building, Pill, ChevronLeft,
  MoreVertical, Paperclip, Clock, Check, CheckCheck
} from 'lucide-react';
import { Badge, Button, Input } from '../components/ui';
import { useTheme } from '../contexts';
import { useToast } from '../contexts';
import { MOCK_MESSAGES } from '../data';

const MessageCenter = ({ onCompose }) => {
  const { isDark } = useTheme();
  const toast = useToast();
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  // Filter messages by folder and search
  const filteredMessages = useMemo(() => {
    let filtered = messages.filter(msg => {
      if (activeFolder === 'inbox') return msg.type === 'inbox';
      if (activeFolder === 'sent') return msg.type === 'sent';
      if (activeFolder === 'starred') return msg.starred;
      return true;
    });

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(search) ||
        msg.from.toLowerCase().includes(search) ||
        msg.body.toLowerCase().includes(search)
      );
    }

    // Sort by timestamp descending
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [messages, activeFolder, searchTerm]);

  // Count unread messages
  const unreadCount = useMemo(() => 
    messages.filter(m => m.type === 'inbox' && !m.read).length
  , [messages]);

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    // Mark as read
    if (!msg.read) {
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, read: true } : m
      ));
    }
  };

  const handleToggleStar = (msgId, e) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, starred: !m.starred } : m
    ));
  };

  const handleDelete = (msgId) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setSelectedMessage(null);
    toast.success('Message deleted');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date('2026-01-02T12:00:00');
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getSenderIcon = (fromType) => {
    switch (fromType) {
      case 'patient': return User;
      case 'provider': return User;
      case 'pharmacy': return Pill;
      case 'department': return Building;
      default: return Mail;
    }
  };

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount },
    { id: 'sent', label: 'Sent', icon: Send, count: 0 },
    { id: 'starred', label: 'Starred', icon: Star, count: messages.filter(m => m.starred).length },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-teal-900/30' : 'bg-teal-100'}`}>
            <Mail className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Message Center
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={onCompose}>
          Compose
        </Button>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex rounded-lg border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Sidebar */}
        <div className={`w-48 flex-shrink-0 border-r flex flex-col ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          {/* Folders */}
          <div className="p-2 space-y-1">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setSelectedMessage(null); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                  activeFolder === folder.id
                    ? 'bg-teal-600 text-white'
                    : isDark 
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <folder.icon className="w-4 h-4" />
                  {folder.label}
                </div>
                {folder.count > 0 && (
                  <Badge 
                    variant={activeFolder === folder.id ? 'default' : 'info'} 
                    size="xs"
                  >
                    {folder.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className={`w-80 flex-shrink-0 border-r flex flex-col ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          {/* Search */}
          <div className={`p-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              icon={Search}
              small
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(msg => {
                const SenderIcon = getSenderIcon(msg.fromType);
                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full p-3 text-left border-b transition-colors ${
                      selectedMessage?.id === msg.id
                        ? isDark ? 'bg-slate-700' : 'bg-teal-50'
                        : isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    } ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Unread indicator */}
                      <div className="mt-2">
                        {!msg.read && msg.type === 'inbox' && (
                          <div className="w-2 h-2 bg-teal-500 rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium truncate ${
                            !msg.read && msg.type === 'inbox'
                              ? isDark ? 'text-white' : 'text-slate-900'
                              : isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {msg.type === 'sent' ? `To: ${msg.to}` : msg.from}
                          </span>
                          <span className={`text-xs flex-shrink-0 ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {formatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-1">
                          {msg.priority === 'urgent' && (
                            <AlertCircle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm truncate ${
                            !msg.read && msg.type === 'inbox'
                              ? isDark ? 'text-white' : 'text-slate-800'
                              : isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {msg.subject}
                          </span>
                        </div>
                        
                        <p className={`text-xs truncate ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {msg.body.split('\n')[0]}
                        </p>
                      </div>

                      {/* Star */}
                      <button 
                        onClick={(e) => handleToggleStar(msg.id, e)}
                        className="p-1"
                      >
                        <Star className={`w-4 h-4 ${
                          msg.starred 
                            ? 'text-amber-400 fill-amber-400' 
                            : isDark ? 'text-slate-600' : 'text-slate-300'
                        }`} />
                      </button>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Mail className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {selectedMessage.priority === 'urgent' && (
                      <Badge variant="danger" size="xs">Urgent</Badge>
                    )}
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedMessage.subject}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToggleStar(selectedMessage.id, { stopPropagation: () => {} })}
                      className={`p-1.5 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                    >
                      <Star className={`w-4 h-4 ${
                        selectedMessage.starred 
                          ? 'text-amber-400 fill-amber-400' 
                          : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      className={`p-1.5 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-rose-400' : 'hover:bg-slate-100 text-slate-500 hover:text-rose-500'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMessage.fromType === 'patient' 
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white'
                      : selectedMessage.fromType === 'provider'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                        : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {selectedMessage.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedMessage.from}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {selectedMessage.type === 'sent' ? 'To: ' + selectedMessage.to : 'To: Dr. Jide Grand'}
                      {' - '}
                      {new Date(selectedMessage.timestamp).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {selectedMessage.body}
                </div>
              </div>

              {/* Reply Actions */}
              {selectedMessage.type === 'inbox' && (
                <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={onCompose}>
                      Reply
                    </Button>
                    <Button variant="secondary" size="sm">
                      Forward
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className={`w-16 h-16 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Select a message to read
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
