import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to execute git commands
const gitCommit = (filePath) => {
    const fileName = path.basename(filePath);
    const commands = [
        'git add .',
        `git commit -m "auto: updated ${fileName}"`,
        'git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD)' // This will push and set upstream for current branch
    ];

    const command = commands.join(' && ');

    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            // If the error is about upstream, try to set it up
            if (error.message.includes('no upstream branch')) {
                const currentBranch = exec('git rev-parse --abbrev-ref HEAD', { cwd: process.cwd() }, (err, branchName) => {
                    if (!err) {
                        const setupCommand = `git push --set-upstream origin ${branchName.trim()}`;
                        exec(setupCommand, { cwd: process.cwd() }, (setupErr, setupStdout, setupStderr) => {
                            if (setupErr) {
                                console.error(`Error setting upstream: ${setupErr.message}`);
                            } else {
                                console.log(`Upstream branch set successfully: ${setupStdout}`);
                            }
                        });
                    }
                });
            }
            return;
        }
        if (stderr) {
            console.log(`Git message: ${stderr}`);
        }
        console.log(`Changes committed and pushed successfully: ${stdout}`);
    });
};

// Initialize watcher
const watcher = chokidar.watch('.', {
    ignored: [
        /(^|[\/\\])\../, // ignore dotfiles
        /node_modules/,
        /dist/,
        /build/,
        /.git/,
        /autocommit.js/  // ignore this script itself
    ],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});

// Add event listeners
watcher
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        gitCommit(path);
    })
    .on('add', path => {
        console.log(`File ${path} has been added`);
        gitCommit(path);
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        gitCommit(path);
    });

console.log('Watching for file changes...');
