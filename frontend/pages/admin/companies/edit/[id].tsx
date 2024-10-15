import AdminLayout from '@/components/layouts/AdminLayout';
import CompanyEditForm from '@/components/admin/companies/CompanyEditForm';
import { getCompanyDetails } from '@/data/api/company'; // Assuming you have a function to fetch company details
import { Company } from '@/data/model/company'; // Company model
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';

type CompanyProps = {
  company: Company;
};

const EditCompany: NextPageWithLayout<CompanyProps> = ({ company }) => {
  return <CompanyEditForm companyData={company} data={{ cities: [] }} />;
};

EditCompany.getLayout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { id } = query;
    const response = await getCompanyDetails(Number(id)); // Fetch the company data
    const company = response?.data; // Assuming the company data is in the response data
    
    // Serialize only the company data
    const serializedCompany = JSON.parse(JSON.stringify(company)); // Ensure serialization-safe data
    
    return { props: { company: serializedCompany } };
  } catch (error) {
    console.error("Error fetching company data:", error);
    return {
      notFound: true,
    };
  }
};

export default EditCompany;
