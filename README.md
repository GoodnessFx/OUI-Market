# OUI MARKET - The Ultimate University Marketplace 🎓🛒

OUI MARKET is a comprehensive, professional-grade campus marketplace designed specifically for the Oduduwa University (OUI) community. It empowers students to buy, sell, connect, and earn while providing a secure, trustless environment for all transactions.

---

## 🌟 Key Features

### 🛍️ Smart Marketplace
- **Buy & Sell Anything**: From electronics and textbooks to fashion and food.
- **Verified Vendors**: Special verification tags for student and local businesses.
- **Exclusive Campus Deals**: Daily flash deals and student-only discounts.

### 💼 Student Gigs & Job Board
- **Earn While Studying**: List your skills (coding, design, tutoring, delivery) and get hired by fellow students or organizations.
- **Trustless Escrow**: All job payments are secured via a **Smart Contract Escrow** system. Funds are only released upon successful completion.

### 🏠 Housing & Renting Hub
- **Verified Listings**: Find rooms, apartments, and hostels near campus.
- **Agent Verification**: Only verified agents and landlords can list properties.
- **Direct Communication**: Call or message landlords directly from the app.

### 💬 Professional Communication
- **P2P Chat System**: Real-time messaging between buyers, sellers, and agents.
- **AI Support Chat**: 24/7 customer support pop-up for instant assistance.
- **Rich Messaging**: Support for images, attachments, and status updates.

### 💳 Secure Payments
- **Multi-Currency Support**: Pay with Nigerian Naira (NGN) or Cryptocurrency (USDT/ETH).
- **Payment Methods**: Card payments, bank transfers, and crypto wallet transfers.
- **Secure Escrow**: Protection for both buyers and sellers on high-value items and services.

### 🛡️ Security & Reliability
- **Rate Limiting**: Protection against spam and automated abuse.
- **Vendor Verification**: Identity verification process for all sellers.
- **Cookie Management**: Professional cookie consent and privacy handling.

---

## 🚀 Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS 4
- **UI Components**: Shadcn UI (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Hash-based Routing for SPA stability
- **Payment Simulation**: Smart Contract Escrow Logic

---

## 🛠️ Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Run the development server**:
   ```bash
   pnpm dev
   ```
4. **Build for production**:
   ```bash
   pnpm build
   ```

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/       # UI Components & Sections
│   │   ├── ui/           # Shadcn UI Base Components
│   │   ├── ChatSystem    # P2P Messaging Logic
│   │   ├── VendorPortal  # Vendor Registration & Dashboard
│   │   ├── JobMarketplace# Gig Economy & Escrow
│   │   └── ...           # Hero, Header, Footer, etc.
│   └── App.tsx           # Main Application & Routing
├── styles/               # Global & Theme Styles
└── main.tsx              # Entry Point
```

---

## 📄 Documentation

### Vendor Verification Process
To get a **Verification Tag**, vendors must:
1. Register on the [Vendor Portal](file:///c%3A/Users/Admin/Desktop/OUI%20MARKET/src/app/components/VendorPortal.tsx).
2. Upload a valid Student ID or NIN.
3. Pass the manual review process (simulated).

### Smart Contract Escrow
For Job listings:
1. Client posts a gig with a budget.
2. Student applies and is selected.
3. Client deposits funds into the **Escrow Contract**.
4. Student completes the work.
5. Client approves, and funds are released to the student's wallet.

---

## 🛡️ License

Private Property of OUI Market Team. All Rights Reserved.
