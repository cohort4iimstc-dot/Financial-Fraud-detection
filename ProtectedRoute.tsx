import { Database, Settings, Brain, BarChart2, CheckCircle, CreditCard, Send, Shield, AlertTriangle, ArrowRight, ArrowDown } from 'lucide-react';

export default function ProcessFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fraud Detection System Flow
          </h1>
          <p className="text-lg text-gray-600">
            Complete ML pipeline from data collection to real-time fraud detection
          </p>
        </div>

        {/* Combined Flow */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {/* ML Model Building Pipeline */}
            <div className="space-y-6 mb-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-8 text-center">
                Machine Learning Model Pipeline
              </h2>
              
              {/* Step 1 */}
              <FlowBox
                icon={<Database className="w-6 h-6" />}
                title="Transaction Dataset"
                description="Historical transaction data with labeled fraud cases"
                color="blue"
              />
              <Arrow />
              
              {/* Step 2 */}
              <FlowBox
                icon={<Settings className="w-6 h-6" />}
                title="Data Preprocessing"
                description="Data cleaning, normalization, and feature engineering"
                color="blue"
              />
              <Arrow />
              
              {/* Step 3 */}
              <FlowBox
                icon={<Brain className="w-6 h-6" />}
                title="Machine Learning Model Training"
                description="Train algorithms: Random Forest, Neural Networks, XGBoost"
                color="purple"
              />
              <Arrow />
              
              {/* Step 4 */}
              <FlowBox
                icon={<BarChart2 className="w-6 h-6" />}
                title="Model Evaluation"
                description="Test accuracy, precision, recall, and F1 score"
                color="purple"
              />
              <Arrow />
              
              {/* Step 5 */}
              <FlowBox
                icon={<CheckCircle className="w-6 h-6" />}
                title="Deployed Fraud Detection Model"
                description="Production-ready model serving real-time predictions"
                color="indigo"
              />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-12"></div>

            {/* Real-Time Detection Flow */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-8 text-center">
                Real-Time Fraud Detection Workflow
              </h2>
              
              {/* Step 6 */}
              <FlowBox
                icon={<CreditCard className="w-6 h-6" />}
                title="User Initiates Payment"
                description="Customer starts a new transaction"
                color="blue"
              />
              <Arrow />
              
              {/* Step 7 */}
              <FlowBox
                icon={<Send className="w-6 h-6" />}
                title="Transaction Sent for Analysis"
                description="Transaction data transmitted to fraud detection system"
                color="blue"
              />
              <Arrow />
              
              {/* Step 8 */}
              <FlowBox
                icon={<Shield className="w-6 h-6" />}
                title="Fraud Detection Processing"
                description="AI analyzes amount, location, frequency, and user behavior"
                color="purple"
              />
              <Arrow />
              
              {/* Decision Node */}
              <DecisionNode />
              
              {/* Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Fraud Path */}
                <OutcomeBox
                  emoji="⚠️"
                  title="Fraud Detected – Notify User"
                  description="Block transaction and alert customer immediately"
                  color="red"
                />
                
                {/* Legitimate Path */}
                <OutcomeBox
                  emoji="✅"
                  title="Payment Approved"
                  description="Transaction is safe, proceed with payment"
                  color="green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Detection Accuracy"
            value="98.5%"
            color="blue"
          />
          <MetricCard
            title="Processing Time"
            value="< 100ms"
            color="purple"
          />
          <MetricCard
            title="False Positives"
            value="1.2%"
            color="indigo"
          />
          <MetricCard
            title="Fraud Prevented"
            value="$2.4M"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

interface FlowBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'indigo' | 'green' | 'red';
}

function FlowBox({ icon, title, description, color }: FlowBoxProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-300 text-blue-600',
    purple: 'bg-purple-50 border-purple-300 text-purple-600',
    indigo: 'bg-indigo-50 border-indigo-300 text-indigo-600',
    green: 'bg-green-50 border-green-300 text-green-600',
    red: 'bg-red-50 border-red-300 text-red-600',
  };

  return (
    <div className={`rounded-2xl border-2 ${colorClasses[color]} p-6 shadow-md hover:shadow-lg transition-all duration-200 max-w-2xl mx-auto`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <ArrowDown className="w-6 h-6 text-gray-400" />
    </div>
  );
}

function DecisionNode() {
  return (
    <div className="flex justify-center my-6">
      <div className="relative">
        <div className="w-64 h-64 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 border-4 border-purple-400 transform rotate-45 rounded-3xl shadow-xl flex items-center justify-center">
          <div className="transform -rotate-45 text-center px-4">
            <Shield className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900 text-lg leading-tight">
              Fraud or<br />Legitimate?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OutcomeBoxProps {
  emoji: string;
  title: string;
  description: string;
  color: 'red' | 'green';
}

function OutcomeBox({ emoji, title, description, color }: OutcomeBoxProps) {
  const colorClasses = {
    red: 'bg-red-50 border-red-400 shadow-red-100',
    green: 'bg-green-50 border-green-400 shadow-green-100',
  };

  const textColorClasses = {
    red: 'text-red-700',
    green: 'text-green-700',
  };

  return (
    <div className={`rounded-2xl border-2 ${colorClasses[color]} p-6 shadow-lg hover:shadow-xl transition-all duration-200`}>
      <div className="text-center">
        <div className="text-4xl mb-3">{emoji}</div>
        <h3 className={`font-bold text-gray-900 mb-2 ${textColorClasses[color]}`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  color: 'blue' | 'purple' | 'indigo' | 'green';
}

function MetricCard({ title, value, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}>
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}