# Candidate API Documentation

> สำหรับ Frontend Team — สรุปจาก commit `feat(candidate)`
>
> Base URL: `/ec/candidates`
> Auth: ต้องแนบ Token + Role **EC** ทุก endpoint

---

## 📦 Database Schema Changes

```diff
model candidate {
  id              Int     @id @default(autoincrement())
  number          Int
- fullName        String
+ firstName       String
+ lastName        String
+ candidatePolicy String?    // nullable (ถ้าไม่ส่ง ใช้ policy ของ party แทน)
  imageUrl        String

  partyId         Int
  constituencyId  Int

  @@unique([number, constituencyId])
+ @@unique([partyId, constituencyId])   // 1 พรรค ต่อ 1 เขต unique
}
```

> [!IMPORTANT]
>
> - `fullName` ถูกลบ → ใช้ `firstName` + `lastName` แทน
> - `candidatePolicy` เป็น **optional** — ถ้าไม่ส่ง backend จะใช้ `policy` ของ `party` ให้อัตโนมัติ
> - เพิ่ม unique constraint `(partyId, constituencyId)` — พรรคเดียวกันสมัครเขตเดียวกันได้แค่คนเดียว

---

## 1. 📋 GET `/ec/candidates` — ดึงรายชื่อผู้สมัครทั้งหมด (Paginated)

### Query Parameters

| Parameter | Type     | Required | Default | Description                                          |
| --------- | -------- | -------- | ------- | ---------------------------------------------------- |
| `page`    | `number` | ❌       | `1`     | หน้าที่ต้องการ                                       |
| `limit`   | `number` | ❌       | `10`    | จำนวนรายการต่อหน้า                                   |
| `search`  | `string` | ❌       | -       | ค้นหาจาก ชื่อ, นามสกุล, ชื่อพรรค, จังหวัด, เบอร์, id |
| `sortBy`  | `string` | ❌       | `id`    | เรียงตาม: `id`, `number`, `firstName`, `lastName`    |
| `order`   | `string` | ❌       | `asc`   | ทิศทาง: `asc` หรือ `desc`                            |

### Request Example

```
GET /ec/candidates?page=1&limit=10&search=สมชาย&sortBy=number&order=asc
```

### Response `200 OK`

```json
{
  "total": 50,
  "candidate": [
    {
      "id": 1,
      "number": 1,
      "firstName": "สมชาย",
      "lastName": "ใจดี",
      "candidatePolicy": "นโยบายพัฒนาชุมชน",
      "imageUrl": "https://example.com/photo.jpg",
      "partyId": 2,
      "constituencyId": 5,
      "party": {
        "name": "พรรคก้าวหน้า"
      },
      "constituency": {
        "number": 3,
        "province": {
          "name": "กรุงเทพมหานคร"
        }
      }
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

## 2. ➕ POST `/ec/candidates` — สร้างผู้สมัครใหม่

### Request Body

| Field             | Type     | Required | Description                                   |
| ----------------- | -------- | -------- | --------------------------------------------- |
| `number`          | `number` | ✅       | เบอร์ผู้สมัคร (ต้อง > 0)                      |
| `firstName`       | `string` | ✅       | ชื่อ                                          |
| `lastName`        | `string` | ✅       | นามสกุล                                       |
| `candidatePolicy` | `string` | ❌       | นโยบายผู้สมัคร (ถ้าไม่ส่ง ใช้ policy ของพรรค) |
| `imageUrl`        | `string` | ✅       | URL รูปผู้สมัคร                               |
| `partyId`         | `number` | ✅       | ID ของพรรค (ต้องมีอยู่ในระบบ)                 |
| `constituencyId`  | `number` | ✅       | ID ของเขตเลือกตั้ง (ต้องมีอยู่ในระบบ)         |

### Request Example

```json
POST /ec/candidates

{
  "number": 1,
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "candidatePolicy": "นโยบายพัฒนาชุมชน",
  "imageUrl": "https://example.com/photo.jpg",
  "partyId": 2,
  "constituencyId": 5
}
```

### Response `200 OK`

```json
{
  "message": "Candidate created successfully",
  "data": {
    "id": 1,
    "number": 1,
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "candidatePolicy": "นโยบายพัฒนาชุมชน",
    "imageUrl": "https://example.com/photo.jpg",
    "partyId": 2,
    "constituencyId": 5
  }
}
```

### Possible Errors

| สถานการณ์                      | Error Message                                                |
| ------------------------------ | ------------------------------------------------------------ |
| เบอร์ซ้ำในเขตเลือกตั้งเดียวกัน | `The candidate numbers are duplicated in this constituency.` |
| เบอร์ไม่ถูกต้อง (≤ 0)          | `Invalid candidate number`                                   |
| ไม่กรอกชื่อหรือนามสกุล         | `Please enter first and last name.`                          |
| ไม่พบพรรค                      | `Party not found`                                            |
| ไม่พบเขตเลือกตั้ง              | `Constituency not found`                                     |

---

## 3. ✏️ PATCH `/ec/candidates/:id` — แก้ไขผู้สมัคร

### Path Parameters

| Parameter | Type     | Description    |
| --------- | -------- | -------------- |
| `id`      | `number` | ID ของผู้สมัคร |

### Request Body (ส่งเฉพาะ field ที่ต้องการแก้ — Partial Update)

| Field             | Type     | Required | Description        |
| ----------------- | -------- | -------- | ------------------ |
| `number`          | `number` | ❌       | เบอร์ผู้สมัคร      |
| `firstName`       | `string` | ❌       | ชื่อ               |
| `lastName`        | `string` | ❌       | นามสกุล            |
| `candidatePolicy` | `string` | ❌       | นโยบายผู้สมัคร     |
| `imageUrl`        | `string` | ❌       | URL รูปผู้สมัคร    |
| `partyId`         | `number` | ❌       | ID ของพรรค         |
| `constituencyId`  | `number` | ❌       | ID ของเขตเลือกตั้ง |

### Request Example

```json
PATCH /ec/candidates/1

