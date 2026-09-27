"use strict";
// Demo examples remain visible only until the approved published data feed is configured.
let demoWords=[
{word:"rabbit",pos:"noun",meaning:"a small animal with long ears",sentence:"The rabbit is eating grass.",picture:"🐰",pictureLabel:"A rabbit",categories:["Animals","Pets"]},
{word:"celebrate",pos:"verb",meaning:"to do something special for a happy event",sentence:"We celebrate my birthday with a party.",picture:"🎉",pictureLabel:"A celebration",categories:["Actions","Celebrations & Traditions"]},
{word:"special",pos:"adjective",meaning:"important or different in a good way",sentence:"This gift is special to me.",picture:"💝",pictureLabel:"A special gift",categories:["Describing Words"]},
{word:"splendid",pos:"adjective",meaning:"very good",sentence:"We had a splendid time.",picture:"🌈",pictureLabel:"A splendid day",categories:["Describing Words"]},
{word:"wing",pos:"noun",meaning:"a body part a bird uses to fly",sentence:"The bird has two wings.",picture:"🐦",pictureLabel:"A bird with wings",categories:["Animals","Body Parts"]}
];
let categoryLabels=[["All topics","✨"],["Animals","🐶"],["Pets","🐱"],["Actions","🏃"],["Celebrations & Traditions","🎉"],["Describing Words","🌟"],["Body Parts","🦶"]];
const pageIds=["home","dictionary","categories","spelling","frequency","study"];
function make(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function speak(word){
 const status=document.getElementById("audio-status");
 if(!("speechSynthesis" in window)){status.textContent="Audio is not available in this browser.";return;}
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(word);utterance.lang="en-US";utterance.rate=.83;
 status.textContent="Playing: "+word;window.speechSynthesis.speak(utterance);
}
function makeWordCard(item){
 const article=make("article","word-card"),content=make("div");
 content.append(make("h3","",item.word),make("span","pos",item.pos));
 content.append(make("p","word-field-title","Meaning"),make("p","word-field-text",item.meaning));
 content.append(make("p","word-field-title","Sentence"),make("p","word-field-text",item.sentence));
 const actions=make("div"),btn=make("button","listen-button","🔊 Listen");
 btn.type="button";btn.setAttribute("aria-label","Hear "+item.word);btn.addEventListener("click",()=>speak(item.word));
 actions.append(btn);content.append(actions);
 const picture=make("div","word-picture");picture.setAttribute("role","img");picture.setAttribute("aria-label",item.pictureLabel);
 if(item.pictureUrl){
   const img=make("img","word-picture-img");img.src=item.pictureUrl;img.alt=item.pictureLabel || item.word;
   img.loading="lazy";img.referrerPolicy="no-referrer";img.addEventListener("error",()=>{img.replaceWith(make("span","word-picture-emoji","🖼️"));},{once:true});
   picture.append(img,make("span","word-picture-label","Picture"));
 }else{picture.append(make("span","word-picture-emoji",item.picture || "🖼️"),make("span","word-picture-label","Picture"));}
 article.append(content,picture);return article;
}
function paintWords(gridId,emptyId,words){
 document.getElementById(gridId).replaceChildren(...words.map(makeWordCard));
 document.getElementById(emptyId).hidden=words.length>0;
}
function renderDictionary(){
 const term=document.getElementById("dictionary-search").value.trim().toLowerCase();
 paintWords("dictionary-grid","dictionary-empty",demoWords.filter(item=>(item.word+" "+item.meaning+" "+item.sentence).toLowerCase().includes(term)));
}
let activeCategory="All topics";
function renderCategories(){
 const bar=document.getElementById("category-buttons");bar.replaceChildren();
 categoryLabels.forEach(([name,emoji])=>{
  const btn=make("button","",emoji+" "+name);btn.type="button";btn.setAttribute("aria-pressed",String(name===activeCategory));
  btn.addEventListener("click",()=>{activeCategory=name;renderCategories();});bar.append(btn);
 });
 document.getElementById("category-title").textContent=activeCategory;
 paintWords("category-grid","category-empty",activeCategory==="All topics"?demoWords:demoWords.filter(item=>item.categories.includes(activeCategory)));
}
function showPage(){
 const requested=decodeURIComponent(location.hash.replace(/^#/,"")).split("?")[0];
 const page=pageIds.includes(requested)?requested:"home";
 pageIds.forEach(id=>{document.getElementById(id).hidden=id!==page;});
 document.querySelectorAll("[data-nav]").forEach(link=>{if(link.dataset.nav===page)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");});
 const titles={dictionary:"My First Dictionary",categories:"Word Categories",spelling:"Sound-Spelling Cards",frequency:"High-Frequency Words",study:"Word Study"};
 document.title=page==="home"?"My English Library":titles[page]+" | My English Library";
 window.scrollTo(0,0);
}
function showStudyTab(name,focus){
 document.querySelectorAll("[data-study-tab]").forEach(tab=>{
  const selected=tab.dataset.studyTab===name;tab.setAttribute("aria-selected",String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();
 });
 document.querySelectorAll(".study-panel").forEach(panel=>panel.hidden=panel.id!=="panel-"+name);
}
document.addEventListener("click",event=>{
 const audio=event.target.closest("[data-speak]");if(audio)speak(audio.dataset.speak);
 const tab=event.target.closest("[data-study-tab]");if(tab)showStudyTab(tab.dataset.studyTab,false);
});
document.querySelector(".study-tabs").addEventListener("keydown",event=>{
 if(!["ArrowRight","ArrowLeft","Home","End"].includes(event.key))return;event.preventDefault();
 const tabs=[...document.querySelectorAll("[data-study-tab]")],current=tabs.findIndex(t=>t.getAttribute("aria-selected")==="true");
 const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(current+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
 showStudyTab(tabs[next].dataset.studyTab,true);
});
document.getElementById("dictionary-search").addEventListener("input",renderDictionary);
window.addEventListener("hashchange",showPage);
renderDictionary();renderCategories();showStudyTab("synonyms",false);showPage();
document.querySelectorAll('a[href="#home-modules"]').forEach(link=>link.addEventListener("click",event=>{
 event.preventDefault();if(document.getElementById("home").hidden){location.hash="home";requestAnimationFrame(()=>document.getElementById("home-modules").scrollIntoView({behavior:"smooth"}));}
 else document.getElementById("home-modules").scrollIntoView({behavior:"smooth"});
}));
