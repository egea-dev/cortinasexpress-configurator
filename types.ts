export interface CurtainType {
  id: string;
  label: string;
  pricePerM2: number;
  description: string;
}

export interface Measurement {
  id: number;
  width: number;
  height: number;
  price: number;
  type: CurtainType | null;
  quantity: number;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  razonSocial: string; // Nuevo campo obligatorio
  cif: string;        // Nuevo campo obligatorio
  goal: 'info' | 'simulation';
}

export interface OrderData {
  customer_info: FormData;
  measurements: Measurement[];
  selected_type: CurtainType;
  total_price: number;
  total_units: number;
}