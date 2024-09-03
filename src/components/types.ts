export interface Client {
    id: string;
    name: string;
    joinDate: string;
    lastPaymentDate: string;
    isCheckedIn?: boolean;
  }