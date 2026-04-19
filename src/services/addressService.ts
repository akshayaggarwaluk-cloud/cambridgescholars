import { supabase } from "@/integrations/supabase/client";
import { getAccessToken } from "@/services/authService";

export interface Address {
  id: string;
  address_type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company: string | null;
  country: string;
  street_address: string;
  street_address_2: string | null;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  is_default: boolean;
}

export interface AddressInput {
  address_type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company?: string | null;
  country: string;
  street_address: string;
  street_address_2?: string | null;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  is_default?: boolean;
}

async function callAddressEndpoint(
  action: string,
  userId: string,
  additionalData?: Record<string, unknown>
): Promise<{ data?: Address | Address[]; error?: string }> {
  const token = getAccessToken();
  if (!token) {
    return { error: "Not authenticated" };
  }

  try {
    const { data, error } = await supabase.functions.invoke("manage-addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action,
        user_id: userId,
        ...additionalData,
      },
    });

    if (error) {
      console.error("Address endpoint error:", error);
      return { error: error.message || "Failed to perform address operation" };
    }

    if (data?.error) {
      return { error: data.error };
    }

    return { data: data?.data };
  } catch (err) {
    console.error("Address service error:", err);
    return { error: "Network error. Please try again." };
  }
}

export async function listAddresses(userId: string): Promise<{ data?: Address[]; error?: string }> {
  return callAddressEndpoint("list", userId) as Promise<{ data?: Address[]; error?: string }>;
}

export async function createAddress(
  userId: string,
  address: AddressInput
): Promise<{ data?: Address; error?: string }> {
  return callAddressEndpoint("create", userId, { address }) as Promise<{ data?: Address; error?: string }>;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  address: AddressInput
): Promise<{ data?: Address; error?: string }> {
  return callAddressEndpoint("update", userId, { address_id: addressId, address }) as Promise<{ data?: Address; error?: string }>;
}

export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<{ success?: boolean; error?: string }> {
  const result = await callAddressEndpoint("delete", userId, { address_id: addressId });
  if (result.error) {
    return { error: result.error };
  }
  return { success: true };
}
