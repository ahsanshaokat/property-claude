import { City } from '@/data/model/city';

export type CompanyFormHelpers = {
  cities: City[];
};

export type CompanyFormFields = {
  name: string;
  address?: string;
  website?: string;
  userId: number;
};
