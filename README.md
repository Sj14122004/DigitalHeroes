#  Digital Heroes

Golf subscription platform with monthly prize draws & charity giving.

---

## Important - Winner Testing Note

For testing the 5-match winner flow, the random winning-number generator was temporarily changed in:

```
apps/Backend/src/services/drawService.ts
```

**Hardcoded winning numbers:**
```javascript
const generateWinningNumbers = () => {
  return [6, 8, 15, 17, 40];
};
```

**Test subscriber entered:** `6, 8, 15, 17, 40`

This was used to verify the complete 5-match → winner → proof verification → payout flow.

**restore original random number generation for production!**

---

##  Test Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@digitalheroes.com` |
| Password | `12345678` |
| URL | `http://localhost:5173/admin` |

### Subscriber Account
| Field | Value |
|-------|-------|
| Email | `shivam@gmail.com` |
| Password | `12345678` |
| URL | `http://localhost:5173/dashboard` |

### Stripe Test Card
| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |
| ZIP | Any valid code |

---

##  Quick Setup

### Backend Setup

```bash
cd apps/Backend
npm install
```

**Create `.env` file:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
STRIPE_SECRET_KEY="your_key"
STRIPE_WEBHOOK_SECRET="your_webhook"
STRIPE_MONTHLY_PRICE_ID="price_xxx"
STRIPE_YEARLY_PRICE_ID="price_xxx"
FRONTEND_URL="http://localhost:5173"
```

**Database setup & run:**
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup

```bash
cd apps/Frontend
npm install
```

**Create `.env` file:**
```env
VITE_API_URL=http://localhost:5000
```

**Run:**
```bash
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

##  Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Passport.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Payments** | Stripe |
| **Storage** | Cloudinary |
| **Authentication** | JWT, HTTP-only Cookies, Role-based Access |

---

##  Key Features

### Public Features
- Homepage & platform overview
- User registration & login
- View subscription plans (₹499/month, ₹4,999/year)
- Browse available charities

###  Subscriber Features
- Dashboard with subscription status
- Add/Edit/Delete golf scores (latest 5)
- Participate in monthly prize draws (3, 4, 5-number matches)
- Select charity contribution (10%)
- Track winnings
- Submit winner verification proof

###  Admin Features
- User management & analytics
- Charity management
- Draw simulation & publishing
- Winner verification & proof review
- Payment status management
- Platform activity tracking

---

##  Prize Distribution

| Match | Prize Allocation |
|-------|------------------|
| 3-number match | 40% |
| 4-number match | 35% |
| 5-number match | 25% |

---

##  Security Features

-  Password hashing (bcrypt)
-  JWT authentication
-  HTTP-only authentication cookies
-  Role-based authorization
-  Server-side validation
-  Stripe PCI-compliant checkout
-  Protected API routes
-  Environment variables for secrets

---

##  Project Structure

```
DigitalHeroes/
├── apps/
│   ├── Backend/           (Node.js + Express + PostgreSQL)
│   └── Frontend/          (React + TypeScript + Vite)
├── .gitignore
└── README.md
```

---

##  User Flow

```
Visitor 
   ↓
Register/Login 
   ↓
Choose Subscription Plan 
   ↓
Stripe Checkout Payment 
   ↓
Member Dashboard 
   ↓
Add Golf Scores 
   ↓
Select Charity 
   ↓
Monthly Prize Draw 
   ↓
Won? → Submit Proof 
   ↓
Admin Verification 
   ↓
Payment Processing
```

---

## Important Links

- **GitHub Repository:** https://github.com/Sj14122004/DigitalHeroes
- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin

---

##  License

Technical Assessment Project

---

##  Quick Reference

| Action | Command |
|--------|---------|
| Start Backend | `cd apps/Backend && npm run dev` |
| Start Frontend | `cd apps/Frontend && npm run dev` |
| DB Migrations | `npx prisma migrate dev` |
| Seed Database | `npx prisma db seed` |
| Open Frontend | `http://localhost:5173` |
| Open Admin | `http://localhost:5173/admin` |
