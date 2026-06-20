'use server';

import { getReconsAction } from '../actions/getRecons';
import { DashboardClientComp } from '@/components/Dashboard-ClientComp.tsx/Dashboard-ClientComp';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ search?: string }> }) {

  const response = await getReconsAction();
  const search = (await searchParams).search ?? null;

  if (response.error) {
    return response.error;
  }
  const email = response.email ?? "example@gmail.com";
  const name = response.name ?? "example user";



  return <DashboardClientComp recons={response.data} email={email} name={name} searchQuery={search} />
}
