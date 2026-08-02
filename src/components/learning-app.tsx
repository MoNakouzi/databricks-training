"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { featureBranches, learners, projectConfig, type LearnerId } from "@/config/project";
import { conceptPrimer, glossary, platformConcepts, projectFiles, stages, taskChecklists, taskReferences, taskTypeGuide, type Task } from "@/lib/guide";
import { ArrowIcon, BookIcon, CheckIcon, SparkleIcon } from "./icons";
import { CodeBlock } from "./code-block";

const storageKey = "cityride-progress-v1";
const emptyProgress = '{"viri":[],"isabel":[]}';
const visible = (task:Task, learner:LearnerId) => task.assignee === "both" || task.assignee === learner;
const subscribe = (callback:()=>void) => {
  window.addEventListener("storage",callback);
  window.addEventListener("cityride-progress",callback);
  return () => { window.removeEventListener("storage",callback); window.removeEventListener("cityride-progress",callback); };
};
const getProgressSnapshot = () => localStorage.getItem(storageKey) ?? emptyProgress;
const getServerProgressSnapshot = () => emptyProgress;

export function LearningApp() {
  const [learner,setLearner] = useState<LearnerId>("viri");
  const [activeStage,setActiveStage] = useState(stages[0].id);
  const [glossaryOpen,setGlossaryOpen] = useState(false);
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false);
  const savedProgress = useSyncExternalStore(subscribe,getProgressSnapshot,getServerProgressSnapshot);
  const completed = useMemo<Record<LearnerId,string[]>>(() => { try { return JSON.parse(savedProgress); } catch { return {viri:[],isabel:[]}; } },[savedProgress]);
  const allTasks=useMemo(()=>stages.flatMap(s=>s.tasks.filter(task=>visible(task,learner))),[learner]);
  const progress=allTasks.length?Math.round(completed[learner].length/allTasks.length*100):0;
  const stage=stages.find(s=>s.id===activeStage)??stages[0];
  const stageTasks=stage.tasks.filter(task=>visible(task,learner));
  const stageDone=stageTasks.filter(task=>completed[learner].includes(task.id)).length;
  const completeStage=stageTasks.length>0&&stageDone===stageTasks.length;
  const nextStage=stages[stages.findIndex(s=>s.id===stage.id)+1];

  const toggle=(id:string)=>{const list=completed[learner];const next={...completed,[learner]:list.includes(id)?list.filter(x=>x!==id):[...list,id]};localStorage.setItem(storageKey,JSON.stringify(next));window.dispatchEvent(new Event("cityride-progress"));};
  const goToStage=(id:string)=>{setActiveStage(id);window.scrollTo({top:0,behavior:"smooth"});};

  return <div className={`app-shell ${sidebarCollapsed?"sidebar-is-collapsed":""}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">CR</div><div><strong>CityRide</strong><small>Analytics field guide</small></div></div>
      <button className="sidebar-toggle" onClick={()=>setSidebarCollapsed(value=>!value)} aria-label={sidebarCollapsed?"Expand sidebar":"Collapse sidebar"} aria-expanded={!sidebarCollapsed}><ArrowIcon/></button>
      <div className="sidebar-label">Your journey</div>
      <nav aria-label="Learning stages">{stages.map(item=>{const tasks=item.tasks.filter(task=>visible(task,learner));const finished=tasks.length>0&&tasks.every(task=>completed[learner].includes(task.id));return <button key={item.id} className={`nav-item ${activeStage===item.id?"active":""}`} onClick={()=>goToStage(item.id)}><span className={`nav-number ${finished?"finished":""}`}>{finished?<CheckIcon/>:item.number}</span><span>{item.title}</span></button>;})}</nav>
      <div className="sidebar-bottom"><button className="utility-button" onClick={()=>setGlossaryOpen(true)}><BookIcon/>Glossary</button><p className="text-help">Stuck? Text {projectConfig.projectOwnerName}.</p></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="mobile-brand">CityRide</div><div className="learner-switch" aria-label="Choose your walkthrough">{(Object.keys(learners) as LearnerId[]).map(id=><button key={id} onClick={()=>setLearner(id)} className={learner===id?"selected":""}><span className={`avatar ${id}`}>{learners[id].name[0]}</span>{learners[id].name}</button>)}</div><div className="overall-progress"><span>{progress}% complete</span><div><i style={{width:`${progress}%`}}/></div></div></header>

      <section className={`hero ${stage.color}`}><div className="hero-copy"><span className="eyebrow">{stage.eyebrow} · {stage.duration}</span><h1>{stage.title}</h1><p>{stage.summary}</p><div className="role-pill"><span className={`avatar ${learner}`}>{learners[learner].name[0]}</span><div><small>Your focus</small><strong>{learners[learner].focus}</strong></div></div></div><div className="scene" aria-hidden="true"><div className="cloud cloud-a"/><div className="cloud cloud-b"/><div className="city"><i/><i/><i/><i/><i/></div><div className="road"><span className="taxi">🚕</span></div><SparkleIcon className="scene-sparkle"/></div></section>

      {stage.id==="setup"?<>
        <section className="setup-card"><div><small>Free Edition signup</small><a href={projectConfig.databricksFreeEditionSignupUrl} target="_blank" rel="noreferrer">Create an account<ArrowIcon/></a></div><div><small>Repository URL</small><a href={projectConfig.repositoryUrl} target="_blank" rel="noreferrer">{projectConfig.repositoryUrl}</a></div><div><small>Workspace</small><a href={projectConfig.databricksWorkspaceUrl} target="_blank" rel="noreferrer">Open Databricks <ArrowIcon/></a></div><div><small>Source data</small><a href={projectConfig.sourceDataUrl} target="_blank" rel="noreferrer">{projectConfig.sourceTable}<ArrowIcon/></a></div><div><small>Prepared namespaces</small><strong>{projectConfig.projectCatalog}.{projectConfig.developmentSchema} · {projectConfig.projectCatalog}.{projectConfig.productionSchema}</strong></div></section>
        <section className="orientation"><div className="orientation-heading"><span className="eyebrow">Start here · 5 minute orientation</span><h2>How to use this field guide</h2><p>You do not need to memorize Databricks. Use one card at a time, follow its bullets in order, and stop whenever the result does not make sense.</p></div><div className="task-types">{taskTypeGuide.map(item=><article key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div><section className="project-map"><div className="project-map-intro"><span className="eyebrow">Already prepared for you</span><h3>Your project files are ready</h3><p>After cloning, verify this structure before starting. Work in the existing files—do not rename, move, or recreate them. The test file is optional until you reach the stretch work.</p></div><div className="file-grid">{projectFiles.map(file=><div key={file.path}><code>{file.path}</code><span>{file.purpose}</span></div>)}</div></section><aside className="git-folder-rule"><div><strong>One person, one Git folder</strong><p>Viri and Isabel each clone the same repository into their own personal Workspace folder. Never share a Git folder: a Git action in a shared folder can switch the branch for everyone.</p></div><div className="branch-list">{Object.values(featureBranches).map(branch=><code key={branch}>{branch}</code>)}</div></aside><aside className="free-edition-note"><strong>Free Edition in 2026</strong><p>Your workspace uses managed Serverless compute and is quota-limited. If compute becomes unavailable, stop and wait for the daily or monthly reset—your saved data and settings are not deleted. Use only public sample data for this project.</p><a href={projectConfig.freeEditionLimitsUrl} target="_blank" rel="noreferrer">Read current official limits <ArrowIcon/></a></aside></section>
      </>:null}

      {stage.id==="setup"?<section className="concept-section"><div className="concept-heading"><span className="eyebrow">The big picture</span><h2>One source. Three levels of trust.</h2><p>This is called medallion architecture. Data becomes more reliable and more useful as it moves from Bronze to Silver to Gold. The names describe data quality and purpose—not different Databricks products.</p><a href={projectConfig.medallionGuideUrl} target="_blank" rel="noreferrer">Official medallion guide <ArrowIcon/></a></div><div className="medallion-flow">{conceptPrimer.map((item,index)=><article key={item.layer} className={`layer layer-${index}`}><div><span>{item.layer}</span><strong>{item.label}</strong></div><p>{item.meaning}</p><small>{item.question}</small></article>)}</div><div className="platform-concepts">{platformConcepts.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>:null}

      <section className="content-wrap"><div className="section-heading"><div><span className="eyebrow">{learners[learner].name}&apos;s to-do list</span><h2>One small win at a time.</h2></div><span className="stage-count">{stageDone} of {stageTasks.length} done</span></div>
        <div className="task-list">{stageTasks.map((task,index)=>{const isDone=completed[learner].includes(task.id);const references=taskReferences[task.id];return <article className={`task-card ${isDone?"is-done":""}`} key={task.id}><button className="check-button" onClick={()=>toggle(task.id)} aria-label={`${isDone?"Mark incomplete":"Mark complete"}: ${task.title}`} aria-pressed={isDone}>{isDone?<CheckIcon/>:<span>{index+1}</span>}</button><div className="task-body"><div className="task-meta"><span className={`owner ${task.assignee}`}>{task.assignee==="both"?"Pair task":learners[task.assignee].name}</span>{task.file?<code>{task.file}</code>:null}</div><h3>{task.title}</h3><p>{task.description}</p><div className="action-list"><strong>Do this in order</strong><ol>{taskChecklists[task.id].map(item=><li key={item}>{item}</li>)}</ol></div>{task.note?<aside className="coach-note"><SparkleIcon/><span><strong>Coach&apos;s note</strong>{task.note}</span></aside>:null}{task.code?<CodeBlock code={task.code}/>:null}{references?<div className="task-references"><span>Helpful official links</span>{references.map(reference=><a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">{reference.label}<ArrowIcon/></a>)}</div>:null}</div></article>;})}</div>
        <section className="checkpoint"><div className="checkpoint-art" aria-hidden="true"><span>🏁</span></div><div><span className="eyebrow">Before you move on</span><h2>Quick checkpoint</h2><ul>{stage.checkpoint.map(item=><li key={item}><CheckIcon/>{item}</li>)}</ul></div></section>
        {completeStage?<section className="celebration" role="status"><span className="confetti">✦</span><div className="celebration-face">◕‿◕</div><div><span className="eyebrow">Stage complete</span><h2>Beautiful work, {learners[learner].name}! 🎉</h2><p>You made the work smaller, clearer, and safer. That&apos;s real engineering.</p></div>{nextStage?<button onClick={()=>goToStage(nextStage.id)}>Next: {nextStage.title}<ArrowIcon/></button>:<span className="finish-badge">CityRide builder</span>}</section>:<section className="gentle-prompt"><span>🌱</span><p><strong>You&apos;re doing fine.</strong> Finish the tasks above at your own pace. Progress is saved on this device.</p></section>}
        <footer className="guide-links"><span>Official help:</span><a href={projectConfig.sourceDataUrl} target="_blank" rel="noreferrer">Sample data</a><a href={projectConfig.gitFoldersGuideUrl} target="_blank" rel="noreferrer">Git folders</a><a href={projectConfig.jobsGuideUrl} target="_blank" rel="noreferrer">Lakeflow Jobs</a><a href={projectConfig.dashboardsGuideUrl} target="_blank" rel="noreferrer">Dashboards</a></footer>
      </section>
    </main>

    {glossaryOpen?<div className="modal-backdrop" onMouseDown={()=>setGlossaryOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="glossary-title" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">Plain language, always</span><h2 id="glossary-title">CityRide glossary</h2></div><button onClick={()=>setGlossaryOpen(false)} aria-label="Close glossary">×</button></div><dl>{glossary.map(([word,meaning])=><div key={word}><dt>{word}</dt><dd>{meaning}</dd></div>)}</dl></section></div>:null}
  </div>;
}
