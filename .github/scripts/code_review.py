import logging
import os

from openai import OpenAI
from github import Github


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


MODEL = "gpt-3.5-turbo"

PROMP_INTRO = \
    """
    You are a seior principal software engineer from FAANG, 
    and am especially good with writing clean, well-refactored, 
    readable, high quality and performant code,
    code reviews and explaining to newcomers. 
    """

PROMPT_CODE_REVIEW = PROMP_INTRO + \
    """
    For each file, each group of code diff, analyze it and do the following:
    Provide a concise review. 
    Also highlight any syntax issues, code smells.
    Provide the filename and start and end line numbers.
    Make suggestions for improvement if confident that it is correct.
    
    At the end of the review, provide a summary of the review based on its title,
    description and content.
    """

NO_DIFF_MSG = "No textual changes found in this PR. It may contain binary files, \
    very large files, or only renamed files."


def main():
    try:
        # Initialize GitHub client
        g = Github(os.getenv('GITHUB_TOKEN'))
        repo = g.get_repo(os.getenv('GITHUB_REPOSITORY'))
        pr_number = int(os.getenv('GITHUB_REF').split('/')[-2])
        pr = repo.get_pull(pr_number)

        # Get PR diff
        diff = pr.get_files()
        
        # Handle files without PATCH
        patches = [f.patch for f in diff if f.patch is not None]
        no_patch_files = [f.filename for f in diff if f.patch is None]        

        if len(patches) > 0:
            diff_text = "\n".join(patches)

            # Initialize OpenAI
            client = OpenAI(
                api_key=os.environ.get("OPENAI_API_KEY"),
            )
                
            # Generate code review
            review = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": PROMPT_CODE_REVIEW},
                    {"role": "user", "content": f"Code diff:\n\n{diff_text}"}
                ]
            )
            review_comment = review.choices[0].message.content

            # Post comments
            pr.create_issue_comment(f"## AI Code Review:\n\n{review_comment}")
        
        else:
            # If diff_text is empty, provide a fallback message
            pr.create_issue_comment(f"## AI Code Review:\n\n{NO_DIFF_MSG}")
                
        if len(no_patch_files) > 0:
            no_patch_msg = ''.join(['\n- ' + filename for filename in no_patch_files])
            pr.create_issue_comment("## AI Code Review: Files without PATCH (and not reviewed):\n\n" +
                                    no_patch_msg)

    except Exception as e:
        logger.error(f"An error occurred:\n\n{str(e)}")
        pr.create_issue_comment(f"## AI Code Review\n\nFailed, please see the logs")
        raise


if __name__ == "__main__":
    main()