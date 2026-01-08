
import { Order, OrderStatus, UserRole, ItemType, Department } from "../types";

// --- CORE HANDOVER LOGIC ---
// This function tells the system "Who comes next?" based on current role and item type.
export const getNextRole = (currentRole: UserRole, status: OrderStatus, itemType: ItemType): UserRole | null => {
  
  // 1. SHOWROOM / ADMIN -> MEASUREMENT
  if (currentRole === UserRole.SHOWROOM || currentRole === UserRole.CIVIL_MANAGER || currentRole === UserRole.ADMIN) {
      return UserRole.CIVIL_MEASUREMENT;
  }
  
  // 2. MEASUREMENT -> CUTTING
  if (currentRole === UserRole.CIVIL_MEASUREMENT) {
      return UserRole.CIVIL_CUTTING_MASTER;
  }
  
  // 3. CUTTING -> MAKER (Based on Item)
  if (currentRole === UserRole.CIVIL_CUTTING_MASTER) {
      if (itemType === ItemType.COAT || itemType === ItemType.SUIT || itemType === ItemType.SAFARI || itemType === ItemType.SHERVANI) {
          return UserRole.CIVIL_COAT_MAKER;
      }
      if (itemType === ItemType.PANT || itemType === ItemType.PYJAMA || itemType === ItemType.LADIES_LOWER || itemType === ItemType.SALWAR) {
          return UserRole.CIVIL_PANT_MAKER;
      }
      if (itemType === ItemType.KURTA || itemType === ItemType.FABRIC_KURTA) {
          return UserRole.CIVIL_KURTA_MAKER;
      }
      return UserRole.CIVIL_SHIRT_MAKER;
  }

  // 4. SPECIAL CASE: PANT MAKER -> PRESS
  // (Updated Requirement: Pant Maker work should show to Press directly)
  if (currentRole === UserRole.CIVIL_PANT_MAKER || currentRole === UserRole.RM_PANT_KARIGAR) {
      return UserRole.CIVIL_PRESS;
  }

  // 5. OTHER MAKERS -> KAJ BUTTON
  // (Shirts/Kurtas still typically go to Buttoning first)
  if (currentRole === UserRole.CIVIL_SHIRT_MAKER || 
      currentRole === UserRole.CIVIL_KURTA_MAKER || 
      currentRole === UserRole.RM_SHIRT_KARIGAR) {
      return UserRole.CIVIL_KAJ_BUTTON;
  }

  // 6. COAT MAKER -> FINISHING
  if (currentRole === UserRole.CIVIL_COAT_MAKER) {
      return UserRole.CIVIL_FINISHING;
  }

  // 7. KAJ BUTTON -> PRESS
  if (currentRole === UserRole.CIVIL_KAJ_BUTTON || currentRole === UserRole.RM_KAJ_BUTTON) {
      return UserRole.CIVIL_PRESS;
  }

  // 8. PRESS -> FINISHING / DELIVERY
  if (currentRole === UserRole.CIVIL_PRESS || currentRole === UserRole.RM_PRESS) {
      // Usually goes to finishing check, but if you want direct delivery flow, 
      // we can keep it to finishing first to ensure quality.
      return UserRole.CIVIL_FINISHING;
  }

  // 9. FINISHING -> DELIVERY
  if (currentRole === UserRole.CIVIL_FINISHING) {
      return UserRole.CIVIL_DELIVERY;
  }

  // 10. DELIVERY -> SHOWROOM (Loop Close)
  if (currentRole === UserRole.CIVIL_DELIVERY || currentRole === UserRole.RM_DELIVERY) {
      return UserRole.SHOWROOM;
  }

  return null;
};

export const getOrdersForRole = (orders: Order[], role: UserRole): Order[] => {
  if (role === UserRole.ADMIN) return orders;

  const isCivilRole = role.startsWith('CIVIL') || role === UserRole.SHOWROOM;
  const deptOrders = orders.filter(o => isCivilRole ? o.department === Department.CIVIL : o.department === Department.READYMADE);

  if (role === UserRole.RM_MANAGER || role === UserRole.CIVIL_MANAGER) return deptOrders;

  return deptOrders.filter(o => {
    // 1. INBOX: Orders sent TO me (In Transit) or Accepted by me (Completed handover)
    if (o.targetRole === role && (o.handoverStatus === 'IN_TRANSIT' || o.handoverStatus === 'COMPLETED')) return true;
    
    // 2. DRAFT/SELF: Orders I created
    if (o.creatorRole === role && (o.handoverStatus === 'DRAFT' || o.handoverStatus === 'IN_TRANSIT')) return true;
    
    // 3. SENT: Orders I sent to someone else (Tracking)
    if (o.lastSenderId === role) return true;

    return false;
  });
};

export const getNextStatus = (current: OrderStatus, itemType: ItemType): OrderStatus => {
  // Simple status progression for labels
  if (current === OrderStatus.DRAFT) return OrderStatus.PENDING_APPROVAL;
  if (current === OrderStatus.MEASUREMENT_DONE) return OrderStatus.CUTTING_PENDING;
  if (current === OrderStatus.CUTTING_PENDING) return OrderStatus.SEWING_PENDING;
  if (current === OrderStatus.SEWING_PENDING) return OrderStatus.PRESS_PENDING; // Updated
  return current;
};
