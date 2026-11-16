import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Download, Plus, Pencil, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportFile } from '@/lib/research';
import { useRecords, useResearch, type ResearchRecord } from './provider';
import { RecordEditor, type Field } from './record-editor';
import { Shell, PageHeading, Badge } from './shell';
export const findingFields: Field[] = [
  {key:'question',label:'Research question',required:true,multiline:true},
  {key:'dataset',label:'Dataset and analysis identifier',required:true},
  {key:'methodology',label:'Analysis performed and contrast',required:true,multiline:true},
  {key:'results',label:'Relevant identifiers and numerical results (JSON)',required:true,multiline:true},
  {key:'statistics',label:'Statistical evidence and thresholds',required:true,multiline:true},
  {key:'interpretation',label:'Biological interpretation',required:true,multiline:true},
  {key:'limitations',label:'Limitations',required:true,multiline:true},
  {key:'references',label:'Supporting source URLs',required:true,multiline:true},
  {key:'follow_up',label:'Follow-up research questions',multiline:true},
  {key:'information_type',label:'Information type',options:['Computed Result','Observed Data','Literature-Based Evidence','Research Hypothesis']},
];
export function FindingEditor({initial,onClose}:{initial:Record<string,string>;onClose:()=>void}) {
  return <RecordEditor table="research_notes" fields={findingFields} initial={{record_type:'finding',...initial}} onClose={onClose}/>;
}
export function Findings() {
  const {data:all=[],isFetching}=useRecords('research_notes'); const records=all.filter(r=>r.data['record_type']==='finding');
  const [search,setSearch]=useState('');const [kind,setKind]=useState('all');const visible=records.filter(r=>(r.title+' '+Object.values(r.data).join(' ')).toLowerCase().includes(search.toLowerCase())&&(kind==='all'||r.data['information_type']===kind));const {user,signIn}=useResearch(); const [editor,setEditor]=useState<ResearchRecord|'new'|null>(null);
  return <Shell><PageHeading title="Research Findings" description="Source-linked results, interpretations, limitations, and follow-up questions." action={<Button onClick={()=>user?setEditor('new'):signIn()}><Plus/>New finding</Button>}/>
    <div className="record-actions"><Button variant="outline" onClick={()=>exportFile('torpor-research-findings.json',{exported_at:new Date().toISOString(),findings:records})}><Download/>Export research summary</Button><Button variant="outline" asChild><Link to="/pathways">Investigate source results</Link></Button></div>
    <div className="toolbar mt-5"><div className="search"><Search/><input aria-label="Search findings" placeholder="Search findings, identifiers and citations…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select aria-label="Filter finding information type" value={kind} onChange={e=>setKind(e.target.value)}><option value="all">All information types</option>{['Computed Result','Observed Data','Literature-Based Evidence','Research Hypothesis'].map(v=><option key={v}>{v}</option>)}</select></div>
    {!records.length&&<div className="notice">{isFetching?'Loading saved findings…':user?'No saved findings.':'Sign in to read and save your private findings.'} A significant result alone does not establish a biological discovery.</div>}
    {visible.map(r=><article className="record mt-5" key={r.id}><div className="record-top"><Badge>{r.data['information_type']??'Computed Result'}</Badge><Button size="icon" variant="ghost" aria-label={`Edit ${r.title}`} onClick={()=>setEditor(r)}><Pencil/></Button></div><h3>{r.title}</h3><div className="finding-sections">{findingFields.filter(f=>f.key!=='information_type').map(f=><div key={f.key}><h4 className="text-xs mt-4">{f.label}</h4><p className="whitespace-pre-wrap break-words">{r.data[f.key]||'Not documented'}</p></div>)}</div><p>Saved: {r.created_at}</p><Button variant="outline" asChild><Link to="/readiness">Investigate measurement hypotheses</Link></Button></article>)}
    {editor&&<RecordEditor table="research_notes" fields={findingFields} record={editor==='new'?undefined:editor} initial={{record_type:'finding'}} onClose={()=>setEditor(null)}/>}
  </Shell>;
}