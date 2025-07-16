export interface Staff {
  id: number;
  documentId: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate?: string;
  terminationDate?: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
