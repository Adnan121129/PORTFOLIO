/**
 * Inline script placed in <head>. It runs before first paint and:
 *
 * 1. Applies the saved theme (or the OS preference on a first visit) to <html data-theme>,
 *    so there is no flash of the wrong theme during hydration.
 * 2. Adds `js` and — unless the visitor prefers reduced motion — `reveal-on` to <html>.
 * 3. Reveals `[data-reveal]` elements as they scroll into view using IntersectionObserver
 *    and the Web Animations API. Nothing is hidden unless this script runs, and it never
 *    mutates React-managed attributes, so it cannot cause hydration mismatches.
 *
 * Kept dependency-free and small on purpose; it is inlined into every page.
 */
export const headScript = `(function(){
var d=document.documentElement;
try{var s=localStorage.getItem('theme');var t=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){}
d.classList.add('js');
try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
d.classList.add('reveal-on');
var seen=new WeakSet();
var io=new IntersectionObserver(function(entries){
var shown=entries.filter(function(e){return e.isIntersecting;}).map(function(e){return e.target;});
shown.sort(function(a,b){return a.compareDocumentPosition(b)&4?-1:1;});
shown.forEach(function(el,i){
io.unobserve(el);
var delay=Math.min(i,6)*70+(parseInt(el.getAttribute('data-reveal-delay')||'0',10)||0);
el.animate([{opacity:0,transform:'translate3d(0,18px,0)'},{opacity:1,transform:'none'}],{duration:760,delay:delay,easing:'cubic-bezier(0.16,1,0.3,1)',fill:'both'});
});
},{rootMargin:'0px 0px -8% 0px',threshold:0.08});
function watch(root){
if(!root||root.nodeType!==1)return;
var list=root.matches&&root.matches('[data-reveal]')?[root]:[];
var inner=root.querySelectorAll?root.querySelectorAll('[data-reveal]'):[];
for(var i=0;i<inner.length;i++)list.push(inner[i]);
list.forEach(function(el){if(!seen.has(el)){seen.add(el);io.observe(el);}});
}
function start(){
watch(document.body);
new MutationObserver(function(muts){muts.forEach(function(m){m.addedNodes.forEach(watch);});}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
}catch(e){d.classList.remove('reveal-on');}
})();`;
