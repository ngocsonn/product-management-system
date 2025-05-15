
## Setup & installation instructions
- Create .env file: `move .env.example .env` and update env variables
### Use docker
- Move to repository: `cd product-management-system`
- Run command `docker compose up -d --build`
### Manual 
- Install postgres
- Node version `22.12.0`
- Move to repository: `cd product-management-system`
- Run commands:
```
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run start:dev
```
### API document url (Swagger): 
`http://localhost:3000/api#/`
I was seed user data, so you can use under user info to login, all of users have the same password is `pass`
```
user-01@gmail.com
user-02@gmail.com
user-03@gmail.com
user-04@gmail.com
user-05@gmail.com
```

## Explanation of caching, optimization strategies, and like feature
### Caching
Caching is a technique used to improve data access speed and reduce system load. A cache is a storage area that holds a collection of data, usually temporary in nature, allowing reuse of previously retrieved or computed data. This helps accelerate data access in subsequent operations.
### Optimization strategies
#### 1. 🧹 Cache Invalidation
Ensure the cache is refreshed correctly.  
When the original data changes (e.g., a database update), the cache must be **cleared or updated** to maintain consistency.

#### 2. 🧺 Eviction Policies
Since cache has **limited capacity**, old or unused data needs to be removed.  
Common eviction strategies include:
- **LRU (Least Recently Used)**
- **LFU (Least Frequently Used)**
- **FIFO (First In, First Out)**

#### 3. 🚀 Cache Preloading / Warm-up
Preload frequently accessed data into the cache during **system startup**, instead of waiting for users to trigger it.

✅ Helps reduce **initial latency**  
✅ Improves **user experience**

#### 4. ⏱️ Time-To-Live (TTL) Setting
Set a **lifetime** for each cache item (e.g., 5 minutes, 1 hour).  
Once expired, the cache is automatically **deleted or refreshed**.

🔁 Balances **data freshness** and **system performance**

## 👍 Like Feature

This feature allows users to like or unlike a product. Each user can only like a product once.

### How it works:
- When a user sends a POST request to `/products/:id/like`, the system checks:
  - If the user **has not liked** the product → a new like is added.
  - If the user **has already liked** the product → the like is removed .
- The product's total number of likes is updated accordingly.
- This endpoint **requires authentication** to identify the user.
- **Invalidate cache**: Update the product cache to ensure the latest data is displayed on subsequent requests.

### Example:
- User A sends `POST /products/123/like`
  - If A hasn’t liked product 123 → like count increases by 1.
  - If A has already liked → the like is removed → like count decreases by 1.
  - **Invalidate cache** to ensure the latest data is displayed on subsequent requests

## ⚠️ NOTE

This project uses **in-memory caching** provided by the application server. Since the project is small and handles a low volume of data, this approach is sufficient.

If your project grows in complexity or scale, you can easily switch to a more robust caching solution like **Redis** or **Memcached**.

🔧 The caching logic is **modularized** in a separate cache module, so you only need to update that module to change the caching strategy.