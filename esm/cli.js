import{execSync as e}from"child_process";import r from"path";import{makeDir as o,saveFile as t,findFiles as i,findFolders as n,deleteFilesInFolder as s,substituteInFile as l}from"./builtin.js";import{findGithubAccount as p}from"./git.js";import c from"fs";let m=`${process.env.DEV_ROOT}/jd-templates`??"C:/JnJ/Developments/jd-templates",a="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,d={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},$=()=>"win"===a?(e("chcp 65001>nul",{shell:"cmd.exe"}),e("cd",d).toString().trim().replace(/\\/g,"/")):e("pwd",d).toString().trim(),u=()=>"win"===a?(e("chcp 65001>nul",{shell:"cmd.exe"}),r.dirname(e("cd",d).toString().trim().replace(/\\/g,"/"))):r.dirname(e("pwd",d).toString().trim()),f=r=>{let o=e(r,{encoding:"utf8"});return o?o.toString().trim():""},g=e=>{let r=[];return e.forEach(e=>r.push(f(e))),r},h=r=>{let o=p(r.userName??""),t=u(),i=$(),n="";return"win"===a?e(n=`xcopy "${m}\\ts-swc-npm" "${r.repoName}\\" /E /I /H /Y`,d):e(n=`cp -r ${m}/ts-swc-npm ${r.repoName}`,d),l(`${r.repoName}/package.json`,{"{{name}}":r.repoName??"","{{author}}":`${o.fullName} <${o.email}>`,"{{description}}":r.description??""}),l(`${r.repoName}/README.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{author}}":`${o.fullName} <${o.email}>`,"{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":t,"{{current-dir}}":i}),l(`${r.repoName}/docs/workflow.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":t,"{{current-dir}}":i}),console.log(n=`cd ${i}/${r.repoName} && npm install`),e(n,d),console.log(n=`cd ${i}/${r.repoName} && xgit -e makeRepo -u ${r.userName} -n ${r.repoName} -d "${r.description}"`),e(n,d),r},w=r=>(e(`xgit -e deleteRemoteRepo -u ${r.userName} -n ${r.repoName}`,d),"win"===a?e(`rmdir /s /q ${r.repoName}`,d):e(`rm -rf ${r.repoName}`,d),r),x=e=>{let{template:r,repoName:o,userName:t,description:i}=e;switch(r){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":h(e)}return e},N=(o,t)=>{try{let i=r.resolve(o),n=r.basename(i),s=r.dirname(i),l=process.cwd();if("win"===a)try{process.chdir(s);let r=`${n}_temp`;for(let o of(e(`xcopy "${n}" "${r}\\" /E /I /H /Y`,d),t?t.split(","):["node_modules","package-lock.json","package.json"])){let t=`${r}/${o}`;try{o.includes("/")?e(`rmdir /s /q "${t}"`,d):e(`del /q "${t}"`,d)}catch(e){console.log(`Warning: Could not remove ${o}`)}}e(`powershell -Command "Compress-Archive -Path '${r}/*' -DestinationPath '${n}.zip' -Force"`,d),e(`rmdir /s /q "${r}"`,d)}catch(e){throw console.error("Error during zip operation:",e),e}finally{process.chdir(l)}else try{process.chdir(s);let r=t?t.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';e(`zip -r "${n}.zip" "${n}" -x ${r}`,d)}finally{process.chdir(l)}return{folderPath:o,excluded:t}}catch(e){throw console.error("Error in zip function:",e),e}},_=(t,l="__MACOSX/,node_modules/,.DS_Store,.git/")=>{let p=$(),m=[];for(let s of i(t,"*.zip"))try{let t;let i=`${p}/_unzip/${r.parse(s).name}`;if(console.log(`## extractPath: ${i}`),o(i),"win32"===process.platform)for(let o of(t=`powershell -command "Expand-Archive -Path '${s}' -DestinationPath '${i}' -Force"`,l.split(",").map(e=>e.trim()))){let t=r.join(i,o.replace("/",""));o.endsWith("/")?e(`if exist "${t}" rmdir /s /q "${t}"`,d):e(`if exist "${t}" del /q "${t}"`,d)}else{let e=l.split(",").map(e=>`"${e.trim()}"`).join(" ");t=`unzip -o "${s}" -d "${i}" -x ${e}`}e(t),console.log(`압축 해제 완료: ${s} -> ${i}`);let a=n(i).filter(e=>!e.includes("__MACOSX"));if(console.log(`### subFolders: ${a}, subFolders.length: ${a.length}, ${a[0]}`),1===a.length&&a[0].replace(i,"").includes(r.parse(s).name)){for(let o of(console.log(`### 중복 폴더 처리 필요: ${a}`),c.readdirSync(a[0]))){let t=r.join(a[0],o),n=r.join(i,o);"win32"===process.platform?e(`move "${t}" "${n}"`,d):e(`mv "${t}" "${n}"`,d)}"win32"===process.platform?e(`rmdir /s /q "${a[0]}"`,d):e(`rm -rf "${a[0]}"`,d)}m.push(i)}catch(e){console.error(`'${s}' 압축 해제 중 오류 발생:`,e.message)}return s(p,"__MACOSX/",!0),m.join(",")},j=r=>{{if("win"===a){let o=r.split(",").join("|")||"node_modules|dist|_backups|_drafts|types|docs";try{let r=`powershell -NoProfile -ExecutionPolicy Bypass -Command "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; tree /F /A | Select-String -NotMatch '${o}'"`;console.log("Command: ",r);let i=e(r,{encoding:"utf8",stdio:"pipe"});return console.log("Result: ",i),i&&t("tree.txt",i,{overwrite:!0,newFile:!1,encoding:"utf8"}),i||""}catch(e){return console.error("Error executing tree command:",e),""}}let o=r?`"${r.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',i=`tree -I ${o} --dirsfirst -L 3`;try{console.log("Command: ",i);let r=e(i,{encoding:"utf8",stdio:"pipe"});return r&&t("tree.txt",r,{overwrite:!0,newFile:!1}),r||""}catch(e){return console.error("Error executing tree command:",e),""}}};export{m as TEMPLATES_ROOT,a as PLATFORM,d as execOptions,f as exec,g as exe,u as getParentDir,$ as getCurrentDir,x as initApp,w as removeApp,N as zip,j as tree,_ as unzip};