import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Notification {
  id: string;
  type: 'fraud' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  amount?: string;
  location?: string;
  account?: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'fraud',
    title: 'Suspicious Transaction Blocked',
    message: 'We blocked a potentially fraudulent transaction from an unusual location.',
    timestamp: '2 mins ago',
    amount: '$15,420',
    location: 'Lagos, Nigeria',
    account: '****4532',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Multiple Login Attempts Detected',
    message: 'Someone tried to access your account 5 times from an unknown device.',
    timestamp: '15 mins ago',
    location: 'Moscow, Russia',
    account: '****7829',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Transaction Approved',
    message: 'Your recent purchase was verified and approved.',
    timestamp: '1 hour ago',
    amount: '$89.99',
    location: 'New York, USA',
    account: '****4532',
    read: true,
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showMobileAlert, setShowMobileAlert] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Show mobile alert on mount for demo
    const timer = setTimeout(() => {
      if (window.innerWidth < 768 && notifications.some(n => !n.read)) {
        setShowMobileAlert(true);
        // Vibrate mobile device
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'fraud':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'fraud':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-500 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Fraud Alert Banner */}
      {showMobileAlert && unreadCount > 0 && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 p-4 animate-slide-down">
          <div className="bg-red-600 text-white rounded-lg shadow-2xl p-4 border-2 border-red-400 animate-pulse-slow">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Fraud Alert!</h3>
                <p className="text-sm mb-3">{notifications[0].message}</p>
                {notifications[0].amount && (
                  <div className="text-sm space-y-1 mb-3">
                    <p><span className="font-semibold">Amount:</span> {notifications[0].amount}</p>
                    <p><span className="font-semibold">Location:</span> {notifications[0].location}</p>
                    <p><span className="font-semibold">Account:</span> {notifications[0].account}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-white text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      setShowMobileAlert(false);
                      setIsOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-red-700"
                    onClick={() => setShowMobileAlert(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setShowMobileAlert(false)}
                className="text-white hover:bg-red-700 rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="fixed top-16 right-0 md:right-4 w-full md:w-96 bg-white rounded-b-lg md:rounded-lg shadow-2xl z-50 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col animate-slide-down">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-700 rounded p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/20 text-white border-0">
                    {unreadCount} unread
                  </Badge>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-white/90 hover:text-white underline"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getBackgroundColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          {(notification.amount || notification.location || notification.account) && (
                            <div className="text-xs text-gray-500 space-y-1 mb-2">
                              {notification.amount && (
                                <p><span className="font-medium">Amount:</span> {notification.amount}</p>
                              )}
                              {notification.location && (
                                <p><span className="font-medium">Location:</span> {notification.location}</p>
                              )}
                              {notification.account && (
                                <p><span className="font-medium">Account:</span> {notification.account}</p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {notification.timestamp}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-xs text-gray-400 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/alerts';
                }}
              >
                View All Alerts
              </Button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
