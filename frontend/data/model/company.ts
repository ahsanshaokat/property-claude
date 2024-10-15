export interface Company {
    id: number;
    name: string;
    description: string;
    address: string;
    website: string;
    phoneNumber: string | null;
    companyImages?: Image[]; // Assuming you have a similar image structure
  }
  
  export interface CompanyResponse {
    companyImages: any;
    name: string;
    description: any;
    success: boolean;
    data: Company;
  }
  
  export interface Image {
    id: number;
    type: string;
    size: string;
    image_url: string;
  }