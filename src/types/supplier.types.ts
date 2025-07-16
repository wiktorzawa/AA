export interface Supplier {
  id: number;
  documentId: string;
  supplierId: string;
  companyName: string;
  nip: string;
  email: string;
  contactFirstName?: string;
  contactLastName?: string;
  phone?: string;
  website?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
