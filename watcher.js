const chokidar = require('chokidar');
const { exec } = require('child_process');

// Initialize watcher
const watcher = chokidar.watch('.', {
    ignored: [
        /(^|[\/\\])\../,      // ignore dotfiles
        '**/node_modules/**', 
        '**/dist/**',
        '**/build/**',
        '**/.git/**',
        'watcher.js'
    ],
    persistent: true,
    ignoreInitial: true
});

// Function to execute git commands
function commitAndPush(filepath) {
    // Get current branch name
    exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error getting branch name: ${error}`);
            return;
        }

        const currentBranch = stdout.trim();
        const commands = [
            'git add .',
            `git commit -m "auto: updated ${filepath}"`,
            `git push --set-upstream origin ${currentBranch}`
        ];

        exec(commands.join(' && '), (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            console.log(`Changes committed and pushed successfully for ${filepath}`);
            if (stderr) {
                console.log(`Git messages: ${stderr}`);
            }
        });
    });
}

// Add event listeners
watcher
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        commitAndPush(path);
    })
    .on('add', path => {
        console.log(`File ${path} has been added`);
        commitAndPush(path);
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        commitAndPush(path);
    });

console.log('Watching for file changes...');
