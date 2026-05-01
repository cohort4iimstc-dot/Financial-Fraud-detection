import { useEffect } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, XCircle } from 'lucide-react';

export function useFraudAlerts() {
  useEffect(() => {
    // Simulate receiving a fraud alert after 3 seconds
    const timer = setTimeout(() => {
      // Vibrate mobile device if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }

      toast.custom((t) => (
        <div className="bg-red-600 text-white rounded-lg shadow-2xl p-4 max-w-md w-full border-2 border-red-400">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">🚨 Fraud Alert Detected!</h3>
              <p className="text-sm mb-2">
                Suspicious transaction blocked on your account
              </p>
              <div className="bg-white/10 rounded-lg p-2 text-xs space-y-1 mb-3">
                <p><span className="font-semibold">Amount:</span> $15,420.00</p>
                <p><span className="font-semibold">Location:</span> Lagos, Nigeria</p>
                <p><span className="font-semibold">Account:</span> ****4532</p>
                <p><span className="font-semibold">Time:</span> Just now</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    window.location.href = '/alerts';
                  }}
                  className="bg-white text-red-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="bg-white/20 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white hover:bg-red-700 rounded p-1 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      ), {
        duration: 10000,
        position: 'top-center',
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
}

export default function FraudAlertToast() {
  useFraudAlerts();
  return null;
}
