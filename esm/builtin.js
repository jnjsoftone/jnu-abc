import*as e from"fs";import r from"path";let t="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,n=e=>e.replace(/^\uFEFF/gm,"").replace(/^\u00BB\u00BF/gm,"").replace(/\r\n/g,"\n"),s=e=>(e=e.replace(/\\/g,"/")).endsWith("/")?e.slice(0,-1):e,i=e=>(e.startsWith(".")&&(e=r.join(process.cwd(),e)),s(e)),c=e=>e?e.toString().normalize("NFKC"):"",l=e=>e?(e=c(e)).replace(/\[/g,"(").replace(/\]/g,")").replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g,"").replace(/\s+/g," ").trim():"",o=(r,t="utf8")=>{try{return n(e.readFileSync(i(r),{encoding:t}))}catch{return""}},a=(r,t="utf8")=>{try{return JSON.parse(n(e.readFileSync(i(r),{encoding:t})))}catch{return{}}},p=(r,t="utf8")=>{try{let s=n(e.readFileSync(i(r),{encoding:t}));if(!s)return{};let c=s.split("\n"),l={};for(let e of c){let r=e.split("="),[t,n]=[r[0].trim(),r.slice(1).join("=").trim()];!t||t.startsWith("#")||t.startsWith("//")||(l[t]=n.replace(/^['"]|['"]$/g,""))}return l}catch{return{}}},u=(r,t,n="utf8")=>{let s=Object.entries(t).map(([e,r])=>`${e}=${r}`).join("\n");e.writeFileSync(i(r),s,{encoding:n})},f=(t,n="",{encoding:s="utf-8",overwrite:c=!0,newFile:l=!0}={})=>{if(t=i(t),l&&e.existsSync(t)){let n=r.dirname(t),s=r.extname(t),i=r.basename(t,s),c=1;for(;e.existsSync(t);)t=r.join(n,`${i}(${c})${s}`),c++}e.mkdirSync(r.dirname(t),{recursive:!0}),c?e.writeFileSync(t,n,s):e.appendFileSync(t,n,s)},d=(e,r={},{indent:t=2,overwrite:n=!0,newFile:s=!1}={})=>{f(i(e),JSON.stringify(r,null,t),{overwrite:n,newFile:s})},m=r=>{e.mkdirSync(i(r),{recursive:!0})},y=(r,t,n=!0)=>{e.cpSync(i(r),i(t),{recursive:n})},g=(t,n="",s=[])=>{if(!e.existsSync(t))return[];let i=e.readdirSync(t);return s=s||[],i.forEach(function(i){e.statSync(t+"/"+i).isDirectory()?s=g(t+"/"+i,n,s):(n instanceof RegExp?n:new RegExp(n.replace(/\*/g,".*"))).test(i)&&s.push(r.join(t,"/",i))}),s};function S(t,n=""){let i=[];for(let c of e.readdirSync(t)){let l=r.join(t,c),o=n instanceof RegExp?n:new RegExp(n.replace(/\*/g,".*"));e.statSync(l).isDirectory()&&o.test(c)&&i.push(s(l))}return i}let F=r=>e.existsSync(r),$=r=>e.existsSync(r),x=r=>e.existsSync(r),h=(r,t,n,i)=>{r=s(r),t=s(t),e.rename(`${r}/${n}`,`${t}/${i}`,e=>console.log(e))},v=(r,t,n,i)=>{r=s(r),t=s(t),e.existsSync(t)||e.mkdirSync(t,{recursive:!0});for(let s=0;s<n.length;s++){let c=n[s],l=i[s];e.rename(`${r}/${c}`,`${t}/${l}`,e=>console.log(e))}},E=(r,t,n)=>(r=`${process.env.DIR_ROOT}/${r}`,t=e=>e.endsWith(".ts"),n=e=>`${r}/${e}`,e.readdirSync(r).filter(e=>t(e)).map(e=>n(e))),w=(t,n="node_modules/,.git/.DS_Store",s=!0)=>{try{if(!e.existsSync(t))return;let i=n.split(",").map(e=>e.endsWith("/")?e:e.includes("*")?RegExp("^"+e.replace(/\*/g,".*")+"$"):e);for(let c of e.readdirSync(t))try{let l=r.join(t,c),o=e.statSync(l);o.isDirectory()&&s?i.some(e=>"string"==typeof e&&e.endsWith("/")&&c+"/"===e)?e.rmSync(l,{recursive:!0,force:!0}):w(l,n,s):o.isFile()&&i.some(e=>e instanceof RegExp?e.test(c):c===e)&&e.unlinkSync(l)}catch(e){console.error(`Error processing ${c}: ${e.message}`);continue}return{folderPath:t,pattern:n}}catch(e){return console.error(`Error processing folder ${t}: ${e.message}`),{}}},R=(e,r)=>{let t=o(e);if(t){for(let[e,n]of Object.entries(r))t=t.replace(RegExp(e,"g"),n);f(e,t,{overwrite:!0,newFile:!1})}};export{t as PLATFORM,s as slashedFolder,c as composeHangul,i as setPath,l as sanitizeName,o as loadFile,a as loadJson,p as loadEnv,f as saveFile,d as saveJson,u as saveEnv,m as makeDir,y as copyDir,g as findFiles,S as findFolders,F as existsFolder,$ as existsFile,x as exists,h as moveFile,v as moveFiles,E as renameFilesInFolder,w as deleteFilesInFolder,R as substituteInFile};