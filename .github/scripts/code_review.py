import os
import openai
from github import Github

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
    
    # TODO
    print(diff)
    for f in diff:
        if f.patch is not None:
            print(f.patch)
        else:
            print(f.filename + " has no PATCH.")
            
    diff_text = "\n".join([f.patch for f in diff if f.patch is not None])

    # If diff_text is empty, provide a fallback message
    if not diff_text:
        diff_text = "No textual changes found in this PR. It may contain binary files, very large files, or only renamed files."

    # Initialize OpenAI
    openai.api_key = os.getenv('OPENAI_API_KEY')

    # Generate code review
    review = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": PROMPT},
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