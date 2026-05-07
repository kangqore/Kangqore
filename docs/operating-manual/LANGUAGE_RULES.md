# Language Rules - When to Use Node.js vs Python vs Others

> [!IMPORTANT]
> This document establishes **clear rules** on when to use each programming language. Violations will result in code rejection during review.

---

## 🎯 Language Decision Matrix

| Scenario | Language | Rationale |
|----------|----------|-----------|
| Frontend UI | JavaScript/TypeScript (React) | Client-side execution |
| Authentication & Authorization | Node.js (TypeScript) | Core Backend responsibility |
| RESTful API Endpoints | Node.js (TypeScript) | Core Backend responsibility |
| Database CRUD Operations | Node.js (TypeScript) | Prisma ORM integration |
| Business Logic | Node.js (TypeScript) | Core Backend responsibility |
| CMS Operations | Node.js (TypeScript) | Core Backend responsibility |
| Analytics & Insights | Python | Intelligence Layer responsibility |
| Machine Learning | Python | Intelligence Layer responsibility |
| Data Science / Statistical Analysis | Python | Intelligence Layer responsibility |
| Build Scripts | Bash/Shell | DevOps tooling |
| Infrastructure as Code | YAML (Docker Compose) | Container orchestration |

---

## 🟢 Node.js (TypeScript) - When to Use

### ✅ ALWAYS Use Node.js For:

1. **API Layer (Core Backend)**
   ```typescript
   // ✅ CORRECT: All user-facing APIs in Node.js
   app.post('/api/auth/login', loginController);
   app.get('/api/dashboard/stats', authenticate, getDashboardStats);
   app.post('/api/admin/content', authenticate, authorize('admin'), createContent);
   ```

2. **Authentication & Authorization**
   ```typescript
   // ✅ CORRECT: JWT generation/validation in Node.js
   const token = jwt.sign(
     { userId: user.id, role: user.role },
     process.env.JWT_SECRET!,
     { expiresIn: '24h' }
   );
   ```

3. **Database Operations (via Prisma)**
   ```typescript
   // ✅ CORRECT: All writes happen in Node.js
   const user = await prisma.user.create({
     data: {
       email: 'user@example.com',
       passwordHash: await bcrypt.hash(password, 10),
       role: 'USER'
     }
   });
   ```

4. **Business Logic**
   ```typescript
   // ✅ CORRECT: Business rules in Node.js
   function canUserAccessContent(user: User, content: Content): boolean {
     if (content.visibility === 'PUBLIC') return true;
     if (user.role === 'ADMIN') return true;
     return content.authorId === user.id;
   }
   ```

5. **Request Proxying to Intelligence Layer**
   ```typescript
   // ✅ CORRECT: Node.js proxies to Python
   app.get('/api/dashboard/insights', authenticate, async (req, res) => {
     const insights = await axios.get(
       `${PYTHON_SERVICE_URL}/analytics/insights`,
       { params: { userId: req.user.id } }
     );
     res.json(insights.data);
   });
   ```

6. **File Uploads & CMS**
   ```typescript
   // ✅ CORRECT: Node.js handles file uploads
   app.post('/api/admin/upload', authenticate, upload.single('file'), uploadController);
   ```

### ❌ NEVER Use Node.js For:
- Heavy data processing (use Python)
- Machine learning (use Python)
- Complex mathematical computations (use Python)
- Statistical analysis (use Python)

---

## 🐍 Python - When to Use

### ✅ ALWAYS Use Python For:

1. **Analytics & Insights**
   ```python
   # ✅ CORRECT: Analytics in Python
   @app.get("/analytics/insights")
   def get_insights(user_id: int):
       # Aggregate and compute insights
       df = pd.DataFrame(fetch_user_activity(user_id))
       insights = {
           "total_sessions": len(df),
           "avg_session_duration": df["duration"].mean(),
           "most_active_hour": df["hour"].mode()[0]
       }
       return insights
   ```

2. **Machine Learning Models**
   ```python
   # ✅ CORRECT: ML predictions in Python
   @app.post("/ml/predict")
   def predict(features: PredictionRequest):
       model = load_model("trained_model.pkl")
       prediction = model.predict([features.to_array()])
       return {"prediction": prediction[0]}
   ```

