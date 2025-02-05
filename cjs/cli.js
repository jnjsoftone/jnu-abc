"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(exports,{PLATFORM:function(){return l},TEMPLATES_ROOT:function(){return i},exe:function(){return f},exec:function(){return m},execOptions:function(){return s},getCurrentDir:function(){return u},getParentDir:function(){return a},initApp:function(){return h},removeApp:function(){return x},tree:function(){return S},unzip:function(){return y},zip:function(){return g}});const e=require("child_process"),t=/*#__PURE__*/c(require("path")),n=require("./builtin.js"),r=require("./git.js"),o=/*#__PURE__*/c(require("fs"));function c(e){return e&&e.__esModule?e:{default:e}}const i=`${process.env.DEV_ROOT}/jd-templates`??"C:/JnJ/Developments/jd-templates",l="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,s={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},u=()=>"win"===l?((0,e.execSync)("chcp 65001>nul",{shell:"cmd.exe"}),(0,e.execSync)("cd",s).toString().trim().replace(/\\/g,"/")):(0,e.execSync)("pwd",s).toString().trim(),a=()=>"win"===l?((0,e.execSync)("chcp 65001>nul",{shell:"cmd.exe"}),t.default.dirname((0,e.execSync)("cd",s).toString().trim().replace(/\\/g,"/"))):t.default.dirname((0,e.execSync)("pwd",s).toString().trim()),p=e=>e.endsWith("/")?"*/"+e+"*":"*/"+e,d=(e,t,r)=>{let o=(0,n.loadEnv)(`${e}/.env.${t}`);if(o){let c=Object.entries(o).map(([e,t])=>({[`{{${e}}}`]:String(t)})).reduce((e,t)=>({...e,...t}),{});(0,n.substituteInFile)(`${e}/${"win"===t?"publish.bat":"publish.sh"}`,{...r,...c})}},m=t=>{let n=(0,e.execSync)(t,{encoding:"utf8"});return n?n.toString().trim():""},f=e=>{let t=[];return e.forEach(e=>t.push(m(e))),t},$=(t,o=l)=>{let{template:c,repoName:p,userName:m,description:f}=t,{fullName:$,email:x}=(0,r.findGithubAccount)(m??""),h=a(),g=u(),y="";y="win"===o?`xcopy "${i}\\${c}" "${p}\\" /E /I /H /Y`:`cp -r ${i}/${c} ${p}`,(0,e.execSync)(y,s);let S=[`${p}/package.json`,`${p}/README.md`,`${p}/docs/workflow.md`,`${p}/manifest.json`,`${p}/publish.sh`,`${p}/publish.bat`],_={"{{name}}":p??"","{{project-name}}":p??"","{{author}}":`${$} <${x}>`,"{{github-id}}":m??"","{{description}}":f||"","{{parent-dir}}":h,"{{current-dir}}":g};for(let e of S)(0,n.substituteInFile)(e,_);for(let e of["win","mac"])d(p,e,_);return console.log(y=`cd ${g}/${p} && npm install`),(0,e.execSync)(y,s),console.log(y=`cd ${g}/${p} && xgit -e makeRepo -u ${m} -n ${p} -d "${f}"`),(0,e.execSync)(y,s),t},x=t=>((0,e.execSync)(`xgit -e deleteRemoteRepo -u ${t.userName} -n ${t.repoName}`,s),"win"===l?(0,e.execSync)(`rmdir /s /q ${t.repoName}`,s):(0,e.execSync)(`rm -rf ${t.repoName}`,s),t),h=e=>{let{template:t,repoName:n,userName:r,description:o}=e;switch(t){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":case"ts-webpack-obsidianPlugin":$(e)}return e},g=(n,r)=>{try{let o=t.default.resolve(n),c=t.default.basename(o),i=t.default.dirname(o),u=process.cwd();if("win"===l)try{process.chdir(i);let t=`${c}_temp`;for(let n of((0,e.execSync)(`xcopy "${c}" "${t}\\" /E /I /H /Y`,s),r?r.split(","):["node_modules","package-lock.json","package.json"])){let r=`${t}/${n}`;try{n.includes("/")?(0,e.execSync)(`rmdir /s /q "${r}"`,s):(0,e.execSync)(`del /q "${r}"`,s)}catch(e){console.log(`Warning: Could not remove ${n}`)}}(0,e.execSync)(`powershell -Command "Compress-Archive -Path '${t}/*' -DestinationPath '${c}.zip' -Force"`,s),(0,e.execSync)(`rmdir /s /q "${t}"`,s)}catch(e){throw console.error("Error during zip operation:",e),e}finally{process.chdir(u)}else try{process.chdir(i);let t=r?r.split(",").map(e=>`"${p(e)}"`).join(" "):'"*/node_modules/*" ".git/*"';(0,e.execSync)(`zip -r "${c}.zip" "${c}" -x ${t}`,s)}finally{process.chdir(u)}return{folderPath:n,excluded:r}}catch(e){throw console.error("Error in zip function:",e),e}},y=(r,c="__MACOSX/,node_modules/,.DS_Store,.git/")=>{let i=u(),l=[];for(let u of(0,n.findFiles)(r,"*.zip"))try{let r;let a=`${i}/_unzip/${t.default.parse(u).name}`;if(console.log(`## extractPath: ${a}`),(0,n.makeDir)(a),"win32"===process.platform)for(let n of(r=`powershell -command "Expand-Archive -Path '${u}' -DestinationPath '${a}' -Force"`,c.split(",").map(e=>e.trim()))){let r=t.default.join(a,n.replace("/",""));n.endsWith("/")?(0,e.execSync)(`if exist "${r}" rmdir /s /q "${r}"`,s):(0,e.execSync)(`if exist "${r}" del /q "${r}"`,s)}else{let e=c.split(",").map(e=>`"${e.trim()}"`).join(" ");r=`unzip -o "${u}" -d "${a}" -x ${e}`}(0,e.execSync)(r),console.log(`압축 해제 완료: ${u} -> ${a}`);let p=(0,n.findFolders)(a).filter(e=>!e.includes("__MACOSX"));if(console.log(`### subFolders: ${p}, subFolders.length: ${p.length}, ${p[0]}`),1===p.length&&p[0].replace(a,"").includes(t.default.parse(u).name)){for(let n of(console.log(`### 중복 폴더 처리 필요: ${p}`),o.default.readdirSync(p[0]))){let r=t.default.join(p[0],n),o=t.default.join(a,n);"win32"===process.platform?(0,e.execSync)(`move "${r}" "${o}"`,s):(0,e.execSync)(`mv "${r}" "${o}"`,s)}"win32"===process.platform?(0,e.execSync)(`rmdir /s /q "${p[0]}"`,s):(0,e.execSync)(`rm -rf "${p[0]}"`,s)}l.push(a)}catch(e){console.error(`'${u}' 압축 해제 중 오류 발생:`,e.message)}return(0,n.deleteFilesInFolder)(i,"__MACOSX/",!0),l.join(",")},S=t=>{{if("win"===l){let r=t.split(",").join("|")||"node_modules|dist|_backups|_drafts|types|docs";try{let t=`powershell -NoProfile -ExecutionPolicy Bypass -Command "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; tree /F /A | Select-String -NotMatch '${r}'"`;console.log("Command: ",t);let o=(0,e.execSync)(t,{encoding:"utf8",stdio:"pipe"});return console.log("Result: ",o),o&&(0,n.saveFile)("tree.txt",o,{overwrite:!0,newFile:!1,encoding:"utf8"}),o||""}catch(e){return console.error("Error executing tree command:",e),""}}let r=t?`"${t.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',o=`tree -I ${r} --dirsfirst -L 3`;try{console.log("Command: ",o);let t=(0,e.execSync)(o,{encoding:"utf8",stdio:"pipe"});return t&&(0,n.saveFile)("tree.txt",t,{overwrite:!0,newFile:!1}),t||""}catch(e){return console.error("Error executing tree command:",e),""}}};