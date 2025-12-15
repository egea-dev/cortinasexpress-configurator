import { createClient } from '@supabase/supabase-js';
import { OrderData } from '../types';

// NOTE: In a real project, use import.meta.env.VITE_SUPABASE_URL
// For this demo, we check if they exist, otherwise we mock the client to prevent runtime crashes if keys are missing.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const submitOrder = async (orderData: OrderData) => {
  // If keys are missing, throw a helpful error
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
     console.warn("Supabase keys missing. Simulating success for UI demo.");
     await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
     return { data: { id: 'simulated-id' }, error: null };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_info: orderData.customer_info,
        measurements: orderData.measurements,
        selected_type: orderData.selected_type,
        total_price: orderData.total_price,
        status: 'pending'
      }
    ])
    .select();

  return { data, error };
};