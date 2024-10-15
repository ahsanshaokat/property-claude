import AdminLayout from '@/components/layouts/AdminLayout';
import AdminCompanyList from '@/components/admin/companies/AdminCompanyList';
import React, { ReactElement } from 'react';
import { getCompanies } from '@/data/api/company';
import { Company } from '@/data/model/company';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

type CompanyProps = {
  companies: Company[];
};

const Companies: NextPageWithLayout<CompanyProps> = ({ companies }) => {
  return <AdminCompanyList data={companies} />;
};

Companies.getLayout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await getCompanies();
  return { props: { companies: data } };
};

export default Companies;
