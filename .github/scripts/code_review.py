import os
from openai import OpenAI
from github import Github

MODEL = "gpt-3.5-turbo"

PROMPT = """
        You are a seior principal software engineer from FAANG with 40 years of experience, 
        and am especially good with explaining code reviewer to fresh graduates. 
        Analyze the following code diff and provide a concise review per section of code, 
        and also highlight any syntax issues, code smells and make suggestions for 
        improvement for clean, well-refactored, readable, high quality and performant code.
       """


def main():
    # Initialize GitHub client
    g = Github(os.getenv('GITHUB_TOKEN'))
    repo = g.get_repo(os.getenv('GITHUB_REPOSITORY'))
    pr_number = int(os.getenv('GITHUB_REF').split('/')[-2])
    pr = repo.get_pull(pr_number)

    # Get PR diff
    diff = pr.get_files()
    
    # Handle files without PATCH
    no_patch_files = [f.filename for f in diff if f.patch is None]

    diff_text = "\n".join([f.patch for f in diff if f.patch is not None])

    # If diff_text is empty, provide a fallback message
    if not diff_text:
        diff_text = "No textual changes found in this PR. It may contain binary files, very large files, or only renamed files."

    # Initialize OpenAI
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )
        
    # Generate code review
    review = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": PROMPT},
            {"role": "user", "content": f"Code diff:\n\n{diff_text}"}
        ]
    )
    review_comment = review.choices[0].message.content

    # Generate PR summary
    summary = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Summarize the following pull request based on its title, description, and diff."},
            {"role": "user", "content": f"PR Title: {pr.title}\nPR Description: {pr.body}\nDiff:\n\n{diff_text}"}
        ]
    )
    summary_comment = summary.choices[0].message.content

    # Post comments
    pr.create_issue_comment(f"## Code Review\n\n{review_comment}")
    pr.create_issue_comment(f"## PR Summary\n\n{summary_comment}")
    pr.create_issue_comment(f"## Files without PATCH (and hence not reviewed):\n\n{', '.join(no_patch_files)}")


if __name__ == "__main__":
    main()