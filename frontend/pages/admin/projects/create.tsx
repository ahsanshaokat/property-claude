import AdminLayout from '@/components/layouts/AdminLayout';
import ProjectCreate from '@/components/admin/projects/ProjectCreate';
import { getCompanies } from '@/data/api/company'; // Fetching companies
import { Company } from '@/data/model/company'; // Assuming you have a company model
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';

type CreateProjectProps = {
  companies: Company[]; // Passing companies as props
};

const CreateProject: NextPageWithLayout<CreateProjectProps> = ({ companies }) => {
  return <ProjectCreate companies={companies} data={undefined} />;
};

CreateProject.getLayout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetching companies to pass to the ProjectCreate component
    const companiesResult = await getCompanies();
    const companies = companiesResult?.data || [];

    return {
      props: {
        companies: companies || [], // Always pass an empty array if no data
      },
    };
  } catch (error) {
    console.error("Failed to fetch companies", error);
    return {
      props: {
        companies: [], // Fallback to an empty array in case of error
      },
    };
  }
};

export default CreateProject;
