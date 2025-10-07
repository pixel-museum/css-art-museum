# 🚀 Deploying with MongoDB Atlas + Render

Follow these steps to set up your database on **MongoDB Atlas** and deploy your app with **Render**.

---

## 1. Create a MongoDB Atlas Account & Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2. Create a **Free Tier Cluster** (M0).
3. Once created, Atlas will provide you with a **connection string** like this:

``` mongodb+srv://<username>:<password>@css-art-museum.umif2pm.mongodb.net/?retryWrites=true&w=majority&appName=css-art-museum ```

- Replace `<username>` and `<password>` with your own credentials.

---

## 2. Configure Network Access
1. In your Atlas dashboard, go to **Network Access**.
2. Add a new IP address:
``` 0.0.0.0 ```

This allows access from anywhere (good for testing).

---

## 3. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/login) and create an account.
2. Click **New → Web Service**.
3. Select your repository.
4. Fill in the settings:
- **Root Directory**: `./server`  
- **Build Command**: `npm install`
- **Start Command**: `npm run start`
---

## 4. Add Environment Variable
1. In the Render settings, add a new environment variable:
- **Name**: `MONGO_URI`  
- **Value**: *your MongoDB URI from step 1*  

⚠️ **Important**: The variable name must be exactly `MONGO_URI` or it won’t work.

---

## 5. Deploy 🚀
Hit **Deploy Static Site** and wait for Render to build your project.  

---

### ✅ Troubleshooting
- Double-check that your `MONGO_URI` is correct.  
- Make sure your username/password in the URI are **URL-encoded** if they contain special characters.  
- Confirm Atlas network access allows `0.0.0.0/0`.  
