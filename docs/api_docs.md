# API Documentation for Frontend

Base URL: `http://<your-backend-url>` (e.g., `http://localhost:3000` or production URL)

## Types

You can copy these TypeScript interfaces to your frontend project.

```typescript
// Common
export interface ApiResponse<T> {
  // Note: The backend wrapper might vary, usually it returns the data directly or wrapped.
  // Based on controllers, successful responses often return the data object directly or a specific shape.
  // This documentation assumes the JSON body returned by the endpoint.
  [key: string]: any;
}

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
}

export interface Constituency {
  id: number;
  number: number;
  provinceId: number;
  isClosed: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserRoleRelation {
  role: Role;
}

export interface User {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;
  province: Province;
  district: District;
  roles: UserRoleRelation[] | string[]; // logic varies between endpoints
  createdAt: string; // ISO Date string
}

export interface AuthResponse {
  accessToken: string;
}
```

## Endpoints

### 1. Authentication (`/auth`)

#### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:

```typescript
interface RegisterUserInput {
  citizenId: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  provinceId: number;
  districtId: number;
}
```

- **Success Response (201)**:
  Returns the created user object.

```typescript
interface RegisterResponse {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;
  province: Province;
  district: District;
  roles: { role: Role }[];
  createdAt: string;
}
```

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```typescript
interface LoginUserInput {
  citizenId: string;
  password: string;
}
```

- **Success Response (200)**:

```typescript
interface LoginResponse {
  accessToken: string;
}
```

#### Get Current User (Me)

- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200)**:

```typescript
interface MeResponse {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;
  province: Province;
  district: District;
  roles: string[]; // Example: ["ROLE_VOTER"]
  createdAt: string;
}
```

---

### 2. Location (`/location`)

#### Get All Provinces

- **URL**: `/location/provinces`
- **Method**: `GET`
- **Success Response (200)**:

```typescript
type GetAllProvincesResponse = Province[];
```

#### Get Districts by Province

- **URL**: `/location/provinces/:provinceId/districts`
- **Method**: `GET`
- **Params**: `provinceId` (number)
- **Success Response (200)**:

```typescript
type GetDistrictsResponse = District[];
```

#### Get Constituency by District

- **URL**: `/location/districts/:districtId/constituencies`
- **Method**: `GET`
- **Params**: `districtId` (number)
- **Success Response (200)**:

```typescript
interface GetConstituencyResponse {
  district: {
    id: number;
    name: string;
  };
  constituency: Constituency;
}
```

---

### 3. Admin (`/admin`)

#### Get All Constituencies

- **URL**: `/admin/constituencies`
- **Method**: `GET`
- **Success Response (200)**:

```typescript
type GetAllConstituenciesResponse = Constituency[];
```

#### Get Constituency by ID

- **URL**: `/admin/constituencies/:id`
- **Method**: `GET`
- **Params**: `id` (number)
- **Success Response (200)**:

```typescript
interface GetConstituencyByIdResponse {
  id: number;
  number: number;
  isClosed: boolean;
  province: {
    name: string;
  };
}
```

#### Add Constituency

- **URL**: `/admin/constituencies`
- **Method**: `POST`
- **Body**:

```json
{
  "number": 1,
  "provinceId": 1
}
```

- **Success Response (200)**: Empty (void)
