// @ts-check
/** @template {Element} T @param {string} selector @param {ParentNode} [root] @returns {T} */
export function requiredElement(selector,root=document){const element=root.querySelector(selector);if(!element)throw new Error(`Required element not found: ${selector}`);return /** @type {T} */(element);}
export function createElement(tag,options={}){const el=document.createElement(tag);if(options.className)el.className=options.className;if(options.text!==undefined)el.textContent=options.text;for(const [k,v]of Object.entries(options.attributes||{}))el.setAttribute(k,v);return el;}
export function createSvgElement(name){return document.createElementNS('http://www.w3.org/2000/svg',name);}
export function setSvgAttributes(el,attrs){for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
