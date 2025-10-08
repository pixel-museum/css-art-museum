# 🎨 CSS Art Museum

Welcome to the **CSS Art Museum**!  
This is an open-source project where developers can showcase their creativity using **HTML, CSS, and JavaScript**.  

Contribute your **CSS Art** during Hacktoberfest 2025 and become part of our gallery!  

---

### 🚀 How to Contribute

1. **Fork** this repo
2. **Clone** your fork locally
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/css-art-museum.git
    cd css-art-museum
    ```
    Create a branch for your **artwork**
    ```bash
    git checkout -b my-artwork
    ```

3. **Add your artwork**

    Navigate to the `/arts/` folder
    Create a new file: `yourname-artname.html` 
    Add your HTML + CSS artwork (no JS/images)
    Update `arts.json` or the gallery page to include your art.
   ```bash
    {
    "file": "example.html",
    "title": "example",
    "author": "example"
   }
   ```

## ✨ Contributors Recognition
We value each and every contribution! 🎉  
Along with your code/artwork changes, we also want to recognize you on our **Contributors Page**.  

### 📝 How to add yourself as a contributor
1. Go to the file: [`Contributors/contributors.json`](Contributors/contributors.json)
2. **Check if your GitHub username is already listed.**
   - ✅ If your name is already there → No action needed.  
   - ❌ If your name is not listed → Please add it at the end of the list.
3. Add your username in this format:
   ```json
   {
     "username": "your-github-username"
   }
   ```


5. **Commit & push your changes**

    ```bash
    git add .
    git commit -m "Added CSS artwork: yourname-artname"
    git push origin my-artwork
    ```
    Create a Pull Request (PR)
    Go to your fork on GitHub -> Click Compare & Pull Request
    Include a screenshot of your **artwork** in the PR description


---

## 📌 Rules
- Only **original CSS art** (no images)  
- Keep code clean and commented  
- Small contributions (like text/typo only) will be marked invalid  
- PRs will be accepted with `hacktoberfest-accepted` label

- ⚠️ Note: When raising a PR, please add a screenshot of both your code changes and the output/result. PRs without screenshots may take longer to review.

--- 

Happy contributing 💖
