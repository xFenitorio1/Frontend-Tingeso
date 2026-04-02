export interface Package {
  id: string;
  title: string;
  destination: string;
  description: string;
  basePrice: number;
  spotsTotal: number;
  spotsLeft: number;
  imageUrl: string;
  includes: string[];
  status: 'Active' | 'Sold Out' | 'Draft';
}

export interface Sale {
  id: string;
  customerName: string;
  packageId: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Cancelled' | 'Pending';
}
