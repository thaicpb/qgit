# MyGit - Custom Git Command Aliases Manager

MyGit is a CLI tool that helps you create and manage aliases (shortcuts) for common git and shell commands, speeding up your git workflow.

## 🚀 Features

- ✅ Create custom aliases for any git/shell command
- ✅ Support for dynamic parameters ($1, $2, ..., $@)
- ✅ Manage aliases via CLI (add, edit, remove, list)
- ✅ Easy-to-edit JSON config file
- ✅ Comes with many useful built-in aliases

## 📦 Installation

### Method 1: Local Installation

```bash
# Clone project
git clone <your-repo-url>
cd mygit

# Install dependencies
npm install

# Link globally for system-wide use
npm link
```

### Method 2: Install from npm (after publishing)

```bash
npm install -g mygit
```

## 🎯 Basic Usage

### Run built-in aliases

```bash
# Instead of: git status
mygit st

# Instead of: git commit -m "Initial commit"
mygit cmt "Initial commit"

# Instead of: git checkout develop
mygit co develop

# View pretty log
mygit recent

# Quick commit (add all + commit)
mygit save "Fix bug #123"
```

### Manage aliases

```bash
# List all aliases
mygit list
# or
mygit ls

# Add new alias
mygit add <alias> "<command>"
# Example:
mygit add hello "echo Hello World"
mygit add gp "git push origin $1"

# Edit alias
mygit edit <alias> "<new-command>"
# Example:
mygit edit cmt "git commit -m \"$1\" --no-verify"

# Remove alias
mygit remove <alias>
# or
mygit rm <alias>
# Example:
mygit rm hello

# Show config file path
mygit config
```

## 🔧 Config File Structure

Config file is stored at: `~/.mygitconfig.json`

```json
{
  "version": "1.0.0",
  "aliases": {
    "st": "git status",
    "cmt": "git commit -m \"$1\"",
    "co": "git checkout $@",
    "save": "git add -A && git commit -m \"$1\"",
    "custom": "your-custom-command $@"
  }
}
```

### Parameter Syntax

- `$1`, `$2`, `$3`... : Positional parameters
- `$@` : All parameters
- Can chain multiple commands with `&&`

### Advanced Alias Examples

```json
{
  "aliases": {
    // Commit with message
    "cmt": "git commit -m \"$1\"",
    
    // Checkout and create new branch
    "cob": "git checkout -b $1",
    
    // Add all and commit
    "save": "git add -A && git commit -m \"$1\"",
    
    // Push to specific branch
    "pushto": "git push origin $1",
    
    // Pull with rebase
    "pullr": "git pull --rebase origin $1",
    
    // All parameters
    "npm": "npm $@",
    
    // Pretty log
    "glog": "git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
  }
}
```

## 📝 Default Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `st` | `git status` | View status |
| `cmt` | `git commit -m "$1"` | Commit with message |
| `co` | `git checkout $@` | Checkout branch |
| `br` | `git branch $@` | Manage branches |
| `push` | `git push $@` | Push code |
| `pull` | `git pull $@` | Pull code |
| `log` | `git log --oneline -10` | View last 10 commits |
| `diff` | `git diff $@` | View changes |
| `add` | `git add $@` | Add files |
| `stash` | `git stash $@` | Stash changes |
| `recent` | `git log --oneline --graph --decorate -15` | Log with graph |
| `unstage` | `git reset HEAD $@` | Unstage files |
| `amend` | `git commit --amend` | Amend last commit |
| `undo` | `git reset --soft HEAD~1` | Undo last commit |
| `branches` | `git branch -a` | List all branches |
| `remotes` | `git remote -v` | View remotes |

## 🚢 Publishing to npm

### Step 1: Register npm account
```bash
npm adduser
```

### Step 2: Update package.json
Ensure the following information is complete:
- `name`: Package name (must be unique on npm)
- `version`: Version
- `description`: Description
- `author`: Author name
- `license`: License
- `keywords`: Search keywords

### Step 3: Create .npmignore file
```bash
# .npmignore
.git
.gitignore
.mygitconfig.example.json
node_modules/
*.log
.DS_Store
```

### Step 4: Test and publish
```bash
# Check files to be published
npm pack --dry-run

# Publish to npm
npm publish

# If name is taken, change name in package.json
# Example: @yourname/mygit
```

### Step 5: Install and use
```bash
# After successful publish
npm install -g mygit
# or with scoped package
npm install -g @yourname/mygit
```

## 🔄 Version Update

```bash
# Increment patch version (1.0.0 -> 1.0.1)
npm version patch

# Increment minor version (1.0.0 -> 1.1.0)
npm version minor

# Increment major version (1.0.0 -> 2.0.0)
npm version major

# Publish new version
npm publish
```

## 🛠️ Development

### Project Structure

```
mygit/
├── index.js           # Entry point, handles CLI commands
├── lib/
│   ├── config.js      # Config file management
│   ├── executor.js    # Command execution
│   └── alias-manager.js # CRUD operations for aliases
├── package.json       # Package configuration
├── README.md         # Documentation
└── .mygitconfig.example.json # Example config file
```

### Local Testing

```bash
# In project directory
node index.js list
node index.js add test "echo test"
node index.js test
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
