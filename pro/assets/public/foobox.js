(()=>{"use strict";var e,t={408:(e,t,r)=>{r.d(t,{Z:()=>V});var i={};r.r(i),r.d(i,{defaults:()=>g,extend:()=>h,getProperty:()=>o,hasProperty:()=>s,merge:()=>u,mergeMissing:()=>l,objForEach:()=>p,objReduce:()=>f,removeProperty:()=>a,setProperty:()=>c});var n=r(320);function s(e,t){if((0,n.isPlainObject)(e)&&(0,n.isStringNotEmpty)(t)){if(-1===t.indexOf("."))return e.hasOwnProperty(t);{const r=t.split("."),i=r.length,s=i-1;let a=0,o=e;for(;a<i;a++){const e=r[a];if(a===s)return o.hasOwnProperty(e);if(!(0,n.isPlainObject)(o[e]))return!1;o=o[e]}}}return!1}function a(e,t){if((0,n.isPlainObject)(e)&&(0,n.isStringNotEmpty)(t))if(-1!==t.indexOf(".")){const r=t.split("."),i=r.length,s=i-1;let a=0,o=e;for(;a<i;a++){const e=r[a];a===s?delete o[e]:(0,n.isPlainObject)(o[e])&&(o=o[e])}}else delete e[t]}function o(e,t,r){if((0,n.isPlainObject)(e)&&(0,n.isStringNotEmpty)(t))if(-1!==t.indexOf(".")){const r=t.split("."),i=r.length,s=i-1;let a=0,o=e;for(;a<i;a++){const e=r[a];if(a===s){if(o.hasOwnProperty(e))return o[e]}else{if(!(0,n.isPlainObject)(o[e]))break;o=o[e]}}}else if(e.hasOwnProperty(t))return e[t];return r}function c(e,t,r){if((0,n.isPlainObject)(e)&&(0,n.isStringNotEmpty)(t)&&!(0,n.isUndefined)(r)){if(-1===t.indexOf("."))return e[t]=r,!0;{const i=t.split("."),s=i.length,a=s-1;let o=0,c=e;for(;o<s;o++){const e=i[o];if(o===a)return c[e]=r,!0;if((0,n.isPlainObject)(c[e]))c=c[e];else{if(!(0,n.isUndefined)(c[e]))break;c=c[e]={}}}}}return!1}function u(e,t){return e=(0,n.isPlainObject)(e)?e:{},(0,n.isPlainObject)(e)&&(0,n.isPlainObject)(t)&&p(t,((t,r)=>{(0,n.isPlainObject)(r)?e[t]=u(e[t],r):Array.isArray(r)?e[t]=r.slice():e[t]=r})),e}function h(e,...t){return e=(0,n.isPlainObject)(e)?e:{},t.reduce(((e,t)=>u(e,t)),e)}function l(e,t){return e=(0,n.isPlainObject)(e)?e:{},(0,n.isPlainObject)(t)&&p(t,((t,r)=>{const i=!e.hasOwnProperty(t);(0,n.isPlainObject)(r)?(0,n.isPlainObject)(e[t])?e[t]=l(e[t],r):i&&(e[t]=u({},r)):i&&(e[t]=r)})),e}function g(e,...t){return e=(0,n.isPlainObject)(e)?e:{},t.reduce(((e,t)=>l(e,t)),e)}function p(e,t){Object.keys(e).forEach((r=>{t.call(this,r,e[r])}))}function f(e,t,r){return Object.keys(e).reduce(((r,i)=>t.call(this,r,e[i],i)),r)}const d=class{constructor(e,t,r){const i=y.parseType(e,!0);this.#e=i.type,this.#t=i.namespace,(0,n.isPlainObject)(t)&&(this.#r=!!(0,n.isBoolean)(t.bubbles)&&t.bubbles,this.#i=!!(0,n.isBoolean)(t.cancelable)&&t.bubbles),r instanceof y&&(this.#n=this.#s=r)}#e;get type(){return this.#e}#t=null;get namespace(){return this.#t}#r=!1;get bubbles(){return this.#r}#i=!1;get cancelable(){return this.#i}#a=!1;get defaultPrevented(){return this.#a}#n=null;get target(){return this.#n}set target(e){if(!(e instanceof y))throw new TypeError("The EmitterEvent.target must be an instance of Emitter.");this.#n=e}#s=null;get currenTarget(){return this.#s}set currenTarget(e){if(!(e instanceof y))throw new TypeError("The EmitterEvent.currenTarget must be an instance of Emitter.");this.#s=e}preventDefault(){this.cancelable&&(this.#a=!0)}isDefaultPrevented(){return this.defaultPrevented}#o=!1;stopPropagation(){this.#o=!0}isPropagationStopped(){return this.#o}};class m{static EVENT_TYPE_NAMESPACE_SEPARATOR=".";static parseType(e,t){if(!(0,n.isStringNotEmpty)(e))throw new TypeError("The 'type' argument must be a non-empty string.");let r=null,i=e;const s=e.indexOf(this.EVENT_TYPE_NAMESPACE_SEPARATOR);if(-1!==s&&(r=e.slice(s+1)||null,i=e.slice(0,s)||null),!r&&!i||!i&&t)throw new TypeError(`Unable to parse the event type: "${e}"`);return{type:i,namespace:r}}constructor(e,t){this.#c={...this.#c,...e},this.#u=t instanceof m?t:null}#h=new Map;get __events__(){return this.#h}#c={bubbles:!1,cancelable:!1};get __emitterEventDefaults__(){return this.#c}#u=null;get __parentEmitter__(){return this.#u}#l(e,t,r){if(!(0,n.isStringNotEmpty)(e))throw new TypeError("The 'type' argument must be a non-empty string.");if(!(0,n.isFunction)(t))throw new TypeError("The 'listener' argument must be a function.");r=r??this,e.split(" ").forEach((e=>{if(!(0,n.isStringNotEmpty)(e))return;const i=m.parseType(e,!0);let s=this.#h.get(i.type);s||this.#h.set(i.type,s=new Map);let a=s.get(i.namespace);a||s.set(i.namespace,a=new Map);let o=a.get(t);o||a.set(t,o=new Set),o.add(r)}))}#g(e,t,r){if(!(0,n.isStringNotEmpty)(e))throw new TypeError("The 'type' argument must be a non-empty string.");r=r??this,e.split(" ").forEach((e=>{if(!(0,n.isStringNotEmpty)(e))return;const i=m.parseType(e),s=[];if((0,n.isStringNotEmpty)(i.type))s.push(i.type);else if((0,n.isStringNotEmpty)(i.namespace))for(const[e,t]of this.#h)t.has(i.namespace)&&s.push(e);s.forEach((e=>{if(!this.#h.has(e))return;const s=this.#h.get(e);if(s.has(i.namespace)){if((0,n.isFunction)(t)){const e=s.get(i.namespace);if(!e.has(t))return;if((0,n.isUndefined)(r))e.delete(t);else{const i=e.get(t);if(!i.has(r))return;i.delete(r),0===i.size&&e.delete(t)}0===e.size&&s.delete(i.namespace)}else s.delete(i.namespace);0===s.size&&this.#h.delete(e)}}))}))}#p(e,t,r){return e.length>=2&&(0,n.isStringNotEmpty)(e[0])&&(0,n.isFunction)(e[1])?(3===e.length&&(r=e[2]),t.call(this,e[0],e[1],r)):e.length>=1&&(0,n.isPlainObject)(e[0])&&(2===e.length&&(r=e[1]),p(e[0],((e,i)=>{t.call(this,e,i,r)}))),this}on(e,t,r){return this.#p(arguments,this.#l)}off(e,t,r){return this.#p(arguments,this.#g)}emit(e,...t){if(e instanceof d){null===e.target&&(e.target=this),e.currenTarget!==this&&(e.currenTarget=this);const r=r=>{if(!r.has(e.namespace))return;const i=r.get(e.namespace);for(const[r,n]of i)for(const i of n)r.call(i,e,...t)};return this.#h.has(e.type)&&r(this.#h.get(e.type)),this.#h.has("*")&&r(this.#h.get("*")),e.bubbles&&!e.isPropagationStopped()&&this.#u instanceof m?this.#u.emit(e,...t):!e.isDefaultPrevented()}return!1}trigger(e,t,r){return!!(0,n.isStringNotEmpty)(e)&&(t=Array.isArray(t)?t:[],r=g(r,this.#c),e.split(" ").map((e=>this.emit(new d(e,r,this),...t))).every((e=>e)))}}const y=m,b=(e,t=0)=>`color: ${e}; text-indent:${1.6*t}em; padding: 0.4em; margin-right: 0.4em;`,E=(e,t)=>`display: inline-block; color: ${e}; background-color: ${t}; border-radius: 3px; padding: 0.4em; margin-right: 0.4em;`,S={__types__:["image","iframe"],include:[".foobox,[data-foobox],[data-foobox-items]"],exclude:[".nolightbox"],defaultProperties:[{name:"url",obj:["url","href"],elem:["data:href","data:url","href"],required:!0,test:n.isStringNotEmpty},{name:"title",obj:["title"],elem:["data:title","title","img/title"],test:n.isStringNotEmpty},{name:"description",obj:["description"],elem:["data:description","img/alt"],test:n.isStringNotEmpty},{name:"width",obj:["width"],elem:["data:width"]},{name:"height",obj:["height"],elem:["data:height"]},{name:"aspectRatio",obj:["aspectRatio"],elem:["data:aspectRatio"]}],image:{priority:10,include:["[href^='http'][href*='.svg']","[href^='http'][href*='.png']","[href^='http'][href*='.jpg']","[href^='http'][href*='.jpeg']","[href^='http'][href*='.webp']","[href^='http'][href*='.gif']","[href^='http'][href*='.bmp']","[href^='http'][href*='fakeimg.pl']","[href^='http'].foobox-image"],exclude:[]},iframe:{priority:20,include:["[href^='http'][target='foobox']","[href^='http'].foobox-iframe"],exclude:[]}},T={...S,__types__:[...S.__types__,"video"],video:{priority:15,include:["[href^='http'][href*='youtube.com/watch']","[href^='http'][href*='youtube.com/v']","[href^='http'][href*='youtube.com/embed']","[href^='http'][href*='youtube-nocookie.com/watch']","[href^='http'][href*='youtube-nocookie.com/v']","[href^='http'][href*='youtube-nocookie.com/embed']","[href^='http'][href*='youtu.be/']","[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])","[href^='http'][href*='.mp4']","[href^='http'][href*='.ogv']","[href^='http'][href*='.wmv']","[href^='http'][href*='.webm']"],properties:[{name:"cover",obj:["cover"],elem:["data:cover"],test:n.isStringNotEmpty}]}},P={...T,include:[]},v=function(e){if((0,n.isStringNotEmpty)(e))return e;if(Array.isArray(e)&&e.length){const t=e.filter((e=>(0,n.isStringNotEmpty)(e))).join(",");return(0,n.isStringNotEmpty)(t)?t:null}return null},w=class{parent;type;ref;requiredProperties;#f=null;constructor(e,t,r,i){this.parent=e,this.type=t,this.ref=r,i instanceof EventTarget&&(this.#f=i)}get triggerTarget(){return this.#f}set triggerTarget(e){if(!(e instanceof EventTarget))throw new TypeError("The Item.trigger property must be an instance of EventTarget!");this.#f=e}getProperties(e){return{...this.type.getProperties(this.ref,e),type:this.type.name}}};class I{static DEFAULT_CONVERT(e,t){return e}static DEFAULT_TEST(e,t){return null!=e&&e!==t.defaultValue}static DEFINITION(e){return(0,n.isPlainObject)(e)?{configuration:e,ctor:I}:Array.isArray(e)&&2===e.length&&(0,n.isPlainObject)(e[0])&&(0,n.isFunction)(e[1])?{configuration:e[0],ctor:e[1]}:null}static MERGE_DEFINITIONS(e,t){return function(e,t,r){return(0,n.isFunction)(r)?[...e,...t.filter((t=>!e.some((e=>r(e,t)))))]:[...e,...t.filter((t=>!e.includes(t)))]}(e,t,((e,t)=>{const r=I.DEFINITION(e),i=I.DEFINITION(t);return!(!r||!i)&&r.configuration.name===i.configuration.name}))}static create(e,t){const r=I.DEFINITION(t);return r?new r.ctor(e,r.configuration):null}static createAll(e,t){return t.reduce(((t,r)=>{const i=I.create(e,r);return i&&t.push(i),t}),[])}static getValues(e,t,r){const i={};for(const n of t){const t=n.getValue(e,r);if(n.required&&!n.test(t))return null;i[n.name]=t}return i}constructor(e,t){this.#d=e,this.#m=t.name,this.required=t.required??!1,this.defaultValue=t.defaultValue??null,this.#y=t.convert??I.DEFAULT_CONVERT,this.#b=t.test??I.DEFAULT_TEST,this.queryParent=t.queryParent??"^",this.queryPath=t.queryPath??"/",this.queryType=t.queryType??":",Array.isArray(t.obj)&&(this.obj=t.obj.map((e=>this.objectQuery(e))).filter((e=>null!=e))),Array.isArray(t.elem)&&(this.elem=t.elem.map((e=>this.elementQuery(e))).filter((e=>null!=e)))}#d;get typeParser(){return this.#d}#m;get name(){return this.#m}required;defaultValue;queryParent;queryPath;queryType;obj=[];elem=[];#y;#b;#E=new Map;objectQuery(e){if((0,n.isStringNotEmpty)(e)){let t=e,r=[];if(-1!==t.indexOf(this.queryPath)){const e=t.split(this.queryPath);t=e.pop(),r.push(e)}const i=e=>{let t=e;for(const e of r)if(t=t[e],!t)break;return t??null};return{raw:e,name:t,path:r,getValue:e=>{const r=i(e);return r?this.convert(r[t])??this.defaultValue:this.defaultValue}}}return null}elementQuery(e){if((0,n.isStringNotEmpty)(e)){let t=e,r=0,i=null,n="prop";for(;t[0]===this.queryParent;)r++,t=t.slice(1);if(-1!==t.indexOf(this.queryPath)){const e=t.split(this.queryPath);i=e[0],t=e[1]}if(-1!==t.indexOf(this.queryType)){const e=t.split(this.queryType);n=e[0],t=e[1]}const s=e=>{let t=e;for(let e=0;e<r&&(t=t.parentElement,t);e++);return t&&i?t.querySelector(i):t};let a;switch(n){case"prop":a=e=>this.convert(e[t])??this.defaultValue;break;case"data":a=e=>this.convert(e.dataset[t])??this.defaultValue;break;case"attr":a=e=>e.hasAttribute(t)?this.convert(e.getAttribute(t)):this.defaultValue;break;default:a=()=>this.defaultValue}return{raw:e,name:t,type:n,parents:r,selector:i,getValue:e=>{const t=s(e);return t?a(t):this.defaultValue}}}return null}getValue(e,t){if(!t&&this.#E.has(e))return this.#E.get(e);let r=this.defaultValue;if(e instanceof HTMLElement)for(const t of this.elem){const i=t.getValue(e);if(this.test(i)){r=i;break}}else if((0,n.isPlainObject)(e))for(const t of this.obj){const i=t.getValue(e);if(this.test(i)){r=i;break}}return this.#E.set(e,r),r}convert(e){return this.#y(e,this)}test(e){return this.#b(e,this)}}const _=I;class O{static DEFINITION(e){return(0,n.isStringNotEmpty)(e)?{name:e,ctor:O}:Array.isArray(e)&&2===e.length&&(0,n.isStringNotEmpty)(e[0])&&(0,n.isFunction)(e[1])?{name:e[0],ctor:e[1]}:null}static create(e,t){const r=O.DEFINITION(t);return r?new r.ctor(e,r.name):null}static createAll(e,t){return t.reduce(((t,r)=>{const i=O.create(e,r);return i&&t.push(i),t}),[]).sort(((e,t)=>e.priority-t.priority))}constructor(e,t){this.#S=e,this.#m=t,g(this.config,this.defaults),this.#T=v(this.config.include),this.#P=v(this.config.exclude),this.#v=_.createAll(this,_.MERGE_DEFINITIONS(this.config.properties,this.parser.config.defaultProperties)),this.#w=this.properties.filter((e=>e.required))}#S;get parser(){return this.#S}#m;get name(){return this.#m}get defaults(){return{priority:0,include:[],exclude:[],properties:[]}}get config(){return(0,n.isPlainObject)(this.parser.config[this.name])?this.parser.config[this.name]:this.parser.config[this.name]={}}#I;get priority(){return this.#I}#T;get includeSelector(){return this.#T}#P;get excludeSelector(){return this.#P}#v;get properties(){return this.#v}#w;get requiredProperties(){return this.#w}#E=new Map;#_=new Map;#O=new Map;includes(e){return e instanceof HTMLElement?null!==this.includeSelector&&e.matches(this.includeSelector):!!(0,n.isPlainObject)(e)&&e.type===this.name}excludes(e){return e instanceof HTMLElement&&null!==this.excludeSelector&&e.matches(this.excludeSelector)}canParse(e){return this.includes(e)&&!this.excludes(e)}create(e,t,r){return t instanceof HTMLElement||(0,n.isPlainObject)(t)?new w(e,this,t,r):null}parse(e,t,r){let i;if(i=this.#E.has(t)?this.#E.get(t):this.create(e,t,this.getTrigger(t)),i instanceof w){const e=this.getRequiredProperties(t,r);if(!e)return this.#E.delete(t),null;i.requiredProperties=e,this.#E.set(t,i)}return i}getTrigger(e){return e instanceof HTMLElement?e:null}getRequiredProperties(e,t){if(!t&&this.#_.has(e))return this.#_.get(e);const r=_.getValues(e,this.requiredProperties,t);return this.#_.set(e,r),r}getProperties(e,t){if(!t&&this.#O.has(e))return this.#O.get(e);const r=_.getValues(e,this.properties,t);return this.#O.set(e,r),r}}const N=O;class j{parser;ref;options;#f=null;items=[];constructor(e,t,r,i){this.parser=e,this.ref=t,this.options=h({},r),i instanceof EventTarget&&(this.#f=i)}get triggerTarget(){return this.#f}set triggerTarget(e){if(!(e instanceof EventTarget))throw new TypeError("The Container.triggerTarget property must be an instance of EventTarget.");this.#f=e}get firstIndex(){return this.items.length?0:-1}get lastIndex(){return this.items.length?this.items.length-1:-1}withinRange(e){return(0,n.isNumber)(e)&&e>=this.firstIndex&&e<=this.lastIndex}getByIndex(e){return this.withinRange(e)?this.items[e]:null}getFirst(){return-1!==this.firstIndex?this.items[this.firstIndex]:null}getLast(){return-1!==this.lastIndex?this.items[this.lastIndex]:null}getNext(e,t){const r=this.items.indexOf(e);if(-1!==r){let e=r+1;const i=this.withinRange(e);if(i)return this.items[e];if(!i&&t)return this.getFirst()}return null}getPrevious(e,t){const r=this.items.indexOf(e);if(-1!==r){let e=r-1;const i=this.withinRange(e);if(i)return this.items[e];if(!i&&t)return this.getLast()}return null}get[Symbol.toStringTag](){return"Container"}}const x=j;async function A(e,...t){return new Promise((r=>{setTimeout((()=>{r(e(...t))}),0)}))}async function D(e,t){for(const r of e)await A(t,r)}class R extends y{static DEFINITION(e){return(0,n.isStringNotEmpty)(e)?{name:e,ctor:R}:Array.isArray(e)&&2===e.length&&(0,n.isStringNotEmpty)(e[0])&&(0,n.isFunction)(e[1])?{name:e[0],ctor:e[1]}:null}static create(e,t){const r=R.DEFINITION(t);return r?new r.ctor(e,r.name):null}static createAll(e,t){return t.reduce(((t,r)=>{const i=R.create(e,r);return i&&t.push(i),t}),[]).sort(((e,t)=>e.priority-t.priority))}constructor(e,t){super({bubbles:!0},e),this.#N=e,this.#m=t,g(this.config,this.defaults),this.#I=this.config.priority,this.#T=v(this.config.include),this.#P=v(this.config.exclude),this.#j=N.createAll(this,this.config.__types__),this.#x=v(this.#j.map((e=>e.includeSelector)))}#N;get containers(){return this.#N}#m;get name(){return this.#m}get defaults(){return{__types__:[],priority:49,include:[],exclude:[],data:{options:"foobox",items:"fooboxItems"},defaultProperties:[]}}get config(){return(0,n.isPlainObject)(this.containers.config[this.name])?this.containers.config[this.name]:this.containers.config[this.name]={}}#I;get priority(){return this.#I}#T;get includeSelector(){return this.#T}#P;get excludeSelector(){return this.#P}#j=[];#x;get typesSelector(){return this.#x}#A=new Map;#D=new Map;get isDocumentParser(){return!0}includes(e){return e instanceof HTMLElement&&null!==this.includeSelector&&e.matches(this.includeSelector)}excludes(e){return e instanceof HTMLElement&&null!==this.excludeSelector&&e.matches(this.excludeSelector)}canParse(e){return this.includes(e)&&!this.excludes(e)}data(e,t){if(!t&&this.#D.has(e))return this.#D.get(e);const r=f(this.config.data,((t,r,i)=>{if((0,n.isStringNotEmpty)(r)&&e.dataset.hasOwnProperty(r)){let n;try{n=JSON.parse(e.dataset[r])}catch(t){console.error(`Invalid dataset.${r} JSON string supplied.`,e.dataset,r,t),n=null}finally{t[i]=n}}else t[i]=null;return t}),{});return this.#D.set(e,r),r}async parseDocument(e,t){const r=[];for(const i of this.config.include)await D(document.querySelectorAll(i),(i=>{if(e.has(i)||this.excludes(i))return;const n=this.parse(i,e,t);n&&(r.push(n),e.add(i))}));return this.purgeCache(r),r}purgeCache(e){for(const t of this.#A.values())e.includes(t)&&!this.shouldPurge(t)||(this.#A.delete(t.ref),this.trigger("removed-container",[t]))}shouldPurge(e){return!1}getArgs(e,t){let r=null,i=[],s={};if(e instanceof HTMLElement){const a=this.data(e,t);(0,n.isPlainObject)(a.options)&&(s=a.options),Array.isArray(a.items)?(r=e,i.push(...a.items)):(e.matches(this.typesSelector)&&i.push(e),i.push(...e.querySelectorAll(this.typesSelector)))}return{options:s,itemRefs:i,trigger:r}}create(e,t,r){return e instanceof HTMLElement?new x(this,e,t,r):null}parse(e,t,r){const{itemRefs:i,options:n,trigger:s}=this.getArgs(e,r);let a,o=!1;if(this.#A.has(e)?(a=this.#A.get(e),o=!0):a=this.create(e,n,s),a instanceof x){const n=this.parseItems(a,i,t,r);if(o){const e=this.compareItems(n,a.items);a.items.length=0,a.items.push(...n),(e.added.length>0||e.removed.length>0)&&this.trigger("updated-container",[a,e])}else a.items.push(...n),this.trigger("added-container",[a]);this.#A.set(e,a)}return a}parseItems(e,t,r,i){const n=[];for(const s of t){if(r.has(s)||this.excludes(s))continue;const t=this.parseItem(e,s,i);t&&(n.push(t),r.add(s))}return n}parseItem(e,t,r){const i=this.#j.find((e=>e.canParse(t)));return i?i.parse(e,t,r):null}compareItems(e,t){return{removed:t.filter((t=>!e.includes(t))),added:e.filter((e=>!t.includes(e)))}}}const L=R,q={containers:{__parsers__:["default",["groups",class extends L{get config(){return super.config}get defaults(){return h(super.defaults,{priority:99})}async parseDocument(e,t){const r=[];return await D(this.config.include,(i=>{if(!e.has(i)){const n=this.parse(i,e,t);n&&n.items.length&&(r.push(n),e.add(i))}})),this.purgeCache(r),r}shouldPurge(e){return 0===e.items.length}create(e,t,r){return(0,n.isStringNotEmpty)(e)?new x(this,e,t,r):super.create(e,t,r)}getArgs(e,t){return(0,n.isStringNotEmpty)(e)?{trigger:null,options:{},itemRefs:document.querySelectorAll(e)}:super.getArgs(e,t)}}]],default:T,groups:P}},C={is:n,obj:i},F=new class extends y{config={};constructor(e,t){super(),this.config=e,this.#N=new t(this,"containers")}#N;get containers(){return this.#N}#R;get RS_DEFAULT(){return 0}get RS_INITIALIZING(){return 1}get RS_INITIALIZED(){return 2}get RS_READY(){return 3}#L=this.RS_DEFAULT;get readyState(){return this.#L}set#q(e){if(this.#L!==e){if(!(0,n.isNumber)(e))throw new TypeError("The 'value' argument must be a number.");if(e<this.#L)throw new RangeError("The 'value' argument can't be less than the current readyState.");if(e>this.RS_READY)throw new RangeError("The 'value' argument can't be more than the RS_READY value.");this.#L=e,this.documentDispatch("foobox-readystatechange"),this.trigger("readystatechange",[e])}}documentDispatch(e,t){return(0,n.isString)(e)&&(e=new CustomEvent(e,h({detail:this},t))),e instanceof Event&&document.dispatchEvent(e)}async init(e){if(this.readyState!==this.RS_DEFAULT)return;const t=function(e){const t=performance.now(),r=`%c--\x3e%c${e}`;return console.debug(r,b("green"),E("gray","white")),{end:()=>{const r=((e,t)=>{const r=t-e;return{value:r,color:r>50?"red":r>25?"darkorange":"green"}})(t,performance.now()),i=`%c<--%c${e}%c${r.value.toFixed(2)}ms`;console.debug(i,b("red"),E("gray","white"),E("white",r.color))}}}("foobox:init()");h(this.config,e),this.#q=this.RS_INITIALIZING,this.#N.init(),this.#q=this.RS_INITIALIZED,await this.#N.parseDocument(!0),this.#q=this.RS_READY,t.end()}registerParser(e,t,r){return this.#N.registerParser(e,t,r)}async parseDocument(e){return await this.#N.parseDocument(e)}parse(e,t){return this.#N.parse(e,t)}}(q,class extends y{constructor(e,t){super({bubbles:!0},e),this.#C=e,this.#m=t,g(this.config,this.defaults),this.on({"added-container":this.#F,"removed-container":this.#V,"updated-container":this.#M},this)}#m;get name(){return this.#m}#C;get plugin(){return this.#C}get defaults(){return{__parsers__:[]}}get config(){return(0,n.isPlainObject)(this.plugin.config[this.name])?this.plugin.config[this.name]:this.plugin.config[this.name]={}}#N=new Map;#k=new Map;#U=null;#Z=[];get __parsers__(){return this.#Z}init(){this.plugin.readyState===this.plugin.RS_INITIALIZING&&(this.#Z=L.createAll(this,this.config.__parsers__))}registerParser(e,t,r){if(this.plugin.readyState<this.plugin.RS_INITIALIZED&&!this.config.hasOwnProperty(e)){const i=(0,n.isFunction)(r)?r:L;return this.config.__parsers__.push([e,i]),this.config[e]=h({},t),!0}return!1}unregisterParser(e){return!!(this.plugin.readyState<this.plugin.RS_INITIALIZED&&this.config.hasOwnProperty(e))&&(this.config.__parsers__=this.config.__parsers__.filter((t=>{const r=L.DEFINITION(t);return!!r&&r.name!==e})),delete this.config[e],!0)}removeTriggerListener(e){if(e instanceof EventTarget&&this.#k.has(e)){const t=this.#k.get(e);e.removeEventListener("click",t,!1),this.#k.delete(e)}}addTriggerListener(e,t,r){if(e instanceof EventTarget){this.#k.has(e)&&e.removeEventListener("click",this.#k.get(e),!1);const i=e=>{e.preventDefault(),this.trigger("triggered-container",[t,r])};this.#k.set(e,i),e.addEventListener("click",i,!1)}}getDocumentParsers(){return this.#Z.filter((e=>e.isDocumentParser))}getRefParser(e){return this.#Z.find((t=>t.canParse(e)))??null}getAll(){return Array.from(this.#N.values())}getRefs(e){const t=new Set;return this.getAll().reduce(((t,r)=>(r.ref!==e&&(t.add(r.ref),r.items.forEach((r=>{r.ref!==e&&t.add(r.ref)}))),t)),t)}async parseDocument(e){return this.plugin.readyState<this.plugin.RS_INITIALIZED?[]:this.#U?this.#U:(e=e??!1,this.#U=new Promise((async t=>{const r=[],i=new Set;await D(this.getDocumentParsers(),(async t=>{const n=await t.parseDocument(i,e);r.push(...n)})),this.#U=null,t(r)})))}parse(e,t){if(this.plugin.readyState<this.plugin.RS_INITIALIZED)return null;t=t??!1;const r=this.getRefParser(e);if(r){const i=this.getRefs(e);return r.parse(e,i,t)}return null}#F(e,t){this.addTriggerListener(t.triggerTarget,t),t.items.forEach((e=>this.addTriggerListener(e.triggerTarget,t,e))),this.#N.set(t.ref,t)}#M(e,t,r){r.removed.forEach((e=>this.removeTriggerListener(e.triggerTarget))),r.added.forEach((e=>this.addTriggerListener(e.triggerTarget,t,e))),this.#N.set(t.ref,t)}#V(e,t){this.removeTriggerListener(t.triggerTarget),t.items.forEach((e=>this.removeTriggerListener(e.triggerTarget))),this.#N.delete(t.ref)}});F.utils=C,r.g.FooBox=F;const V=F},320:(e,t,r)=>{function i(e){return null!=e&&"[object Boolean]"===Object.prototype.toString.call(e)}function n(e){return null!=e&&("[object Function]"===Object.prototype.toString.call(e)||"function"==typeof e||e instanceof Function)}function s(e){return null!=e&&"[object Number]"===Object.prototype.toString.call(e)&&!isNaN(e)}function a(e){return null!=e&&"object"==typeof e}function o(e){if(a(e)){const t=Object.getPrototypeOf(e);return t===Object.prototype||null===t}return!1}function c(e){return null!=e&&e instanceof Promise}function u(e){return null!=e&&"[object String]"===Object.prototype.toString.call(e)}r.r(t),r.d(t,{isBoolean:()=>i,isFunction:()=>n,isNumber:()=>s,isObject:()=>a,isPlainObject:()=>o,isPromise:()=>c,isString:()=>u,isStringNotEmpty:()=>l,isUndefined:()=>g});const h=/^\s*$/;function l(e){return u(e)&&!h.test(e)}function g(e){return void 0===e}}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,i),s.exports}i.m=t,e=[],i.O=(t,r,n,s)=>{if(!r){var a=1/0;for(h=0;h<e.length;h++){for(var[r,n,s]=e[h],o=!0,c=0;c<r.length;c++)(!1&s||a>=s)&&Object.keys(i.O).every((e=>i.O[e](r[c])))?r.splice(c--,1):(o=!1,s<a&&(a=s));if(o){e.splice(h--,1);var u=n();void 0!==u&&(t=u)}}return t}s=s||0;for(var h=e.length;h>0&&e[h-1][2]>s;h--)e[h]=e[h-1];e[h]=[r,n,s]},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={958:0};i.O.j=t=>0===e[t];var t=(t,r)=>{var n,s,[a,o,c]=r,u=0;if(a.some((t=>0!==e[t]))){for(n in o)i.o(o,n)&&(i.m[n]=o[n]);if(c)var h=c(i)}for(t&&t(r);u<a.length;u++)s=a[u],i.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return i.O(h)},r=self.webpackChunkfoobox=self.webpackChunkfoobox||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var n=i(408);n=i.O(n)})();
//# sourceMappingURL=foobox.js.map