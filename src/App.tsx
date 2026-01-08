
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, TrendingUp, Scissors, ArrowUpRight, ArrowDownLeft, Sparkles, Award, Lock, 
  Menu, X, Edit3, ArrowRightLeft, ChevronRight, FilePlus, User, Inbox, 
  Clock, CheckCircle, Calendar, Boxes, Loader, ArrowLeft, MapPin, Truck, Ruler,
  LogOut, Trash2, Save, Image, CheckSquare, AlertTriangle, Package, Search, RefreshCcw,
  Network, Phone, QrCode, Landmark, Send, Upload, CreditCard, UserCheck, ShieldCheck,
  Users, BarChart3, Share2, Copy, Link as LinkIcon, ChevronDown, ChevronUp, Hourglass, RefreshCw,
  BookOpen, Hammer, CircleDollarSign, BellRing
} from 'lucide-react';
import { Card, Button, Badge, Input } from './components/SharedComponents';
import { 
  Department, UserRole, OrderStatus, ItemType, Worker, Order, MaterialItem, MeasurementData, PaymentRequest, PaymentStatus
} from './types';
import { 
  MOCK_WORKERS, ROLE_LABELS, ITEM_RATES, getWorkerRate, MAGIC_DISTRIBUTION_PERCENTAGES, INITIAL_MATERIALS, DISTRIBUTION_PERCENTAGES, DOWNLINE_DISTRIBUTION_PERCENTAGES, MOCK_ORDERS 
} from './constants';
import { getOrdersForRole, getNextRole } from './services/logic';

// --- Components ---

const Toast = ({ message, onClose }: { message: string | null, onClose: () => void }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  
  if (!message) return null;
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gold-600 text-black px-6 py-3 rounded-full font-bold shadow-lg z-[1000] animate-in fade-in slide-in-from-top-5 text-sm sm:text-base text-center min-w-[280px]">
      {message}
    </div>
  );
};

