
export enum Department {
  CIVIL = 'CIVIL',
  READYMADE = 'READYMADE',
  ALTERATION = 'ALTERATION',
  CLOTH_SALES = 'CLOTH_SALES'
}

export enum UserRole {
  // Common
  ADMIN = 'ADMIN',
  
  // --- CIVIL DEPARTMENT (12 PANELS) ---
  CIVIL_MANAGER = 'CIVIL_MANAGER',    // 1. Manager/Admin View
  SHOWROOM = 'SHOWROOM',              // 2. Showroom (Booking)
  CIVIL_MEASUREMENT = 'CIVIL_MEASUREMENT', // 3. Measurement
  CIVIL_CUTTING_MASTER = 'CIVIL_CUTTING_MASTER', // 4. Cutting
  CIVIL_MATERIAL = 'CIVIL_MATERIAL',  // 5. Material/Store
  
  // Makers
  CIVIL_SHIRT_MAKER = 'CIVIL_SHIRT_MAKER', // 6. Shirt
  CIVIL_PANT_MAKER = 'CIVIL_PANT_MAKER',   // 7. Pant
  CIVIL_COAT_MAKER = 'CIVIL_COAT_MAKER',   // 8. Coat
  CIVIL_KURTA_MAKER = 'CIVIL_KURTA_MAKER', // 9. Kurta/Safari
  
  // Finishing Pipeline
  CIVIL_KAJ_BUTTON = 'CIVIL_KAJ_BUTTON', // 10. Kaj Button
  CIVIL_PRESS = 'CIVIL_PRESS',           // 11. Press
  CIVIL_FINISHING = 'CIVIL_FINISHING',   // 12. Final Checking/Finishing
  CIVIL_DELIVERY = 'CIVIL_DELIVERY',     // (Delivery is usually the exit point, can be part of Showroom or separate. Let's keep it separate for tracking)

  // Readymade Roles
  RM_MANAGER = 'RM_MANAGER',
  RM_MEASUREMENT = 'RM_MEASUREMENT', 
  RM_CUTTING = 'RM_CUTTING', 
  RM_SHIRT_KARIGAR = 'RM_SHIRT_KARIGAR',
  RM_PANT_KARIGAR = 'RM_PANT_KARIGAR',
  RM_LADIES_UPPER = 'RM_LADIES_UPPER',
  RM_LADIES_LOWER = 'RM_LADIES_LOWER',
  RM_KAJ_BUTTON = 'RM_KAJ_BUTTON',
  RM_PRESS = 'RM_PRESS', 
  RM_PACKING = 'RM_PACKING',
  RM_DELIVERY = 'RM_DELIVERY',
  RM_FABRIC_SHOP = 'RM_FABRIC_SHOP', 
  
  // Alteration Roles
  ALT_MANAGER = 'ALT_MANAGER',
  ALT_TAILOR = 'ALT_TAILOR',

  // Cloth Sales Roles
  CLOTH_MANAGER = 'CLOTH_MANAGER',
  CLOTH_SALESMAN = 'CLOTH_SALESMAN',
  
  // Misc
  INVESTOR = 'INVESTOR',
}

export enum OrderStatus {
  DRAFT = 'DRAFT', 
  MEASUREMENT_DONE = 'MEASUREMENT_DONE',
  PENDING_APPROVAL = 'PENDING_APPROVAL', 
  CUTTING_PENDING = 'CUTTING_PENDING',
  MATERIAL_PENDING = 'MATERIAL_PENDING', // New
  SEWING_PENDING = 'SEWING_PENDING',
  KAJ_BUTTON_PENDING = 'KAJ_BUTTON_PENDING',
  PRESS_PENDING = 'PRESS_PENDING',
  FINISHING_PENDING = 'FINISHING_PENDING', // New
  PACKING_PENDING = 'PACKING_PENDING',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  DELIVERED = 'DELIVERED', 
  
  // Alteration Specific
  RECEIVED = 'RECEIVED',
  REPAIRING = 'REPAIRING',
  REPAIRED = 'REPAIRED',
}

