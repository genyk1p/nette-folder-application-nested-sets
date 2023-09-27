(()=>{"use strict";const t=t=>{"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t()};class e extends Error{}const n=(t,n)=>{if(!t)throw new e("Assertion failed"+(void 0!==n?`: ${n}`:"."))};class i extends EventTarget{constructor(t){super(),this.naja=t,this.selector=".ajax",this.allowedOrigins=[window.location.origin],this.handler=this.handleUI.bind(this),t.addEventListener("init",this.initialize.bind(this))}initialize(){t((()=>this.bindUI(window.document.body))),this.naja.snippetHandler.addEventListener("afterUpdate",(t=>{const{snippet:e}=t.detail;this.bindUI(e)}))}bindUI(t){const e=[`a${this.selector}`,`input[type="submit"]${this.selector}`,`input[type="image"]${this.selector}`,`button[type="submit"]${this.selector}`,`form${this.selector} input[type="submit"]`,`form${this.selector} input[type="image"]`,`form${this.selector} button[type="submit"]`].join(", "),n=t=>{t.removeEventListener("click",this.handler),t.addEventListener("click",this.handler)},i=t.querySelectorAll(e);for(let t=0;t<i.length;t++)n(i.item(t));t.matches(e)&&n(t);const a=t=>{t.removeEventListener("submit",this.handler),t.addEventListener("submit",this.handler)};t.matches(`form${this.selector}`)&&a(t);const s=t.querySelectorAll(`form${this.selector}`);for(let t=0;t<s.length;t++)a(s.item(t))}handleUI(t){const e=t;if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey||e.button)return;const n=t.currentTarget,i=this.naja.prepareOptions(),a=()=>{};"submit"===t.type?this.submitForm(n,i,t).catch(a):"click"===t.type&&this.clickElement(n,i,e).catch(a)}async clickElement(t,e={},i){let a,s="GET",r="";if(!this.dispatchEvent(new CustomEvent("interaction",{cancelable:!0,detail:{element:t,originalEvent:i,options:e}})))return i?.preventDefault(),{};if("A"===t.tagName)n(t instanceof HTMLAnchorElement),s="GET",r=t.href,a=null;else if("INPUT"===t.tagName||"BUTTON"===t.tagName){n(t instanceof HTMLInputElement||t instanceof HTMLButtonElement);const{form:e}=t;if(s=t.getAttribute("formmethod")?.toUpperCase()??e?.getAttribute("method")?.toUpperCase()??"GET",r=t.getAttribute("formaction")??e?.getAttribute("action")??window.location.pathname+window.location.search,a=new FormData(e??void 0),"submit"===t.type&&""!==t.name)a.append(t.name,t.value||"");else if("image"===t.type){const e=t.getBoundingClientRect(),n=""!==t.name?`${t.name}.`:"";a.append(`${n}x`,Math.max(0,Math.floor(void 0!==i?i.pageX-e.left:0))),a.append(`${n}y`,Math.max(0,Math.floor(void 0!==i?i.pageY-e.top:0)))}}if(!this.isUrlAllowed(r))throw new Error(`Cannot dispatch async request, URL is not allowed: ${r}`);return i?.preventDefault(),this.naja.makeRequest(s,r,a,e)}async submitForm(t,e={},n){if(!this.dispatchEvent(new CustomEvent("interaction",{cancelable:!0,detail:{element:t,originalEvent:n,options:e}})))return n?.preventDefault(),{};const i=t.getAttribute("method")?.toUpperCase()??"GET",a=t.getAttribute("action")??window.location.pathname+window.location.search,s=new FormData(t);if(!this.isUrlAllowed(a))throw new Error(`Cannot dispatch async request, URL is not allowed: ${a}`);return n?.preventDefault(),this.naja.makeRequest(i,a,s,e)}isUrlAllowed(t){const e=new URL(t,location.href);return"null"!==e.origin&&this.allowedOrigins.includes(e.origin)}}class a{constructor(t){this.naja=t,t.addEventListener("init",this.initialize.bind(this)),t.uiHandler.addEventListener("interaction",this.processForm.bind(this))}initialize(){t((()=>this.initForms(window.document.body))),this.naja.snippetHandler.addEventListener("afterUpdate",(t=>{const{snippet:e}=t.detail;this.initForms(e)}))}initForms(t){const e=this.netteForms||window.Nette;if(e){"form"===t.tagName&&e.initForm(t);const n=t.querySelectorAll("form");for(let t=0;t<n.length;t++)e.initForm(n.item(t))}}processForm(t){const{element:e,originalEvent:n}=t.detail,i=e;void 0!==i.form&&null!==i.form&&(i.form["nette-submittedBy"]=e);const a=this.netteForms||window.Nette;"FORM"!==e.tagName&&!e.form||!a||a.validateForm(e)||(n&&(n.stopImmediatePropagation(),n.preventDefault()),t.preventDefault())}}class s extends EventTarget{constructor(t){super(),this.naja=t,t.uiHandler.addEventListener("interaction",(t=>{const{element:e,options:n}=t.detail;if(e&&(e.hasAttribute("data-naja-force-redirect")||e.form?.hasAttribute("data-naja-force-redirect"))){const t=e.getAttribute("data-naja-force-redirect")??e.form?.getAttribute("data-naja-force-redirect");n.forceRedirect="off"!==t}})),t.addEventListener("success",(t=>{const{payload:e,options:n}=t.detail;e.redirect&&(this.makeRedirect(e.redirect,n.forceRedirect??!1,n),t.stopImmediatePropagation())})),this.locationAdapter={assign:t=>window.location.assign(t)}}makeRedirect(t,e,n={}){t instanceof URL&&(t=t.href);let i=e||!this.naja.uiHandler.isUrlAllowed(t);this.dispatchEvent(new CustomEvent("redirect",{cancelable:!0,detail:{url:t,isHardRedirect:i,setHardRedirect(t){i=!!t},options:n}}))&&(i?this.locationAdapter.assign(t):this.naja.makeRequest("GET",t,null,n))}}class r extends EventTarget{constructor(t){super(),this.naja=t,this.op={replace:(t,e)=>{t.innerHTML=e},prepend:(t,e)=>t.insertAdjacentHTML("afterbegin",e),append:(t,e)=>t.insertAdjacentHTML("beforeend",e)},t.addEventListener("success",(t=>{const{options:e,payload:n}=t.detail;n.snippets&&this.updateSnippets(n.snippets,!1,e)}))}static findSnippets(t){const e={},n=window.document.querySelectorAll('[id^="snippet-"]');for(let i=0;i<n.length;i++){const a=n.item(i);(t?.(a)??1)&&(e[a.id]=a.innerHTML)}return e}updateSnippets(t,e=!1,n={}){Object.keys(t).forEach((i=>{const a=document.getElementById(i);a&&this.updateSnippet(a,t[i],e,n)}))}updateSnippet(t,e,n,i){let a=this.op.replace;!t.hasAttribute("data-naja-snippet-prepend")&&!t.hasAttribute("data-ajax-prepend")||n?!t.hasAttribute("data-naja-snippet-append")&&!t.hasAttribute("data-ajax-append")||n||(a=this.op.append):a=this.op.prepend,this.dispatchEvent(new CustomEvent("beforeUpdate",{cancelable:!0,detail:{snippet:t,content:e,fromCache:n,operation:a,changeOperation(t){a=t},options:i}}))&&("title"===t.tagName.toLowerCase()?document.title=e:a(t,e),this.dispatchEvent(new CustomEvent("afterUpdate",{cancelable:!0,detail:{snippet:t,content:e,fromCache:n,operation:a,options:i}})))}}class o extends EventTarget{constructor(t){super(),this.naja=t,this.initialized=!1,this.popStateHandler=this.handlePopState.bind(this),t.addEventListener("init",this.initialize.bind(this)),t.addEventListener("before",this.saveUrl.bind(this)),t.addEventListener("before",this.replaceInitialState.bind(this)),t.addEventListener("success",this.pushNewState.bind(this)),t.uiHandler.addEventListener("interaction",this.configureMode.bind(this)),this.historyAdapter={replaceState:(t,e,n)=>window.history.replaceState(t,e,n),pushState:(t,e,n)=>window.history.pushState(t,e,n)}}set uiCache(t){console.warn("Naja: HistoryHandler.uiCache is deprecated, use options.snippetCache instead."),this.naja.defaultOptions.snippetCache=t}handlePopState(t){const{state:e}=t;if("naja"!==e?.source)return;const n=this.naja.prepareOptions();this.dispatchEvent(new CustomEvent("restoreState",{detail:{state:e,options:n}}))}initialize(){window.addEventListener("popstate",this.popStateHandler)}saveUrl(t){const{url:e,options:n}=t.detail;n.href??=e}replaceInitialState(e){const{options:n}=e.detail;!1===o.normalizeMode(n.history)||this.initialized||(t((()=>this.historyAdapter.replaceState(this.buildState(window.location.href,n),window.document.title,window.location.href))),this.initialized=!0)}configureMode(t){const{element:e,options:n}=t.detail;if(e&&(e.hasAttribute("data-naja-history")||e.form?.hasAttribute("data-naja-history"))){const t=e.getAttribute("data-naja-history")??e.form?.getAttribute("data-naja-history");n.history=o.normalizeMode(t)}}static normalizeMode(t){return"off"!==t&&!1!==t&&("replace"!==t||"replace")}pushNewState(t){const{payload:e,options:n}=t.detail,i=o.normalizeMode(n.history);if(!1===i)return;e.postGet&&e.url&&(n.href=e.url);const a="replace"===i?"replaceState":"pushState";this.historyAdapter[a](this.buildState(n.href,n),window.document.title,n.href)}buildState(t,e){const n={source:"naja",href:t};return this.dispatchEvent(new CustomEvent("buildState",{detail:{state:n,options:e}})),n}}class d extends EventTarget{constructor(t){super(),this.naja=t,this.storages={off:new l(t),history:new c,session:new h},t.uiHandler.addEventListener("interaction",this.configureCache.bind(this)),t.historyHandler.addEventListener("buildState",this.buildHistoryState.bind(this)),t.historyHandler.addEventListener("restoreState",this.restoreHistoryState.bind(this))}resolveStorage(t){let e;return e=!0===t||void 0===t?"history":!1===t?"off":t,this.storages[e]}configureCache(t){const{element:e,options:n}=t.detail;if(e&&(e.hasAttribute("data-naja-snippet-cache")||e.form?.hasAttribute("data-naja-snippet-cache")||e.hasAttribute("data-naja-history-cache")||e.form?.hasAttribute("data-naja-history-cache"))){const t=e.getAttribute("data-naja-snippet-cache")??e.form?.getAttribute("data-naja-snippet-cache")??e.getAttribute("data-naja-history-cache")??e.form?.getAttribute("data-naja-history-cache");n.snippetCache=t}}buildHistoryState(t){const{state:e,options:n}=t.detail;"historyUiCache"in n&&(console.warn("Naja: options.historyUiCache is deprecated, use options.snippetCache instead."),n.snippetCache=n.historyUiCache);const i=r.findSnippets((t=>!(t.hasAttribute("data-naja-history-nocache")||t.hasAttribute("data-history-nocache")||t.hasAttribute("data-naja-snippet-cache")&&"off"===t.getAttribute("data-naja-snippet-cache"))));if(!this.dispatchEvent(new CustomEvent("store",{cancelable:!0,detail:{snippets:i,state:e,options:n}})))return;const a=this.resolveStorage(n.snippetCache);e.snippets={storage:a.type,key:a.store(i)}}restoreHistoryState(t){const{state:e,options:n}=t.detail;if(void 0===e.snippets)return;if(n.snippetCache=e.snippets.storage,!this.dispatchEvent(new CustomEvent("fetch",{cancelable:!0,detail:{state:e,options:n}})))return;const i=this.resolveStorage(n.snippetCache).fetch(e.snippets.key,e,n);null!==i&&this.dispatchEvent(new CustomEvent("restore",{cancelable:!0,detail:{snippets:i,state:e,options:n}}))&&(this.naja.snippetHandler.updateSnippets(i,!0,n),this.naja.scriptLoader.loadScripts(i))}}class l{constructor(t){this.naja=t,this.type="off"}store(){return null}fetch(t,e,n){return this.naja.makeRequest("GET",e.href,null,{...n,history:!1,snippetCache:!1}),null}}class c{constructor(){this.type="history"}store(t){return t}fetch(t){return t}}class h{constructor(){this.type="session"}store(t){const e=Math.random().toString(36).substring(2,8);return window.sessionStorage.setItem(e,JSON.stringify(t)),e}fetch(t){const e=window.sessionStorage.getItem(t);return null===e?null:JSON.parse(e)}}class p{constructor(e){this.loadedScripts=new Set,e.addEventListener("init",(()=>{t((()=>{document.querySelectorAll("script[data-naja-script-id]").forEach((t=>{const e=t.getAttribute("data-naja-script-id");null!==e&&""!==e&&this.loadedScripts.add(e)}))})),e.addEventListener("success",(t=>{const{payload:e}=t.detail;e.snippets&&this.loadScripts(e.snippets)}))}))}loadScripts(t){Object.keys(t).forEach((e=>{const n=t[e];if(!/<script/i.test(n))return;const i=window.document.createElement("div");i.innerHTML=n;const a=i.querySelectorAll("script");for(let t=0;t<a.length;t++){const e=a.item(t),n=e.getAttribute("data-naja-script-id");if(null!==n&&""!==n&&this.loadedScripts.has(n))continue;const i=window.document.createElement("script");if(i.innerHTML=e.innerHTML,e.hasAttributes()){const t=e.attributes;for(let e=0;e<t.length;e++){const n=t[e].name;i.setAttribute(n,t[e].value)}}window.document.head.appendChild(i).parentNode.removeChild(i),null!==n&&""!==n&&this.loadedScripts.add(n)}}))}}class u extends EventTarget{constructor(t,e,n,l,c,h,u){super(),this.VERSION=2,this.initialized=!1,this.extensions=[],this.defaultOptions={},this.uiHandler=new(t??i)(this),this.redirectHandler=new(e??s)(this),this.snippetHandler=new(n??r)(this),this.formsHandler=new(l??a)(this),this.historyHandler=new(c??o)(this),this.snippetCache=new(h??d)(this),this.scriptLoader=new(u??p)(this)}registerExtension(t){this.initialized&&t.initialize(this),this.extensions.push(t)}initialize(t={}){if(this.initialized)throw new Error("Cannot initialize Naja, it is already initialized.");this.defaultOptions=this.prepareOptions(t),this.extensions.forEach((t=>t.initialize(this))),this.dispatchEvent(new CustomEvent("init",{detail:{defaultOptions:this.defaultOptions}})),this.initialized=!0}prepareOptions(t){return{...this.defaultOptions,...t,fetch:{...this.defaultOptions.fetch,...t?.fetch}}}async makeRequest(t,e,n=null,i={}){"string"==typeof e&&(e=new URL(e,location.href)),i=this.prepareOptions(i);const a=new Headers(i.fetch.headers||{}),s=this.transformData(e,t,n),r=new AbortController,o=new Request(e.toString(),{credentials:"same-origin",...i.fetch,method:t,headers:a,body:s,signal:r.signal});if(o.headers.set("X-Requested-With","XMLHttpRequest"),o.headers.set("Accept","application/json"),!this.dispatchEvent(new CustomEvent("before",{cancelable:!0,detail:{request:o,method:t,url:e.toString(),data:n,options:i}})))return{};const d=window.fetch(o);let l,c;this.dispatchEvent(new CustomEvent("start",{detail:{request:o,promise:d,abortController:r,options:i}}));try{if(l=await d,!l.ok)throw new m(l);c=await l.json()}catch(t){if("AbortError"===t.name)return this.dispatchEvent(new CustomEvent("abort",{detail:{request:o,error:t,options:i}})),this.dispatchEvent(new CustomEvent("complete",{detail:{request:o,response:l,payload:void 0,error:t,options:i}})),{};throw this.dispatchEvent(new CustomEvent("error",{detail:{request:o,response:l,error:t,options:i}})),this.dispatchEvent(new CustomEvent("complete",{detail:{request:o,response:l,payload:void 0,error:t,options:i}})),t}return this.dispatchEvent(new CustomEvent("payload",{detail:{request:o,response:l,payload:c,options:i}})),this.dispatchEvent(new CustomEvent("success",{detail:{request:o,response:l,payload:c,options:i}})),this.dispatchEvent(new CustomEvent("complete",{detail:{request:o,response:l,payload:c,error:void 0,options:i}})),c}appendToQueryString(t,e,n){if(null!=n)if(Array.isArray(n)||Object.getPrototypeOf(n)===Object.prototype)for(const[i,a]of Object.entries(n))this.appendToQueryString(t,`${e}[${i}]`,a);else t.append(e,String(n))}transformData(t,e,n){const i=["GET","HEAD"].includes(e.toUpperCase());if(i&&n instanceof FormData){for(const[e,i]of n)null!=i&&t.searchParams.append(e,String(i));return null}if(null!==n&&Object.getPrototypeOf(n)===Object.prototype||Array.isArray(n)){const e=i?t.searchParams:new URLSearchParams;for(const[t,i]of Object.entries(n))this.appendToQueryString(e,t,i);return i?null:e}return n}}class m extends Error{constructor(t){const e=`HTTP ${t.status}: ${t.statusText}`;super(e),this.name=this.constructor.name,this.stack=new Error(e).stack,this.response=t}}const f=new u;f.registerExtension(new class{constructor(){this.abortControllers=new Set}initialize(t){t.uiHandler.addEventListener("interaction",this.checkAbortable.bind(this)),t.addEventListener("init",this.onInitialize.bind(this)),t.addEventListener("start",this.saveAbortController.bind(this)),t.addEventListener("complete",this.removeAbortController.bind(this))}onInitialize(){document.addEventListener("keydown",(t=>{if("Escape"===t.key&&!(t.ctrlKey||t.shiftKey||t.altKey||t.metaKey)){for(const t of this.abortControllers)t.abort();this.abortControllers.clear()}}))}checkAbortable(t){const{element:e,options:n}=t.detail;(e.hasAttribute("data-naja-abort")||e.form?.hasAttribute("data-naja-abort"))&&(n.abort="off"!==(e.getAttribute("data-naja-abort")??e.form?.getAttribute("data-naja-abort")))}saveAbortController(t){const{abortController:e,options:n}=t.detail;!1!==n.abort&&(this.abortControllers.add(e),n.clearAbortExtension=()=>this.abortControllers.delete(e))}removeAbortController(t){const{options:e}=t.detail;!1!==e.abort&&e.clearAbortExtension&&e.clearAbortExtension()}}),f.registerExtension(new class{constructor(){this.abortControllers=new Map}initialize(t){t.uiHandler.addEventListener("interaction",this.checkUniqueness.bind(this)),t.addEventListener("start",this.abortPreviousRequest.bind(this)),t.addEventListener("complete",this.clearRequest.bind(this))}checkUniqueness(t){const{element:e,options:n}=t.detail,i=e.getAttribute("data-naja-unique")??e.form?.getAttribute("data-naja-unique");n.unique="off"!==i&&(i??"default")}abortPreviousRequest(t){const{abortController:e,options:n}=t.detail;!1!==n.unique&&(this.abortControllers.get(n.unique??"default")?.abort(),this.abortControllers.set(n.unique??"default",e))}clearRequest(t){const{request:e,options:n}=t.detail;e.signal.aborted||!1===n.unique||this.abortControllers.delete(n.unique??"default")}}),document.addEventListener("DOMContentLoaded",(function(){f.initialize({history:!1});const t=document.getElementById("addForm"),e=document.getElementById("add-form-input-data"),n=document.getElementById("add-form-id"),i=t.getAttribute("action"),a=document.getElementById("rename-submit-btn"),s=document.getElementById("rename-form-input-data"),r=new bootstrap.Modal(document.getElementById("deleteModal")),o=new bootstrap.Modal(document.getElementById("renameFormModal")),d=new bootstrap.Modal(document.getElementById("renameWarningModal")),l=document.getElementById("renameWarningModal").querySelector(".modal-body");let c,h,p=1,u="root",m=[],b=[],g=[];const E=t=>{p=t;const e=document.getElementById("getFoldersUrl").textContent,n=document.querySelector(".folders"),i=`${e.slice(0,-1)}${t}`;f.makeRequest("GET",i).then((e=>{e.snippets&&e.snippets.folders&&(m=e.snippets.folders,n.innerHTML="",m.forEach((t=>{n.innerHTML+=`<div class="folder btn btn-primary btn-lg" data-id="${t.id}" data-name="${t.name}">\n                                                    ${t.name}\n                                                    <img class="trash_img" src="img/red-trash-can-icon.svg">\n                                                    <img class="rename_img" src="img/rename-icon.svg">   \n                                                </div>`})),(t=>{const e=document.getElementById("breadcrumb_path");e.innerHTML='<li class="breadcrumb-item active" aria-current="page">Path</li>';const n=`${document.getElementById("getPathUrl").textContent.slice(0,-1)}${t}`;f.makeRequest("GET",n).then((t=>{t.snippets&&t.snippets.folders&&(g=t.snippets.folders,g.forEach((t=>{console.log(t),e.innerHTML+=`<li class="breadcrumb-item active"><a href="#" class="folder_link" data-id="${t.id}">${t.name}</a></li>`})),e.innerHTML+=`<li class="breadcrumb-item active"><a href="#" class="folder_link" data-id="${+p}">${u}</a></li>`)}))})(t),b=m.map((t=>t.name)))}))};E(1),document.getElementById("delet-btn").addEventListener("click",(()=>{r.hide(),(t=>{const e=`${document.getElementById("getDeleteUrl").textContent.slice(0,-1)}${t}`;f.makeRequest("DELETE",e).then((t=>{E(p)}))})(c)})),t.addEventListener("submit",(function(a){n.value=p,e.value=e.value.trim(),a.preventDefault(),""!==e.value&&f.makeRequest("POST",i,new FormData(t)).then((t=>{E(p)})),e.value=""})),a.addEventListener("click",(()=>{const t=s.value.trim();""===t?s.classList.add("is-invalid"):b.includes(t)?(o.hide(),l.innerHTML=`This directory already has a folder named <span class="fw-bold">${t}</span>, please enter a different folder name`,d.show()):(()=>{const t=document.getElementById("rename-form-input-data"),e=`${document.getElementById("getRenameUrl").textContent.split("?")[0]}?newName=${t.value}&itemId=${h}`;f.makeRequest("PUT",e).then((t=>{E(p),o.hide()})),t.value=""})()})),window.addEventListener("click",(t=>{if(t.target&&t.target.classList.contains("folder")&&!t.target.classList.contains("trash_img")&&!t.target.classList.contains("rename_img")){const e=t.target.getAttribute("data-id");u=t.target.getAttribute("data-name"),E(e)}else if(t.target&&t.target.classList.contains("folder_link")){t.preventDefault();const e=t.target.getAttribute("data-id");u=t.target.textContent,E(e)}else if(t.target&&t.target.classList.contains("trash_img")){c=t.target.parentElement.getAttribute("data-id");const e=t.target.parentElement.textContent.trim();document.getElementById("folder_name_in_span").innerHTML='"'+e+'"',r.show()}else t.target&&t.target.classList.contains("rename_img")&&(s.classList.remove("is-invalid"),s.value="",h=t.target.parentElement.getAttribute("data-id"),o.show())}))}))})();
//# sourceMappingURL=bundle.js.map