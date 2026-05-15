"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Activity, Zap, Bell, CreditCard, Repeat, ArrowRightLeft } from "lucide-react";

const PortfolioOverview = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-green-500/20 transition-all" />
      
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-5xl font-bold text-white tracking-tight">$124,500.00</h2>
        </div>
        <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-[#00FF87] text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.1)]">
          <TrendingUp className="w-3 h-3" />
          +12.4% <span className="opacity-50 font-normal">24h</span>
        </div>
      </div>

      <div className="h-48 w-full bg-gradient-to-t from-green-500/5 to-transparent rounded-2xl relative">
        {/* Mock Chart Area */}
        <div className="absolute inset-x-0 bottom-10 h-16 flex items-end gap-1 px-4">
          {[40, 70, 45, 90, 65, 80, 100, 85, 95, 110, 90, 120, 110].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }} animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className="flex-1 bg-[#00FF87]/30 rounded-t-sm hover:bg-[#00FF87] transition-all cursor-pointer"
            />
          ))}
        </div>
        <div className="absolute bottom-0 inset-x-0 flex justify-between px-4 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
          <span>08:00 AM</span><span>12:00 PM</span><span>04:00 PM</span><span>08:00 PM</span>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button className="flex-1 py-4 rounded-2xl bg-[#00FF87] text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all">
          <CreditCard className="w-4 h-4" /> Buy
        </button>
        <button className="flex-1 py-4 rounded-2xl glass border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
          <Repeat className="w-4 h-4" /> Sell
        </button>
        <button className="flex-1 py-4 rounded-2xl glass border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
          <ArrowRightLeft className="w-4 h-4" /> Swap
        </button>
      </div>
    </motion.div>

    <div className="flex flex-col gap-6">
      <div className="glass p-6 rounded-[2rem] border-white/5 flex flex-col justify-between h-full bg-gradient-to-br from-purple-500/5 to-transparent">
        <div className="flex justify-between items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <Bell className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price Alert</h4>
          <p className="text-sm text-gray-300 mb-4">Set target price for Bitcoin</p>
          <div className="flex gap-2">
            <input type="text" placeholder="$72,000" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50" />
            <button className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold">Set</button>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-[2rem] border-white/5 h-full">
         <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Gas Tracker</h4>
         <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Low', val: '12', color: 'gray' },
              { label: 'Avg', val: '18', color: 'green' },
              { label: 'High', val: '45', color: 'purple' }
            ].map(item => (
              <div key={item.label} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">{item.label}</span>
                <span className="block text-sm font-bold text-white">{item.val} <span className="text-[8px] text-gray-500">Gwei</span></span>
              </div>
            ))}
         </div>
      </div>
    </div>
  </div>
);

const MarketWatchlist = () => (
  <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden mb-8">
    <div className="p-8 border-b border-white/5 flex justify-between items-center">
       <h3 className="text-xl font-bold">Market Watchlist</h3>
       <button className="text-xs font-bold text-gray-500 hover:text-[#00FF87] transition-colors">View All Assets</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-b border-white/5">
            <th className="px-8 py-6">Asset</th>
            <th className="px-8 py-6">Price</th>
            <th className="px-8 py-6">24h Change</th>
            <th className="px-8 py-6">Market Cap</th>
            <th className="px-8 py-6 text-right">Activity</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {[
            { name: 'Bitcoin', symbol: 'BTC', price: '$68,432.12', change: '+2.4%', color: '#00FF87', mcap: '$1.3T' },
            { name: 'Ethereum', symbol: 'ETH', price: '$3,842.50', change: '-1.2%', color: '#FF3D71', mcap: '$450B' },
            { name: 'Solana', symbol: 'SOL', price: '$145.20', change: '+8.7%', color: '#00FF87', mcap: '$64B' }
          ].map((coin, i) => (
            <tr key={i} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div>
                    <div className="font-bold text-white">{coin.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6 font-bold text-white">{coin.price}</td>
              <td className={`px-8 py-6 font-bold ${coin.change.startsWith('+') ? 'text-[#00FF87]' : 'text-[#FF3D71]'}`}>
                {coin.change}
              </td>
              <td className="px-8 py-6 text-gray-400 font-medium">{coin.mcap}</td>
              <td className="px-8 py-6 text-right">
                <div className="inline-flex h-8 w-24 bg-white/5 rounded-lg items-end gap-1 p-1">
                  {[20, 50, 30, 70, 40, 60, 80].map((h, j) => (
                    <div key={j} style={{ height: `${h}%`, backgroundColor: coin.color }} className="flex-1 opacity-40 rounded-t-[1px]" />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RecentTransactions = () => (
  <div className="glass p-8 rounded-[2.5rem] border-white/5">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-xl font-bold">Recent Transactions</h3>
      <Activity className="w-4 h-4 text-gray-500" />
    </div>
    <div className="space-y-6">
      {[
        { type: 'Buy', asset: 'Bitcoin', amount: '0.042 BTC', status: 'Completed', date: '2 mins ago', val: '$2,850' },
        { type: 'Swap', asset: 'ETH to SOL', amount: '1.2 ETH', status: 'Pending', date: '15 mins ago', val: '$4,610' },
        { type: 'Sell', asset: 'Ethereum', amount: '0.5 ETH', status: 'Completed', date: '1h ago', val: '$1,920' }
      ].map((tx, i) => (
        <div key={i} className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tx.type === 'Buy' ? 'bg-green-500/10 text-[#00FF87]' : tx.type === 'Swap' ? 'bg-purple-500/10 text-purple-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {tx.type === 'Buy' ? <CreditCard className="w-4 h-4" /> : tx.type === 'Swap' ? <ArrowRightLeft className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{tx.asset}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{tx.amount} • {tx.date}</div>
            </div>
          </div>
          <div className="text-right">
             <div className="font-bold text-white text-sm">{tx.val}</div>
             <div className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'Completed' ? 'text-green-500' : 'text-orange-500'}`}>
               {tx.status}
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function CryptoPulse() {
  return (
    <div className="min-h-screen bg-[#08090D] text-white font-['Inter'] p-4 md:p-8 selection:bg-[#00FF87] selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00FF87] to-purple-600 flex items-center justify-center text-black font-black">CP</div>
             <h1 className="text-2xl font-bold tracking-tight">CryptoPulse</h1>
          </div>
          <div className="flex gap-4">
            <div className="hidden md:flex bg-white/5 border border-white/10 rounded-2xl px-4 py-2 items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Network: Ethereum Mainnet</span>
            </div>
            <div className="w-10 h-10 rounded-full glass border-white/10" />
          </div>
        </header>

        <PortfolioOverview />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           <div className="xl:col-span-2">
              <MarketWatchlist />
           </div>
           <div>
              <RecentTransactions />
           </div>
        </div>
      </div>
    </div>
  );
}
