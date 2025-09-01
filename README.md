# Jira Comment Fix

Temporary userscript that restores the auto-expanding behavior of the Jira comment input field and removes the inner scroll introduced in recent UI changes.

## How it works
The script adjusts Jira’s comment editor styles and automatically resizes the input field while typing.  
It runs locally in your browser via a userscript manager extension.

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended, tested)  
   - or [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)

2. Click on the `jira-comment-fix.user.js` file in this repository.

3. In Tampermonkey/Greasemonkey, click **Install** when prompted.

4. Reload your Jira page (`*.atlassian.net`).

## Notes
- This is a temporary client-side workaround until Atlassian fixes the issue.
- Works only in your browser, does not modify Jira server-side.
- Tested on Jira Cloud.
