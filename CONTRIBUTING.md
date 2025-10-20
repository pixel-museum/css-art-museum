# 🤝 Contributing to CSS Art Museum

First of all, thank you for considering contributing to **CSS Art Museum**! 🎨  
We welcome all kinds of contributions, whether you are a beginner or experienced developer.  
This project is beginner-friendly and Hacktoberfest-eligible, so feel free to participate and showcase your creativity.

---

## 🎨 How to Contribute

### Step 1: Create Your Artwork

Navigate to the `/arts/` folder and create a new HTML file:
```bash
cd arts/
# Create your file: yourname-artname.html
```

**File Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Art Title</title>
    <style>
        /* Your CSS magic here */
    </style>
</head>
<body>
    <!-- Your HTML structure -->
    <script>
        // Optional JavaScript
    </script>
</body>
</html>
```

### Step 2: Register Your Art

Update the `arts.json` file (or the gallery page) to include your artwork:
```json
{
"file":"amansingh-ballJump.html",
"title":"Bouncing Ball",
"author":"Aman Singh",
"tags":["animation","ball","bouncing"],
"description":"An animated ball that bounces up the stairs continuously.",
"date":"2025-10-18"
}
```

### Step 3: Add Yourself as a Contributor

📝 **Important:** Don't forget to add yourself to our contributors list!

1. Open `Contributors/contributors.json`
2. Check if your username is already listed
3. If not, add your entry at the end:
```json
{
  "username": "your-github-username"
}
```

### Step 4: Commit Your Changes
```bash
git add .
git commit -m "Added CSS artwork: yourname-artname"
git push origin my-artwork-<#issue number>
```

### Step 5: Create a Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & Pull Request"**
3. Fill in the PR template with:
   - Clear title describing your artwork
   - Screenshot of your code
   - Screenshot/GIF of the final output
4. Submit and wait for review! 🎉

---

## 📌 Contribution Rules

Please follow these contribution rules to ensure your PR is valid, accepted, and appreciated! 💫

### ✅ DO

- Create **original CSS artwork** — no copied templates, images, or JavaScript.  
- Use proper **file naming convention:** `yourname-artname.html` for file and `my-artwork-<#issue number>` for branch name.  
- Keep your code **clean, well-indented, and well-commented**.  
- Add your artwork to the **`index.html` gallery page**.  
- Include **screenshots** of both your code and output in your PR.  
- Test your artwork in **multiple browsers** to ensure compatibility.  
- Follow **proper naming conventions** for files and folders.  
- Be **respectful, collaborative,** and helpful in discussions.  
- Submit **one PR per artwork or fix** for clarity.  

### ❌ DON'T

- Submit any artwork containing **copyrighted material**.  
- Make **typo-only** or **text-only** PRs — these will be marked invalid.  
- Use **external image files** unless absolutely necessary.  
- Submit work **without proper documentation** or screenshots.  
- Create **spammy or irrelevant** pull requests.  

### 🏷️ PR Labels

All valid and merged contributions will receive the **`hacktoberfest-accepted`** label. 🎉

---

## 🔰 Other Ways to Contribute

Even if you are not creating artwork, you can still help the project grow:

- 🎨 Improving **gallery layout**  
- 📱 Making the site **responsive for mobile devices**  
- ✨ Adding **hover effects, animations, or visual enhancements**  
- 📝 Updating **documentation or README**  
- 🐞 Fixing **bugs or small CSS issues**  

Check issues labeled `good first issue` or `help wanted` to get started!

---

## 🏆 Hacktoberfest 2025

This repository is part of **Hacktoberfest 2025**.  

- All valid contributions will be marked with the `hacktoberfest-accepted` label.  
- Make at least **4 valid PRs** (here or across repositories) to complete Hacktoberfest.  
- Only meaningful and original contributions will count toward Hacktoberfest.  

Get ready, have fun, and enjoy contributing! 🎉



      

