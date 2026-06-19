@echo off
set PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs;%PATH%
cd /d S:\claude\Pizza_recipe
node node_modules\vite\bin\vite.js --port=3000 --host=0.0.0.0
