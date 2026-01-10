import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Activity, MoreHorizontal } from 'lucide-react';

const data = [
  { name: 'يناير', kaizens: 4, wastes: 2 },
  { name: 'فبراير', kaizens: 7, wastes: 5 },
  { name: 'مارس', kaizens: 12, wastes: 8 },
  { name: 'أبريل', kaizens: 18, wastes: 4 },
  { name: 'مايو', kaizens: 24, wastes: 6 },
  { name: 'يونيو', kaizens: 31, wastes: 3 },
];

const pieData = [
  { name: 'انتظار', value: 35 },
  { name: 'حركة زائدة', value: 25 },
  { name: 'عيوب', value: 15 },
  { name: 'مخزون', value: 25 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const stats = [
    { 
      label: 'أفكار كايزن', 
      value: '41', 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+12%',
      trendUp: true 
    },
    { 
      label: 'تنبيهات الهدر', 
      value: '12', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      trend: '-5%',
      trendUp: false 
    },
    { 
      label: 'تحسينات مكتملة', 
      value: '28', 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+8%',
      trendUp: true 
    },
    { 
      label: 'ساعات تم توفيرها', 
      value: '156', 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '+24%',
      trendUp: true 
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">لوحة التحكم</h2>
          <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">نظرة عامة على أداء التحسين المستمر</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-xs md:text-sm font-bold text-slate-600 w-fit">
          <Activity size={16} className="text-teal-500" />
          <span>آخر تحديث: الآن</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 md:p-3.5 rounded-2xl ${stat.bg} ${stat.color} md:group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <stat.icon size={22} className="md:w-6 md:h-6" />
              </div>
              {stat.trendUp ? (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                  <ArrowUpRight size={14} />
                  {stat.trend}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">
                  <ArrowDownRight size={14} />
                  {stat.trend}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Bar Chart - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">نشاط التحسين الشهري</h3>
              <p className="text-slate-400 text-xs md:text-sm mt-1">مقارنة بين أفكار الكايزن والهدر المكتشف</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="h-[250px] md:h-[350px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{padding: 2}}
                />
                <Bar 
                  dataKey="kaizens" 
                  name="كايزن" 
                  fill="#0d9488" 
                  radius={[4, 4, 4, 4]} 
                  barSize={16} 
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="wastes" 
                  name="هدر مكتشف" 
                  fill="#f43f5e" 
                  radius={[4, 4, 4, 4]} 
                  barSize={16} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Takes up 1 column */}
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6 md:mb-8">
             <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">توزيع الهدر</h3>
              <p className="text-slate-400 text-xs md:text-sm mt-1">حسب النوع</p>
            </div>
          </div>
          
          <div className="h-[250px] md:h-[350px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Overlay for Donut Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl md:text-3xl font-black text-slate-800">100%</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">الإجمالي</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
             {pieData.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
