'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { shopCategoryFilters } from '@/data/shopFilters';
import { getCartCount } from '@/lib/cart';
import { getCurrentUser, getPublicBrands, logout } from '@/lib/storage';
import { useMounted } from '@/lib/useMounted';
import BrandMark from './BrandMark';

const MAIN_LINKS = [
  { label: '브랜??, href: '/brands' },
  { label: '케??, href: '/concerns' },
  { label: '?�보??, href: '/insurance' },
  { label: 'B2B', href: '/b2b' },
];

const DESKTOP_NAV_TEXT_CLASS =
  'relative inline-flex h-[68px] items-center gap-[5px] whitespace-nowrap text-[15px] font-medium tracking-[-0.015em] text-[#505650] transition-colors duration-300 hover:text-[#172820]';

const DESKTOP_NAV_ACTIVE_CLASS =
  'font-semibold text-[#172820] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#172820] after:content-[""]';

const UTILITY_ICON_CLASS = "relative inline-flex size-[36px] items-center justify-center rounded-full bg-transparent p-0 text-[#485049] transition-colors duration-300 hover:bg-[#F1EEE7] hover:text-[#172820]";
const ADMIN_BADGE_CLASS = "mx-[4px] inline-flex h-[34px] items-center justify-center rounded-full border border-[#E2DDD2] bg-[#F5F2EB] px-[13px] text-[13px] font-semibold text-[#475248] transition-colors duration-300 hover:bg-[#EAE5D9]";
const LOGOUT_CLASS = "m-0 inline-flex h-[36px] items-center px-[7px] text-[13px] font-medium text-[#777B76] transition-colors duration-300 hover:text-[#172820]";

const STORY_LINKS = [
  { label: '검�?기�?', description: '백조 Audit????가지 ?�인 기�?', href: '/audit' },
  { label: '?�문가 칼럼', description: '건강�??�활???�피???�문가???�선', href: '/experts' },
  { label: '보호???�기', description: '먼�? 경험??보호?�들??기록', href: '/reviews' },
  { label: '?�식', description: '백조?�브?�의 ?�로???�비?��? ?�내', href: '/notices' },
];

const SHOP_LINKS = {
  categories: shopCategoryFilters.map((category) => ({
    label: category.label,
    href: `/shop?category=${category.slug}`,
  })),
};

const subscribeToCart = (callback: () => void) => {
  window.addEventListener('cart-updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('cart-updated', callback);
    window.removeEventListener('storage', callback);
  };
};

type MobilePanel = 'shop' | 'story' | null;

export default function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const [brandLinks, setBrandLinks] = useState<Array<{ label: string; href: string }>>([]);
  const cartCount = useSyncExternalStore(subscribeToCart, getCartCount, () => 0);
  const currentUser = mounted ? getCurrentUser() : null;

  useEffect(() => {
    getPublicBrands()
      .then((list) =>
        setBrandLinks(
          list
            .filter((brand) => brand.isVisible !== false)
            .map((brand) => ({
              label: brand.name.split(' (')[0],
              href: `/brands/${brand.id}`,
            })),
        ),
      )
      .catch(() => {});
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const storyActive = STORY_LINKS.some((link) => isActive(link.href));

  const closeMenu = () => {
    setMenuOpen(false);
    setMobilePanel(null);
  };

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E9E5DC] bg-[#FCFBF7] lg:h-[68px]">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-5 lg:h-[68px] lg:w-[calc(100%-32px)] lg:max-w-[1160px] lg:justify-start lg:gap-0 lg:px-0 xl:w-[calc(100%-40px)] xl:max-w-[1180px]">
        <Link href="/" aria-label="백조?�브???? className="flex-none items-center p-0 m-0 text-[#17211D] lg:inline-flex lg:w-[158px] xl:w-[174px]" onClick={closeMenu}>
          <BrandMark />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden h-full w-auto flex-none items-center justify-start lg:flex lg:ml-[32px] lg:gap-[22px] xl:ml-[42px] xl:gap-[28px]">
          <div className="group relative flex h-full items-center">
            <Link
              href="/shop"
              aria-current={isActive('/shop') ? 'page' : undefined}
              className={`${DESKTOP_NAV_TEXT_CLASS} ${
                isActive('/shop') ? DESKTOP_NAV_ACTIVE_CLASS : ''
              }`}
            >
              ?�?�션
              <ChevronDown className="size-3.5 transition-transform duration-500 group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="absolute left-1/2 top-full z-40 hidden w-[520px] -translate-x-1/2 overflow-hidden rounded-b-3xl border border-[#E7E0D5] bg-white shadow-[0_24px_60px_-24px_rgba(23,33,29,0.18)] group-hover:block group-focus-within:block">
              <div className="grid grid-cols-2 gap-8 p-8">
                <DropdownColumn title="브랜?�로 ?�러보기" links={brandLinks} />
                <DropdownColumn title="?�요??것으�?찾기" links={SHOP_LINKS.categories} />
              </div>
              <Link
                href="/shop"
                className="flex items-center justify-between border-t border-[#E7E0D5] bg-[#FAF8F3] px-8 py-4 text-sm font-semibold text-[#17211D] transition-colors duration-500 hover:bg-[#F3EEE6]"
              >
                백조?�브???�?�션 모두 보기
                <span aria-hidden="true">??/span>
              </Link>
            </div>
          </div>

          {MAIN_LINKS.slice(0, 3).map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} />
          ))}

          <div className="group relative flex h-full items-center">
            <button
              type="button"
              aria-label="백조 ?�브??메뉴"
              className={`${DESKTOP_NAV_TEXT_CLASS} cursor-pointer ${
                storyActive ? DESKTOP_NAV_ACTIVE_CLASS : ''
              }`}
            >
              백조 ?�브??              <ChevronDown className="size-3.5 transition-transform duration-500 group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="absolute right-0 top-full z-40 hidden w-80 overflow-hidden rounded-b-3xl border border-[#E7E0D5] bg-white p-3 shadow-[0_24px_60px_-24px_rgba(23,33,29,0.18)] group-hover:block group-focus-within:block">
              {STORY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 transition-colors duration-500 hover:bg-[#FAF8F3]"
                >
                  <span className="block text-sm font-semibold text-[#17211D]">{link.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#6F766F]">{link.description}</span>
                </Link>
              ))}
            </div>
          </div>

          <NavLink {...MAIN_LINKS[3]} active={isActive(MAIN_LINKS[3].href)} />
        </nav>

        <div className="flex w-auto flex-none items-center justify-end gap-[4px] whitespace-nowrap lg:ml-auto">
          <Link
            href="/shop?focus=search"
            aria-label="?�품 검??
            className={`hidden md:inline-flex mr-[4px] ${UTILITY_ICON_CLASS}`}
          >
            <Search className="size-[19px]" />
          </Link>
          {currentUser ? (
            <>
              {(currentUser.role === 'admin' || currentUser.email === 'admin@naver.com') && (
                <Link
                  href="/admin"
                  aria-label="최고관리자"
                  className={`hidden md:inline-flex ${ADMIN_BADGE_CLASS}`}
                >
                  최고관리자
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                aria-label="로그?�웃"
                className={`hidden md:inline-flex ${LOGOUT_CLASS}`}
              >
                로그?�웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="로그??
              className={`hidden md:inline-flex ${UTILITY_ICON_CLASS}`}
            >
              <LogIn className="size-[19px]" />
            </Link>
          )}
          <Link
            href="/mypage"
            aria-label="마이?�이지"
            className={`hidden md:inline-flex ${UTILITY_ICON_CLASS}`}
          >
            <User className="size-[19px]" />
          </Link>
          <Link
            href="/cart"
            aria-label={`?�바구니, ?�품 ${cartCount}�?}
            className={UTILITY_ICON_CLASS}
          >
            <ShoppingBag className="size-[19px]" />
            {cartCount > 0 && (
              <span className="absolute -right-[1px] top-0 flex min-w-[17px] h-[17px] items-center justify-center rounded-full bg-[#172820] px-1 text-[10px] font-bold leading-none text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? '메뉴 ?�기' : '메뉴 ?�기'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`lg:hidden ${UTILITY_ICON_CLASS}`}
          >
            {menuOpen ? <X className="size-[19px]" /> : <Menu className="size-[19px]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="?�체 메뉴"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#E7E0D5] bg-white px-4 pb-8 pt-4 lg:hidden"
        >
          <div className="mx-auto flex max-w-lg flex-col">
            <MobileAccordion
              title="?�?�션"
              open={mobilePanel === 'shop'}
              active={isActive('/shop')}
              onToggle={() => setMobilePanel((panel) => (panel === 'shop' ? null : 'shop'))}
            >
              <Link href="/shop" onClick={closeMenu} className="text-sm font-semibold text-[#17211D]">
                ?�?�션 모두 보기
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {SHOP_LINKS.categories.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className="text-sm text-[#6F766F]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            {MAIN_LINKS.slice(0, 3).map((link) => (
              <MobileLink key={link.href} {...link} active={isActive(link.href)} onClick={closeMenu} />
            ))}

            <MobileAccordion
              title="백조 ?�브??
              open={mobilePanel === 'story'}
              active={storyActive}
              onToggle={() => setMobilePanel((panel) => (panel === 'story' ? null : 'story'))}
            >
              <div className="space-y-3">
                {STORY_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className="block">
                    <span className="block text-sm font-semibold text-[#17211D]">{link.label}</span>
                    <span className="mt-0.5 block text-xs text-[#6F766F]">{link.description}</span>
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            <MobileLink {...MAIN_LINKS[3]} active={isActive(MAIN_LINKS[3].href)} onClick={closeMenu} />

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E7E0D5] pt-5">
              <Link href={currentUser ? '/mypage' : '/login'} onClick={closeMenu} className="btn-secondary min-h-11 px-4">
                {currentUser ? '???�보 보기' : '로그??}
              </Link>
              <Link href="/cart" onClick={closeMenu} className="btn-secondary min-h-11 px-4">
                ?�바구니 {cartCount > 0 ? `${cartCount}` : ''}
              </Link>
              {(currentUser?.role === 'admin' || currentUser?.email === 'admin@naver.com') && (
                <Link href="/admin" onClick={closeMenu} className="btn-secondary min-h-11 px-4 col-span-2">
                  최고관리자 ?�이지
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

interface NavLinkProps {
  label: string;
  href: string;
  active: boolean;
}

function NavLink({ label, href, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`${DESKTOP_NAV_TEXT_CLASS} ${
        active ? DESKTOP_NAV_ACTIVE_CLASS : ''
      }`}
    >
      {label}
    </Link>
  );
}

interface DropdownColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

function DropdownColumn({ title, links }: DropdownColumnProps) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold tracking-wider text-[#A8742E]">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-[#6F766F] transition-colors duration-500 hover:text-[#17211D]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface MobileLinkProps {
  label: string;
  href: string;
  active: boolean;
  onClick: () => void;
}

function MobileLink({ label, href, active, onClick }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors duration-500 ${
        active ? 'bg-[#F3EEE6] text-[#17211D]' : 'text-[#6F766F] hover:bg-[#FAF8F3] hover:text-[#17211D]'
      }`}
    >
      {label}
    </Link>
  );
}

interface MobileAccordionProps {
  title: string;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function MobileAccordion({ title, open, active, onToggle, children }: MobileAccordionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold transition-colors duration-500 ${
          active || open ? 'bg-[#F3EEE6] text-[#17211D]' : 'text-[#6F766F] hover:bg-[#FAF8F3]'
        }`}
      >
        {title}
        <ChevronDown className={`size-4 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mx-4 mb-3 mt-2 rounded-2xl bg-white p-5">{children}</div>}
    </div>
  );
}