{
  "firstName": "สมหญิง",
  "candidatePolicy": "นโยบายใหม่"
}
```

### Response `200 OK`

```json
{
  "message": "Candidate updated successfully",
  "data": {
    "id": 1,
    "number": 1,
    "firstName": "สมหญิง",
    "lastName": "ใจดี",
    "candidatePolicy": "นโยบายใหม่",
    "imageUrl": "https://example.com/photo.jpg",
    "partyId": 2,
    "constituencyId": 5
  }
}
```

### Possible Errors

| สถานการณ์           | Status | Error Message          |
| ------------------- | ------ | ---------------------- |
| ID ไม่ถูกต้อง (≤ 0) | `400`  | `Invalid candidate id` |
| ไม่พบผู้สมัคร       | `500`  | `Candidate not found`  |

---

## 4. 🗑️ DELETE `/ec/candidates/:id` — ลบผู้สมัคร

### Path Parameters

| Parameter | Type     | Description    |
| --------- | -------- | -------------- |
| `id`      | `number` | ID ของผู้สมัคร |

### Request Example

```
DELETE /ec/candidates/1
```

### Response `200 OK` (ลบสำเร็จ)

```json
{
  "message": "Candidate deleted successfully"
}
```

### Possible Errors

| สถานการณ์                   | Status | Error Message                                     |
| --------------------------- | ------ | ------------------------------------------------- |
| ID ไม่ใช่ตัวเลข             | `400`  | `Invalid candidate id`                            |
| ไม่พบผู้สมัคร               | `400`  | `Candidate not found`                             |
| มีข้อมูลโหวตอยู่ (ลบไม่ได้) | `400`  | `Cannot delete candidate because there are votes` |

> [!WARNING]
> ถ้าผู้สมัครมีคนโหวตแล้ว → **ลบไม่ได้** เพื่อรักษาความถูกต้องของข้อมูล

---

## 🔐 Authentication & Authorization

ทุก endpoint ต้อง:

1. **Header**: `Authorization: Bearer <token>`
2. **Role**: ต้องเป็น `EC` (Election Commission) เท่านั้น

---

## 📝 TypeScript Types (สำหรับ Frontend)

```typescript
// สร้างผู้สมัคร
interface CreateCandidatePayload {
  number: number;
  firstName: string;
  lastName: string;
  candidatePolicy?: string;
  imageUrl: string;
  partyId: number;
  constituencyId: number;
}

// แก้ไขผู้สมัคร (Partial)
interface UpdateCandidatePayload {
  number?: number;
  firstName?: string;
  lastName?: string;
  candidatePolicy?: string;
  imageUrl?: string;
  partyId?: number;
  constituencyId?: number;
}

// Query params สำหรับดึงรายการ
interface GetCandidatesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "number" | "firstName" | "lastName";
  order?: "asc" | "desc";
}

// Response จาก GET (Paginated)
interface GetCandidatesResponse {
  total: number;
  candidate: CandidateItem[];
  page: number;
  limit: number;
  totalPages: number;
}

// แต่ละ item ใน list
interface CandidateItem {
  id: number;
  number: number;
  firstName: string;
  lastName: string;
  candidatePolicy: string | null;
  imageUrl: string;
  partyId: number;
  constituencyId: number;
  party: {
    name: string;
  };
  constituency: {
    number: number;
    province: {
      name: string;
    };
  };
}

// Response จาก POST / PATCH
interface MutateCandidateResponse {
  message: string;
  data: {
    id: number;
    number: number;
    firstName: string;
    lastName: string;
    candidatePolicy: string | null;
    imageUrl: string;
    partyId: number;
    constituencyId: number;
  };
}

// Response จาก DELETE
interface DeleteCandidateResponse {
  message: string;
}
```

---

## 📊 สรุป Endpoints

| Method   | Path                 | Description            |
| -------- | -------------------- | ---------------------- |
| `GET`    | `/ec/candidates`     | ดึงรายชื่อ (Paginated) |
| `POST`   | `/ec/candidates`     | สร้างผู้สมัครใหม่      |
| `PATCH`  | `/ec/candidates/:id` | แก้ไขผู้สมัคร          |
| `DELETE` | `/ec/candidates/:id` | ลบผู้สมัคร             |