3. **Data Aggregation & Processing**
   ```python
   # ✅ CORRECT: Heavy data processing in Python
   def aggregate_user_metrics(user_ids: list[int]) -> dict:
       df = pd.DataFrame(fetch_metrics(user_ids))
       return {
           "total_users": len(df),
           "total_revenue": df["revenue"].sum(),
           "avg_spend": df["revenue"].mean(),
           "cohort_analysis": df.groupby("cohort")["revenue"].sum().to_dict()
       }
   ```

4. **Statistical Analysis**
   ```python
   # ✅ CORRECT: Statistics in Python
   from scipy import stats
   
   def run_ab_test(control: list, variant: list) -> dict:
       t_stat, p_value = stats.ttest_ind(control, variant)
       return {
           "t_statistic": t_stat,
           "p_value": p_value,
           "significant": p_value < 0.05
       }
   ```

5. **Recommendations Engine**
   ```python
   # ✅ CORRECT: Recommendation logic in Python
   def get_recommendations(user_id: int, limit: int = 10):
       user_vector = get_user_embedding(user_id)
       item_vectors = get_all_item_embeddings()
       similarities = cosine_similarity([user_vector], item_vectors)[0]
       top_indices = np.argsort(similarities)[-limit:][::-1]
       return [item_ids[i] for i in top_indices]
   ```

### ❌ NEVER Use Python For:
- User-facing API authentication
- Database write operations (use Node.js)
- Session management (use Node.js)
- Business workflow logic (use Node.js)
- Accepting direct requests from Frontend

### ⚠️ Python Only as Internal Service
```python
# ❌ WRONG: Python accepting Frontend requests
@app.get("/insights")
def get_insights(authorization: str):  # DO NOT DO THIS
    token = verify_jwt(authorization)  # AUTH BELONGS IN NODE.JS
    ...

# ✅ CORRECT: Python trusts Core Backend
@app.get("/analytics/insights")
def get_insights(user_id: int):  # Node.js already validated user
    # Just compute and return
    return compute_insights(user_id)
```

---

## 🌐 JavaScript (React) - When to Use

### ✅ ALWAYS Use JavaScript/React For:

1. **User Interface Components**
   ```javascript
   // ✅ CORRECT: UI rendering in React
   function Dashboard() {
     const [insights, setInsights] = useState(null);
     
     useEffect(() => {
       // Fetch from Core Backend ONLY
       axios.get('/api/dashboard/insights')
         .then(res => setInsights(res.data));
     }, []);
     
     return <div>{insights && <InsightsChart data={insights} />}</div>;
   }
   ```

2. **Client-Side Routing**
   ```javascript
   // ✅ CORRECT: Client-side navigation
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/dashboard" element={<Dashboard />} />
     </Routes>
   </BrowserRouter>
   ```

3. **UI State Management**
   ```javascript
   // ✅ CORRECT: UI state in React
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   ```

4. **Display Logic (NOT Business Logic)**
   ```javascript
   // ✅ CORRECT: Display formatting only
   function formatCurrency(amount) {
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD'
     }).format(amount);
   }
   
   // ❌ WRONG: Business logic in Frontend
   function calculateDiscount(user, product) {
     if (user.isPremium && product.price > 100) {
       return product.price * 0.2;  // THIS BELONGS IN NODE.JS
     }
   }
   ```

### ❌ NEVER Use JavaScript (Frontend) For:
- Authentication logic (use Node.js)
- Database queries (use Node.js)
- Business rules (use Node.js)
- Data transformations beyond formatting (use Node.js or Python)
- Calling Intelligence Layer directly

---

## 🐚 Bash/Shell Scripts - When to Use

### ✅ ALWAYS Use Bash For:

1. **Development Environment Setup**
   ```bash
   # ✅ CORRECT: Setup scripts
   #!/bin/bash
   # setup.sh
   docker-compose up -d
   cd core-backend && npm install
   cd ../frontend && npm install
   ```

2. **Build & Deployment Automation**
   ```bash
   # ✅ CORRECT: Deployment scripts
   #!/bin/bash
   # deploy.sh
   npm run build
   docker build -t kangqore-backend .
   docker push kangqore-backend:latest
   ```

3. **Database Maintenance**
   ```bash
   # ✅ CORRECT: Database scripts
   #!/bin/bash
   # backup_db.sh
   pg_dump -U kangqore_user kangqore_core > backup.sql
   ```

### ❌ NEVER Use Bash For:
- Application logic (use Node.js or Python)
- API endpoints (use Node.js)
- Data processing (use Python)

