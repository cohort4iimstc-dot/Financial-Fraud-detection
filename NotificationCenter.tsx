import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, TrendingUp, Users, Phone, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import logoImage from '../../imports/image-2.png';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('trustx_auth') === 'authenticated') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (loginMethod === 'email') {
        if (email && password) {
          localStorage.setItem('trustx_auth', 'authenticated');
          navigate('/');
        } else {
          setError('Please enter both email and password');
        }
      } else {
        if (phone && password) {
          localStorage.setItem('trustx_auth', 'authenticated');
          navigate('/');
        } else {
          setError('Please enter both phone number and password');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('trustx_auth', 'authenticated');
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="mb-16">
              <img
                src={logoImage}
                alt="TrustX Logo"
                className="h-48 w-auto"
              />
            </div>

            {/* Main Content */}
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Advanced AI-Powered Fraud Detection for Financial Institutions
              </h2>
              <p className="text-lg text-slate-300 mb-12">
                Protect your organization with real-time transaction monitoring, behavioral analysis, and machine learning-powered threat detection.
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/10 p-3 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Real-Time Detection</h3>
                    <p className="text-slate-400 text-sm">Identify fraudulent transactions in milliseconds with 98.5% accuracy</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-600/10 p-3 rounded-lg flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Reduced False Positives</h3>
                    <p className="text-slate-400 text-sm">Advanced ML models minimize disruption to legitimate customers</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-600/10 p-3 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Enterprise Grade</h3>
                    <p className="text-slate-400 text-sm">Trusted by leading financial institutions worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700">
            <div>
              <p className="text-3xl font-bold text-white mb-1">$2.4B+</p>
              <p className="text-sm text-slate-400">Fraud Prevented</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">98.5%</p>
              <p className="text-sm text-slate-400">Detection Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-slate-400">Enterprise Clients</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <img
                src={logoImage}
                alt="TrustX Logo"
                className="h-44 w-auto"
              />
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <CardContent className="pt-8 pb-8 px-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to access your fraud detection dashboard</p>
                </div>

                {/* Login Method Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                      loginMethod === 'email'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline-block mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    Phone
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {loginMethod === 'email' ? (
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 border-gray-300"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 h-12 border-gray-300"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Quick Access</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-medium"
                    onClick={handleDemoLogin}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Access Demo Environment
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Need help Login?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Reset Password
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 mb-3">TRUSTED BY LEADING FINANCIAL INSTITUTIONS</p>
              <div className="flex items-center justify-center gap-6 opacity-50">
                <div className="text-white text-sm font-semibold">BANK OF AMERICA</div>
                <div className="text-white text-sm font-semibold">JP MORGAN</div>
                <div className="text-white text-sm font-semibold">CITI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
