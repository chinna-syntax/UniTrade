# UniTrade - Enterprise Campus Marketplace

UniTrade is a secure, high-performance campus marketplace for discovering, listing, and exchanging products within trusted university communities. The platform is designed for production operation, horizontal scaling, real-time collaboration, and reliable media delivery across web and mobile-ready clients.

## Platform Capabilities

- University email-based identity and access control
- Searchable, categorized product marketplace
- Seller-managed listings with availability state
- Secure image upload and responsive media delivery
- Real-time buyer and seller conversations
- Paginated feeds and indexed marketplace search
- Motion-enhanced React interface with accessible responsive layouts
- Operational separation between the client, API, real-time transport, and persistence layers

## 1. System Architecture

UniTrade follows a modular MERN architecture with independently deployable presentation, application, and data services.

```text
Browser / Mobile Web
        |
        v
React.js 18 + Redux Toolkit + Tailwind CSS + Framer Motion
        |
        +-------------------- REST/HTTPS --------------------+
        |                                                    |
        v                                                    v
Node.js + Express.js API                            Socket.io Gateway
        |                                                    |
        +----------------------+-----------------------------+
                               |
                               v
                         MongoDB Cluster
                               |
                               +--> Cloudinary Media Storage/CDN
```

### Frontend

- **React.js 18** provides the component model and concurrent rendering foundation.
- **Redux Toolkit** owns shared client state such as the authenticated session, marketplace filters, listing data, and chat state.
- **Tailwind CSS** supplies the responsive design system, utility composition, spacing scale, typography, and breakpoint behavior.
- **Framer Motion** provides GPU-friendly interaction feedback, scroll reveals, staggered listing-grid loading, hover physics, and route-level page transitions.
- Feature modules communicate through a consistent API boundary so loading, error, and optimistic-update states remain predictable.

### Backend

- **Node.js** runs the application services and real-time event layer.
- **Express.js** exposes versioned REST endpoints, authentication middleware, validation, authorization, pagination, and health checks.
- **Socket.io** provides authenticated, low-latency chat rooms. A room is scoped to the buyer, seller, and product conversation.
- The service layer separates request validation, business rules, persistence, media orchestration, and transport concerns.

### Data and media

- **MongoDB** stores users, products, messages, indexes, and marketplace metadata.
- **Cloudinary** stores product media outside the API process, generates optimized delivery URLs, and supports transformations, responsive sizing, format negotiation, and CDN caching.
- Product and message queries use compound indexes and stable pagination boundaries so latency remains predictable as the catalog grows.

## 2. Database Schema Design

All identifiers use MongoDB `ObjectId` values. Timestamps are stored in UTC and collections include `createdAt` and `updatedAt` metadata where applicable.

### User Model