export type HandoverStatus = 'DRAFT' | 'READY_TO_SEND' | 'IN_TRANSIT' | 'COMPLETED';

export enum ItemType {
  SHIRT = 'SHIRT',
  PANT = 'PANT',
  COAT = 'COAT',
  SUIT = 'SUIT', 
  SHERVANI = 'SHERVANI',
  SAFARI = 'SAFARI',
  KURTA = 'KURTA',
  PYJAMA = 'PYJAMA',
  LADIES_UPPER = 'LADIES_UPPER',
  LADIES_LOWER = 'LADIES_LOWER',
  SALWAR = 'SALWAR',
  
  // Cloth Types
  FABRIC_SUITING = 'FABRIC_SUITING',
  FABRIC_SHIRTING = 'FABRIC_SHIRTING',
  FABRIC_KURTA = 'FABRIC_KURTA'
}

export interface MeasurementData {
  // Shirt Fields
  length?: string;
  shoulder?: string;
  sleeve?: string;
  chest?: string;
  stomach?: string; // Waist for shirt
  neck?: string;
  front?: string;
  
  // Pant Fields
  waist?: string;
  hip?: string;
  thigh?: string;
  knee?: string;
  bottom?: string;
  crotch?: string; // Latak
  
  notes?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: UserRole;
  department: Department;
  rating: number; 
  mobile?: string;
  email?: string;
  address?: string; 
  photoUrl?: string;
  
  // Security
  password?: string; 
  transactionPassword?: string; 
  withdrawalPin?: string;
  
  // Wallet Data - ALL WALLETS
  walletMain: number;        // 1. Main Wallet (Withdrawable)
  walletToday: number;       // 2. Today's Work
  walletStitching: number;   // 3. Stitching Cost Wallet (User adds funds here)
  walletUpline: number;      // 4. Upline Commission
  walletDownline: number;    // 5. Downline Commission
  walletMagic: number;       // 6. Magic/Royalty Income
  walletPerformance: number; // 7. Performance Bonus
  walletHold: number;        // 8. Hold/Security Amount
  
  // ADMIN SPECIFIC WALLETS
  walletBooking: number;     // Admin: Incoming Funds from Users
  walletLabor: number;       // Admin: Outgoing Labor Cost
  walletProfit: number;      // Admin: Remaining Profit
  
  walletMonthly: number;
  walletTotal: number;
  walletWithdrawal: number;
  
  // MLM
  referralCode?: string;
  uplineId?: string;
  downlineCount?: number;
}

export interface Order {
  id: string;
  billId: string; 
  department: Department;
  
  // Customer Details
  customerId: string;
  customerName: string; 
  fatherName?: string;
  schoolName?: string;
  customerAddress?: string;
  mobileNumber?: string;
  
  itemType: ItemType; 
  quantity: number;   
  sizeGroup?: string; 
  measurementId?: string; 
  measurements?: MeasurementData; // NEW: Added measurements
  
  status: OrderStatus;
  
  // Handover Logic
  handoverStatus: HandoverStatus;
  targetRole?: UserRole;
  lastSenderId?: string; // UPDATED: Tracks who sent the order
  securityCode?: string; // NEW: OTP for delivery verification
  
  // Financials
  totalCost: number; 
  paidAmount: number; 
  
  // Dates
  deliveryDate: string;
  trialDate?: string; 
  createdAt: string;
  updatedAt: string;
  
  // Attribution
  creatorRole: UserRole; 
  creatorId: string; 
  assignedWorkerId?: string; 
  assignedWorkerName?: string; 
  priority: 'NORMAL' | 'URGENT' | 'VIP';

  // Material Tracking
  fabricAmount?: number;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'FABRIC' | 'ACCESSORY' | 'PACKING';
  quantity: number;
  unit: string; 
  minThreshold: number;
  pricePerUnit: number;
}

// --- NEW PAYMENT TYPES ---
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amount: number;
  utrNumber: string;
  status: PaymentStatus;
  timestamp: string;
}
