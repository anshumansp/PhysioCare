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
        'git push'
    ];

    exec(commands.join(' && '), (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`Git message: ${stderr}`);
        }
        console.log(`Changes committed successfully: ${stdout}`);
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
