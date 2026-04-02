import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-white text-2xl font-bold">Fixora</span>
        </div>
        <Link
          href="/login"
          className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-all border border-white/20"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
          <span className="text-blue-300 text-sm font-medium">🚀 AI-Powered IT Support System</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
          Fix IT Issues
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Lightning Fast
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl">
          Streamline your IT support with intelligent ticket management, AI-powered classification, and real-time analytics
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">&lt; 2min</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10k+</div>
            <div className="text-gray-400 text-sm">Tickets Resolved</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to manage IT support efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎫</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Smart Ticket Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Create, assign, and track tickets seamlessly. Advanced filtering and search capabilities to find what you need instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">AI Classification</h3>
              <p className="text-gray-400 leading-relaxed">
                Powered by Google Gemini AI to automatically categorize tickets, assign priorities, and suggest solutions intelligently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Real-time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive dashboards with insights on ticket trends, team performance, and SLA compliance metrics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Slack Integration</h3>
              <p className="text-gray-400 leading-relaxed">
                Create and manage tickets directly from Slack. Get instant notifications and updates where your team works.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Knowledge Base</h3>
              <p className="text-gray-400 leading-relaxed">
                Build a searchable repository of solutions and FAQs. Empower users to find answers before creating tickets.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">SLA Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Configure and track Service Level Agreements. Automatic escalations ensure tickets are resolved on time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your IT Support?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using Fixora to deliver exceptional IT support
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Start Free Trial
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-white font-semibold">Fixora</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 Fixora. AI-Powered IT Support System.
          </p>
        </div>
      </footer>
    </div>
  );
}
