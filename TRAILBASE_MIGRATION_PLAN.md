# Trailbase Migration Plan

## Overview

This is your complete roadmap for building Trailbase - a production-ready, TypeScript-first campsite booking platform.

**Timeline:** 8-12 weeks (part-time)
**Difficulty:** Intermediate to Advanced
**Result:** Portfolio-worthy full-stack application

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Target Architecture](#target-architecture)
3. [Migration Phases](#migration-phases)
4. [Phase Breakdown](#phase-breakdown)
5. [Technical Decisions](#technical-decisions)
6. [Risk Mitigation](#risk-mitigation)

---

## Current State Analysis

### What You Have

**Frontend:**
- Create React App with Redux
- JavaScript (no TypeScript)
- Bootstrap/Reactstrap styling
- React Router for navigation
- Formik for forms
- Local mock data

**State Management:**
- Redux Toolkit
- Redux Logger
- No async data fetching library

**Data:**
- Static JavaScript arrays
- No database
- No backend API

**Authentication:**
- None

**Deployment:**
- Not configured

### What Needs to Change

- [ ] JavaScript → TypeScript
- [ ] CRA → Next.js 14
- [ ] Local data → PostgreSQL database
- [ ] Bootstrap → Tailwind + shadcn/ui
- [ ] Formik → React Hook Form + Zod
- [ ] Redux → Zustand + React Query
- [ ] No auth → NextAuth.js
- [ ] Static site → Full-stack app

---

## Target Architecture

### Technology Stack

```
┌─────────────────────────────────────────┐
│            Frontend Layer               │
│  Next.js 14 + TypeScript + Tailwind     │
│  React Query + Zustand                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Application Layer              │
│   Server Components + Server Actions    │
│         API Routes (REST)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Data Layer                    │
│    Prisma ORM + PostgreSQL              │
│    Type-safe database access            │
└─────────────────────────────────────────┘
```

### Folder Structure

```
trailbase/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── images/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── bookings/
│   │   │   └── profile/
│   │   ├── campsites/
│   │   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── campsites/
│   │   │   └── bookings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui
│   │   ├── forms/
│   │   ├── campsite/
│   │   └── booking/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── validations-auth.ts
│   │   ├── validations-campsite-booking.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── types-campsite.ts
│   │   ├── types-user.ts
│   │   ├── types-booking.ts
│   │   ├── types-review.ts
│   │   └── types-api.ts
│   ├── hooks/
│   ├── stores/
│   └── styles/
├── tests/
├── .env.local
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Migration Phases

### Phase 0: Foundation Setup (Week 1-2)
- [ ] TypeScript configuration
- [ ] Next.js setup
- [ ] Database setup
- [ ] Type definitions
- [ ] Validation schemas
- [ ] Utility functions

**Deliverable:** Working Next.js + TypeScript + Database environment

### Phase 1: Core Features (Week 3-5)
- [ ] Authentication system
- [ ] User management
- [ ] Campsite listings
- [ ] Basic search/filter

**Deliverable:** Users can browse and search campsites

### Phase 2: Booking System (Week 6-8)
- [ ] Booking creation
- [ ] Availability calendar
- [ ] Payment integration
- [ ] Booking management

**Deliverable:** End-to-end booking flow

### Phase 3: Reviews & Communication (Week 9-10)
- [ ] Review system
- [ ] Rating aggregation
- [ ] Messaging between users
- [ ] Email notifications

**Deliverable:** Complete user interaction

### Phase 4: Owner Features (Week 11)
- [ ] Campsite management
- [ ] Owner dashboard
- [ ] Analytics
- [ ] Revenue tracking

**Deliverable:** Two-sided marketplace

### Phase 5: Admin & Polish (Week 12)
- [ ] Admin dashboard
- [ ] Content moderation
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Testing

**Deliverable:** Production-ready application

---

## Phase Breakdown

### Phase 0: Foundation Setup

#### Task 0.1: Next.js + TypeScript Setup

**Time:** 2 hours

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest trailbase \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd trailbase

# Install additional dependencies
npm install @prisma/client prisma zod \
  @tanstack/react-query zustand \
  react-hook-form @hookform/resolvers \
  next-auth @next-auth/prisma-adapter \
  stripe @stripe/stripe-js
```

**Files to create:**
- `tsconfig.json` ✅ (already provided)
- `next.config.js` ✅ (already provided)
- `.env.local`

**Validation:**
```bash
npm run dev
# Should see Next.js welcome page at localhost:3000
```

#### Task 0.2: Database Setup

**Time:** 3 hours

**Step 1: Install PostgreSQL**
```bash
# Option A: Local
brew install postgresql@15
brew services start postgresql@15
createdb trailbase

# Option B: Docker
docker run --name trailbase-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=trailbase \
  -p 5432:5432 \
  -d postgres:15

# Option C: Supabase (free tier)
# Sign up at supabase.com and create project
```

**Step 2: Configure Prisma**
```bash
# Initialize Prisma
npx prisma init

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/trailbase"
```

**Step 3: Apply schema**
```bash
# Copy schema.prisma (already provided)
# Run migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Open Prisma Studio to verify
npx prisma studio
```

**Validation:**
- [ ] Database created
- [ ] All tables exist
- [ ] Prisma Studio works

#### Task 0.3: Create Type Definitions

**Time:** 2 hours

**Files:** (Already provided)
- `src/types/types-campsite.ts`
- `src/types/types-user.ts`
- `src/types/types-booking.ts`
- `src/types/types-review.ts`
- `src/types/types-api.ts`

**Test usage:**
```typescript
// src/test.ts
import type { Campsite } from '@/types/types-campsite';

const campsite: Campsite = {
  // TypeScript will validate this!
};
```

#### Task 0.4: Setup Validation & Utils

**Files:** (Already provided)
- `src/lib/validations-auth.ts`
- `src/lib/validations-campsite-booking.ts`
- `src/lib/utils.ts`

**Test validation:**
```typescript
import { loginSchema } from '@/lib/validations-auth';

const result = loginSchema.safeParse({
  email: 'test@example.com',
  password: 'password123'
});

console.log(result.success); // true or false
```

**Phase 0 Checklist:**
- [ ] Next.js runs locally
- [ ] TypeScript compiles
- [ ] Database connected
- [ ] All types available
- [ ] Validations work

---

### Phase 1: Core Features

#### Task 1.1: Authentication Setup

**Time:** 6 hours

**Step 1: Install NextAuth.js**
```bash
npm install next-auth @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

**Step 2: Create auth config**

File: `src/lib/auth.ts`
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations-auth';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = loginSchema.parse(credentials);

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
```

**Step 3: Create API routes**

File: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

**Step 4: Create login page**

File: `src/app/(auth)/login/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations-auth';
import type { LoginCredentials } from '@/types/types-user';

export default function LoginPage() {
  const [error, setError] = useState('');

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...form.register('email')}
            className="w-full border p-2 rounded"
          />
          {form.formState.errors.email && (
            <p className="text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...form.register('password')}
            className="w-full border p-2 rounded"
          />
          {form.formState.errors.password && (
            <p className="text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

**Validation:**
- [ ] Can create user account
- [ ] Can login
- [ ] Session persists
- [ ] Can logout

#### Task 1.2: Campsite Listing Page

**Time:** 8 hours

**Step 1: Create API route**

File: `src/app/api/campsites/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ApiResponse } from '@/types/types-api';
import type { Campsite } from '@/types/types-campsite';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const campsites = await prisma.campsite.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        location: true,
      },
      orderBy: {
        featured: 'desc',
      },
    });

    return NextResponse.json<ApiResponse<Campsite[]>>({
      success: true,
      data: campsites,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
```

**Step 2: Create listing page**

File: `src/app/campsites/page.tsx`
```typescript
import { prisma } from '@/lib/prisma';
import CampsiteCard from '@/components/campsite/CampsiteCard';
import SearchBar from '@/components/SearchBar';

export default async function CampsitesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const campsites = await prisma.campsite.findMany({
    where: searchParams.q
      ? {
          OR: [
            { name: { contains: searchParams.q, mode: 'insensitive' } },
            { description: { contains: searchParams.q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: {
      owner: true,
      location: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Find Your Perfect Campsite</h1>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {campsites.map((campsite) => (
          <CampsiteCard key={campsite.id} campsite={campsite} />
        ))}
      </div>

      {campsites.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No campsites found. Try a different search.
        </p>
      )}
    </div>
  );
}
```

**Step 3: Create CampsiteCard component**

File: `src/components/campsite/CampsiteCard.tsx`
```typescript
import Link from 'next/link';
import Image from 'next/image';
import type { Campsite } from '@/types/types-campsite';
import { formatPrice } from '@/lib/utils';

interface CampsiteCardProps {
  campsite: Campsite;
}

export default function CampsiteCard({ campsite }: CampsiteCardProps) {
  return (
    <Link href={`/campsites/${campsite.slug}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        <div className="relative h-48">
          <Image
            src={campsite.imageUrl}
            alt={campsite.name}
            fill
            className="object-cover"
          />
          {campsite.featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
              Featured
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{campsite.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {campsite.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              {formatPrice(campsite.pricePerNight)}/night
            </span>
            <span className="text-sm text-gray-500">
              {campsite.location.city}, {campsite.location.state}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

**Validation:**
- [ ] Campsites display correctly
- [ ] Search works
- [ ] Images load
- [ ] Links work

#### Task 1.3: Campsite Detail Page

**Time:** 6 hours

File: `src/app/campsites/[slug]/page.tsx`
```typescript
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import BookingForm from '@/components/booking/BookingForm';
import ReviewList from '@/components/review/ReviewList';
import { formatPrice } from '@/lib/utils';

export default async function CampsiteDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const campsite = await prisma.campsite.findUnique({
    where: { slug: params.slug },
    include: {
      owner: true,
      location: true,
      amenities: true,
      images: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  });

  if (!campsite) {
    notFound();
  }

  const averageRating = campsite.reviews.length > 0
    ? campsite.reviews.reduce((sum, review) => sum + review.rating, 0) / campsite.reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Image */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={campsite.imageUrl}
          alt={campsite.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{campsite.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 font-semibold">{averageRating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500">
                ({campsite.reviews.length} reviews)
              </span>
            </div>
            <span className="text-gray-500">
              {campsite.location.city}, {campsite.location.state}
            </span>
          </div>

          <p className="text-gray-700 mb-8">{campsite.description}</p>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {campsite.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <ReviewList reviews={campsite.reviews} />
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <div className="text-3xl font-bold mb-4">
              {formatPrice(campsite.pricePerNight)}
              <span className="text-lg font-normal text-gray-600">/night</span>
            </div>
            <BookingForm campsiteId={campsite.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Phase 1 Checklist:**
- [ ] Authentication works
- [ ] Users can browse campsites
- [ ] Search/filter functional
- [ ] Detail pages display correctly
- [ ] All types are enforced

---

### Phase 2: Booking System

#### Task 2.1: Booking Form & Availability

**Time:** 10 hours

This is a complex feature. See separate implementation guide.

Key components:
- Date picker with availability
- Guest selection
- Price calculation
- Booking confirmation

#### Task 2.2: Payment Integration

**Time:** 8 hours

- Stripe setup
- Payment intent creation
- Checkout flow
- Payment confirmation

#### Task 2.3: Booking Management

**Time:** 6 hours

- User's booking dashboard
- Booking cancellation
- Booking modification
- Email confirmations

**Phase 2 Checklist:**
- [ ] Users can make bookings
- [ ] Payments process successfully
- [ ] Availability updates in real-time
- [ ] Booking confirmations sent

---

### Phase 3-5: Advanced Features

(Similar detailed breakdowns for remaining phases)

---

## Technical Decisions

### Why Next.js over CRA?

**Next.js Advantages:**
1. **Server Components** - Better performance
2. **Built-in API Routes** - No separate backend needed
3. **File-based Routing** - Simpler navigation
4. **Image Optimization** - Automatic
5. **SEO** - Better for discoverability
6. **Production Ready** - Vercel deployment

### Why Prisma over Raw SQL?

1. **Type Safety** - Auto-generated types
2. **Migrations** - Version controlled schema
3. **Developer Experience** - Great tooling
4. **Relationships** - Easy to query
5. **Prisma Studio** - Built-in database GUI

### Why Zod for Validation?

1. **Type Inference** - Types from schemas
2. **Runtime Safety** - Validates user input
3. **Composable** - Reusable schemas
4. **Error Messages** - User-friendly
5. **React Hook Form Integration** - Perfect match

---

## Risk Mitigation

### Risk 1: Learning Curve

**Mitigation:**
- Start with small features
- Use provided types and validations
- Follow examples closely
- Ask for help when stuck

### Risk 2: Time Investment

**Mitigation:**
- Set realistic timeline
- Focus on MVP first
- Skip optional features initially
- Iterate incrementally

### Risk 3: Database Issues

**Mitigation:**
- Use Prisma Studio for debugging
- Keep backups
- Test migrations on dev database first
- Use transactions for complex operations

---

## Success Metrics

### Week 4
- [ ] Authentication working
- [ ] Campsites displaying

### Week 8
- [ ] Bookings functional
- [ ] Payments processing

### Week 12
- [ ] All features complete
- [ ] Deployed to production
- [ ] Portfolio ready

---

## Next Steps

1. Complete Phase 0 (Foundation Setup)
2. Start with Task 1.1 (Authentication)
3. Build incrementally
4. Test thoroughly
5. Deploy early and often

Good luck! You're building something amazing!
