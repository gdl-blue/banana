@echo off
git add * > nul
git commit -m %1 > nul
git push -f origin master
