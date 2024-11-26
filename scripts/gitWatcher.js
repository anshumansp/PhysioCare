const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// Path to your project folder
const projectPath = path.resolve(__dirname, '../');

// Initialize watcher
const watcher = chokidar.watch(projectPath, {
    ignored: [
        /(^|[\/\\])\../, // ignore dotfiles
        /node_modules/,
        /.git/,
        /dist/,
        /build/
    ],
    persistent: true,
    ignoreInitial: true
});

// Function to execute git commands
const executeGitCommands = (filePath) => {
    const commands = [
        'git add .',
        `git commit -m "auto: updated ${path.basename(filePath)}"`,
        'git push origin HEAD'
    ];

    const command = commands.join(' && ');

    exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Changes committed and pushed successfully: ${stdout}`);
    });
};

// Event listener for file changes
watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    // Wait for 1 second to ensure file writing is complete
    setTimeout(() => {
        executeGitCommands(filePath);
    }, 1000);
});

console.log('Watching for file changes...');
