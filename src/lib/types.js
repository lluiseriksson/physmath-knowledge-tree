// @ts-check
/**
 * @typedef {'en'|'es'} Language
 * @typedef {'math'|'bridge'|'physics'} DomainId
 * @typedef {'foundation'|'intermediate'|'advanced'} LevelId
 * @typedef {'not-started'|'learning'|'mastered'} ProgressStatus
 * @typedef {{en:string,es:string}} LocalizedText
 * @typedef {{id:string,title:LocalizedText,domain:DomainId,area:string,level:LevelId,prerequisites:string[],estimatedHours:number,summary:LocalizedText,concepts:{en:string[],es:string[]},keywords:string[]}} Topic
 * @typedef {{x:number,y:number,depth:number,order:number}} GraphPoint
 * @typedef {{schemaVersion:1,statuses:Record<string,ProgressStatus>,favorites:string[],updatedAt:string}} AppProgress
 */
export {};
