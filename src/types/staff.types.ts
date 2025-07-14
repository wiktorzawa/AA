export interface Staff {
  id: number;
  attributes: {
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
  };
}
