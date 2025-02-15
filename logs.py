#!/usr/bin/env python3
import argparse
import subprocess
import requests
import time
import sys
import io
import zipfile
from datetime import datetime

GITHUB_API_URL = "https://api.github.com"

def get_current_commit():
    """Return the current commit SHA."""
    try:
        sha = subprocess.check_output(["git", "rev-parse", "HEAD"], universal_newlines=True).strip()
        return sha
    except subprocess.CalledProcessError as e:
        print("Error obtaining current commit SHA:", e)
        sys.exit(1)

def get_current_branch():
    """Return the current branch name."""
    try:
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], universal_newlines=True).strip()
        return branch
    except subprocess.CalledProcessError as e:
        print("Error obtaining current branch name:", e)
        sys.exit(1)

def find_workflow_run(owner, repo, commit_sha, branch, token, poll_interval=10, max_attempts=30):
    """
    Polls the GitHub API until a workflow run for the given commit_sha is found.
    Returns the run id once found.
    """
    headers = {"Authorization": f"token {token}"}
    runs_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/actions/runs"
    params = {"branch": branch, "event": "push", "per_page": 50}
    
    # First verify if workflows exist
    workflows_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/actions/workflows"
    workflows_response = requests.get(workflows_url, headers=headers)
    if workflows_response.status_code == 404:
        print("No workflows found in repository. Please check .github/workflows/ directory")
        sys.exit(1)
    elif workflows_response.status_code == 401:
        print("Authentication failed. Please check if your token has workflow permissions")
        sys.exit(1)
    
    attempt = 0
    while attempt < max_attempts:
        response = requests.get(runs_url, headers=headers, params=params)
        if response.status_code != 200:
            print("Error fetching workflow runs:", response.text)
            sys.exit(1)
        data = response.json()
        runs = data.get("workflow_runs", [])
        
        for run in runs:
            # Check if this run corresponds to our commit SHA.
            if run.get("head_sha") == commit_sha:
                run_id = run.get("id")
                status = run.get("status")
                print(f"Found workflow run {run_id} with status: {status}")
                return run_id, status
        attempt += 1
        print(f"[{datetime.now().isoformat()}] Workflow run for commit {commit_sha} not found yet. Retrying in {poll_interval} seconds...")
        time.sleep(poll_interval)
    print("Timed out waiting for a workflow run to be created for the commit.")
    sys.exit(1)

def wait_for_run_completion(owner, repo, run_id, token, poll_interval=15, max_attempts=60):
    """
    Polls the workflow run status until it is 'completed'.
    """
    headers = {"Authorization": f"token {token}"}
    run_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/actions/runs/{run_id}"
    attempt = 0
    while attempt < max_attempts:
        response = requests.get(run_url, headers=headers)
        if response.status_code != 200:
            print("Error fetching workflow run status:", response.text)
            sys.exit(1)
        run_data = response.json()
        status = run_data.get("status")
        conclusion = run_data.get("conclusion")
        print(f"[{datetime.now().isoformat()}] Run status: {status}, conclusion: {conclusion}")
        if status == "completed":
            return conclusion
        attempt += 1
        time.sleep(poll_interval)
    print("Timed out waiting for the workflow run to complete.")
    sys.exit(1)

def download_logs(owner, repo, run_id, token):
    """
    Downloads the logs ZIP for the given workflow run.
    """
    headers = {"Authorization": f"token {token}"}
    logs_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    print(f"Downloading logs from {logs_url}")
    response = requests.get(logs_url, headers=headers)
    if response.status_code == 200:
        return response.content
    else:
        print("Error downloading logs:", response.text)
        sys.exit(1)

def extract_and_print_logs(zip_data):
    """
    Extracts logs from the ZIP archive and prints file names and content.
    """
    with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
        for filename in z.namelist():
            print(f"\n=== {filename} ===")
            with z.open(filename) as f:
                try:
                    content = f.read().decode("utf-8")
                except UnicodeDecodeError:
                    content = f.read().decode("latin1")
                print(content)
                
def main():
    parser = argparse.ArgumentParser(
        description="Automatically fetch GitHub Actions build logs for the latest commit without needing a workflow ID."
    )
    parser.add_argument("--owner", required=True, help="GitHub repository owner (username or organization)")
    parser.add_argument("--repo", required=True, help="GitHub repository name")
    parser.add_argument("--token", required=True, help="GitHub Personal Access Token")
    parser.add_argument("--branch", help="Branch name (defaults to current branch)", default=None)
    args = parser.parse_args()

    commit_sha = get_current_commit()
    branch = args.branch or get_current_branch()
    print(f"Current commit: {commit_sha}\nCurrent branch: {branch}")
    
    # Poll for the workflow run associated with the commit
    run_id, status = find_workflow_run(args.owner, args.repo, commit_sha, branch, args.token)
    
    # Wait until the workflow run is completed
    conclusion = wait_for_run_completion(args.owner, args.repo, run_id, args.token)
    print(f"Workflow run {run_id} completed with conclusion: {conclusion}")
    
    # Download and extract logs
    zip_data = download_logs(args.owner, args.repo, run_id, args.token)
    extract_and_print_logs(zip_data)

if __name__ == "__main__":
    main()