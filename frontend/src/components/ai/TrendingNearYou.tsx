import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const REGIONAL_TRENDS: Record<string, { items: { name: string; type: string; color: string }[]; style: string }> = {
  'Tamil Nadu': {
    style: 'Traditional Kanchipuram Silk, Chettinad Cotton, Madurai Sungudi',
    items: [
      { name: 'Kanchipuram Silk Saree', type: 'Saree', color: '#8B0000' },
      { name: 'Chettinad Cotton Saree', type: 'Saree', color: '#228B22' },
      { name: 'Madurai Sungudi Saree', type: 'Saree', color: '#FF8C00' },
      { name: 'Korvai Silk Saree', type: 'Saree', color: '#4169E1' },
    ],
  },
  'Maharashtra': {
    style: 'Paithani Silk, Nauvari Sarees, Kolhapuri-inspired',
    items: [
      { name: 'Paithani Silk Saree', type: 'Saree', color: '#800080' },
      { name: 'Nauvari Cotton Saree', type: 'Saree', color: '#DAA520' },
      { name: 'Chanderi Silk Saree', type: 'Saree', color: '#FF69B4' },
      { name: 'Maharashtrian Brocade', type: 'Fabric', color: '#006400' },
    ],
  },
  'West Bengal': {
    style: 'Tant Sarees, Baluchari Silk, Dhakai Jamdani',
    items: [
      { name: 'Baluchari Silk Saree', type: 'Saree', color: '#DC143C' },
      { name: 'Tant Cotton Saree', type: 'Saree', color: '#20B2AA' },
      { name: 'Dhakai Jamdani Saree', type: 'Saree', color: '#F5F5DC' },
      { name: 'Muslin Saree', type: 'Saree', color: '#FFFACD' },
    ],
  },
  'Rajasthan': {
    style: 'Bandhani, Block Print, Leheriya Sarees',
    items: [
      { name: 'Bandhani Saree', type: 'Saree', color: '#FF4500' },
      { name: 'Block Print Kurti', type: 'Kurti', color: '#8B4513' },
      { name: 'Leheriya Dupatta', type: 'Fabric', color: '#FFD700' },
      { name: 'Gota Patti Saree', type: 'Saree', color: '#FF69B4' },
    ],
  },
  'Kerala': {
    style: 'Kasavu Sarees, Kerala Cotton, Cream and Gold',
    items: [
      { name: 'Kasavu Kerala Saree', type: 'Saree', color: '#FFFACD' },
      { name: 'Kerala Cotton Set Sari', type: 'Saree', color: '#FFFFFF' },
      { name: 'Kalamkari Print Saree', type: 'Saree', color: '#8B4513' },
      { name: 'Kerala Brocade', type: 'Fabric', color: '#DAA520' },
    ],
  },
  'Andhra Pradesh': {
    style: 'Pochampally Ikat, Venkatagiri, Narayanpet',
    items: [
      { name: 'Pochampally Ikat Saree', type: 'Saree', color: '#9400D3' },
      { name: 'Venkatagiri Silk Saree', type: 'Saree', color: '#4169E1' },
      { name: 'Narayanpet Cotton Saree', type: 'Saree', color: '#228B22' },
      { name: 'Mangalgiri Cotton Saree', type: 'Saree', color: '#FF8C00' },
    ],
  },
  'Other': {
    style: 'Popular across India — trending now',
    items: [
      { name: 'Printed Chiffon Saree', type: 'Saree', color: '#FF69B4' },
      { name: 'Linen Blend Kurti', type: 'Kurti', color: '#2E8B57' },
      { name: 'Cotton Anarkali', type: 'Kurti', color: '#8B5CF6' },
      { name: 'Georgette Saree', type: 'Saree', color: '#DC143C' },
    ],
  },
};

const STATES = Object.keys(REGIONAL_TRENDS);

export default function TrendingNearYou() {
  const [region, setRegion] = useState<string>('Other');
  const [detecting, setDetecting] = useState(false);
  const navigate = useNavigate();
  const data = REGIONAL_TRENDS[region];

  const detectLocation = () => {
    setDetecting(true);
    navigator.geolocation?.getCurrentPosition(
      () => {
        // In real app, you'd use reverse geocoding. Here we simulate a Tamil Nadu detection.
        setTimeout(() => { setRegion('Tamil Nadu'); setDetecting(false); }, 1500);
      },
      () => {
        setTimeout(() => { setRegion('Tamil Nadu'); setDetecting(false); }, 1500);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/ai-features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to AI Features
          </Link>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-sm font-semibold text-green-300">Trending in Your Area</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black mb-3">
              Trending{' '}<span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Near You</span>
            </h1>
            <p className="text-muted-foreground">Discover regional textile trends and popular styles in your area</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center mb-8">
            <button onClick={detectLocation} disabled={detecting}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
              <MapPin size={16} />
              {detecting ? 'Detecting...' : '📍 Detect My Location'}
            </button>
            <span className="text-muted-foreground text-sm">or select your state:</span>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-foreground outline-none focus:border-green-500 transition-colors">
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <motion.div key={region} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={18} className="text-green-400" />
                <h2 className="font-bold text-lg">Trending in {region}</h2>
              </div>
              <p className="text-green-300/80 text-sm">{data.style}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.items.map((item, i) => (
                <motion.div key={item.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all group">
                  <div className="h-28 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))' }} />
                    <span className="text-4xl relative z-10">
                      {item.type === 'Saree' ? '👗' : item.type === 'Kurti' ? '👚' : '🧵'}
                    </span>
                    <div className="absolute top-2 left-2 bg-green-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      🔥 Trending
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.type}</p>
                    <button onClick={() => navigate(`/products?category=${item.type.toLowerCase()}s`)}
                      className="mt-2 w-full text-xs py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-lg transition-colors">
                      View Products →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
