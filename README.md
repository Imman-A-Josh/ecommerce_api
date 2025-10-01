# E-Commerce Backend Project (Node.js + Express + MySQL )

## Overview
Developed a full-featured e-commerce backend with **Node.js, Express, MySQL**, JWT-based authentication, Razorpay payment integration, and complete product, store, and order management. The project demonstrates modular architecture, best practices, and real-world e-commerce workflows.

---

## Key Features

1. **Node/Express API Setup**  
   - Configured environment variables for MySQL, JWT, SMTP, Razorpay.  
   - Connected to MySQL and implemented SQL-based data management.  

2. **User Authentication (Admin)**  
   - Registration/login endpoints with bcrypt password hashing.  
   - JWT-based authentication and protected routes.  

3. **Customer Authentication**  
   - Separate Customer model with default address and coordinates.  
   - Profile fetch and address update endpoints.

4. **Product Management**  
   - CRUD operations with Brand & Category associations.  
   - Optional image upload via Multer + Cloudinary. 

5. **Store Management**  
   - CRUD operations with address and coordinates.  
   - Many-to-many relationship with products.  
   - Nearby stores calculation using Haversine formula.

6. **Brand & Category Management**  
   - Admin can create brands and categories with uniqueness validation.  
   - Multi-category & multi-account support.  
   - Scoped endpoints for create/get-all/get-by-id.

7. **Product Listing & Pagination**  
   - Public listing with Brand & Category data.  
   - Search/filter and pagination support.  
   - Category-wise product listing.

8. **Cart Management**  
   - Authenticated customers can add/update/remove cart items.  
   - Validates product availability and store mapping.  
   - Maintains price snapshots for items.

9. **Order Management**  
   - Create order from cart with totals, taxes, and snapshots.  
   - Order statuses: `CREATED`, `PAYMENT_PENDING`, `PAID`, `FAILED`, `CANCELLED`.

10. **Payment Integration (Razorpay)**  
    - Razorpay Test Mode integration.  
    - Backend creates Razorpay orders, verifies payment signatures.  
    - Idempotent updates and webhook implementation (`payment.captured`).  

---

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MySQL / Sequelize ORM  
- **Authentication:** JWT, bcrypt  
- **Payment:** Razorpay  
- **Email:** Nodemailer / SMTP  
- **Image Upload:** Multer=

---

## Achievements
- Fully functional e-commerce backend with secure authentication, cart, and order workflows.  
- Payment integration with real-world Razorpay flow, including signature verification and webhooks.  
- Modular, scalable code architecture ready for production deployment.  
- Efficient relational database management with many-to-many relationships and advanced SQL queries.

---

## How to Run
1. Clone repo and install dependencies:
```bash
https://github.com/Imman-A-Josh/ecommerce_api
npm install

```

## Live Url 

```
https://ecommerce-api-1rgz.onrender.com
```
## POSTMAN Url 

```
https://documenter.getpostman.com/view/26184153/2sB3QFRsCq

```

## THANK YOU
