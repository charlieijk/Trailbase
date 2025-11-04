"use client";

import type { FC } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem } from 'reactstrap';
import UserLoginForm from '../features/user/UserLoginForm';
import { navigationItems } from '../routes/appRoutes';

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() ?? '';

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-5">
        <Link href="/" className="d-flex align-items-center text-decoration-none text-white">
          <Image src="/assets/img/logo.png" alt="Trailbase logo" width={48} height={48} className="me-3" />
          <h1 className="mt-1 mb-0">Trailbase</h1>
        </Link>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen((open) => !open)} />
      <Collapse isOpen={menuOpen} navbar>
        <Nav className="ms-auto" navbar>
          {navigationItems.map(({ id, path, label, icon }) => (
            <NavItem key={id}>
              <Link
                className={`nav-link${path === '/signup' ? ' nav-link--cta' : ''}${
                  isActive(path) ? ' active' : ''
                }`}
                href={path}
                onClick={() => setMenuOpen(false)}
              >
                {icon && <i className={`fa ${icon} fa-lg me-2`} />}
                {label}
              </Link>
            </NavItem>
          ))}
        </Nav>
        <UserLoginForm />
      </Collapse>
    </Navbar>
  );
};

export default Header;
