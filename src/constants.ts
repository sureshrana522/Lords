
import { ItemType, Order, OrderStatus, UserRole, MaterialItem, Worker, Department } from './types';

// 1. Role Labels
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin Panel',
  [UserRole.CIVIL_MANAGER]: 'Head Manager',
  [UserRole.SHOWROOM]: '1. Showroom Panel',
  [UserRole.CIVIL_MEASUREMENT]: '2. Measurement Panel',
  [UserRole.CIVIL_CUTTING_MASTER]: '3. Cutting Panel',
  [UserRole.CIVIL_MATERIAL]: '4. Material Panel',
  [UserRole.CIVIL_SHIRT_MAKER]: '5. Shirt Maker Panel',
  [UserRole.CIVIL_PANT_MAKER]: '6. Pant Maker Panel',
  [UserRole.CIVIL_COAT_MAKER]: '7. Coat Maker Panel',
  [UserRole.CIVIL_KURTA_MAKER]: '8. Kurta/Safari Panel',
  [UserRole.CIVIL_KAJ_BUTTON]: '9. Kaj Button Panel',
  [UserRole.CIVIL_PRESS]: '10. Press Panel',
  [UserRole.CIVIL_FINISHING]: '11. Finishing Panel',
  [UserRole.CIVIL_DELIVERY]: '12. Delivery Panel',

  // Readymade & Others
  [UserRole.RM_MANAGER]: 'Readymade Manager',
  [UserRole.RM_MEASUREMENT]: 'RM Measurement',
  [UserRole.RM_CUTTING]: 'RM Cutting',
  [UserRole.RM_SHIRT_KARIGAR]: 'RM Shirt Maker',
  [UserRole.RM_PANT_KARIGAR]: 'RM Pant Maker',
  [UserRole.RM_LADIES_UPPER]: 'RM Ladies Upper',
  [UserRole.RM_LADIES_LOWER]: 'RM Ladies Lower',
  [UserRole.RM_KAJ_BUTTON]: 'RM Kaj Button',
  [UserRole.RM_PRESS]: 'RM Press',
  [UserRole.RM_PACKING]: 'RM Packing',
  [UserRole.RM_DELIVERY]: 'RM Delivery',
  [UserRole.RM_FABRIC_SHOP]: 'RM Fabric Shop',
  [UserRole.ALT_MANAGER]: 'Alteration Manager',
  [UserRole.ALT_TAILOR]: 'Alteration Tailor',
  [UserRole.CLOTH_MANAGER]: 'Cloth Manager',
  [UserRole.CLOTH_SALESMAN]: 'Cloth Salesman',
  [UserRole.INVESTOR]: 'Investor',
};

// 2. Item Rates
export const ITEM_RATES: Record<ItemType, number> = {
  [ItemType.SHIRT]: 375,
  [ItemType.PANT]: 475,
  [ItemType.COAT]: 3000,
  [ItemType.SUIT]: 2500,
  [ItemType.SHERVANI]: 3500,
  [ItemType.SAFARI]: 800,
  [ItemType.KURTA]: 400,
  [ItemType.PYJAMA]: 200,
  [ItemType.LADIES_UPPER]: 350,
  [ItemType.LADIES_LOWER]: 250,
  [ItemType.SALWAR]: 250,
  [ItemType.FABRIC_SUITING]: 0,
  [ItemType.FABRIC_SHIRTING]: 0,
  [ItemType.FABRIC_KURTA]: 0,
};

// 3. Distribution Percentages (MLM)
// All distributions follow: 30%, 20%, 10%, 10%, 5%, 5%, 5%, 5%, 5%, 5%
export const DISTRIBUTION_PERCENTAGES = [30, 20, 10, 10, 5, 5, 5, 5, 5, 5]; 
export const DOWNLINE_DISTRIBUTION_PERCENTAGES = [30, 20, 10, 10, 5, 5, 5, 5, 5, 5];
export const MAGIC_DISTRIBUTION_PERCENTAGES = [30, 20, 10, 10, 5, 5, 5, 5, 5, 5];

// 4. Initial Materials
export const INITIAL_MATERIALS: MaterialItem[] = [
  { id: 'M-001', name: 'White Thread (Reel)', category: 'ACCESSORY', quantity: 50, unit: 'pcs', minThreshold: 10, pricePerUnit: 15 },
  { id: 'M-002', name: 'Black Thread (Reel)', category: 'ACCESSORY', quantity: 45, unit: 'pcs', minThreshold: 10, pricePerUnit: 15 },
  { id: 'M-003', name: 'Fused Canvas (Hard)', category: 'FABRIC', quantity: 100, unit: 'mtr', minThreshold: 20, pricePerUnit: 80 },
  { id: 'M-004', name: 'Premium Buttons (Gold)', category: 'ACCESSORY', quantity: 500, unit: 'pcs', minThreshold: 100, pricePerUnit: 5 },
  { id: 'M-005', name: 'Lining Fabric (Black)', category: 'FABRIC', quantity: 120, unit: 'mtr', minThreshold: 30, pricePerUnit: 60 },
  { id: 'M-006', name: 'Collar Bone (Plastic)', category: 'ACCESSORY', quantity: 200, unit: 'pcs', minThreshold: 50, pricePerUnit: 2 },
  { id: 'M-007', name: 'Packing Bags (Large)', category: 'PACKING', quantity: 80, unit: 'pcs', minThreshold: 25, pricePerUnit: 12 },
];

