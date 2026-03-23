import type { Address, AddressInput } from "@larimar/types";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

function mapAddress(row: Record<string, unknown>): Address {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    fullName: String(row.full_name),
    phone: String(row.phone),
    country: String(row.country),
    city: String(row.city),
    state: String(row.state),
    postalCode: String(row.postal_code),
    streetAddress: String(row.street_address),
    apartment: row.apartment ? String(row.apartment) : null,
    isDefault: Boolean(row.is_default),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

async function clearDefaultAddress(userId: string) {
  const { error } = await supabaseAdmin()
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);

  if (error) {
    throw new ApiError(500, "address_update_failed", "Unable to update default address.", error);
  }
}

export async function listAddresses(userId: string) {
  const { data, error } = await supabaseAdmin()
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(500, "address_fetch_failed", "Unable to load addresses.", error);
  }

  return (data ?? []).map(mapAddress);
}

export async function getAddressById(userId: string, addressId: string) {
  const { data, error } = await supabaseAdmin()
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("id", addressId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, "address_fetch_failed", "Unable to load the address.", error);
  }

  if (!data) {
    throw new ApiError(404, "address_not_found", "Address not found.");
  }

  return mapAddress(data);
}

export async function createAddress(userId: string, input: AddressInput) {
  const existingAddresses = await listAddresses(userId);
  const shouldBeDefault = input.isDefault || existingAddresses.length === 0;

  if (shouldBeDefault) {
    await clearDefaultAddress(userId);
  }

  const { data, error } = await supabaseAdmin()
    .from("addresses")
    .insert({
      user_id: userId,
      full_name: input.fullName,
      phone: input.phone,
      country: input.country,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      street_address: input.streetAddress,
      apartment: input.apartment,
      is_default: shouldBeDefault,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "address_create_failed", "Unable to create the address.", error);
  }

  return mapAddress(data);
}

export async function updateAddress(userId: string, addressId: string, input: AddressInput) {
  await getAddressById(userId, addressId);

  if (input.isDefault) {
    await clearDefaultAddress(userId);
  }

  const { data, error } = await supabaseAdmin()
    .from("addresses")
    .update({
      full_name: input.fullName,
      phone: input.phone,
      country: input.country,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      street_address: input.streetAddress,
      apartment: input.apartment,
      is_default: input.isDefault,
    })
    .eq("user_id", userId)
    .eq("id", addressId)
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "address_update_failed", "Unable to update the address.", error);
  }

  return mapAddress(data);
}

export async function deleteAddress(userId: string, addressId: string) {
  const current = await getAddressById(userId, addressId);
  const { error } = await supabaseAdmin()
    .from("addresses")
    .delete()
    .eq("user_id", userId)
    .eq("id", addressId);

  if (error) {
    throw new ApiError(500, "address_delete_failed", "Unable to delete the address.", error);
  }

  if (current.isDefault) {
    const addresses = await listAddresses(userId);
    const nextDefault = addresses.find((address) => address.id !== addressId);

    if (nextDefault) {
      await setDefaultAddress(userId, nextDefault.id);
    }
  }
}

export async function setDefaultAddress(userId: string, addressId: string) {
  await getAddressById(userId, addressId);
  await clearDefaultAddress(userId);

  const { data, error } = await supabaseAdmin()
    .from("addresses")
    .update({ is_default: true })
    .eq("user_id", userId)
    .eq("id", addressId)
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "address_update_failed", "Unable to set the default address.", error);
  }

  return mapAddress(data);
}
