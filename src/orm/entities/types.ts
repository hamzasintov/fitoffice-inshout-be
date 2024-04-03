export type Carrier = 'UPS' | 'USPS' | 'FedEx' | 'DHL' | 'Amazon' | 'OnTrac';
export type PackageStatus =
  | 'Incoming'
  | 'Outgoing'
  | 'In Transit'
  | 'Delivered';
export type PackageCondition = 'Good' | 'Moderate' | 'Damaged';
