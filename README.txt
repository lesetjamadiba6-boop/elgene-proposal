ELGENE PROPOSAL LOCKBOX
=======================

This project is intentionally different from the birthday site.
It is a short interactive proposal experience:

1. Open envelope
2. Unlock with Elgene's birthday code (DDMM = 0111)
3. Open three truth cards
4. Press and hold the heart
5. Answer the question

FILES
-----
index.html
style.css
script.js
config.js
images/
music/ke-lorile.mp3

ANSWER NOTIFICATIONS
--------------------
The site is ready to send Elgene's answer to a Formspree endpoint.

To activate notifications:
1. Create a free form at https://formspree.io/
2. Set the notification email address you want to receive answers at.
3. Copy the endpoint, which looks like:
   https://formspree.io/f/abcdwxyz
4. Open config.js
5. Paste it into:
   answerEndpoint: "YOUR_ENDPOINT_HERE"
6. Save, upload the updated config.js to GitHub, and test the page once yourself.

The submitted notification includes:
- Elgene's selected answer
- Her name
- The question
- Submission date/time
- Page URL

IMPORTANT: Static HTML cannot privately send you an email/notification by itself.
A Formspree (or equivalent webhook) endpoint is the small backend that makes notification possible.

GITHUB PAGES
------------
Upload the CONTENTS of this folder directly to the root of a GitHub repository.
The repository root must show index.html directly.

Recommended repository name:
elgene-question

Then Settings > Pages:
Source: Deploy from a branch
Branch: main
Folder: / (root)