```js
{
  _id: ObjectId,
  name: String,
  email: String,                 // normalized and validated against the approved .edu domain
  passwordHash: String,          // bcrypt hash; plaintext passwords are never persisted
  hostelBlock: String,
  graduationYear: Number,
  avatarUrl: String,
  role: "user" | "admin",
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes and rules**

- `email` is unique, normalized, and validated against the institution's `.edu` policy.
- `passwordHash` is generated with bcrypt using a production-appropriate work factor.
- Sensitive fields are excluded from default API serialization.
- `hostelBlock` and `graduationYear` support trusted campus context and profile filtering.

### Product Model

```js
{
  _id: ObjectId,
  sellerId: ObjectId,            // ref: User
  title: String,                 // text-indexed
  description: String,
  price: Number,
  category: String,
  condition: "Like New" | "Good" | "Fair",
  status: "Available" | "Sold",
  images: [
    {
      publicId: String,
      secureUrl: String,         // Cloudinary HTTPS delivery URL
      width: Number,
      height: Number,
      format: String
    }
  ],
  location: {
    hostelBlock: String,
    campus: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes and rules**

- `title` is text-indexed for relevance-ranked search.
- Recommended indexes: `{ status: 1, createdAt: -1 }`, `{ category: 1, status: 1, createdAt: -1 }`, and `{ sellerId: 1, createdAt: -1 }`.
- `sellerId` references `User`; ownership is checked server-side for updates and deletes.
- `images` contains only Cloudinary secure URLs and public IDs. Upload signatures and transformations remain server-controlled.
- `status` transitions are explicit and auditable; sold listings are excluded from active marketplace results.

### Message Model

```js
{
  _id: ObjectId,
  conversationId: String,
  productId: ObjectId,           // ref: Product
  buyerId: ObjectId,             // ref: User
  sellerId: ObjectId,            // ref: User
  senderId: ObjectId,            // ref: User
  body: String,
  readAt: Date | null,
  createdAt: Date
}
```

`conversationId` is deterministic for the product/buyer/seller tuple. A compound index on `{ conversationId: 1, createdAt: 1 }` supports ordered history retrieval, while `{ senderId: 1, readAt: 1 }` supports unread-message counts. Socket.io emits messages after persistence succeeds, allowing reconnecting clients to recover from MongoDB without losing ordering.

## 3. Core API Endpoints

The REST API is versioned under `/api` and returns JSON. Protected endpoints require an authenticated session and enforce resource ownership.

### Authentication

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account after validating the approved `.edu` email, password policy, hostel block, and graduation year. |
| `POST` | `/api/auth/login` | Authenticate credentials and issue a secure session token in an HTTP-only cookie. |
| `POST` | `/api/auth/logout` | Revoke the current session and clear authentication cookies. |
| `GET` | `/api/auth/me` | Return the authenticated user's safe profile representation. |
| `POST` | `/api/auth/refresh` | Rotate an expiring access session using the refresh-session policy. |

### Products

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List available products with pagination, category, condition, status, price, and sort filters. |
| `POST` | `/api/products` | Create a product listing for the authenticated seller. |
| `GET` | `/api/products/:productId` | Fetch a product, seller summary, media, and availability state. |
| `PATCH` | `/api/products/:productId` | Update an owned listing, including title, price, condition, category, and media references. |
| `DELETE` | `/api/products/:productId` | Remove an owned listing or apply the configured archival policy. |
| `PATCH` | `/api/products/:productId/status` | Mark a listing `Available` or `Sold` after ownership validation. |
| `GET` | `/api/products/search?q=<term>` | Search text-indexed title and description fields with pagination and relevance ordering. |

Pagination responses use a stable page contract:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 0,
    "hasNextPage": false
  }
}
```

### Real-time messaging

Socket.io authenticates during the handshake and authorizes room membership before joining `conversation:<conversationId>`. Typical events include `conversation:join`, `message:send`, `message:created`, `message:read`, and `conversation:typing`. REST history endpoints remain the source of truth for reconnect and pagination.

## 4. Security Measures

- **JWT with HTTP-only cookies:** access and refresh tokens use `HttpOnly`, `Secure`, `SameSite`, and explicit expiration attributes. Tokens are rotated and invalidated according to session policy.
- **XSS protection and data sanitization:** request bodies, query strings, and path parameters are schema-validated; HTML is escaped or stripped from user-generated fields; MongoDB operators and prototype-pollution payloads are rejected.
- **Strict CORS policy:** only configured production and development origins are allowed. Credentials are enabled only for approved origins, methods, and headers.
- **IP-based rate limiting:** authentication, password recovery, search, upload, and message endpoints use independent IP/user buckets with a trusted proxy configuration.
- Passwords are bcrypt-hashed, never logged, and never returned through API serializers.
- Authorization middleware checks ownership for product mutations and conversation access.
- Cloudinary uploads use signed server-issued parameters, constrained MIME types, file sizes, transformations, and HTTPS delivery URLs.
- Security headers, structured audit logging, request correlation IDs, bounded request payloads, and centralized error handling are applied at the API boundary.

## 5. Local Development Setup

### Prerequisites

- Node.js **18 or newer**
- npm 9 or newer
- A MongoDB deployment accessible from the development machine
- A Cloudinary account with an upload configuration

### Environment variables

Create `server/.env` from `server/.env.example`:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/unitrade
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

The client may also use `client/.env` for browser-safe configuration:

```dotenv
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

Never commit `.env` files or expose `JWT_SECRET` and `CLOUDINARY_API_SECRET` to the browser.

### Install dependencies

From the repository root:

```bash
npm run install-all
```

The `install-all` orchestration installs the root, client, and server dependency trees with their lockfiles.

### Boot the application

From the repository root:

```bash
npm run dev
```

The development runner concurrently starts:

- Express API on `http://localhost:5000`
- React development server on `http://localhost:3000`

For isolated service work:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm start
```

### Production build

```bash
cd client
npm run build
```

The generated client bundle is deployable behind a CDN or reverse proxy. The Express service should run behind TLS termination, a process manager, and a health-aware load balancer in production.

## Operational Standards

- Use environment-specific configuration and secret management rather than checked-in credentials.
- Keep MongoDB indexes synchronized with migration reviews.
- Monitor API latency, error rates, Socket.io connection health, database saturation, Cloudinary failures, and authentication anomalies.
- Use rolling deployments with readiness checks and graceful Socket.io connection draining.
- Back up MongoDB according to the recovery point objective and test restoration regularly.

## Vercel Monorepo Deployment

The repository is deployable as one Vercel project; Render is not required. The root
`vercel.json` uses Vercel's legacy `builds` configuration to compile the React client
from `client/`, deploy the Express serverless function through `@vercel/node`, and
route every `/api/*` request to `api/index.js`.

1. Import the repository into Vercel and select the repository root as the project root.
2. Select the **Other** framework preset. The checked-in `builds` configuration supplies
   the frontend and backend builders.
3. Configure the production environment variables required by the server, including
   `JWT_SECRET`, `MONGO_URI`, and the Cloudinary credentials.
4. Use these dashboard settings when importing the root repository:

   - **Build Command:** `npm run build`
   - **Output Directory:** `client/build`
   - **Framework Preset:** `Other`

5. Deploy with the standard Vercel build, or validate locally:

```bash
npm run install-all
npm run build
```

The deployed frontend calls relative `/api/*` paths, so the browser uses the same
origin for the React application and Express API. Local development remains available
with `npm run dev`, which starts the client on port 3000 and the Express server on
port 5000 through the client proxy.
