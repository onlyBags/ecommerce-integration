export type IcePriceResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
      USD: {
        price: number;
        last_updated: string;
      };
    };
  };
};
