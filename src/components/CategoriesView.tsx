import React from 'react';
import { CategoryItem } from '../types';
import { 
  Shield, 
  Laptop, 
  Utensils, 
  HardHat, 
  Car, 
  ShoppingBag, 
  TrendingUp, 
  Briefcase, 
  Calculator, 
  Activity, 
  GraduationCap, 
  Sprout, 
  Headphones, 
  Sparkles, 
  Wrench, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface CategoriesViewProps {
  categories: CategoryItem[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onSelectCategory,
}) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'security': return <Shield className="w-6 h-6 text-blue-600" />;
      case 'technology / it': return <Laptop className="w-6 h-6 text-purple-600" />;
      case 'hospitality': return <Utensils className="w-6 h-6 text-amber-600" />;
      case 'construction': return <HardHat className="w-6 h-6 text-orange-600" />;
      case 'driving': return <Car className="w-6 h-6 text-emerald-600" />;
      case 'retail': return <ShoppingBag className="w-6 h-6 text-teal-600" />;
      case 'sales': return <TrendingUp className="w-6 h-6 text-rose-600" />;
      case 'administration': return <Briefcase className="w-6 h-6 text-indigo-600" />;
      case 'accounting / finance': return <Calculator className="w-6 h-6 text-cyan-600" />;
      case 'healthcare': return <Activity className="w-6 h-6 text-red-600" />;
      case 'education': return <GraduationCap className="w-6 h-6 text-violet-600" />;
      case 'agriculture': return <Sprout className="w-6 h-6 text-lime-600" />;
      case 'customer service': return <Headphones className="w-6 h-6 text-sky-600" />;
      case 'cleaning': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'general labour': return <Wrench className="w-6 h-6 text-amber-600" />;
      default: return <Layers className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Kenyan Job Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
          Browse Jobs by Category
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Find verified positions across high-demand Kenyan industries. Select a sector below to explore all active vacancies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                {getIcon(cat.name)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified vacancies in Kenya
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>View Openings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
