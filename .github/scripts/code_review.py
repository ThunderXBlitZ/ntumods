import os
import openai
from github import Github

def main():
    # Initialize GitHub client
    g = Github(os.getenv('GITHUB_TOKEN'))
    repo = g.get_repo(os.getenv('GITHUB_REPOSITORY'))
    pr_number = int(os.getenv('GITHUB_REF').split('/')[-2])
    pr = repo.get_pull(pr_number)

    # Get PR diff
    diff = pr.get_files()
    diff_text = "\n".join([f.patch for f in diff])

    # Initialize OpenAI
    openai.api_key = os.getenv('OPENAI_API_KEY')

    # Generate code review
    review = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful code reviewer. Analyze the following code diff and provide a concise review."},
            {"role": "user", "content": f"Code diff:\n\n{diff_text}"}
        ]
    )
    review_comment = review.choices[0].message.content

    # Generate PR summary
    summary = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Summarize the following pull request based on its title, description, and diff."},
            {"role": "user", "content": f"PR Title: {pr.title}\nPR Description: {pr.body}\nDiff:\n\n{diff_text}"}
        ]
    )
    summary_comment = summary.choices[0].message.content

    # Post comments
    pr.create_issue_comment(f"## Code Review\n\n{review_comment}")
    pr.create_issue_comment(f"## PR Summary\n\n{summary_comment}")

if __name__ == "__main__":
    main()