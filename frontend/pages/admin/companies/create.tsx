import AdminLayout from '@/components/layouts/AdminLayout';
import CompanyCreate from '@/components/admin/companies/CompanyCreate';
import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';
import { getUsers } from '@/data/api/user'; // API function to fetch users
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Auth configuration for NextAuth
import { unstable_getServerSession } from 'next-auth'; // To fetch session details

type CreateCompanyProps = {
  users: { id: number; firstName: string; lastName: string }[]; // Define the user structure
};

const CreateCompany: NextPageWithLayout<CreateCompanyProps> = ({ users }) => {
  return <CompanyCreate data={{ users }} />; // Pass the users to the CompanyCreate component
};

CreateCompany.getLayout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    // Fetch session details including the token
    const session = await unstable_getServerSession(req, res, authOptions);
    let users = [];

    if (session) {
      const token = `${(session as any)?.access_token}`; // Access token from the session
      const role = `${(session as any)?.role}`; // Role from the session
      
      // Check if the user is admin, otherwise return 404
      if (role !== 'admin') {
        return {
          notFound: true,
        };
      }

      // Fetch users by passing the token
      const usersResults = await getUsers(token);
      users = usersResults.data || [];
    }

    return {
      props: {
        users, // Pass the users as props
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      notFound: true,
    };
  }
};

export default CreateCompany;
