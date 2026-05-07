# Kangqore Admin Account Management

## Current Admin Credentials

### Default Admin Account
```
Email:    admin@kangqore.com
Password: Admin@123
```

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## How to Manage Admin Accounts

### Option 1: Using the Management Script (Recommended)

Run the interactive admin management script:

```bash
cd /app/backend
python manage_admins.py
```

**Features:**
1. **View all admin accounts** - See all existing admins
2. **Change admin password** - Update password for any admin
3. **Create new admin account** - Add additional administrators
4. **Exit** - Close the script

---

### Option 2: Using the Admin Dashboard

1. Login to the admin dashboard at: `http://your-domain.com/admin/dashboard`
2. Use the default credentials above
3. View and manage all users (including admins)
4. Activate/Deactivate user accounts

---

## Creating Additional Admins

### Method 1: Using Management Script
```bash
cd /app/backend
python manage_admins.py
# Select option 3: Create new admin account
# Follow the prompts
```

### Method 2: Using create_admin.py
```bash
cd /app/backend
python create_admin.py
# This creates another admin with default credentials
```

### Method 3: Register via Frontend
1. Go to `/register`
2. Create account with any role
3. Use admin dashboard to manually change role to "admin" in database

---

## Changing Admin Password

### Method 1: Management Script (Easiest)
```bash
cd /app/backend
python manage_admins.py
# Select option 2: Change admin password
```

### Method 2: Direct Database Update
```bash
cd /app/backend
python -c "
from manage_admins import change_admin_password
import asyncio
asyncio.run(change_admin_password())
"
```

---

## Security Best Practices

1. **Change Default Password Immediately**
   - Use a strong password (min 12 characters)
   - Include uppercase, lowercase, numbers, and symbols
   - Example: `Kangq0re@2025!Secure`

2. **Create Multiple Admins**
   - One admin per administrator
   - Use unique passwords for each
   - Easy to track who made what changes

3. **Regular Password Updates**
   - Change passwords every 90 days
   - Never share passwords via email
   - Use password manager

4. **Monitor Admin Activity**
   - Check admin dashboard regularly
   - Review user changes
   - Deactivate unused admin accounts

---

## Quick Commands Reference

**View all admins:**
```bash
cd /app/backend
python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
load_dotenv()
async def show():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    admins = await db.users.find({'role': 'admin'}, {'_id': 0, 'password': 0}).to_list(100)
    for a in admins:
        print(f\"{a['name']} - {a['email']}\")
    client.close()
asyncio.run(show())
"
```

**Count total users:**
```bash
cd /app/backend
python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
load_dotenv()
async def count():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    total = await db.users.count_documents({})
    print(f'Total users: {total}')
    client.close()
asyncio.run(count())
"
```

---

## Admin Dashboard Features

Access at: `/admin/dashboard`

**Statistics:**
- Total Users
- Users by Role (Clients, Investors, Job Seekers, Admins)
- Active Users
- Completed Profiles

**User Management:**
- Search users by name/email
- Filter by role
- View user details
- Activate/Deactivate accounts
- Real-time updates

---

## Troubleshooting

**Can't login as admin?**
1. Verify credentials are correct (case-sensitive)
2. Check if admin account exists: `cd /app/backend && python manage_admins.py`
3. Ensure account is active

**Forgot admin password?**
1. Run: `cd /app/backend && python manage_admins.py`
2. Select option 2: Change admin password
3. Select the admin account
4. Enter new password

**Need to reset to default?**
1. Delete admin account from database
2. Run: `cd /app/backend && python create_admin.py`
3. This recreates admin@kangqore.com with Admin@123

---

## Support

For additional help with admin account management:
1. Check backend logs: `/var/log/supervisor/backend.err.log`
2. Run management script in debug mode
3. Contact IT support

---

**Last Updated:** December 30, 2025
**System:** Kangqore Multi-Role Authentication System
