# TypeScript Setup Summary

## Overview

This document explains the TypeScript foundation for Trailbase, including all technical decisions, type definitions, and best practices.

## Table of Contents

1. [Why TypeScript?](#why-typescript)
2. [Type System Architecture](#type-system-architecture)
3. [Type Definitions](#type-definitions)
4. [Validation Strategy](#validation-strategy)
5. [Utility Functions](#utility-functions)
6. [Database Types](#database-types)
7. [Best Practices](#best-practices)

---

## Why TypeScript?

### Benefits for This Project

1. **Type Safety**
   - Catch errors before runtime
   - Autocomplete for better DX
   - Self-documenting code

2. **Refactoring Confidence**
   - Rename symbols safely
   - Find all usages
   - Breaking changes are obvious

3. **Better Tooling**
   - IntelliSense in VS Code
   - Instant error feedback
   - Import autocomplete

4. **Production Ready**
   - Industry standard
   - Required for large codebases
   - Portfolio value

### Migration Strategy

We're moving from:
```javascript
// Old: JavaScript with PropTypes
const CampsiteCard = ({ campsite }) => {
  return <div>{campsite.name}</div>
}
```

To:
```typescript
// New: TypeScript with full type safety
interface CampsiteCardProps {
  campsite: Campsite;
}

const CampsiteCard: React.FC<CampsiteCardProps> = ({ campsite }) => {
  return <div>{campsite.name}</div>
}
```

---

## Type System Architecture

### Layered Type Approach

```
┌─────────────────────────────────┐
│  UI Components (React Props)    │  ← Component interfaces
├─────────────────────────────────┤
│  Business Logic (Services)      │  ← Domain types
├─────────────────────────────────┤
│  API Layer (Request/Response)   │  ── API types
├─────────────────────────────────┤
│  Database (Prisma Generated)    │  ← Database models
└─────────────────────────────────┘
```

### Type Files Organization

```
src/types/
├── types-campsite.ts      # Campsite domain types
├── types-user.ts          # User & auth types
├── types-booking.ts       # Booking system types
├── types-review.ts        # Review types
└── types-api.ts           # API types
```

---

## Type Definitions

### 1. Campsite Types (`types-campsite.ts`)

#### Base Campsite
```typescript
export interface Campsite {
  id: string;
  name: string;
  slug: string;
  description: string;
  elevation?: number;
  featured: boolean;
  // ... more fields
}
```

#### Why this structure?
- `id`: UUID for scalability (vs sequential integers)
- `slug`: SEO-friendly URLs (`/campsites/react-lake`)
- Optional `elevation`: Not all sites track this
- `featured`: For homepage carousel

#### Campsite with Relations
```typescript
export interface CampsiteWithDetails extends Campsite {
  owner: CampsiteOwner;
  location: Location;
  amenities: Amenity[];
  pricing: Pricing;
  images: CampsiteImage[];
  reviews: Review[];
}
```

Benefits:
- Explicit about what data is loaded
- Different types for different use cases
- Prevents over-fetching

#### Search and Filter Types
```typescript
export interface CampsiteSearchParams {
  query?: string;
  location?: LocationFilter;
  priceRange?: PriceRange;
  amenities?: string[];
  startDate?: Date;
  endDate?: Date;
  guests?: number;
}
```

Used for:
- Search form validation
- URL query parameters
- API request types

### 2. User Types (`types-user.ts`)

#### User Roles
```typescript
export enum UserRole {
  CAMPER = 'CAMPER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}
```

Why enum?
- Type-safe role checking
- Autocomplete for roles
- Compile-time validation

#### User Model
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Authentication Types
```typescript
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}
```

Used for:
- Form validation
- API contracts
- Session management

### 3. Booking Types (`types-booking.ts`)

#### Booking Status
```typescript
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}
```

#### Core Booking
```typescript
export interface Booking {
  id: string;
  campsiteId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Booking with Relations
```typescript
export interface BookingWithDetails extends Booking {
  campsite: Campsite;
  user: User;
  payment?: Payment;
}
```

#### Calendar Availability
```typescript
export interface AvailabilityCalendar {
  campsiteId: string;
  month: number;
  year: number;
  availableDates: Date[];
  bookedDates: Date[];
  priceByDate: Map<string, number>;
}
```

### 4. Review Types (`types-review.ts`)

```typescript
export interface Review {
  id: string;
  campsiteId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  photos: string[];
  isVerifiedStay: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithAuthor extends Review {
  author: {
    name: string;
    avatarUrl?: string;
  };
  ownerResponse?: OwnerResponse;
}
```

### 5. API Types (`types-api.ts`)

#### Generic API Response
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

Usage:
```typescript
// Type-safe API response
const response: ApiResponse<Campsite> = await fetchCampsite(id);

if (response.success && response.data) {
  // TypeScript knows response.data is Campsite
  console.log(response.data.name);
}
```

#### Pagination
```typescript
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

---

## Validation Strategy

### Two-Layer Validation

1. **TypeScript** (Compile-time)
   - Structural validation
   - Type correctness
   - IDE support

2. **Zod** (Runtime)
   - Data validation
   - User input sanitization
   - API response validation

### Example: Login Form

```typescript
// Type definition (TypeScript)
import type { LoginCredentials } from '@/types/types-user';

// Runtime validation (Zod)
import { loginSchema } from '@/lib/validations-auth';

// In component
const form = useForm<LoginCredentials>({
  resolver: zodResolver(loginSchema),
});
```

### Validation Files

#### `validations-auth.ts`
- Login form
- Signup form
- Password reset
- Email verification

#### `validations-campsite-booking.ts`
- Campsite creation/edit
- Booking creation
- Search filters
- Review submission

---

## Utility Functions

### `utils.ts` - 30+ Helper Functions

#### Date Utilities
```typescript
formatDate(date: Date, format: string): string
parseDate(dateString: string): Date
isDateInRange(date: Date, start: Date, end: Date): boolean
getDaysBetween(start: Date, end: Date): number
getAvailableDates(bookings: Booking[]): Date[]
```

#### Price Utilities
```typescript
formatPrice(amount: number, currency?: string): string
calculateBookingTotal(
  pricePerNight: number,
  startDate: Date,
  endDate: Date
): number
applyDiscount(price: number, discountPercent: number): number
```

#### String Utilities
```typescript
slugify(text: string): string
truncate(text: string, length: number): string
capitalize(text: string): string
```

#### Validation Utilities
```typescript
isValidEmail(email: string): boolean
isValidUrl(url: string): boolean
sanitizeHtml(html: string): string
```

#### Array Utilities
```typescript
groupBy<T>(array: T[], key: keyof T): Record<string, T[]>
sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[]
unique<T>(array: T[]): T[]
```

---

## Database Types

### Prisma Generated Types

Prisma automatically generates TypeScript types from your schema:

```typescript
// Generated from schema.prisma
import { Prisma, User, Campsite, Booking } from '@prisma/client';

// With relations
type UserWithBookings = Prisma.UserGetPayload<{
  include: { bookings: true }
}>;

// Partial types for updates
type UpdateUser = Prisma.UserUpdateInput;
```

### Type Sync Strategy

1. **Define schema** in `prisma/schema.prisma`
2. **Run migration** `npx prisma migrate dev`
3. **Generate types** `npx prisma generate`
4. **Use types** in your code

```typescript
import { Campsite } from '@prisma/client';

// This type matches your database exactly
const campsite: Campsite = {
  id: '123',
  name: 'Test',
  // ... must match schema
};
```

---

## Best Practices

### 1. Type Naming Conventions

- **Interfaces**: PascalCase (`User`, `Campsite`)
- **Types**: PascalCase (`AuthResponse`)
- **Enums**: PascalCase with UPPER_CASE values (`UserRole.ADMIN`)
- **Generic suffix**: `WithDetails`, `WithRelations`, `CreateInput`

### 2. Type vs Interface

**Use Interface when:**
- Defining object shapes
- Can be extended
- Public API contracts

```typescript
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}
```

**Use Type when:**
- Unions/intersections
- Complex transformations
- Utility types

```typescript
type UserRole = 'CAMPER' | 'OWNER' | 'ADMIN';
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };
```

### 3. Avoid `any`

Instead of:
```typescript
const data: any = fetchData(); // Bad
```

Use:
```typescript
const data: unknown = fetchData();
// Then validate/narrow the type
if (isCampsite(data)) {
  // TypeScript knows data is Campsite here
}
```

### 4. Use Type Guards

```typescript
function isCampsite(obj: unknown): obj is Campsite {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slug' in obj
  );
}
```

### 5. Leverage Utility Types

```typescript
// Pick specific fields
type CampsitePreview = Pick<Campsite, 'id' | 'name' | 'image'>;

// Make all fields optional
type PartialCampsite = Partial<Campsite>;

// Make all fields required
type RequiredCampsite = Required<Campsite>;

// Omit specific fields
type CampsiteWithoutDates = Omit<Campsite, 'createdAt' | 'updatedAt'>;
```

### 6. Export Types Explicitly

```typescript
// types-campsite.ts
export type { Campsite, CampsiteWithDetails };
export type { CampsiteSearchParams, CampsiteFilter };
export { CampsiteCategory, CampsiteStatus }; // enums
```

### 7. Co-locate Related Types

Keep types near where they're used:
```
components/
  CampsiteCard/
    CampsiteCard.tsx
    CampsiteCard.types.ts  ← Component-specific types

types/
  types-campsite.ts  ← Shared domain types
```

---

## Type Safety in React

### Props Typing

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  children
}) => {
  // ...
};
```

### Event Handlers

```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

### Hooks Typing

```typescript
const [user, setUser] = useState<User | null>(null);
const [campsites, setCampsites] = useState<Campsite[]>([]);

const { data, isLoading, error } = useQuery<Campsite[], Error>({
  queryKey: ['campsites'],
  queryFn: fetchCampsites,
});
```

---

## Type Safety in Next.js

### Page Props

```typescript
// app/campsites/[slug]/page.tsx
interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CampsitePage({ params }: PageProps) {
  const campsite = await getCampsite(params.slug);
  return <div>{campsite.name}</div>;
}
```

### API Routes

```typescript
// app/api/campsites/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const campsites: Campsite[] = await fetchCampsites(searchParams);

  return Response.json<ApiResponse<Campsite[]>>({
    success: true,
    data: campsites,
  });
}
```

---

## Type Safety with Prisma

### Query Result Types

```typescript
// Get single campsite with owner
const campsite = await prisma.campsite.findUnique({
  where: { id },
  include: {
    owner: true,
    reviews: {
      include: { user: true }
    }
  }
});

// TypeScript knows the exact shape!
// campsite.owner.name ✓
// campsite.reviews[0].user.email ✓
```

### Type-safe Queries

```typescript
// Create campsite with validation
const createCampsite = async (data: Prisma.CampsiteCreateInput) => {
  return await prisma.campsite.create({ data });
};

// Update campsite
const updateCampsite = async (
  id: string,
  data: Prisma.CampsiteUpdateInput
) => {
  return await prisma.campsite.update({
    where: { id },
    data
  });
};
```

---

## Common Type Patterns

### Pattern 1: API Data Fetching

```typescript
async function fetchCampsites(): Promise<ApiResponse<Campsite[]>> {
  try {
    const response = await fetch('/api/campsites');
    const data: Campsite[] = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
```

### Pattern 2: Form Handling

```typescript
const handleSubmit = async (data: LoginCredentials) => {
  const result = await login(data);

  if (result.success) {
    router.push('/dashboard');
  } else {
    setError(result.error.message);
  }
};
```

### Pattern 3: Conditional Rendering

```typescript
interface UserProfileProps {
  user: User | null;
  isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isLoading }) => {
  if (isLoading) return <Spinner />;
  if (!user) return <Login />;

  // TypeScript knows user is User here
  return <div>{user.name}</div>;
};
```

---

## TypeScript Configuration

### `tsconfig.json` Settings

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",

    // Strict mode
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Key Settings Explained

- `strict: true` - Enables all strict checks
- `noUncheckedIndexedAccess` - Safer array/object access
- Path aliases - Clean imports (`@/types` vs `../../../types`)

---

## Testing with Types

### Type-safe Tests

```typescript
import type { Campsite } from '@/types/types-campsite';

describe('CampsiteCard', () => {
  const mockCampsite: Campsite = {
    id: '1',
    name: 'Test Campsite',
    slug: 'test-campsite',
    // TypeScript ensures all required fields
  };

  it('renders campsite name', () => {
    render(<CampsiteCard campsite={mockCampsite} />);
    expect(screen.getByText('Test Campsite')).toBeInTheDocument();
  });
});
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Cheat Sheet](https://www.typescriptlang.org/cheatsheets)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Prisma TypeScript Guide](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Zod Documentation](https://zod.dev)

---

## Next Steps

1. Review all type files in `src/types/`
2. Understand validation in `src/lib/validations-*.ts`
3. Start using types in your components
4. Enable strict mode gradually
5. Add types to existing code

---

**Remember:** Types are documentation that never goes out of date!
