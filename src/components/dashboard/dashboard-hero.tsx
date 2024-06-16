'use client';

import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import useAuth from '@/hooks/use-auth';

export default function DashboardHero() {
  const { user, unauthorize } = useAuth();
  return (
    <div className="mt-8 flex items-center justify-between lg:mt-12 2xl:mt-16">
      <div>
        <Text tag="h3" className="text-xl">
          {user.displayName}
        </Text>
        <Text className="mt-2 text-sm text-gray lg:mt-3">{user.email}</Text>
      </div>
      <div></div>
    </div>
  );
}
