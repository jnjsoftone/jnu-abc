"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(exports,{PLATFORM:function(){return s},TEMPLATES_ROOT:function(){return i},exe:function(){return p},exec:function(){return a},execOptions:function(){return l},getCurrentDir:function(){return u},getParentDir:function(){return d},initApp:function(){return $},removeApp:function(){return f},tree:function(){return y},unzip:function(){return g},zip:function(){return x}});const e=require("child_process"),t=/*#__PURE__*/c(require("path")),r=require("./builtin.js"),n=require("./git.js"),o=/*#__PURE__*/c(require("fs"));function c(e){return e&&e.__esModule?e:{default:e}}const i=`${process.env.DEV_ROOT}/jd-templates`??"C:/JnJ/Developments/jd-templates",s="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,l={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},u=()=>"win"===s?((0,e.execSync)("chcp 65001>nul",{shell:"cmd.exe"}),(0,e.execSync)("cd",l).toString().trim().replace(/\\/g,"/")):(0,e.execSync)("pwd",l).toString().trim(),d=()=>"win"===s?((0,e.execSync)("chcp 65001>nul",{shell:"cmd.exe"}),t.default.dirname((0,e.execSync)("cd",l).toString().trim().replace(/\\/g,"/"))):t.default.dirname((0,e.execSync)("pwd",l).toString().trim()),a=t=>{let r=(0,e.execSync)(t,{encoding:"utf8"});return r?r.toString().trim():""},p=e=>{let t=[];return e.forEach(e=>t.push(a(e))),t},m=t=>{let{template:o,repoName:c,userName:a,description:p}=t,{fullName:m,email:f}=(0,n.findGithubAccount)(a??""),$=d(),x=u(),g="";g="win"===s?`xcopy "${i}\\${o}" "${c}\\" /E /I /H /Y`:`cp -r ${i}/${o} ${c}`,(0,e.execSync)(g,l),(0,r.substituteInFile)(`${c}/package.json`,{"{{name}}":c??"","{{author}}":`${m} <${f}>`,"{{github-id}}":a??"","{{description}}":p??""}),(0,r.substituteInFile)(`${c}/README.md`,{"{{name}}":c??"","{{project-name}}":c??"","{{author}}":`${m} <${f}>`,"{{github-id}}":a??"","{{description}}":p||"","{{parent-dir}}":$,"{{current-dir}}":x});try{(0,r.substituteInFile)(`${c}/docs/workflow.md`,{"{{name}}":c??"","{{project-name}}":c??"","{{github-id}}":a??"","{{description}}":p||"","{{parent-dir}}":$,"{{current-dir}}":x})}catch(e){console.error("Error in substituteInFile:",e)}return console.log(g=`cd ${x}/${c} && npm install`),(0,e.execSync)(g,l),console.log(g=`cd ${x}/${c} && xgit -e makeRepo -u ${a} -n ${c} -d "${p}"`),(0,e.execSync)(g,l),t},f=t=>((0,e.execSync)(`xgit -e deleteRemoteRepo -u ${t.userName} -n ${t.repoName}`,l),"win"===s?(0,e.execSync)(`rmdir /s /q ${t.repoName}`,l):(0,e.execSync)(`rm -rf ${t.repoName}`,l),t),$=e=>{let{template:t,repoName:r,userName:n,description:o}=e;switch(t){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":case"ts-webpack-obsidianPlugin":m(e)}return e},x=(r,n)=>{try{let o=t.default.resolve(r),c=t.default.basename(o),i=t.default.dirname(o),u=process.cwd();if("win"===s)try{process.chdir(i);let t=`${c}_temp`;for(let r of((0,e.execSync)(`xcopy "${c}" "${t}\\" /E /I /H /Y`,l),n?n.split(","):["node_modules","package-lock.json","package.json"])){let n=`${t}/${r}`;try{r.includes("/")?(0,e.execSync)(`rmdir /s /q "${n}"`,l):(0,e.execSync)(`del /q "${n}"`,l)}catch(e){console.log(`Warning: Could not remove ${r}`)}}(0,e.execSync)(`powershell -Command "Compress-Archive -Path '${t}/*' -DestinationPath '${c}.zip' -Force"`,l),(0,e.execSync)(`rmdir /s /q "${t}"`,l)}catch(e){throw console.error("Error during zip operation:",e),e}finally{process.chdir(u)}else try{process.chdir(i);let t=n?n.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';(0,e.execSync)(`zip -r "${c}.zip" "${c}" -x ${t}`,l)}finally{process.chdir(u)}return{folderPath:r,excluded:n}}catch(e){throw console.error("Error in zip function:",e),e}},g=(n,c="__MACOSX/,node_modules/,.DS_Store,.git/")=>{let i=u(),s=[];for(let u of(0,r.findFiles)(n,"*.zip"))try{let n;let d=`${i}/_unzip/${t.default.parse(u).name}`;if(console.log(`## extractPath: ${d}`),(0,r.makeDir)(d),"win32"===process.platform)for(let r of(n=`powershell -command "Expand-Archive -Path '${u}' -DestinationPath '${d}' -Force"`,c.split(",").map(e=>e.trim()))){let n=t.default.join(d,r.replace("/",""));r.endsWith("/")?(0,e.execSync)(`if exist "${n}" rmdir /s /q "${n}"`,l):(0,e.execSync)(`if exist "${n}" del /q "${n}"`,l)}else{let e=c.split(",").map(e=>`"${e.trim()}"`).join(" ");n=`unzip -o "${u}" -d "${d}" -x ${e}`}(0,e.execSync)(n),console.log(`압축 해제 완료: ${u} -> ${d}`);let a=(0,r.findFolders)(d).filter(e=>!e.includes("__MACOSX"));if(console.log(`### subFolders: ${a}, subFolders.length: ${a.length}, ${a[0]}`),1===a.length&&a[0].replace(d,"").includes(t.default.parse(u).name)){for(let r of(console.log(`### 중복 폴더 처리 필요: ${a}`),o.default.readdirSync(a[0]))){let n=t.default.join(a[0],r),o=t.default.join(d,r);"win32"===process.platform?(0,e.execSync)(`move "${n}" "${o}"`,l):(0,e.execSync)(`mv "${n}" "${o}"`,l)}"win32"===process.platform?(0,e.execSync)(`rmdir /s /q "${a[0]}"`,l):(0,e.execSync)(`rm -rf "${a[0]}"`,l)}s.push(d)}catch(e){console.error(`'${u}' 압축 해제 중 오류 발생:`,e.message)}return(0,r.deleteFilesInFolder)(i,"__MACOSX/",!0),s.join(",")},y=t=>{{if("win"===s){let n=t.split(",").join("|")||"node_modules|dist|_backups|_drafts|types|docs";try{let t=`powershell -NoProfile -ExecutionPolicy Bypass -Command "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; tree /F /A | Select-String -NotMatch '${n}'"`;console.log("Command: ",t);let o=(0,e.execSync)(t,{encoding:"utf8",stdio:"pipe"});return console.log("Result: ",o),o&&(0,r.saveFile)("tree.txt",o,{overwrite:!0,newFile:!1,encoding:"utf8"}),o||""}catch(e){return console.error("Error executing tree command:",e),""}}let n=t?`"${t.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',o=`tree -I ${n} --dirsfirst -L 3`;try{console.log("Command: ",o);let t=(0,e.execSync)(o,{encoding:"utf8",stdio:"pipe"});return t&&(0,r.saveFile)("tree.txt",t,{overwrite:!0,newFile:!1}),t||""}catch(e){return console.error("Error executing tree command:",e),""}}};