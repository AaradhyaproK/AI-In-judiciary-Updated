import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Gavel,
  Scale,
  FileText,
  MessageSquare,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Megaphone,
  ScrollText,
  Mic,
  ChevronRight,
  PlayCircle,
  Star,
  Briefcase,
  Globe,
  GraduationCap,
  Calendar,
  Search,
  Unlock,
  Menu,
  BrainCircuit,
  Languages,
  Accessibility
} from "lucide-react";

const RIGHTS_DATA_LANDING = [
    {
        id: 'fr1',
        title: 'Right to Equality',
        description: 'Ensures no person is denied equality before the law or the equal protection of the laws within India.',
        category: 'Fundamental Rights',
        article: 'Article 14'
    },
    {
        id: 'w1',
        title: 'Right to Zero FIR',
        description: 'A woman can file an FIR at any police station, regardless of where the incident occurred, for certain offenses.',
        category: 'Women',
        article: 'Section 154 CrPC'
    },
    {
        id: 'c2',
        title: 'Protection from Child Labor',
        description: 'Prohibits the employment of children below 14 years in hazardous jobs and regulates working conditions for adolescents.',
        category: 'Children',
        article: 'Article 24'
    },
    {
        id: 'a2',
        title: 'Right before Magistrate',
        description: 'An arrested person must be produced before a magistrate within 24 hours of arrest, excluding travel time.',
        category: 'Arrested Persons',
        article: 'Article 22(2)'
    },
    {
        id: 'co3',
        title: 'Right to Seek Redressal',
        description: 'Consumers have the right to seek compensation against unfair trade practices or exploitation.',
        category: 'Consumers',
        article: 'Consumer Protection Act'
    },
    {
        id: 't1',
        title: 'Right against Unfair Eviction',
        description: 'Landlords cannot evict tenants without proper notice and valid legal grounds as per the rent control act.',
        category: 'Tenants',
        article: 'Rent Control Act'
    }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-[#3F51B5] selection:text-white">
      {/* Navbar */}
      <header className="px-6 lg:px-10 h-20 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
        <Link className="flex items-center justify-center group" href="#">
          <div className="bg-[#3F51B5] p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
             <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-2xl font-bold text-slate-900 tracking-tight">NyayaAI</span>
        </Link>
        <nav className="ml-auto flex gap-8 hidden lg:flex items-center">
          {['Features', 'AI Tools', 'Who Can Use', 'Accessibility', 'Know Your Rights'].map((item) => (
            <Link key={item} className="text-sm font-medium text-slate-600 hover:text-[#3F51B5] transition-colors relative group" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3F51B5] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
        <div className="ml-8 flex gap-4">
            <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-[#3F51B5] hover:bg-blue-50">Login</Button>
            </Link>
            <Link href="/register">
                <Button className="bg-[#3F51B5] hover:bg-[#303F9F] text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">Get Started</Button>
            </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-[#3F51B5] relative overflow-hidden">
             {/* Background elements... */}
             <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
             
             <div className="container px-4 md:px-6 relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-100 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-[#4CAF50] mr-2 animate-pulse"></span>
                                AI-Powered Legal Assistance
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl leading-tight">
                                Smart Justice Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-emerald-300">Artificial Intelligence</span>
                            </h1>
                            <p className="max-w-[600px] text-blue-100 md:text-xl leading-relaxed">
                                Making legal help faster, simpler, and accessible for everyone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-[#4CAF50] hover:bg-[#43A047] text-white border-none px-8 font-bold text-lg h-14 rounded-full shadow-xl shadow-green-900/20 transition-all hover:scale-105 w-full sm:w-auto">
                                    Get Legal Help <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 h-14 rounded-full px-8 font-semibold w-full sm:w-auto">
                                    Login as User / Lawyer / Judge
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Hero Graphic */}
                    <div className="relative flex items-center justify-center">
                        <div className="relative w-full max-w-[500px] aspect-square bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-2xl flex items-center justify-center animate-in fade-in zoom-in duration-1000 overflow-hidden">
                            <img src="https://rockybhai.lovable.app/assets/hero-illustration-DgrLGejo.png" alt="Hero Illustration" className="w-full h-full object-cover drop-shadow-2xl" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-white/30 animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 rounded-full border-b-2 border-[#4CAF50]/50 animate-[spin_15s_linear_infinite_reverse]"></div>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Comprehensive Legal Features</h2>
                    <p className="text-lg text-slate-600">Access a wide range of AI-powered tools designed to simplify legal processes for citizens, lawyers, and judges.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={<Megaphone />} title="PIL Assistance System" description="Help users file Public Interest Litigations with step-by-step guidance" color="bg-red-500" />
                    <FeatureCard icon={<ScrollText />} title="RTI System Support" description="Guide citizens in filing RTI applications effectively" color="bg-orange-500" />
                    <FeatureCard icon={<Gavel />} title="AI as Judge (Research Tool)" description="AI-based legal reasoning & suggestions for complex cases" color="bg-blue-600" />
                    <FeatureCard icon={<BarChart3 />} title="Court Statistics Dashboard" description="Case data visualization, trends, and analytics" color="bg-purple-500" />
                    <FeatureCard icon={<Users />} title="Lawyer Recommendation" description="Find lawyers based on case type and expertise" color="bg-indigo-500" />
                    <FeatureCard icon={<Languages />} title="Multilingual Support" description="Available in Marathi, Hindi, and English" color="bg-green-500" />
                    <FeatureCard icon={<Mic />} title="Voice-Based Input & Output" description="Speak your legal problem for hands-free access" color="bg-pink-500" />
                    <FeatureCard icon={<MessageSquare />} title="AI Legal Chatbot" description="Ask legal questions and get instant responses" color="bg-teal-500" />
                    <FeatureCard icon={<FileText />} title="Document Understanding" description="AI summaries of long legal judgments" color="bg-slate-600" />
                </div>
            </div>
        </section>

        {/* AI Tools Section */}
        <section id="ai-tools" className="w-full py-24 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Powerful AI Tools for the Legal System</h2>
                    <p className="text-lg text-slate-600">Advanced artificial intelligence capabilities to transform how legal work is done.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ToolCard icon={<Scale />} title="Judgment Recommendation" description="AI suggests relevant past judgments for your case" />
                    <ToolCard icon={<Search />} title="Case Fact Extraction" description="Automatically extract key facts from case documents" />
                    <ToolCard icon={<Calendar />} title="Case Management & Scheduling" description="Organize hearings and track case progress" />
                    <ToolCard icon={<Unlock />} title="Bail Prediction Assistance" description="AI-assisted bail outcome predictions" />
                    <ToolCard icon={<GraduationCap />} title="Legal Case Study Helper" description="Learning tool for law students" />
                    <ToolCard icon={<BookOpen />} title="Know Your Rights" description="Citizen legal awareness and education" />
                </div>
            </div>
        </section>

        {/* Who Can Use Section */}
        <section id="who-can-use" className="w-full py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Who Can Use This Platform</h2>
                    <p className="text-slate-600 mt-4">NyayaAI is designed to serve everyone in the justice system.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PersonaCard icon={<Users />} title="Citizens" description="Get legal guidance, understand your rights, file PILs and RTIs with ease." />
                    <PersonaCard icon={<Briefcase />} title="Lawyers" description="Access research tools, case recommendations, and client management features." />
                    <PersonaCard icon={<Gavel />} title="Judges" description="AI-based document analysis, case scheduling, and decision support tools." />
                </div>
            </div>
        </section>

        {/* Know Your Rights Section */}
        <section id="know-your-rights" className="w-full py-24 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Know Your Rights</h2>
                    <p className="text-lg text-slate-600">An informed citizen is an empowered citizen. Here are some of the fundamental and legal rights you should be aware of.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {RIGHTS_DATA_LANDING.map(right => (
                        <RightCard key={right.id} {...right} />
                    ))}
                </div>
                <div className="text-center mt-16">
                    <Link href="/know-your-rights">
                        <Button size="lg" variant="outline" className="border-[#3F51B5] text-[#3F51B5] hover:bg-[#3F51B5]/10">
                            Explore All Rights <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

        {/* Accessibility Section */}
        <section id="accessibility" className="w-full py-24 bg-[#3F51B5] text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Accessibility & Inclusion</h2>
                        <p className="text-blue-100 text-lg mb-8">We believe justice should be accessible to everyone, regardless of language or ability.</p>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-white/10 p-3 rounded-lg h-fit"><Languages className="w-6 h-6 text-[#4CAF50]" /></div>
                                <div>
                                    <h3 className="font-bold text-xl">Multilingual Interface</h3>
                                    <p className="text-blue-200">Available in Marathi, Hindi, and English for wider reach.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 p-3 rounded-lg h-fit"><Mic className="w-6 h-6 text-[#4CAF50]" /></div>
                                <div>
                                    <h3 className="font-bold text-xl">Voice Interaction</h3>
                                    <p className="text-blue-200">Speech-to-text and text-to-speech for hands-free access.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 p-3 rounded-lg h-fit"><BookOpen className="w-6 h-6 text-[#4CAF50]" /></div>
                                <div>
                                    <h3 className="font-bold text-xl">Simple Legal Explanations</h3>
                                    <p className="text-blue-200">Complex legal terms explained in plain language for everyone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mock Chat Interface */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900 max-w-md mx-auto w-full">
                        <div className="bg-slate-100 p-4 border-b flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium text-slate-500 ml-2">NyayaAI Assistant (Hindi)</span>
                        </div>
                        <div className="p-6 space-y-4 h-[300px] overflow-y-auto bg-slate-50">
                            <div className="flex justify-end">
                                <div className="bg-[#3F51B5] text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                                    "मुझे PIL दाखिल करने में मदद चाहिए"
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BrainCircuit className="w-3 h-3 text-[#4CAF50]" />
                                        <span className="text-xs font-bold text-[#4CAF50]">NyayaAI Processing...</span>
                                    </div>
                                    मैं आपकी PIL दाखिल करने में मदद करूंगा। कृपया अपनी शिकायत का विवरण दें...
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-white flex gap-2">
                            <div className="h-10 bg-slate-100 rounded-full flex-1"></div>
                            <div className="h-10 w-10 bg-[#3F51B5] rounded-full flex items-center justify-center"><Mic className="w-5 h-5 text-white" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Justice Should Be Accessible to Everyone</h2>
                    <p className="text-slate-300 text-lg md:text-xl">
                        Join thousands of citizens, lawyers, and judges who are using AI to make the legal system more efficient and accessible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button size="lg" className="bg-[#4CAF50] hover:bg-[#43A047] text-white px-8 h-14 rounded-full text-lg font-semibold w-full sm:w-auto shadow-lg shadow-green-900/20">
                                Start Free Legal Guidance
                            </Button>
                        </Link>
                        <Link href="#ai-tools">
                            <Button variant="outline" size="lg" className="bg-transparent border-slate-600 text-white hover:bg-white/10 px-8 h-14 rounded-full text-lg font-semibold w-full sm:w-auto">
                                Explore AI Tools
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <Link className="flex items-center gap-2" href="#">
                        <div className="bg-[#3F51B5] p-1.5 rounded-md">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">NyayaAI</span>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Making legal help faster, simpler, and accessible for everyone through artificial intelligence.
                    </p>
                    <div className="text-xs text-slate-400">
                        Powered by Artificial Intelligence for a Better Justice System
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">About NyayaAI</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><Link href="#" className="hover:text-[#3F51B5]">Our Mission</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">How It Works</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">Case Studies</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">Press & Media</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Legal Information</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><Link href="#" className="hover:text-[#3F51B5]">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">Terms & Conditions</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">Disclaimer</Link></li>
                        <li><Link href="#" className="hover:text-[#3F51B5]">Accessibility Statement</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Contact Support</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>support@nyayaai.gov.in</li>
                        <li>1800-XXX-XXXX (Toll Free)</li>
                        <li>Ministry of Law & Justice, New Delhi</li>
                        <li><Link href="#" className="text-[#3F51B5] font-medium hover:underline">Submit Feedback →</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-500">© 2026 NyayaAI – AI in Judiciary System. All rights reserved.</p>
                <div className="text-xs text-slate-500 text-center md:text-right">
                    <span className="block md:inline">Developed by <a href="https://portfolioaaradhya.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-[#3F51B5] underline decoration-slate-300 underline-offset-2 transition-all">Aaradhya Pathak</a></span>
                    <span className="hidden md:inline mx-2 text-slate-300">|</span>
                    <span className="block md:inline mt-1 md:mt-0">Sanket Jadhav • Yash Jonshale • Prachi Gaykwad • Sakshi Aagle</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
    return (
        <div className="flex flex-col items-start space-y-3 border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 bg-white group">
            <div className={`p-3 rounded-lg ${color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function RightCard({ title, description, category, article }: { title: string, description: string, category: string, article: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#3F51B5] px-3 py-1 rounded-full">{category}</span>
                <span className="text-xs font-mono text-slate-400">{article}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    )
}

function ToolCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-[#3F51B5] transition-colors shadow-sm">
            <div className="p-2 bg-blue-50 text-[#3F51B5] rounded-lg shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
        </div>
    )
}

function PersonaCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="text-center flex flex-col items-center p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-slate-100">
            <div className="w-16 h-16 bg-[#3F51B5] text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    )
}
