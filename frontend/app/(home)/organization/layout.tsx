'use client';

import { useParams, usePathname } from 'next/navigation';
import { useOrganizations } from '@/lib/contexts/OrganizationProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { organizations } = useOrganizations();
  const pathname = usePathname();
  const router = useRouter();
  const id = Number(params.id);

  useEffect(() => {
    const organization = organizations.find(org => org.id === id);
    if (organization) {
      const isAdminPage = pathname.endsWith('/admin');
      if (isAdminPage && !organization.isAdmin) {
        router.push(`/organization/${id}`);
      } else if (!isAdminPage && organization.isAdmin) {
        
      }
    }
  }, [id, organizations, pathname, router]);

  return <>{children}</>;
}