// --- WALLET MANAGER MODAL ---
const WalletManagerModal = ({ isOpen, onClose, user, wallets, onAction, onRequestAddMoney }: { isOpen: boolean, onClose: () => void, user: Worker, wallets: any[], onAction: (msg: string) => void, onRequestAddMoney: (amt: number, utr: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ADD' | 'WITHDRAW' | 'TRANSFER'>('OVERVIEW');
  const [transferType, setTransferType] = useState<'ID_TO_ID' | 'WALLET_TO_WALLET'>('ID_TO_ID');
  
  // Form States
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [targetId, setTargetId] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (action: string) => {
      onAction(action);
      setAmount(''); setUtr(''); setTargetId(''); setNote('');
      onClose();
  };
  
  const handleAddMoneySubmit = () => {
      if (!amount || !utr) return;
      const val = parseFloat(amount);
      if (val > 0) {
          onRequestAddMoney(val, utr); // Changed to Request
          handleSubmit(`Request Sent for ₹${val} (UTR: ${utr})`);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in">
       <div className="w-full max-w-lg bg-zinc-900 border border-gold-500/30 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-2xl">
             <div className="flex items-center gap-2">
                <Wallet size={20} className="text-gold-500"/>
                <h3 className="text-gold-100 font-bold uppercase tracking-widest text-sm">Wallet Manager</h3>
             </div>
             <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white transition-colors"/></button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
              {[
                  { id: 'OVERVIEW', icon: Boxes, label: 'Overview' },
                  { id: 'ADD', icon: QrCode, label: 'Add Money' },
                  { id: 'WITHDRAW', icon: Landmark, label: 'Withdraw' },
                  { id: 'TRANSFER', icon: ArrowRightLeft, label: 'Transfer' },
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center p-3 gap-1 text-[10px] uppercase font-bold tracking-wider transition-all ${activeTab === tab.id ? 'text-gold-500 bg-white/5 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                      <tab.icon size={18} />
                      {tab.label}
                  </button>
              ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0a0a]">
             
             {/* 1. OVERVIEW TAB */}
             {activeTab === 'OVERVIEW' && (
                 <div className="grid grid-cols-2 gap-3">
                     {wallets.map((w, idx) => (
                         <div key={idx} className="bg-zinc-800/50 p-3 rounded-lg border border-white/5 hover:border-gold-500/30 transition-all">
                             <div className={`mb-2 ${w.color}`}>{React.cloneElement(w.icon, { size: 18 })}</div>
                             <p className="text-[10px] text-gray-500 uppercase font-bold">{w.label}</p>
                             <p className={`text-lg font-mono font-bold ${w.color}`}>₹{w.value.toLocaleString()}</p>
                         </div>
                     ))}
                 </div>
             )}

             {/* 2. ADD MONEY TAB */}
             {activeTab === 'ADD' && (
                 <div className="space-y-6 text-center">
                     <div className="bg-white p-4 rounded-xl inline-block shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                         {/* Placeholder QR Code */}
                         <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=company@upi&pn=LordsTailor" 
                            alt="Payment QR" 
                            className="w-32 h-32 opacity-90"
                         />
                     </div>
                     <p className="text-xs text-gray-400">Scan to Pay via UPI</p>
                     
                     <div className="space-y-3 text-left">
                         <div>
                            <label className="text-[10px] text-gold-500 font-bold uppercase">Amount (₹)</label>
                            <Input type="number" placeholder="Enter Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                         </div>
                         <div>
                            <label className="text-[10px] text-gold-500 font-bold uppercase">UTR / Ref Number</label>
                            <Input placeholder="Paste UTR here" value={utr} onChange={e => setUtr(e.target.value)} />
                         </div>
                         <Button onClick={handleAddMoneySubmit} disabled={!amount || !utr} className="w-full">
                             <Upload size={16} /> Submit Request
                         </Button>
                         <p className="text-[9px] text-center text-gray-500">Funds will be added after Admin approval.</p>
                     </div>
                 </div>
             )}

             {/* 3. WITHDRAW TAB */}
             {activeTab === 'WITHDRAW' && (
                 <div className="space-y-5">
                     <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10 flex justify-between items-center">
                         <span className="text-gray-400 text-xs">Available Balance</span>
                         <span className="text-gold-500 font-bold font-mono text-xl">₹{user.walletMain.toLocaleString()}</span>
                     </div>
                     
                     <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Withdraw Amount</label>
                        <Input type="number" placeholder="Min ₹500" value={amount} onChange={e => setAmount(e.target.value)} />
                     </div>
                     
                     <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Bank Details / UPI ID</label>
                        <Input placeholder="Enter details" value={note} onChange={e => setNote(e.target.value)} />
                     </div>

                     <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase">UTR / Reference (Optional)</label>
                        <Input placeholder="Paste UTR if reporting" value={utr} onChange={e => setUtr(e.target.value)} />
                        <p className="text-[9px] text-gray-600 mt-1">Only if you are reporting a manual withdrawal.</p>
                     </div>

                     <Button variant="danger" onClick={() => handleSubmit(`Withdrawal Request: ₹${amount}`)} disabled={!amount} className="w-full">
                         <Landmark size={16} /> Request Withdrawal
                     </Button>
                 </div>
             )}

             {/* 4. TRANSFER TAB */}
             {activeTab === 'TRANSFER' && (
                 <div className="space-y-5">
                     <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
                         <button onClick={() => setTransferType('ID_TO_ID')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${transferType === 'ID_TO_ID' ? 'bg-gold-600 text-black' : 'text-gray-500'}`}>ID to ID</button>
                         <button onClick={() => setTransferType('WALLET_TO_WALLET')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${transferType === 'WALLET_TO_WALLET' ? 'bg-gold-600 text-black' : 'text-gray-500'}`}>Wallet to Wallet</button>
                     </div>

                     {transferType === 'ID_TO_ID' ? (
                         <>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Recipient ID</label>
                                <Input placeholder="User ID (e.g. CUT-01)" value={targetId} onChange={e => setTargetId(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Amount</label>
                                <Input type="number" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} />
                            </div>
                            <Button onClick={() => handleSubmit(`Transferred ₹${amount} to ${targetId}`)} disabled={!amount || !targetId} className="w-full">
                                <Send size={16} /> Transfer Now
                            </Button>
                         </>
                     ) : (
                         <>
                             <div className="bg-zinc-800 p-3 rounded-lg border border-white/10">
                                 <p className="text-xs text-gray-400 mb-1">Source: <span className="text-gold-500 font-bold">Performance Wallet</span></p>
                                 <p className="text-xs text-gray-400">Target: <span className="text-white font-bold">Main Wallet</span></p>
                             </div>
                             <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Transfer Amount</label>
                                <Input type="number" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} />
                            </div>
                            <Button onClick={() => handleSubmit(`Internal Transfer: ₹${amount} to Main`)} disabled={!amount} className="w-full">
                                <RefreshCcw size={16} /> Convert to Main
                            </Button>
                         </>
                     )}
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

const PaymentRequestsModal = ({ isOpen, onClose, requests, onApprove, onReject }: { isOpen: boolean, onClose: () => void, requests: PaymentRequest[], onApprove: (r: PaymentRequest) => void, onReject: (r: PaymentRequest) => void }) => {
    if (!isOpen) return null;

    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
            <div className="w-full max-w-lg bg-zinc-900 border border-gold-500/30 rounded-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-2xl">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <BellRing size={16} className="text-gold-500"/> Payment Requests
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <CheckCircle size={32} className="mx-auto mb-2 opacity-50"/>
                            <p className="text-xs">No pending requests</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-zinc-800 p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-white font-bold text-sm">{req.userName}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">{req.userId} • {ROLE_LABELS[req.userRole]}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gold-500 font-bold font-mono">₹{req.amount.toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(req.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/50 p-2 rounded border border-white/5 mb-3 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-500 uppercase">UTR Number</span>
                                        <span className="text-xs font-mono text-white">{req.utrNumber}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="danger" className="py-2" onClick={() => onReject(req)}>Reject</Button>
                                        <Button variant="success" className="py-2" onClick={() => onApprove(req)}>Approve</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MeasurementModal = ({ isOpen, onClose, order, onSave }: { isOpen: boolean, onClose: () => void, order: Order | null, onSave: (data: MeasurementData) => void }) => {
  const [data, setData] = useState<MeasurementData>({});

  useEffect(() => {
    if (order?.measurements) setData(order.measurements);
    else setData({});
  }, [order]);

  if (!isOpen || !order) return null;

  const isShirt = order.itemType === ItemType.SHIRT || order.itemType === ItemType.KURTA || order.itemType === ItemType.SAFARI;
  const isPant = order.itemType === ItemType.PANT || order.itemType === ItemType.PYJAMA || order.itemType === ItemType.LADIES_LOWER;
  const isCoat = order.itemType === ItemType.COAT || order.itemType === ItemType.SUIT || order.itemType === ItemType.SHERVANI;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
       <div className="w-full max-w-lg bg-zinc-900 border border-gold-500/30 rounded-2xl flex flex-col max-h-[90vh]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-2xl">
             <div className="flex items-center gap-2">
                <Ruler size={18} className="text-gold-500"/>
                <h3 className="text-gold-100 font-bold uppercase tracking-widest text-sm">
                   {order.itemType} Measurement
                </h3>
             </div>
             <button onClick={onClose}><X size={18} className="text-gray-500 hover:text-white transition-colors"/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             
             {/* Customer Info Header */}
             <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5 mb-4">
                 <p className="text-xs text-gray-400">Customer</p>
                 <p className="text-white font-bold text-lg">{order.customerName}</p>
                 <p className="text-xs text-gold-500">{order.billId}</p>
             </div>

             {/* SHIRT FORM */}
             {(isShirt || isCoat) && (
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Length (L)</label>
                        <Input value={data.length || ''} onChange={e => setData({...data, length: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Shoulder (S)</label>
                        <Input value={data.shoulder || ''} onChange={e => setData({...data, shoulder: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Sleeve (SL)</label>
                        <Input value={data.sleeve || ''} onChange={e => setData({...data, sleeve: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Chest (C)</label>
                        <Input value={data.chest || ''} onChange={e => setData({...data, chest: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Stomach (W)</label>
                        <Input value={data.stomach || ''} onChange={e => setData({...data, stomach: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Neck (N)</label>
                        <Input value={data.neck || ''} onChange={e => setData({...data, neck: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Front (F)</label>
                        <Input value={data.front || ''} onChange={e => setData({...data, front: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                 </div>
             )}

             {/* PANT FORM */}
             {isPant && (
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Length (L)</label>
                        <Input value={data.length || ''} onChange={e => setData({...data, length: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Waist (W)</label>
                        <Input value={data.waist || ''} onChange={e => setData({...data, waist: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Hip (H)</label>
                        <Input value={data.hip || ''} onChange={e => setData({...data, hip: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Thigh (Raan)</label>
                        <Input value={data.thigh || ''} onChange={e => setData({...data, thigh: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Knee (Ghutna)</label>
                        <Input value={data.knee || ''} onChange={e => setData({...data, knee: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Bottom (Mori)</label>
                        <Input value={data.bottom || ''} onChange={e => setData({...data, bottom: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Crotch (Latak)</label>
                        <Input value={data.crotch || ''} onChange={e => setData({...data, crotch: e.target.value})} placeholder='0.00"' className="bg-black text-center text-lg font-mono text-gold-400"/>
                     </div>
                 </div>
             )}

             <div className="space-y-1 pt-4 border-t border-white/10">
                <label className="text-[10px] text-gray-500 uppercase font-bold">Special Notes</label>
                <Input value={data.notes || ''} onChange={e => setData({...data, notes: e.target.value})} placeholder='Any specific instructions...' className="bg-black"/>
             </div>
          </div>

          <div className="p-4 border-t border-white/10 bg-black/50 rounded-b-2xl">
              <Button onClick={() => onSave(data)} className="w-full py-4 text-sm font-bold bg-gold-shine text-black shadow-lg shadow-gold-500/20">SAVE MEASUREMENT</Button>
          </div>
       </div>
    </div>
  );
};


const LoginScreen = ({ onLogin }: { onLogin: (id: string) => void }) => {
  const [id, setId] = useState('');

  const demoUsers = [
     { id: 'ADMIN', label: 'SYSTEM ADMIN' }, // Added Admin
     { id: 'CIVIL-MGR', label: 'HEAD MANAGER' },
     { id: 'SHOW-01', label: '1. Showroom' },
     { id: 'MEASURE-01', label: '2. Measure' },
     { id: 'CUT-01', label: '3. Cutting' },
     { id: 'MAT-01', label: '4. Material' },
     { id: 'SHIRT-01', label: '5. Shirt Maker' },
     { id: 'PANT-01', label: '6. Pant Maker' },
     { id: 'COAT-01', label: '7. Coat Maker' },
     { id: 'KURTA-01', label: '8. Kurta Maker' },
     { id: 'BTN-01', label: '9. Kaj Button' },
     { id: 'PRESS-01', label: '10. Press' },
     { id: 'FIN-01', label: '11. Finishing' },
     { id: 'DEL-01', label: '12. Delivery' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative overflow-hidden">
       {/* Subtle Pattern Background */}
       <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>

       <div className="relative z-10 flex flex-col items-center w-full max-w-md animate-fade-in">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 mb-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <Scissors size={32} className="text-gold-400" />
            </div>
            <h1 className="text-4xl font-serif text-gold-premium mb-2 font-bold tracking-widest drop-shadow-lg">LORD'S</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500/80 font-bold">Bespoke Tailoring System</p>
          </div>
          <Card className="w-full space-y-6 border border-gold-500/20 bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1 flex items-center gap-2">
                        <User size={10} /> Login ID
                    </label>
                    <Input 
                      placeholder="Enter ID" 
                      value={id} 
                      onChange={e => setId(e.target.value)} 
                      className="text-center font-mono tracking-wider text-lg bg-black/50 border-gold-500/30 focus:border-gold-400 h-12"
                    />
                </div>
                <Button onClick={() => onLogin(id)} className="w-full py-4 text-xs bg-gold-shine text-black font-bold shadow-lg shadow-gold-500/10 hover:shadow-gold-500/30 tracking-widest">
                  ACCESS PANEL
                </Button>
            </div>
            <div className="pt-6 border-t border-white/5">
                <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest mb-4 font-bold flex items-center justify-center gap-2">
                    <Sparkles size={10} className="text-gold-500"/> Select Panel (Demo)
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {demoUsers.map(u => (
                        <button key={u.id} onClick={() => onLogin(u.id)} className={`p-2.5 bg-zinc-900/50 hover:bg-zinc-800 border hover:border-gold-500/30 rounded-lg text-[10px] hover:text-gold-400 transition-all uppercase font-bold flex flex-col items-center justify-center gap-1 group ${u.id === 'ADMIN' ? 'border-gold-500/40 text-gold-200' : 'border-white/5 text-gray-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full group-hover:bg-gold-500 transition-colors mb-1 ${u.id === 'ADMIN' ? 'bg-gold-500' : 'bg-white/10'}`}></span>
                            {u.label}
                        </button>
                    ))}
                </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

const MobileSidebar = ({ isOpen, onClose, user, onNavigate, onOpenWallets }: { isOpen: boolean, onClose: () => void, user: Worker | null, onNavigate: (v: string) => void, onOpenWallets: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-[80%] max-w-[300px] bg-black h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-r border-gold-500/20 flex flex-col transform transition-transform duration-300 animate-slide-in-left">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black border border-gold-500/30 flex items-center justify-center font-bold text-gold-500 shadow-inner">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white tracking-wider uppercase">{user?.role ? ROLE_LABELS[user.role] : 'User'}</h2>
                    <p className="text-[10px] text-gold-500/70 font-mono">{user?.id}</p>
                </div>
             </div>
             <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
             <p className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-2 pl-2">Menu</p>
             <button onClick={() => onNavigate('DASHBOARD')} className="w-full text-left p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all border border-transparent hover:border-gold-500/20 group">
                <Boxes size={18} className="group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium tracking-wide">Dashboard</span>
             </button>
             <button onClick={() => onNavigate('NEW_BILL')} className="w-full text-left p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all border border-transparent hover:border-gold-500/20 group">
                <FilePlus size={18} className="group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium tracking-wide">New Order</span>
             </button>
             {/* ADDED REFERRAL TEAM LINK */}
             <button onClick={() => onNavigate('REFERRAL_TEAM')} className="w-full text-left p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all border border-transparent hover:border-gold-500/20 group">
                <Users size={18} className="group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium tracking-wide">Referral Team</span>
             </button>
             {/* ADDED MAGIC INCOME LINK */}
             <button onClick={() => onNavigate('MAGIC_INCOME')} className="w-full text-left p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all border border-transparent hover:border-gold-500/20 group">
                <Sparkles size={18} className="group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium tracking-wide">Magic Income</span>
             </button>
             {/* ADDED MY WALLETS LINK */}
             <button onClick={() => { onOpenWallets(); onClose(); }} className="w-full text-left p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all border border-transparent hover:border-gold-500/20 group">
                <Wallet size={18} className="group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium tracking-wide">My Wallets</span>
             </button>
             
             {/* Add more menu items here as needed */}
        </div>
        
        <div className="p-4 border-t border-white/5 bg-zinc-900/30">
             <button onClick={() => onNavigate('LOGOUT')} className="w-full p-3 rounded-lg text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/50 flex items-center gap-3 justify-center font-bold tracking-wider text-sm transition-all">
                <LogOut size={18}/> LOGOUT SYSTEM
             </button>
        </div>
      </div>
    </div>
  )
};

const OrderHistoryModal = ({ isOpen, onClose, orders, title, onOrderClick, userRole, userId }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
       <div className="w-full max-w-2xl bg-zinc-900 border border-gold-500/30 rounded-2xl flex flex-col h-[80vh] shadow-2xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-2xl">
             <h3 className="text-gold-100 font-bold uppercase tracking-widest text-sm">{title}</h3>
             <button onClick={onClose}><X size={18} className="text-gray-500 hover:text-white transition-colors"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {orders.length === 0 ? <p className="text-center text-gray-500 py-8">No orders found.</p> : orders.map((o: Order) => (
                <div key={o.id} onClick={() => onOrderClick && onOrderClick(o)} className={`bg-zinc-800/50 p-4 rounded-xl border border-white/5 flex justify-between items-center ${onOrderClick ? 'cursor-pointer hover:border-gold-500/50' : ''}`}>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-gold-500 font-mono text-xs">{o.billId}</span>
                         <Badge status={o.status} />
                      </div>
                      <p className="text-white font-bold">{o.customerName}</p>
                      <p className="text-xs text-gray-500">{o.itemType} • {o.handoverStatus}</p>
                      {/* Security Code Visualization for Bill Creator */}
                      {o.creatorId === userId && o.securityCode && (
                          <div className="mt-2 flex items-center gap-2 bg-zinc-900 p-1.5 rounded border border-blue-500/30 text-blue-300 w-fit">
                              <ShieldCheck size={14} />
                              <span className="text-xs font-mono font-bold tracking-widest">CODE: {o.securityCode}</span>
                          </div>
                      )}
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-400">{o.deliveryDate}</p>
                      {onOrderClick && <ChevronRight size={16} className="ml-auto text-gray-600"/>}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const WalletHistoryModal = ({ isOpen, onClose, title, balance }: any) => {
  if (!isOpen) return null;
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
         <div className="w-full max-w-md bg-zinc-900 border border-gold-500/30 rounded-2xl flex flex-col h-[60vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-black rounded-t-2xl">
               <div>
                  <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">{title}</h3>
                  <p className="text-3xl text-white font-mono font-bold">₹{balance.toLocaleString()}</p>
               </div>
               <button onClick={onClose}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-gray-500">
               <p>No transaction history available.</p>
            </div>
         </div>
      </div>
  );
};

// --- Verification Modal for Delivery Boy ---
const VerificationModal = ({ isOpen, onClose, order, onVerify }: { isOpen: boolean, onClose: () => void, order: Order | null, onVerify: (code: string) => void }) => {
    const [code, setCode] = useState('');
    
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
            <div className="bg-zinc-900 border border-gold-500/30 p-6 rounded-2xl w-full max-w-sm text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <ShieldCheck size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Handover</h3>
                <p className="text-gray-400 text-sm mb-6">Ask the Bill Creator ({order.creatorRole}) for the 4-digit code to complete delivery.</p>
                
                <div className="mb-6">
                    <Input 
                        value={code} 
                        onChange={e => setCode(e.target.value)} 
                        placeholder="Enter 4-Digit Code" 
                        maxLength={4}
                        className="text-center text-2xl tracking-[0.5em] font-mono h-14 border-blue-500/30 focus:border-blue-500"
                    />
                </div>

                <Button onClick={() => onVerify(code)} disabled={code.length !== 4} className="w-full mb-3">
                    Verify & Complete
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">Cancel</Button>
            </div>
        </div>
    );
}

// --- NEW COMPONENTS FOR REFERRAL & MAGIC ---

const ReferralPanel = ({ user, workers, onCopy }: { user: Worker, workers: Worker[], onCopy: (text: string) => void }) => {
    // Traverse Logic
    const levels = useMemo(() => {
        const lvlData: Record<number, Worker[]> = {};
        let currentGroup = workers.filter(w => w.uplineId === user.id);
        lvlData[1] = currentGroup;
        
        for(let i=2; i<=10; i++) {
            const nextGroup: Worker[] = [];
            currentGroup.forEach(u => {
                const recruits = workers.filter(w => w.uplineId === u.id);
                nextGroup.push(...recruits);
            });
            lvlData[i] = nextGroup;
            currentGroup = nextGroup;
            if(currentGroup.length === 0) break;
        }
        return lvlData;
    }, [user, workers]);

    const referralLink = `https://lords-tailor.com/join?ref=${user.referralCode || user.id}`;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-2"><h2 className="text-xl font-bold text-gold-400">My Referral Team</h2></div>
            
            {/* Link Card */}
            <div className="card-laher border border-gold-500/30 p-6 rounded-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20"><Share2 size={64}/></div>
                 <div className="relative z-10">
                     <p className="text-xs text-gold-500 uppercase font-bold tracking-widest mb-1">Your Referral Code</p>
                     <p className="text-3xl font-bold text-white mb-4 tracking-wider">{user.referralCode || user.id}</p>
                     
                     <div className="bg-black/50 border border-white/10 rounded-lg p-3 flex items-center justify-between gap-3">
                         <div className="flex items-center gap-3 text-gray-400 text-xs truncate">
                             <LinkIcon size={14} className="shrink-0"/>
                             <span className="truncate">{referralLink}</span>
                         </div>
                         <button onClick={() => onCopy(referralLink)} className="p-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition-colors">
                             <Copy size={16}/>
                         </button>
                     </div>
                 </div>
            </div>

            {/* Downline List */}
            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-black/40"><h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Network size={16} className="text-gold-500"/> 10 Level Downline</h3></div>
                <div className="divide-y divide-white/5">
                    {[1,2,3,4,5,6,7,8,9,10].map(level => {
                        const members = levels[level] || [];
                        const [expanded, setExpanded] = useState(false);
                        
                        return (
                            <div key={level} className="bg-zinc-900/50">
                                <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-gray-400 font-bold border border-white/10">{level}</span>
                                        <span className="text-sm font-medium text-gray-300">Level {level}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gold-500 font-bold text-sm">{members.length} Members</span>
                                        {expanded ? <ChevronUp size={16} className="text-gray-500"/> : <ChevronDown size={16} className="text-gray-500"/>}
                                    </div>
                                </button>
                                {expanded && members.length > 0 && (
                                    <div className="px-4 pb-4 bg-black/20 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {members.map(m => (
                                                <div key={m.id} className="p-2 bg-zinc-800/50 rounded border border-white/5 text-xs flex justify-between">
                                                    <span className="text-white font-bold">{m.name}</span>
                                                    <span className="text-gray-500 font-mono">{m.id}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MagicTeamPanel = ({ user, workers }: { user: Worker, workers: Worker[] }) => {
    
    // Calculate Tree Structure Logic (Binary Downline for current User)
    const userIndex = workers.findIndex(w => w.id === user.id);

    const treeData = useMemo(() => {
        if (userIndex === -1) return [];
        
        const data = [];
        let currentLevelIndices = [userIndex];
        
        for (let i = 1; i <= 10; i++) {
            const nextIndices: number[] = [];
            currentLevelIndices.forEach(idx => {
                // In a flat array representation of a binary tree:
                // Left Child = 2*index + 1
                // Right Child = 2*index + 2
                const left = 2 * idx + 1;
                const right = 2 * idx + 2;
                
                // Check if these indices exist in our mock workers array
                if (left < workers.length) nextIndices.push(left);
                if (right < workers.length) nextIndices.push(right);
            });
            
            data.push({
                level: i,
                capacity: Math.pow(2, i),
                filled: nextIndices.length
            });
            currentLevelIndices = nextIndices;
        }
        return data;
    }, [userIndex, workers.length]);

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-4"><h2 className="text-xl font-bold text-pink-400">Magic Team Income</h2></div>
             </div>
             
             {/* Total Card */}
             <div className="card-laher border border-pink-500/30 p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent"></div>
                 <div className="relative z-10">
                     <p className="text-xs text-pink-300 uppercase font-bold tracking-widest mb-1">Total Magic Income</p>
                     <p className="text-4xl font-mono font-bold text-white">₹{user.walletMagic.toLocaleString()}</p>
                 </div>
                 <div className="relative z-10 bg-pink-500/20 p-3 rounded-full text-pink-400 border border-pink-500/30 group-hover:scale-110 transition-transform"><Sparkles size={32}/></div>
             </div>
             
             {/* 10% Downline Wallet Note */}
             <div className="bg-pink-950/20 border border-pink-900/30 p-4 rounded-lg flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-full text-pink-400"><CircleDollarSign size={18} /></div>
                    <div>
                        <p className="text-sm font-bold text-white">Magic Fund Logic</p>
                        <p className="text-xs text-pink-300">10% of Downline Wallet Income</p>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1 pl-11">
                    Every time your downline earns, <span className="text-white font-bold">10%</span> is deducted and added to this Magic Fund instantly.
                 </p>
             </div>

             {/* Binary Team Structure (2, 4, 8...) */}
             <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-black/40 grid grid-cols-3 text-[10px] uppercase font-bold text-gray-500 tracking-wider items-center">
                    <div>Level</div>
                    <div className="text-center">Team (Filled/Total)</div>
                    <div className="text-right">Status</div>
                </div>
                <div className="divide-y divide-white/5">
                    {treeData.map((data) => (
                        <div key={data.level} className="grid grid-cols-3 p-4 hover:bg-white/5 transition-colors items-center">
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">{data.level}</span>
                                L-{data.level}
                            </div>
                            <div className="text-center font-mono text-gray-300 text-sm">
                                <span className="text-pink-400 font-bold">{data.filled}</span> <span className="text-gray-600">/</span> {data.capacity}
                            </div>
                            <div className="text-right">
                                {data.filled >= data.capacity ? (
                                    <span className="text-[10px] text-green-400 bg-green-950/30 px-2 py-0.5 rounded border border-green-900/50">COMPLETED</span>
                                ) : (
                                    <span className="text-[10px] text-gray-500">IN PROGRESS</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    )
}

// --- Main App Logic ---

const useLiveOrders = (dept: Department) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrders([...MOCK_ORDERS]); 
  }, [dept]);

  const saveOrder = async (order: Order) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 50)); 
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index >= 0) MOCK_ORDERS[index] = order;
    else MOCK_ORDERS.push(order);
    setOrders([...MOCK_ORDERS]);
    setLoading(false);
  };

  return { orders, saveOrder, loading };
};

export default function App() {
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS); 
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [user, setUser] = useState<Worker | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('DASHBOARD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // NEW STATE: Payment Requests
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showPaymentRequests, setShowPaymentRequests] = useState(false);
  
  const [showHistory, setShowHistory] = useState(false);
  
  // UPDATED: boxModal now stores keyof statData (the type string) instead of static data snapshot. 
  // This allows the modal to be reactive.
  const [boxModal, setBoxModal] = useState<{isOpen: boolean, title: string, type: string | null, interactable?: boolean}>({ isOpen: false, title: '', type: null, interactable: false });
  const [walletModal, setWalletModal] = useState<{isOpen: boolean, title: string, balance: number}>({ isOpen: false, title: '', balance: 0 });
  const [showWalletManager, setShowWalletManager] = useState(false); // NEW STATE for Wallet Manager

  const [selectedOrderForAction, setSelectedOrderForAction] = useState<Order | null>(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [showWorkerPopup, setShowWorkerPopup] = useState(false);
  const [selectedWorkerForHandover, setSelectedWorkerForHandover] = useState<Worker | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false); // FOR DELIVERY BOY

  const [newBill, setNewBill] = useState({
    customerName: '', mobile: '', address: '', pincode: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    trialDate: new Date().toISOString().split('T')[0],
    totalAmount: '0'
  });
  const [currentLineItem, setCurrentLineItem] = useState<{type: ItemType, qty: number}>({ type: ItemType.SHIRT, qty: 1 });
  const [billLineItems, setBillLineItems] = useState<{type: ItemType, qty: number}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const total = billLineItems.reduce((sum, item) => sum + ((ITEM_RATES[item.type] || 0) * item.qty), 0);
    setNewBill(prev => ({ ...prev, totalAmount: total.toString() }));
  }, [billLineItems]);

  const { orders, saveOrder } = useLiveOrders(user?.department || Department.CIVIL);
  const myOrders = useMemo(() => user ? getOrdersForRole(orders, user.role) : [], [orders, user]);

  const statData = useMemo(() => {
    if (!user) return { created: [], inbox: [], processing: [], handoverPending: [], handoverComplete: [], todayComplete: [], totalComplete: [], deliveryReturns: [] };
    
    // ADMIN LOGIC: SHOW EVERYTHING
    if (user.role === UserRole.ADMIN) {
        return {
            created: orders.filter(o => o.status === OrderStatus.DRAFT),
            inbox: orders.filter(o => o.handoverStatus === 'IN_TRANSIT'),
            processing: orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.DRAFT),
            handoverPending: orders.filter(o => o.handoverStatus === 'IN_TRANSIT'),
            handoverComplete: orders.filter(o => o.handoverStatus === 'COMPLETED'),
            todayComplete: orders.filter(o => o.status === OrderStatus.DELIVERED && o.updatedAt.includes(new Date().toISOString().split('T')[0])),
            totalComplete: orders.filter(o => o.status === OrderStatus.DELIVERED),
            deliveryReturns: orders.filter(o => o.handoverStatus === 'IN_TRANSIT' && o.creatorId !== 'ADMIN') // Just for view
        };
    }

    // 1. DELIVERY RETURNS (New Box Logic)
    const deliveryReturns = orders.filter(o => 
        o.creatorId === user.id && 
        o.lastSenderId && 
        (workers.find(w => w.id === o.lastSenderId)?.role === UserRole.CIVIL_DELIVERY) &&
        o.handoverStatus === 'IN_TRANSIT'
    );
    
    // 2. SELF (My Created Orders - Currently with me)
    // CHANGE: Removed `o.status === OrderStatus.DRAFT`. Now it stays here as long as it's not handed over.
    const created = orders.filter(o =>
        o.creatorId === user.id &&
        o.handoverStatus === 'DRAFT' &&
        o.status !== OrderStatus.DELIVERED
    );

    // 3. PENDING (Work from OTHERS - Currently with me)
    // CHANGE: Removed the "Created by me" clause so it doesn't duplicate.
    const processing = orders.filter(o =>
       o.creatorId !== user.id && // Not created by me
       o.targetRole === user.role && // Assigned to me
       o.handoverStatus === 'DRAFT' && // I have accepted it (it's active)
       o.status !== OrderStatus.DELIVERED
    );

    // 4. INBOX (Incoming)
    const inbox = orders.filter(o => 
        o.targetRole === user.role && 
        o.handoverStatus === 'IN_TRANSIT' &&
        !(o.creatorId === user.id && workers.find(w => w.id === o.lastSenderId)?.role === UserRole.CIVIL_DELIVERY)
    );

    // 5. HANDOVER PENDING (Outgoing)
    const handoverPending = orders.filter(o => o.lastSenderId === user.id && o.handoverStatus === 'IN_TRANSIT');
    
    // 6. HANDOVER DONE (Completed)
    const handoverComplete = orders.filter(o => o.lastSenderId === user.id && o.handoverStatus === 'COMPLETED');
    
    return { created, inbox, processing, handoverPending, handoverComplete, todayComplete: handoverComplete, totalComplete: handoverComplete, deliveryReturns };
  }, [orders, user, workers]);

  const wallets = useMemo(() => {
    if (!user) return [];
    
    const baseWallets = [
      { label: 'Main Balance', value: user.walletMain, icon: <Wallet />, color: 'text-white' },
      { label: 'Today\'s Work', value: user.walletToday, icon: <TrendingUp />, color: 'text-green-400' },
      { label: 'Stitching Cost', value: user.walletStitching, icon: <Scissors />, color: 'text-blue-400' },
      { label: 'Upline Income', value: user.walletUpline, icon: <ArrowUpRight />, color: 'text-purple-400' },
      { label: 'Downline Income', value: user.walletDownline, icon: <ArrowDownLeft />, color: 'text-orange-400' },
      { label: 'Magic Fund', value: user.walletMagic, icon: <Sparkles />, color: 'text-pink-400' },
      { label: 'Performance', value: user.walletPerformance, icon: <Award />, color: 'text-yellow-400' },
      { label: 'Security Hold', value: user.walletHold, icon: <Lock />, color: 'text-red-400' },
    ];
    
    // ADD ADMIN WALLETS IF USER IS ADMIN
    if (user.role === UserRole.ADMIN) {
        baseWallets.push(
            { label: 'Booking Wallet', value: user.walletBooking, icon: <BookOpen />, color: 'text-emerald-400' },
            { label: 'Labor Wallet', value: user.walletLabor, icon: <Hammer />, color: 'text-amber-400' },
            { label: 'Profit Wallet', value: user.walletProfit, icon: <CircleDollarSign />, color: 'text-gold-400' }
        );
    }
    
    return baseWallets;
  }, [user]);

  const handleLogin = (id: string) => {
    const foundUser = workers.find(w => w.id.toLowerCase() === id.toLowerCase() || w.mobile === id);
    if (foundUser) { setUser(foundUser); setToastMessage(`Welcome, ${foundUser.name}`); } 
    else alert("Invalid Login ID");
  };

  const handleLogout = () => { setUser(null); setActiveView('DASHBOARD'); };
  
  // NEW: Cancel Order Logic
  const handleCancelBill = () => {
      setBillLineItems([]);
      setNewBill({ customerName: '', mobile: '', address: '', pincode: '', deliveryDate: new Date().toISOString().split('T')[0], trialDate: new Date().toISOString().split('T')[0], totalAmount: '0' });
      setActiveView('DASHBOARD');
  };

  // NEW: Remove Specific Item Logic
  const removeItem = (index: number) => {
      const updatedItems = [...billLineItems];
      updatedItems.splice(index, 1);
      setBillLineItems(updatedItems);
  };

  // Copy Helper
  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setToastMessage("Copied to Clipboard!");
  };

  // --- NEW: Handle Adding Money Request ---
  const handleRequestAddMoney = (amount: number, utr: string) => {
      if (!user) return;
      
      const newRequest: PaymentRequest = {
          id: `REQ-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          amount: amount,
          utrNumber: utr,
          status: 'PENDING',
          timestamp: new Date().toISOString()
      };
      
      setPaymentRequests([newRequest, ...paymentRequests]);
  };

  // --- NEW: Approve Request ---
  const handleApprovePayment = (req: PaymentRequest) => {
      const updatedRequests = paymentRequests.map(r => r.id === req.id ? { ...r, status: 'APPROVED' as PaymentStatus } : r);
      setPaymentRequests(updatedRequests);
      
      // Update Wallets
      const updatedWorkers = [...workers];
      
      // 1. Credit User's Stitching Wallet
      const userIndex = updatedWorkers.findIndex(w => w.id === req.userId);
      if (userIndex > -1) {
          updatedWorkers[userIndex].walletStitching += req.amount;
      }
      
      // 2. Credit Admin's Booking Wallet
      const adminIndex = updatedWorkers.findIndex(w => w.role === UserRole.ADMIN);
      if (adminIndex > -1) {
          updatedWorkers[adminIndex].walletBooking += req.amount;
      }
      
      setWorkers(updatedWorkers);
      // If current logged in user is the requester, update their local state too? No, admin is logged in.
      
      setToastMessage(`Request Approved: ₹${req.amount} added to ${req.userName}`);
  };

  const handleRejectPayment = (req: PaymentRequest) => {
      const updatedRequests = paymentRequests.map(r => r.id === req.id ? { ...r, status: 'REJECTED' as PaymentStatus } : r);
      setPaymentRequests(updatedRequests);
      setToastMessage(`Request Rejected for ${req.userName}`);
  };

  const handleGenerateBill = async () => {
     if (!newBill.customerName || !billLineItems.length) { setToastMessage("⚠️ Add Customer & Items"); return; }
     setIsGenerating(true);
     
     // UPDATED: Generate ONE Master Bill ID for the entire batch
     const masterBillId = `BILL-${Math.floor(1000 + Math.random() * 9000)}`;
     
     for (const item of billLineItems) {
        await saveOrder({
            id: `${masterBillId}-${item.type}-${Math.random().toString(36).substr(2, 5)}`,
            billId: masterBillId, // Shared Bill ID
            department: Department.CIVIL, 
            customerId: 'CUST-001',
            customerName: newBill.customerName, 
            mobileNumber: newBill.mobile,
            customerAddress: newBill.address,
            itemType: item.type, 
            quantity: item.qty,
            status: OrderStatus.DRAFT, handoverStatus: 'DRAFT',
            targetRole: user?.role || UserRole.SHOWROOM, 
            totalCost: (ITEM_RATES[item.type] || 0) * item.qty,
            paidAmount: 0,
            deliveryDate: newBill.deliveryDate, createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), creatorRole: user?.role || UserRole.SHOWROOM,
            creatorId: user?.id || 'admin', priority: 'NORMAL',
            securityCode: Math.floor(1000 + Math.random() * 9000).toString(), // GENEREATE CODE HERE
        });
     }
     
     setToastMessage(`Bill Generated: ${masterBillId} (${billLineItems.length} items)`); 
     setIsGenerating(false); 
     setActiveView('DASHBOARD'); 
     setBillLineItems([]);
     setNewBill({ ...newBill, customerName: '', mobile: '', address: '', totalAmount: '0' });
  };

  // NEW: Confirm Draft to Pending
  const handleConfirmDraft = async () => {
      if (selectedOrderForAction) {
          await saveOrder({
              ...selectedOrderForAction,
              status: OrderStatus.PENDING_APPROVAL, // Move to Pending Status
              updatedAt: new Date().toISOString()
          });
          setToastMessage("Order Confirmed. Moved to Pending.");
          setShowActionPopup(false);
          setSelectedOrderForAction(null);
      }
  };

  const handleConfirmHandover = async () => {
    if (selectedOrderForAction && selectedWorkerForHandover && user) {
      
      // BLOCK: Check Balance at Measurement Stage
      if (user.role === UserRole.CIVIL_MEASUREMENT) {
          const creatorId = selectedOrderForAction.creatorId;
          const creator = workers.find(w => w.id === creatorId);
          if (creator) {
              // We check if the creator has enough funds for the TOTAL cost of this specific item
              const requiredAmount = selectedOrderForAction.totalCost;
              if (creator.walletStitching < requiredAmount) {
                  setToastMessage("⛔ Insufficient Balance in Bill Creator's Stitching Wallet! Order Handover Blocked.");
                  setShowConfirmPopup(false);
                  return; // Stop execution
              }
          }
      }

      const updatedOrder: Order = {
        ...selectedOrderForAction,
        handoverStatus: 'IN_TRANSIT',
        targetRole: selectedWorkerForHandover.role,
        lastSenderId: user.id,
        // REMOVED CODE GENERATION HERE, DONE AT CREATION
        updatedAt: new Date().toISOString()
      };
      await saveOrder(updatedOrder);
      
      setToastMessage(`Sent to ${ROLE_LABELS[selectedWorkerForHandover.role]}`);
      setShowConfirmPopup(false); setSelectedOrderForAction(null);
    }
  };

  const handleVerifyDeliveryCode = async (code: string) => {
      if (selectedOrderForAction && user) {
          if (selectedOrderForAction.securityCode === code) {
              // 4TH DEDUCTION: 25% on Secure Code Verification
              const updatedWorkers = [...workers];
              const creatorId = selectedOrderForAction.creatorId;
              const creatorIndex = updatedWorkers.findIndex(w => w.id === creatorId);
              
              if (creatorIndex > -1) {
                  const deduction = selectedOrderForAction.totalCost * 0.25;
                  
                  // Check funds
                  if (updatedWorkers[creatorIndex].walletStitching >= deduction) {
                       updatedWorkers[creatorIndex].walletStitching -= deduction;
                       
                       // UPDATE STATUS TO DELIVERED
                       await saveOrder({
                           ...selectedOrderForAction,
                           status: OrderStatus.DELIVERED,
                           handoverStatus: 'COMPLETED',
                           updatedAt: new Date().toISOString()
                       });

                       setWorkers(updatedWorkers);
                       setToastMessage(`✅ Payment Verified & Order Delivered | Final Deduction: ₹${deduction}`);
                       setShowVerificationModal(false);
                       setShowActionPopup(false);
                  } else {
                       alert("Creator has insufficient funds for final deduction!");
                       return;
                  }
              } else {
                   // Fallback logic
                   await saveOrder({ ...selectedOrderForAction, status: OrderStatus.DELIVERED, handoverStatus: 'COMPLETED' });
                   setToastMessage("Order Delivered (Creator not found for deduction)");
                   setShowVerificationModal(false);
              }
          } else {
              alert("Incorrect Code! Ask the Bill Creator for the correct 4-digit code.");
          }
      }
  };

  const handleAcceptOrder = async () => {
      if (selectedOrderForAction && user) {
          
          const updatedWorkers = [...workers];
          let commissionMsg = "";

          // --- STITCHING WALLET DEDUCTION LOGIC (Installments) ---
          const creatorId = selectedOrderForAction.creatorId;
          const creatorIndex = updatedWorkers.findIndex(w => w.id === creatorId);
          
          if (creatorIndex > -1) {
              const creator = updatedWorkers[creatorIndex];
              const cost = selectedOrderForAction.totalCost;
              const installment = cost * 0.25; // 25%
              
              let shouldDeduct = false;

              // 1. Cutting Master Accepts (25%)
              if (user.role === UserRole.CIVIL_CUTTING_MASTER) {
                  shouldDeduct = true;
              }
              // 2. Pant Maker Accepts (25% - Only for Pants)
              else if (user.role === UserRole.CIVIL_PANT_MAKER && selectedOrderForAction.itemType === ItemType.PANT) {
                   shouldDeduct = true;
              }
              // 2. Kaj Button Accepts (25% - Only for Shirts/Kurtas)
              else if (user.role === UserRole.CIVIL_KAJ_BUTTON && 
                      (selectedOrderForAction.itemType === ItemType.SHIRT || selectedOrderForAction.itemType === ItemType.KURTA)) {
                   shouldDeduct = true;
              }
              // 3. Delivery Accepts (25% - In Transit to Delivery)
              else if (user.role === UserRole.CIVIL_DELIVERY && selectedOrderForAction.handoverStatus === 'IN_TRANSIT') {
                   shouldDeduct = true;
              }
              
              if (shouldDeduct) {
                  if (creator.walletStitching >= installment) {
                      creator.walletStitching -= installment;
                      commissionMsg += ` | Wallet Deducted: ₹${installment}`;
                  } else {
                      // Logic if balance goes negative mid-process? 
                      // Usually blocked at start, but if they withdrew funds, this might go negative.
                      // For now, let's allow negative or just zero.
                      creator.walletStitching -= installment; 
                      commissionMsg += ` | Wallet Deducted (Overdraft): ₹${installment}`;
                  }
              }
          }

          // --- 1. SHOWROOM 3% WORK INCOME (Shirt/Pant) ---
          // Trigger: ONLY when CUTTING MASTER accepts the order (to prevent double payment)
          if (user.role === UserRole.CIVIL_CUTTING_MASTER) {
             const creator = updatedWorkers.find(w => w.id === creatorId);

             if (creator && creator.role === UserRole.SHOWROOM) {
                 const type = selectedOrderForAction.itemType;
                 if (type === ItemType.SHIRT || type === ItemType.PANT) {
                     const showroomComm = selectedOrderForAction.totalCost * 0.03; // 3%
                     
                     // WORK INCOME (Mehnat ki kamai)
                     creator.walletToday += showroomComm; 
                     creator.walletMain += showroomComm;
                     
                     commissionMsg += ` | Showroom Work Income (3%): +₹${showroomComm.toFixed(2)}`;
                 }
             }
          }

          // --- 2. SENDER PAYMENT & MLM LOGIC (Existing) ---
          const senderId = selectedOrderForAction.lastSenderId;
          
          if (senderId) {
             const senderIndex = updatedWorkers.findIndex(w => w.id === senderId);
             
             if (senderIndex > -1) {
                 const sender = updatedWorkers[senderIndex];
                 
                 // 1. Calculate Base Earning
                 const totalRate = getWorkerRate(sender.role, selectedOrderForAction.itemType, selectedOrderForAction.totalCost);
                 
                 if (totalRate > 0) {
                     // 13% Deduction Logic
                     const deductionAmount = totalRate * 0.13;
                     const netPay = totalRate - deductionAmount;
                     
                     // Pots for distribution
                     const uplinePot = totalRate * 0.10; // 10% dedicated for Upline (Ancestors)
                     const downlinePot = totalRate * 0.03; // 3% dedicated for Downline (Descendants)
                     
                     // PERFORMANCE FUND LOGIC (1% of Task Rate)
                     const performanceBonus = totalRate * 0.01;

                     // --- ADMIN WALLET LOGIC (BOOKING -> LABOR -> PROFIT) ---
                     // Calculate Total Labor Cost for this specific task (Cost to System)
                     const adminIndex = updatedWorkers.findIndex(w => w.role === UserRole.ADMIN);
                     if (adminIndex > -1) {
                         // DEDUCT from Booking Wallet (User money used to pay labor)
                         updatedWorkers[adminIndex].walletBooking -= totalRate;
                         
                         // CREDIT to Labor Wallet (Record expense)
                         updatedWorkers[adminIndex].walletLabor += totalRate;
                         
                         // PROFIT CALCULATION
                         // System keeps ~5% margin on every task. 
                         // We pay the Performance Bonus (1%) out of this margin.
                         const grossProfit = totalRate * 0.05; 
                         const netProfit = grossProfit - performanceBonus;
                         
                         updatedWorkers[adminIndex].walletProfit += netProfit;
                     }

                     // --- A. Pay the Sender (Worker) ---
                     sender.walletToday += netPay; // ONLY LABOR INCOME GOES HERE
                     sender.walletTotal += netPay;
                     sender.walletMain += netPay; 
                     
                     // Add Performance Bonus (Separate Wallet)
                     sender.walletPerformance += performanceBonus; 
                     commissionMsg += ` | Perf. Bonus: +₹${performanceBonus.toFixed(2)}`;

                     // --- B. Upline Distribution ---
                     let currentUplineId = sender.uplineId;
                     DISTRIBUTION_PERCENTAGES.forEach((percent) => {
                         if (currentUplineId) {
                             const uplineIndex = updatedWorkers.findIndex(w => w.id === currentUplineId);
                             if (uplineIndex > -1) {
                                 const ancestor = updatedWorkers[uplineIndex];
                                 const share = uplinePot * (percent / 100);
                                 const magicDeduction = share * 0.10; 
                                 const netShare = share - magicDeduction;
                                 
                                 // ADDED: Instant Credit to Main
                                 ancestor.walletDownline += netShare;
                                 ancestor.walletMain += netShare;
                                 
                                 // Magic Distribution
                                 let currentBinaryChildIndex = uplineIndex;
                                 MAGIC_DISTRIBUTION_PERCENTAGES.forEach((magicPercent) => {
                                      if (currentBinaryChildIndex > 0) {
                                          const parentIndex = Math.floor((currentBinaryChildIndex - 1) / 2);
                                          if (parentIndex >= 0 && parentIndex < updatedWorkers.length) {
                                              const binaryParent = updatedWorkers[parentIndex];
                                              const magicShare = magicDeduction * (magicPercent / 100);
                                              // ADDED: Instant Credit to Main
                                              binaryParent.walletMagic += magicShare;
                                              binaryParent.walletMain += magicShare;
                                              currentBinaryChildIndex = parentIndex;
                                          } else {
                                              currentBinaryChildIndex = 0;
                                          }
                                      }
                                 });
                                 currentUplineId = ancestor.uplineId;
                             } else {
                                 currentUplineId = undefined;
                             }
                         }
                     });

                     // --- C. Downline Distribution ---
                     let currentDescendants = updatedWorkers.filter(w => w.uplineId === sender.id);
                     let level = 0;
                     while(level < DOWNLINE_DISTRIBUTION_PERCENTAGES.length && currentDescendants.length > 0) {
                         const percent = DOWNLINE_DISTRIBUTION_PERCENTAGES[level];
                         const share = downlinePot * (percent / 100);
                         const nextLevelDescendants: Worker[] = [];
                         currentDescendants.forEach(descendant => {
                             // ADDED: Instant Credit to Main
                             descendant.walletUpline += share;
                             descendant.walletMain += share;
                             
                             const children = updatedWorkers.filter(w => w.uplineId === descendant.id);
                             nextLevelDescendants.push(...children);
                         });
                         currentDescendants = nextLevelDescendants;
                         level++;
                     }
                     
                     setToastMessage(`Payment Released: ₹${netPay.toFixed(2)}${commissionMsg}`);
                 }
             }
          }
          
          setWorkers(updatedWorkers);

          // Update Order Status - CHANGED LOGIC
          // Instead of COMPLETED, set to DRAFT so it sits in the new owner's PENDING box
          await saveOrder({ 
              ...selectedOrderForAction, 
              handoverStatus: 'DRAFT', 
              targetRole: user.role, 
              status: OrderStatus.PENDING_APPROVAL // Generic pending status
          });
          
          if (!toastMessage?.includes("Payment")) {
              setToastMessage(`Order Accepted Successfully${commissionMsg}`);
          }
          setShowActionPopup(false);
      }
  };
  
  const handleMeasurementSave = async (data: MeasurementData) => {
      if(selectedOrderForAction) {
          await saveOrder({
              ...selectedOrderForAction,
              measurements: data,
              status: OrderStatus.MEASUREMENT_DONE,
              updatedAt: new Date().toISOString()
          });
          setToastMessage("Measurement Saved");
          setShowMeasurementModal(false);
          setShowActionPopup(false);
      }
  };

  // UPDATED: Use keyof statData
  const openStatModal = (title: string, type: string, interactable: boolean = false) => {
    setBoxModal({ isOpen: true, title, type, interactable });
  };

  // Quick Add Helper
  const addItem = (type: ItemType) => {
     setBillLineItems([...billLineItems, { type, qty: 1 }]);
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* Header Mobile - ALWAYS VISIBLE FOR MENU ACCESS */}
      <div className="flex justify-between p-4 border-b border-white/5 bg-black sticky top-0 z-40">
        <div className="flex gap-3 items-center">
           <div className="w-10 h-10 rounded-full bg-zinc-900 border border-gold-500/20 flex items-center justify-center font-bold text-gold-500">
               {user.name.charAt(0)}
           </div>
           <div><h1 className="text-gold-100 font-bold text-sm">LORD'S</h1><p className="text-[10px] text-gray-500">{ROLE_LABELS[user.role]}</p></div>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gold-400 hover:bg-white/5 rounded"><Menu size={24} /></button>
      </div>

      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        user={user} 
        onNavigate={(v:string) => { 
          if(v==='LOGOUT') handleLogout(); else if (v.length > 8 && v !=='INVENTORY' && v !=='NEW_BILL' && v !== 'DASHBOARD' && v !== 'REFERRAL_TEAM' && v !== 'MAGIC_INCOME') setShowHistory(true); else setActiveView(v); 
          setMobileMenuOpen(false); 
        }} 
        onOpenWallets={() => setShowWalletManager(true)}
      />

      {/* UPDATED: Pass reactive data based on type key */}
      <OrderHistoryModal 
        isOpen={boxModal.isOpen} 
        onClose={() => setBoxModal({...boxModal, isOpen: false})} 
        orders={boxModal.type ? (statData as any)[boxModal.type] : []} 
        title={boxModal.title} 
        onOrderClick={boxModal.interactable ? (o: Order) => { setSelectedOrderForAction(o); setShowActionPopup(true); /* Don't close boxModal */ } : undefined} 
        userId={user.id}
        userRole={user.role}
      />
      <OrderHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} orders={myOrders} title="MY HISTORY" userId={user.id} userRole={user.role}/>
      <WalletHistoryModal isOpen={walletModal.isOpen} onClose={() => setWalletModal({...walletModal, isOpen: false})} title={walletModal.title} balance={walletModal.balance} />
      <MeasurementModal isOpen={showMeasurementModal} onClose={() => setShowMeasurementModal(false)} order={selectedOrderForAction} onSave={handleMeasurementSave} />
      <VerificationModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} order={selectedOrderForAction} onVerify={handleVerifyDeliveryCode} />
      
      {/* WALLET MANAGER POPUP */}
      <WalletManagerModal isOpen={showWalletManager} onClose={() => setShowWalletManager(false)} user={user} wallets={wallets} onAction={(msg) => setToastMessage(msg)} onRequestAddMoney={handleRequestAddMoney} />
      
      {/* NEW: ADMIN PAYMENT REQUESTS MODAL */}
      <PaymentRequestsModal isOpen={showPaymentRequests} onClose={() => setShowPaymentRequests(false)} requests={paymentRequests} onApprove={handleApprovePayment} onReject={handleRejectPayment} />

      {/* Popups */}
      {showActionPopup && selectedOrderForAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowActionPopup(false)}>
           <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm border border-gold-500/20" onClick={e => e.stopPropagation()}>
               <h3 className="text-gold-500 font-bold mb-4">Actions for {selectedOrderForAction.billId}</h3>
               {selectedOrderForAction.handoverStatus === 'IN_TRANSIT' && selectedOrderForAction.targetRole === user.role ? (
                   // STANDARD ACCEPT (Non-Delivery)
                    <Button className="w-full bg-green-600" onClick={handleAcceptOrder}>Accept Order</Button>
               ) : (
                   <div className="space-y-3">
                       {/* DELIVERY BOY SPECIFIC: ENTER CODE TO COMPLETE (Condition: Order is with Delivery, Draft/Self status, not yet delivered) */}
                       {user.role === UserRole.CIVIL_DELIVERY && selectedOrderForAction.targetRole === user.role && selectedOrderForAction.handoverStatus === 'DRAFT' && selectedOrderForAction.status !== OrderStatus.DELIVERED && (
                           <Button className="w-full bg-blue-600 hover:bg-blue-500 mb-2" onClick={() => { setShowVerificationModal(true); setShowActionPopup(false); }}>
                               <ShieldCheck size={18} /> Complete Delivery (Enter Code)
                           </Button>
                       )}

                       {/* 1. DRAFT CONFIRM BUTTON */}
                       {selectedOrderForAction.handoverStatus === 'DRAFT' && selectedOrderForAction.status === OrderStatus.DRAFT && (
                           <Button className="w-full bg-emerald-600 border-none hover:bg-emerald-500" onClick={handleConfirmDraft}>
                               <CheckSquare size={16} /> Confirm Order
                           </Button>
                       )}

                       {/* EXCLUSIVE MEASUREMENT BUTTON - ONLY FOR MEASUREMENT PANEL */}
                       {user.role === UserRole.CIVIL_MEASUREMENT && (
                           <Button className="w-full bg-gold-600 text-black border-none hover:bg-gold-500" onClick={() => setShowMeasurementModal(true)}>
                               <Ruler size={16} /> Take Measurement
                           </Button>
                       )}

                       <Button className="w-full bg-zinc-800" onClick={() => alert("Edit Order")}>Edit Info</Button>
                       
                       {/* Show Handover Button for everyone EXCEPT Delivery Boy if he is completing delivery */}
                       {user.role !== UserRole.CIVIL_DELIVERY && (
                           <Button className="w-full" onClick={() => { setShowWorkerPopup(true); setShowActionPopup(false); }}>Handover Order</Button>
                       )}
                   </div>
               )}
           </div>
        </div>
      )}

      {showWorkerPopup && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowWorkerPopup(false)}>
             <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm border border-gold-500/20 h-[60vh] flex flex-col" onClick={e => e.stopPropagation()}>
                 <h3 className="text-white font-bold mb-4">Select Receiver</h3>
                 <div className="overflow-y-auto space-y-2 flex-1">
                     {(() => {
                         const nextRole = getNextRole(user.role, selectedOrderForAction!.status, selectedOrderForAction!.itemType);
                         return workers.filter(w => w.role === nextRole).map(w => (
                             <button key={w.id} onClick={() => { setSelectedWorkerForHandover(w); setShowWorkerPopup(false); setShowConfirmPopup(true); }} className="w-full p-3 bg-black border border-white/10 rounded-lg flex items-center gap-3 text-left hover:border-gold-500">
                                 <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">{w.name.charAt(0)}</div>
                                 <div><p className="text-sm font-bold text-white">{w.name}</p><p className="text-[10px] text-gray-500">{ROLE_LABELS[w.role]}</p></div>
                             </button>
                         ));
                     })()}
                 </div>
             </div>
         </div>
      )}

      {showConfirmPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
              <div className="bg-black border border-gold-500/50 p-6 rounded-2xl text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Confirm Handover</h3>
                  <p className="text-gray-400 mb-6">Send to {selectedWorkerForHandover?.name}?</p>
                  <div className="flex gap-4"><Button variant="ghost" onClick={() => setShowConfirmPopup(false)}>Cancel</Button><Button onClick={handleConfirmHandover}>Confirm</Button></div>
              </div>
          </div>
      )}

      <main className="max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in">
         {activeView === 'DASHBOARD' && (
             <div className="grid grid-cols-1 gap-6">
                 
                 {/* ADMIN TOP ROW SUMMARY - ONLY FOR ADMIN */}
                 {user.role === UserRole.ADMIN && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                         <div className="bg-zinc-900 border border-gold-500/30 p-4 rounded-xl flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400"><Boxes size={24}/></div>
                             <div><p className="text-xs text-gray-500 uppercase font-bold">Total Orders</p><p className="text-2xl font-bold text-white">{orders.length}</p></div>
                         </div>
                         <div className="bg-zinc-900 border border-gold-500/30 p-4 rounded-xl flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><Users size={24}/></div>
                             <div><p className="text-xs text-gray-500 uppercase font-bold">Total Staff</p><p className="text-2xl font-bold text-white">{workers.length}</p></div>
                         </div>
                         <div className="bg-zinc-900 border border-gold-500/30 p-4 rounded-xl flex items-center gap-4 col-span-2 md:col-span-2">
                             <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400"><BarChart3 size={24}/></div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">Total System Revenue (Est)</p>
                                 <p className="text-2xl font-bold text-white">₹{orders.reduce((acc, o) => acc + o.totalCost, 0).toLocaleString()}</p>
                             </div>
                         </div>
                         
                         {/* NEW: Payment Requests Box for Admin */}
                         <div onClick={() => setShowPaymentRequests(true)} className="bg-zinc-900 border border-red-500/30 p-4 rounded-xl flex items-center gap-4 col-span-2 md:col-span-4 cursor-pointer hover:bg-white/5 transition-all animate-pulse">
                             <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400"><BellRing size={24}/></div>
                             <div className="flex-1 flex justify-between items-center">
                                 <div>
                                     <p className="text-xs text-red-400 uppercase font-bold">Payment Requests</p>
                                     <p className="text-2xl font-bold text-white">{paymentRequests.filter(r => r.status === 'PENDING').length} Pending</p>
                                 </div>
                                 <ChevronRight className="text-gray-500"/>
                             </div>
                         </div>
                     </div>
                 )}

                 {/* Action Buttons */}
                 <div className="grid grid-cols-2 gap-4 mb-2">
                     <button onClick={() => setActiveView('NEW_BILL')} className="p-4 bg-gradient-to-r from-gold-600 to-gold-400 rounded-xl text-black font-bold flex flex-col items-center justify-center shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-transform">
                        <FilePlus size={24} className="mb-2"/> 
                        <span className="text-sm tracking-wider">NEW ORDER</span>
                     </button>
                     <button onClick={() => alert("Coming Soon")} className="p-4 bg-zinc-900 border border-white/10 rounded-xl text-gray-400 font-bold flex flex-col items-center justify-center hover:border-gold-500/50 transition-colors">
                        <Image size={24} className="mb-2"/> 
                        <span className="text-sm tracking-wider">GALLERY</span>
                     </button>
                 </div>

                 {/* ORDER STATUS GRID (7 Boxes) - Laher Grid 3 */}
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     <div onClick={() => openStatModal('SELF / DRAFTS', 'created', true)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><User size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Self</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.created.length}</p>
                     </div>

                     <div onClick={() => openStatModal('INBOX', 'inbox', true)} className="card-laher border border-gold-500/30 p-6 rounded-xl cursor-pointer hover:bg-gold-500/5 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400"><Inbox size={20}/></div>
                            <span className="text-[10px] text-gold-500 uppercase font-bold tracking-widest">Inbox</span>
                        </div>
                        <p className="text-3xl font-bold text-gold-100">{statData.inbox.length}</p>
                     </div>
                     
                     {/* NEW DELIVERY RETURNS BOX - Exclusive for Creator or Admin */}
                     <div onClick={() => openStatModal('DELIVERY RETURNS', 'deliveryReturns', true)} className="card-laher border border-blue-500/30 p-6 rounded-xl cursor-pointer hover:bg-blue-900/10 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"><ShieldCheck size={20}/></div>
                            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Returns</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-100">{statData.deliveryReturns.length}</p>
                     </div>

                     <div onClick={() => openStatModal('PENDING', 'processing', true)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400"><Clock size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.processing.length}</p>
                     </div>

                     <div onClick={() => openStatModal('H.O PENDING', 'handoverPending', true)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-yellow-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400"><ArrowRightLeft size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">H.O Pend</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.handoverPending.length}</p>
                     </div>
                     
                     <div onClick={() => openStatModal('H.O DONE', 'handoverComplete', false)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><CheckCircle size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">H.O Done</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.handoverComplete.length}</p>
                     </div>

                     <div onClick={() => openStatModal('TODAY', 'todayComplete', false)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400"><Calendar size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Today</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.todayComplete.length}</p>
                     </div>

                     <div onClick={() => openStatModal('TOTAL', 'totalComplete', false)} className="card-laher border border-white/5 p-6 rounded-xl cursor-pointer hover:border-gold-500/50 transition-colors md:col-span-3 lg:col-span-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400"><Boxes size={20}/></div>
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{statData.totalComplete.length}</p>
                     </div>
                 </div>

                 {/* FINANCIAL WALLETS - Laher Grid 3 (Large Boxes) */}
                 <div className="mt-6">
                     <h3 className="text-lg font-bold text-gold-100 uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet size={20} className="text-gold-500"/> Financial Hub</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                         {wallets.map((wallet, idx) => (
                             <div key={idx} onClick={() => setWalletModal({ isOpen: true, title: wallet.label, balance: wallet.value })} className="card-laher border border-white/5 hover:border-gold-500/30 p-6 rounded-xl cursor-pointer h-40 flex flex-col justify-between group transition-all">
                                 <div className="flex justify-between items-start">
                                     <div className={`text-xl ${wallet.color}`}>{React.cloneElement(wallet.icon as React.ReactElement, { size: 24 })}</div>
                                     <ChevronRight size={16} className="text-zinc-700 group-hover:text-gold-500 transition-colors"/>
                                 </div>
                                 <div className="mt-2">
                                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 truncate group-hover:text-gray-300 transition-colors">{wallet.label}</p>
                                     <p className={`text-2xl font-mono font-bold ${wallet.color}`}>₹{wallet.value.toLocaleString()}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* ADMIN EXCLUSIVE: STAFF LIST */}
                 {user.role === UserRole.ADMIN && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gold-100 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={20} className="text-gold-500"/> Staff Management</h3>
                        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-3 bg-black/50 p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                <div>Name / ID</div>
                                <div className="text-right">Main Wallet</div>
                                <div className="text-right">Performance</div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {workers.map(w => (
                                    <div key={w.id} className="grid grid-cols-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-white">{w.name}</p>
                                            <p className="text-[10px] text-gray-500">{ROLE_LABELS[w.role]}</p>
                                        </div>
                                        <div className="text-right font-mono text-gold-500">₹{w.walletMain.toLocaleString()}</div>
                                        <div className="text-right font-mono text-yellow-500">₹{w.walletPerformance.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 )}
             </div>
         )}
         
         {activeView === 'REFERRAL_TEAM' && (
             <Card>
                 <div className="flex items-center gap-4 mb-4"><button onClick={() => setActiveView('DASHBOARD')} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft/></button></div>
                 <ReferralPanel user={user} workers={workers} onCopy={handleCopy} />
             </Card>
         )}

         {activeView === 'MAGIC_INCOME' && (
             <Card>
                 <div className="flex items-center gap-4 mb-4"><button onClick={() => setActiveView('DASHBOARD')} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft/></button></div>
                 <MagicTeamPanel user={user} workers={workers} />
             </Card>
         )}

         {activeView === 'NEW_BILL' && (
             <Card>
                 <div className="flex items-center gap-4 mb-6"><button onClick={() => setActiveView('DASHBOARD')} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft/></button><h2 className="text-xl font-bold text-gold-400">New Booking</h2></div>
                 <div className="space-y-6">
                     
                     {/* Customer Details */}
                     <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                         <h3 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Customer Info</h3>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Customer Name</label>
                            <Input placeholder="Enter Name" value={newBill.customerName} onChange={e => setNewBill({...newBill, customerName: e.target.value})} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Mobile Number</label>
                            <Input placeholder="Enter 10-digit number" type="tel" value={newBill.mobile} onChange={e => setNewBill({...newBill, mobile: e.target.value})} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Address</label>
                            <Input placeholder="Enter Full Address" value={newBill.address} onChange={e => setNewBill({...newBill, address: e.target.value})} />
                         </div>
                     </div>

                     {/* Quick Selection Buttons */}
                     <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <h3 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">Quick Add Items</h3>
                        <div className="grid grid-cols-3 gap-3">
                             <button onClick={() => addItem(ItemType.SHIRT)} className="bg-zinc-800 hover:bg-gold-500/20 hover:border-gold-500 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group">
                                <span className="text-xs font-bold text-white group-hover:text-gold-400">SHIRT</span>
                                <span className="text-[10px] text-gold-500">₹375</span>
                             </button>
                             <button onClick={() => addItem(ItemType.PANT)} className="bg-zinc-800 hover:bg-gold-500/20 hover:border-gold-500 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group">
                                <span className="text-xs font-bold text-white group-hover:text-gold-400">PANT</span>
                                <span className="text-[10px] text-gold-500">₹475</span>
                             </button>
                             <button onClick={() => addItem(ItemType.COAT)} className="bg-zinc-800 hover:bg-gold-500/20 hover:border-gold-500 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group">
                                <span className="text-xs font-bold text-white group-hover:text-gold-400">COAT</span>
                                <span className="text-[10px] text-gold-500">₹3000</span>
                             </button>
                        </div>
                     </div>
                     
                     {/* Manual Add */}
                     <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Other Items</label>
                             <select className="bg-zinc-900 border border-white/20 p-3 rounded-lg text-white w-full h-12 focus:border-gold-500 outline-none text-sm" value={currentLineItem.type} onChange={e => setCurrentLineItem({...currentLineItem, type: e.target.value as ItemType})}>
                                 {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                        <div className="col-span-1 flex items-end">
                            <Button className="w-full h-12" onClick={() => setBillLineItems([...billLineItems, currentLineItem])}>Add</Button>
                        </div>
                     </div>

                     {/* Summary */}
                     <div className="bg-black/40 border border-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Added Items</p>
                            <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full">{billLineItems.length}</span>
                        </div>
                        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto custom-scrollbar">
                             {billLineItems.map((item, i) => (
                                 <div key={i} className="flex justify-between items-center text-sm text-gray-300 p-2 hover:bg-white/5 rounded">
                                     <div className="flex items-center gap-3">
                                         <span>{item.type}</span>
                                         <span className="text-gold-500 text-xs">Qty: {item.qty}</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                        <span>₹{ITEM_RATES[item.type]}</span>
                                        <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={16}/></button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                             <span className="text-gray-400 text-sm">Total Estimate</span>
                             <p className="text-gold-500 font-bold text-2xl">₹{newBill.totalAmount}</p>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-2 text-center">*Single Bill ID will be generated for all items</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <Button variant="ghost" onClick={handleCancelBill} className="w-full py-4 text-sm border-red-900 text-red-400 hover:bg-red-950/20">CANCEL</Button>
                         <Button className="w-full py-4 text-sm" onClick={handleGenerateBill} disabled={isGenerating}>{isGenerating ? "Processing..." : "Generate Bill"}</Button>
                     </div>
                 </div>
             </Card>
         )}
      </main>
    </div>
  );
}
