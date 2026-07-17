'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mypageMenuByRole } from '@/lib/mypage-permissions';
import type { User } from '@/types';

export default function MypageSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  if (!user.role) return null;

  const menu = mypageMenuByRole[user.role] || [];

  return (
    <div className="bg-[#FFFEFB] rounded-sm shadow-sm border border-[#E2DACD] overflow-hidden">
      <div className="hidden lg:block p-4 bg-[#F2EEE6] border-b border-[#E2DACD] font-bold text-[#17251F]">
        나의 메뉴
      </div>
      <ul className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar divide-x lg:divide-x-0 divide-[#E2DACD] lg:divide-y lg:flex-col">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0 snap-start lg:w-full">
              <Link 
                href={item.href} 
                className={`flex items-center justify-center gap-2 px-5 py-4 lg:p-4 text-[14px] lg:text-sm transition-colors whitespace-nowrap
                  ${isActive ? 'bg-[#F8F6F0] text-[#16382D] font-bold border-b-2 border-b-[#16382D] lg:border-b-0 lg:border-l-2 lg:border-l-[#16382D]' : 'text-[#6F756F] hover:bg-[#F8F6F0] hover:text-[#17251F] border-b-2 border-b-transparent lg:border-b-0 lg:border-l-2 lg:border-l-transparent'}`}
              >
                <Icon className={`size-4 ${isActive ? 'text-[#16382D]' : 'text-[#6F756F]'}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
