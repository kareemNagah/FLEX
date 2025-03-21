# Welcome to FLEX Project

## Getting Started

## Development

### **Local Development**

To work on this project locally:

1. Clone this repository
2. Install dependencies
3. Start the development server

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ee9853f7-c7f1-4d0b-a93e-648634eb6538) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

First, you'll need to install Node.js and npm. There are two ways to do this:

**Option 1: Using apt (Recommended for Ubuntu/Debian users)**

1. Update your package list:
```sh
sudo apt update
```

2. Install Node.js and npm:
```sh
sudo apt install nodejs npm
```

3. Verify the installation:
```sh
node --version
npm --version
```

**Option 2: Using nvm (Node Version Manager)**

Alternatively, you can use nvm for managing multiple Node.js versions:

1. Install nvm:
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. Restart your terminal or run:
```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

3. Install Node.js LTS version:
```sh
nvm install --lts
nvm use --lts
```

4. Verify the installation:
```sh
node --version
npm --version
```

Then, follow these steps to set up the project:

```sh
# Step 1: Clone the repository using the project's Git URL
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

You can deploy this project using your preferred hosting platform like Netlify, Vercel, or GitHub Pages.
