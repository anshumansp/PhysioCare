const chokidar = require('chokidar');
const { exec } = require('child_process');

// Function to set up upstream branch
function setupUpstream(branch) {
    return new Promise((resolve, reject) => {
        exec(`git push --set-upstream origin ${branch}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error setting upstream: ${error.message}`);
                reject(error);
                return;
            }
            console.log(`Upstream branch set up successfully for ${branch}`);
            resolve(true);
        });
    });
}

// Function to execute git commands
async function commitAndPush(filepath) {
    try {
        // Get current branch name
        exec('git rev-parse --abbrev-ref HEAD', async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error getting branch name: ${error}`);
                return;
            }

            const currentBranch = stdout.trim();
            
            try {
                // First try to add and commit
                await new Promise((resolve, reject) => {
                    exec('git add . && git commit -m "auto: updated ' + filepath + '"', (error, stdout, stderr) => {
                        if (error && !error.message.includes('nothing to commit')) {
                            reject(error);
                            return;
                        }
                        resolve(true);
                    });
                });

                // Then try to push
                try {
                    await new Promise((resolve, reject) => {
                        exec('git push', async (error, stdout, stderr) => {
                            if (error) {
                                if (error.message.includes('no upstream branch')) {
                                    // If no upstream, set it up and try pushing again
                                    await setupUpstream(currentBranch);
                                    await new Promise((resolve, reject) => {
                                        exec('git push', (error, stdout, stderr) => {
                                            if (error) {
                                                reject(error);
                                                return;
                                            }
                                            resolve(true);
                                        });
                                    });
                                } else {
                                    reject(error);
                                    return;
                                }
                            }
                            resolve(true);
                        });
                    });
                    console.log(`Changes pushed successfully for ${filepath}`);
                } catch (pushError) {
                    console.error(`Error pushing changes: ${pushError.message}`);
                }
            } catch (commitError) {
                console.error(`Error committing changes: ${commitError.message}`);
            }
        });
    } catch (error) {
        console.error(`Error in git operations: ${error.message}`);
    }
}

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
