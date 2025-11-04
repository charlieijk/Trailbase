import type { Metadata } from 'next';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.css';
import 'typeface-lobster';
import 'typeface-open-sans';

export const metadata: Metadata = {
  title: 'Trailbase',
  description: 'TypeScript-first campsite booking platform',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <Providers>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
