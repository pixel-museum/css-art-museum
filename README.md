<!-- Centered banner for README -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C2FF,100:FF5F9E&height=200&section=header&text=🎨%20CSS%20Art%20Museum%20🎨&fontSize=45&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35" alt="CSS Art Museum Banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&size=28&duration=3500&pause=1000&color=00C2FF&center=true&vCenter=true&width=600&lines=Where+Code+Meets+Creativity!;Contribute+Your+CSS+Art+for+Hacktoberfest+2025!;HTML+%2B+CSS+%2B+JavaScript+Masterpieces!" alt="Typing SVG" />
</p>

### How to Contribute

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
```mermaid
flowchart TD
    A[Fork the Repository] --> B[Clone your fork locally]
    B --> C[Create artwork branch]
    C --> D[Navigate to /arts/ folder]
    D --> E[Create artwork HTML file]
    E --> F[Add HTML + CSS artwork<br/>No JS/images]
    F --> G[Update arts.json with artwork info]
    G --> H[Commit and push changes]
    H --> I[Create Pull Request]
    
    subgraph G [Update arts.json]
        G1[Add new entry with<br/>file, title, and author]
    end
    
    subgraph E [Create artwork file]
        E1[Filename format:<br/>yourname-artname.html]
    end
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style E fill:#fff3e0
    style G fill:#f3e5f5
```
## 🤝 Contributors Recognition

We ❤️ every contribution! Whether it’s code, CSS art, or ideas, we want to give you **props** on our **Contributors Page**.  

---

###  How to Add Yourself

1. **Open** the file: [`Contributors/contributors.json`](Contributors/contributors.json)  
2. **Check if your GitHub username is listed**  
   - ✅ Already listed → No action needed!  
   - ❌ Not listed → Add yourself at the **end of the list**  

3. **Add your username** like this:
```json
{
  "username": "your-github-username"
}
```

4. **Commit & push your changes:**
```bash
git add .
git commit -m "Added CSS artwork: yourname-artname"
git push origin my-artwork
```

5. **Create a Pull Request (PR):**

Go to your fork → Click Compare & Pull Request
Add a screenshot of your artwork in the PR description
Once merged, your name will appear on the Contributors Page 🎉



---

## 📌 Rules
- Only **original CSS art** (no images)  
- Keep code clean and commented  
- Small contributions (like text/typo only) will be marked invalid  
- PRs will be accepted with `hacktoberfest-accepted` label

- ⚠️ Note: When raising a PR, please add a screenshot of both your code changes and the output/result. PRs without screenshots may take longer to review.

--- 
<div align="center">

## 💌 Happy Contributing! 💖

<!-- Typing-style SVGs -->
<svg height="40" width="300">
  <text x="0" y="25" fill="#FF69B4" font-size="20" font-family="monospace">✨ Keep Creating ✨</text>
</svg>

<svg height="40" width="350">
  <text x="0" y="25" fill="#00CED1" font-size="20" font-family="monospace">⌨️ Typing... Typing... ⌨️</text>
</svg>


![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)
![Issues](https://img.shields.io/badge/Issues-Open-yellow)
![Hacktoberfest 2025](https://img.shields.io/badge/Hacktoberfest-2025-blueviolet)
![Contributors](https://img.shields.io/badge/Contributors-🎉-orange)

---

Made with ❤️ by **Shamli** and fellow **Contributors of the Pixel Museum Community**.

</p>
</div>
