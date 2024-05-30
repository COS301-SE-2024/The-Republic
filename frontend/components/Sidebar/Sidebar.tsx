'use client'

import React from 'react';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarList = [
    {
      group: 'General',
      items: [
        { link: '/', text: 'Home' },
        { link: '/notifications', text: 'Notifications' },
        { link: '/reports', text: 'View Reports' },
        { link: '/visualizations', text: 'Visualizations' },
        { link: '/profile', text: 'Profile' },
      ],
    },
  ];

  return (
    <div className="w-[300px] border-r min-h-80vh">
      <div className="grow">
        <Command className="shadow-md">
          <CommandList>
            {sidebarList.map((menu, key) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((option, optionKey) => (
                  <CommandItem
                    key={optionKey}
                    className={`flex gap-2 cursor-pointer ${
                      pathname === option.link ? 'bg-gray-200' : ''
                    }`}
                    onSelect={() => router.push(option.link)}
                  >
                    {option.text}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default Sidebar;