---

## 📋 Decision Flowchart

```
┌─────────────────────────────────────────┐
│     What are you trying to build?       │
└─────────────┬───────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │  User Interface?    │
    └─────────────────────┘
              │ YES → Use React (JavaScript)
              │
              ▼ NO
    ┌─────────────────────┐
    │  API Endpoint or    │
    │  Database Operation?│
    └─────────────────────┘
              │ YES → Use Node.js (TypeScript)
              │
              ▼ NO
    ┌─────────────────────┐
    │  Analytics, ML, or  │
    │  Heavy Computation? │
    └─────────────────────┘
              │ YES → Use Python
              │
              ▼ NO
    ┌─────────────────────┐
    │  Build/Deploy       │
    │  Automation?        │
    └─────────────────────┘
              │ YES → Use Bash
              │
              ▼ NO
       ❌ Re-evaluate need
```

---

## 🔍 Real-World Examples

### Example 1: User Recommendations Feature

**Question**: We need to recommend products to users. Which language?

**Answer**:
```typescript
// Node.js (Core Backend) - API Endpoint
app.get('/api/recommendations', authenticate, async (req, res) => {
  const userId = req.user.id;
  
  // Call Python service
  const recommendations = await axios.get(
    `${PYTHON_SERVICE_URL}/ml/recommendations?user_id=${userId}`
  );
  
  // Fetch product details from DB
  const products = await prisma.product.findMany({
    where: { id: { in: recommendations.data.product_ids } }
  });
  
  res.json(products);
});
```

```python
# Python (Intelligence Layer) - ML Computation
@app.get("/ml/recommendations")
def get_recommendations(user_id: int):
    user_features = get_user_features(user_id)
    model = load_recommendation_model()
    predicted_products = model.predict(user_features)
    return {"product_ids": predicted_products.tolist()}
```

### Example 2: Dashboard Statistics

**Question**: Show total users, revenue, and trends. Which language?

**Answer**:
```typescript
// Node.js - Simple aggregation (no ML needed)
app.get('/api/admin/stats', authenticate, authorize('admin'), async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: { amount: true }
  });
  
  res.json({
    totalUsers,
    totalRevenue: totalRevenue._sum.amount
  });
});
```

**BUT** if complex trend analysis is needed:
```typescript
// Node.js - Proxy to Python for trends
app.get('/api/admin/trends', authenticate, authorize('admin'), async (req, res) => {
  const trends = await axios.get(`${PYTHON_SERVICE_URL}/analytics/trends`);
  res.json(trends.data);
});
```

```python
# Python - Complex trend analysis
@app.get("/analytics/trends")
def get_trends():
    df = fetch_revenue_data()
    df["moving_avg"] = df["revenue"].rolling(window=7).mean()
    df["trend"] = np.where(df["moving_avg"].diff() > 0, "up", "down")
    return df.tail(30).to_dict(orient="records")
```

---

## 🚨 Common Mistakes & Fixes

### ❌ Mistake 1: Business Logic in Frontend
```javascript
// ❌ WRONG
function canEditPost(user, post) {
  return user.role === 'ADMIN' || post.authorId === user.id;
}
```
**Fix**: Move to Node.js backend.

### ❌ Mistake 2: Authentication in Python
```python
# ❌ WRONG
@app.get("/insights")
def get_insights(token: str):
    user = verify_jwt(token)
    ...
```
**Fix**: Remove auth from Python, let Node.js handle it.

### ❌ Mistake 3: Heavy Computation in Node.js
```typescript
// ❌ WRONG
app.get('/api/trends', async (req, res) => {
  const data = await prisma.order.findMany();
  const trend = calculateComplexTrend(data); // HEAVY CPU
  res.json(trend);
});
```
**Fix**: Proxy to Python for heavy computation.

---

## ✅ Language Choice Checklist

Before writing code, ask:
- [ ] Does this involve UI rendering? → **React**
- [ ] Does this involve authentication or DB writes? → **Node.js**
- [ ] Does this involve business logic? → **Node.js**
- [ ] Does this involve analytics or ML? → **Python**
- [ ] Does this involve build/deployment? → **Bash**
- [ ] Is this called by Frontend? → **Node.js only**

---

**Last Updated**: 2026-01-08  
**Authority**: Architecture Review Board  
**Status**: MANDATORY - No Exceptions
