const fs=require("fs");
const path=require("path");
const html=`<div class="grid" id="grid" data-om-id="48ce79d0:7">`+fs.readdirSync("figures").filter(f=>f.endsWith(".svg")).map(f=>{
  const id=f.replace(".svg","").replace("fig-","fig-");
  const svg=fs.readFileSync(path.join("figures",f),"utf8");
  return `<figure id="${f.replace(".svg","")}">${svg}</figure>`;
}).join("")+`</div>`;
fs.writeFileSync("illustration-source-built.html",html);
console.log("built",html.length);
