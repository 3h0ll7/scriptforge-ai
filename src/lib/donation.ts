/** Wallet that receives voluntary donations. Support buttons stay hidden until `address` is set. */
export const donation = {
  asset: "USDT",
  network: "BNB Smart Chain (BEP20)",
  address: "",
};

export const isValidBep20Address = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

export const donationEnabled = isValidBep20Address(donation.address);
