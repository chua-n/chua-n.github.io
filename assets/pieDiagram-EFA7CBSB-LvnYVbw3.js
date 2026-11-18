import{t as e}from"./chunk-JQRUD6KW-Dbva2Z17.js";import{j as t}from"./chunk-ZUNWM646-DGY2BDuU.js";import{f as n}from"./mermaid.esm.min-FPsO58g2.js";import{a as r,p as i}from"./chunk-VY2OSTJR-CbbGvjAe.js";import"./chunk-STOV2HOB-GnExfzIX.js";import{B as a,F as o,O as s,Q as c,V as l,X as u,Y as d,h as f,q as p,v as m}from"./chunk-QJSWEUOL-BzsfeTYg.js";import{W as h,c as g,p as _,q as v}from"./chunk-H7VHZCWX-BssshwZi.js";import{t as y}from"./chunk-AQ6EADP3-CZhslHi-.js";var b=m.pie,x={sections:new Map,showData:!1,config:b},S=x.sections,C=x.showData,w=structuredClone(b),T=y(()=>structuredClone(w),`getConfig`),E=y(()=>{S=new Map,C=x.showData,f()},`clear`),D=y(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);S.has(e)||(S.set(e,t),v.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),O=y(()=>S,`getSections`),k=y(e=>{C=e},`setShowData`),A=y(()=>C,`getShowData`),j={getConfig:T,clear:E,setDiagramTitle:o,getDiagramTitle:u,setAccTitle:c,getAccTitle:l,setAccDescription:d,getAccDescription:p,addSection:D,getSections:O,setShowData:k,getShowData:A},M=y((t,n)=>{e(t,n),n.setShowData(t.showData),t.sections.map(n.addSection)},`populateDb`),N={parse:y(async e=>{let n=await t(`pie`,e);v.debug(n),M(n,j)},`parse`)},P=y(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),F=y(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return g().value(e=>e.value).sort(null)(n)},`createPieArcs`),I={parser:N,db:j,renderer:{draw:y((e,t,o,c)=>{v.debug(`rendering pie chart
`+e);let l=c.db,u=a(),d=r(l.getConfig(),u.pie),f=n(t),p=f.append(`g`);p.attr(`transform`,`translate(225,225)`);let{themeVariables:m}=u,[g]=i(m.pieOuterStrokeWidth);g??=2;let y=d.legendPosition,b=d.textPosition,x=d.donutHole>0&&d.donutHole<=.9?d.donutHole:0,S=h().innerRadius(x*185).outerRadius(185),C=h().innerRadius(185*b).outerRadius(185*b),w=p.append(`g`);w.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+g/2).attr(`class`,`pieOuterCircle`);let T=l.getSections(),E=F(T),D=[m.pie1,m.pie2,m.pie3,m.pie4,m.pie5,m.pie6,m.pie7,m.pie8,m.pie9,m.pie10,m.pie11,m.pie12],O=0;T.forEach(e=>{O+=e});let k=E.filter(e=>(e.data.value/O*100).toFixed(0)!==`0`),A=_(D).domain([...T.keys()]);w.selectAll(`mySlices`).data(k).enter().append(`path`).attr(`d`,S).attr(`fill`,e=>A(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return d.highlightSlice===`hover`?t+=` highlightedOnHover`:d.highlightSlice===e.data.label&&(t+=` highlighted`),t}),w.selectAll(`mySlices`).data(k).enter().append(`text`).text(e=>(e.data.value/O*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+C.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let j=p.append(`text`).text(l.getDiagramTitle()).attr(`x`,0).attr(`y`,-200).attr(`class`,`pieTitleText`),M=[...T.entries()].map(([e,t])=>({label:e,value:t})),N=p.selectAll(`.legend`).data(M).enter().append(`g`).attr(`class`,`legend`);N.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>A(e.label)).style(`stroke`,e=>A(e.label)),N.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>l.getShowData()?`${e.label} [${e.value}]`:e.label);let P=Math.max(...N.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),I=450,L=490,R=M.length*22;switch(y){case`center`:N.attr(`transform`,(e,t)=>{let n=22*M.length/2,r=-P/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:I+=R,N.attr(`transform`,(e,t)=>`translate(${-P/2-22}, ${t*22-185})`),w.attr(`transform`,()=>`translate(0, ${R+22})`);break;case`bottom`:I+=R,N.attr(`transform`,(e,t)=>{let n=-P/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:L+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(-207,`+(t*22-n)+`)`}),w.attr(`transform`,()=>`translate(${P+18+4}, 0)`);break;default:L+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(216,`+(t*22-n)+`)`})}let z=j.node()?.getBoundingClientRect().width??0,B=225-z/2,V=225+z/2,H=Math.min(0,B),U=Math.max(L,V)-H;f.attr(`viewBox`,`${H} 0 ${U} ${I}`),s(f,I,U,d.useMaxWidth)},`draw`)},styles:P};export{I as diagram};