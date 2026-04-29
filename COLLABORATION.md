# Team Collaboration Guide: GitHub for Hackathons

Welcome to the Deli Oracle team! We're using a simple **Branch -> PR -> Merge** workflow to make sure we don't step on each other's toes.

## 1. Setting Up (Do this once)
Before you start, make sure your local `main` is up to date with the latest backend changes:
```bash
git checkout main
git pull origin main
npm install
```

## 2. Working on your Task
**NEVER work directly on `main`.** Create a branch for your role:
- **Dev 1 (Prompt):** `git checkout -b feature/bernie-persona`
- **Dev 3 (UI):** `git checkout -b feature/projector-ui`
- **Dev 4 (Vibe):** `git checkout -b feature/interactions`

## 3. Saving & Pushing your Work
As you make changes, commit them and push your branch to GitHub:
```bash
git add .
git commit -m "Added the [feature name] logic"
git push origin your-branch-name
```

## 4. Merging to Main (The "Hand-off")
1. Go to GitHub and click **"Compare & pull request"** for your branch.
2. Tag the Backend Lead (@hirekarl) for a quick look.
3. Once approved, click **"Merge pull request."**
4. Switch back to `main` locally and pull the fresh code:
   ```bash
   git checkout main
   git pull origin main
   ```

## 5. Pro-Tips
- **Communicate:** If you're about to change `app/page.tsx`, tell Dev 3 and 4 so you don't overwrite each other.
- **Save Often:** Push your branch even if the feature isn't done—it’s your "cloud backup."
- **Broken Build?** If `npm run dev` fails after a pull, try `npm install`.
