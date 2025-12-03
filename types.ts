
export interface Article {
  id: number | string;
  title: string;
  content: string[];
}

export interface ClientDetails {
  fullName: string;
  phone: string;
  cin: string;
  guardianFor: string;
  selectedProgram?: string;
  discount?: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  details: string[];
  ice: string;
}
