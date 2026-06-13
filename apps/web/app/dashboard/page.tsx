'use server';

import { toast } from 'sonner';
import { getReconsAction } from '../actions/getRecons';
import { DashboardClientComp } from '@/components/Dashboard-ClientComp.tsx/Dashboard-ClientComp';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ search?: string }> }) {

  const response = await getReconsAction();
  const search = (await searchParams).search ?? null;
  if (response.error) {
    toast.error(response.error);
  }
  const email = response.email ?? "example@gmail.com";
  const userFullName = response.userFullName ?? "example user";



  return <DashboardClientComp recons={response.data} email={email} userFullName={userFullName} searchQuery={search} />
}
