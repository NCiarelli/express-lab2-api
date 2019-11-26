::Batch file to automatically run a few git commands to commit and push
git status
pause
git add .
git commit -m %1
git push