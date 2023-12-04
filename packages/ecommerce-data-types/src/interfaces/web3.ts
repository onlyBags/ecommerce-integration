export interface Payment {
  id: string;
  orderID: string;
  amount: string;
  beneficiary: string;
  buyer: string;
  transactionHash: string;
  dataSource: number;
}

export interface GraphPaymentData {
  payments: Payment[];
}
