"use client";

import type { FC } from 'react';
import { Container } from 'reactstrap';
import SignupForm from '../features/user/SignupForm';

const SignupPage: FC = () => (
  <section className="signup-page">
    <div className="signup-gradient" />
    <Container className="signup-container">
      <div className="signup-content">
        <article className="signup-intro">
          <span className="signup-kicker">Trailbase Membership</span>
          <h1>Plan adventures you&apos;ll actually take</h1>
          <p>
            Build wishlists, unlock members-only guides, and sync trips across every device. Trailbase keeps
            your next escape organised, so you can stay focused on the sunrise.
          </p>
          <ul className="signup-benefits">
            <li>
              <i className="fa fa-map-marker" aria-hidden />
              Personalised campsite recommendations
            </li>
            <li>
              <i className="fa fa-bolt" aria-hidden />
              Early access to seasonal releases
            </li>
            <li>
              <i className="fa fa-cloud-upload" aria-hidden />
              Offline-ready packing and checklist tools
            </li>
          </ul>
        </article>
        <SignupForm />
      </div>
    </Container>
  </section>
);

export default SignupPage;