// 5. Workers (Mock Data) - Added Upline Structure for Testing
const createWorker = (id: string, name: string, role: UserRole, dept: Department, mobile: string, uplineId?: string): Worker => ({
  id,
  name,
  role,
  department: dept,
  rating: 5.0,
  mobile,
  uplineId: uplineId, // Used for 10% distribution UP
  downlineCount: 0,
  walletMain: 0,
  walletToday: 0,
  walletStitching: 0,
  walletUpline: 0,
  walletDownline: 0,
  walletMagic: 0, 
  walletPerformance: 0,
  walletHold: 0,
  walletBooking: 0, // NEW: Admin Booking Wallet
  walletLabor: 0,   // NEW: Admin Labor Wallet
  walletProfit: 0,  // NEW: Admin Profit Wallet
  walletMonthly: 0,
  walletTotal: 0,
  walletWithdrawal: 0,
});

// Tree Structure for Demo:
// ADMIN -> CIVIL-MGR -> SHOW-01 -> MEASURE-01 -> CUT-01 -> SHIRT-01
// This creates a chain for testing the 10-level distribution.
export const MOCK_WORKERS: Worker[] = [
  createWorker('ADMIN', 'System Admin', UserRole.ADMIN, Department.CIVIL, '9999999999'),
  createWorker('CIVIL-MGR', 'Rajesh Manager', UserRole.CIVIL_MANAGER, Department.CIVIL, 'CIVIL-MGR', 'ADMIN'),
  
  // THE 12 PANELS (Chained for MLM Demo)
  createWorker('SHOW-01', 'Amit Showroom', UserRole.SHOWROOM, Department.CIVIL, 'SHOW-01', 'CIVIL-MGR'),
  createWorker('MEASURE-01', 'Master Ji', UserRole.CIVIL_MEASUREMENT, Department.CIVIL, 'MEASURE-01', 'SHOW-01'),
  createWorker('CUT-01', 'Suresh Cutting', UserRole.CIVIL_CUTTING_MASTER, Department.CIVIL, 'CUT-01', 'MEASURE-01'),
  createWorker('MAT-01', 'Ramesh Store', UserRole.CIVIL_MATERIAL, Department.CIVIL, 'MAT-01', 'CUT-01'),
  
  // Makers
  createWorker('SHIRT-01', 'Abdul Shirt', UserRole.CIVIL_SHIRT_MAKER, Department.CIVIL, 'SHIRT-01', 'MAT-01'),
  createWorker('PANT-01', 'John Pant', UserRole.CIVIL_PANT_MAKER, Department.CIVIL, 'PANT-01', 'SHIRT-01'),
  createWorker('COAT-01', 'Vikram Coat', UserRole.CIVIL_COAT_MAKER, Department.CIVIL, 'COAT-01', 'PANT-01'),
  createWorker('KURTA-01', 'Salman Kurta', UserRole.CIVIL_KURTA_MAKER, Department.CIVIL, 'KURTA-01', 'COAT-01'),
  
  // Finishers
  createWorker('BTN-01', 'Geeta Button', UserRole.CIVIL_KAJ_BUTTON, Department.CIVIL, 'BTN-01', 'KURTA-01'),
  createWorker('PRESS-01', 'Mohan Press', UserRole.CIVIL_PRESS, Department.CIVIL, 'PRESS-01', 'BTN-01'),
  createWorker('FIN-01', 'Sanjay Finish', UserRole.CIVIL_FINISHING, Department.CIVIL, 'FIN-01', 'PRESS-01'),
  createWorker('DEL-01', 'Raju Delivery', UserRole.CIVIL_DELIVERY, Department.CIVIL, 'DEL-01', 'FIN-01'),
  
  // Readymade Manager
  createWorker('RM-MGR', 'RM Manager', UserRole.RM_MANAGER, Department.READYMADE, 'RM-MGR', 'ADMIN'),
];

// 6. Orders - RESET TO EMPTY
export const MOCK_ORDERS: Order[] = [];

// 7. Rate Helper - UPDATED WITH NEW RATES
export const getWorkerRate = (role: UserRole, itemType: ItemType, totalCost: number): number => {
    
    // Showroom (Booking)
    if (role === UserRole.SHOWROOM) return 20; 
    
    // Measurement: Shirt 20, Pant 25
    if (role === UserRole.CIVIL_MEASUREMENT) {
        return itemType === ItemType.PANT ? 25 : 20;
    }

    // Cutting: Coat 100, Pant 30, Shirt/Other 25
    if (role === UserRole.CIVIL_CUTTING_MASTER) {
        if (itemType === ItemType.COAT || itemType === ItemType.SUIT || itemType === ItemType.SHERVANI) return 100;
        if (itemType === ItemType.PANT) return 30;
        return 25; 
    }

    // Makers (Stitching)
    if (role === UserRole.CIVIL_PANT_MAKER) return 230;
    if (role === UserRole.CIVIL_SHIRT_MAKER) return 130;
    if (role === UserRole.CIVIL_COAT_MAKER) return 800;
    if (role === UserRole.CIVIL_KURTA_MAKER) return 150;

    // Finishing Line
    if (role === UserRole.CIVIL_KAJ_BUTTON) return 10;
    if (role === UserRole.CIVIL_PRESS) return 10;
    if (role === UserRole.CIVIL_FINISHING) return 15;
    if (role === UserRole.CIVIL_DELIVERY) return 5;
    
    return 0;
};
