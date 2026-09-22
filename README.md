Digital Heroes

Golf subscription platform with monthly prize draws & charity giving.

Test Credentials
Admin
Email: admin@digitalheroes.com
Password: 12345678
URL: http://localhost:5173/admin
Subscriber
Email: shivam@gmail.com
Password: 12345678
URL: http://localhost:5173/dashboard
Stripe Test Card
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any valid code

Quick Setup
Backend
cd apps/Backend
npm install

# Create .env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
STRIPE_SECRET_KEY="your_key"
STRIPE_WEBHOOK_SECRET="your_webhook"
STRIPE_MONTHLY_PRICE_ID="price_xxx"
STRIPE_YEARLY_PRICE_ID="price_xxx"
FRONTEND_URL="http://localhost:5173"


# databse setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

Backend runs on: http://localhost:5000

Frontend
cd apps/Frontend
npm install

# Create .env
VITE_API_URL=http://localhost:5000

npm run dev

Frontend runs on: http://localhost:5173

Tech Stack

Layer	Tech
Frontend:-	React, TypeScript, Vite, Tailwind, Framer Motion
Backend:-	Node.js, Express, TypeScript, Passport.js
Database:-	PostgreSQL, Prisma ORM
Payments:-	Stripe

Storage	Cloudinary
Auth	JWT, HTTP-only Cookies, Role-based Access

Key Features
Public
Homepage & learn platform
User registration & login
View subscription plans (₹499/month, ₹4,999/year)
Browse charities
Subscriber Features
Dashboard with subscription status
Add/Edit/Delete golf scores (latest 5)
Monthly prize draws (3, 4, 5-number matches)
Choose charity contribution (10%)
Track winnings
Submit winner verification proof
Admin Features
User management
Charity management
Draw simulation & publishing
Winner verification & payment management
Platform analytics
Prize Distribution
3-number match: 40%
4-number match: 35%
5-number match: 25%
Security
Password hashing (bcrypt)
JWT authentication
HTTP-only cookies
Role-based authorization
Server-side validation
Stripe PCI-compliant checkout
Project Structure
DigitalHeroes/
├── apps/
│   ├── Backend/  (Node.js + Express)
│   └── Frontend/ (React + TypeScript)
└── README.md
User Flow

Visitor → Register → Choose Plan → Payment → Dashboard → Add Scores → Monthly Draw → Winner? → Submit Proof → Admin Verify → Payment

Links
GitHub: https://github.com/Sj14122004/DigitalHeroes
Backend API: http://localhost:5000
Frontend: http://localhost:5173
