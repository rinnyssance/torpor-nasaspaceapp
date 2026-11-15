import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { studiesQuery } from '@/lib/research.functions';
export type RecordTable = 'candidate_measurements' | 'references' | 'roadmap_items' | 'research_notes';
export type ResearchRecord = { id: string; title: string; data: Record<string, string>; created_at: string };
const Context = createContext<{ user: User | null; ready: boolean; signIn: () => void; closeAuth: () => void; authOpen: boolean }>({ user: null, ready: false, signIn: () => {}, closeAuth: () => {}, authOpen: false });
export function ResearchProvider({ children }: { children: ReactNode }) {
 const [user,setUser] = useState<User|null>(null); const [ready,setReady] = useState(false); const [authOpen,setAuthOpen] = useState(false); const cache = useQueryClient();
 useEffect(() => { supabase.auth.getUser().then(({ data }) => {setUser(data.user);setReady(true)}); const {data} = supabase.auth.onAuthStateChange((event, session) => {if (!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) return;setUser(session?.user??null);setReady(true);if(event==='SIGNED_IN')setAuthOpen(false);cache.removeQueries({queryKey:['private']});}); return () => data.subscription.unsubscribe(); }, [cache]);
 return <Context.Provider value={{user,ready,authOpen,signIn:()=>setAuthOpen(true),closeAuth:()=>setAuthOpen(false)}}>{children}</Context.Provider>;
}
export const useResearch = () => useContext(Context);
function usePrivateRecords(table: RecordTable) { const {user,ready}=useResearch();return useQuery({queryKey:['private',user?.id,table],enabled:ready&&!!user,queryFn:async()=>{const {data,error}=await supabase.from(table).select('id,title,data,created_at').order('created_at',{ascending:false});if(error)throw error;return (data??[]) as ResearchRecord[];}}); }
function usePrivateAnalyses() {const {user,ready}=useResearch();return useQuery({queryKey:['private',user?.id,'analyses'],enabled:ready&&!!user,queryFn:async()=>{const {data,error}=await supabase.from('analyses').select('*').order('created_at',{ascending:false});if(error)throw error;return data??[];}});}
export function useSaveRecord(table: RecordTable) {const {user,signIn}=useResearch();const cache=useQueryClient();return async(title:string,data:Record<string,string>,id?:string)=>{if(!user){signIn();return false;}const row={title,data:data as Json,owner_id:user.id};const ownId=id&&/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)?id:undefined;const result=ownId?await supabase.from(table).update(row).eq('id',ownId):await supabase.from(table).insert(row);if(result.error){toast.error(result.error.message);return false;}await cache.invalidateQueries({queryKey:['private',user.id,table]});toast.success('Research record saved');return true;};}

export function useRecords(table: RecordTable) { const { data: {catalog} }=useSuspenseQuery(studiesQuery); const own=usePrivateRecords(table); const curated=catalog.filter(r=>r.kind===table).map(r=>({id:r.id,title:r.title,data:r.data as Record<string,string>,created_at:r.created_at})); return {...own,data:[...curated,...(own.data??[])]}; }
export function useAnalyses() { const {data:{catalog}}=useSuspenseQuery(studiesQuery);const own=usePrivateAnalyses();const curated=catalog.filter(r=>r.kind==='analyses').map(r=>{const d=r.data as Record<string,Json>;return {id:r.id,study_id:String(d['study_id']),analysis_name:r.title,analysis_type:String(d['analysis_type']),methodology:String(d['methodology']),source_file:String(d['source_file']),source_url:String(d['source_url']),processing_status:String(d['processing_status']),results:d['results']??[],created_at:String(d['import_date']),owner_id:'curated',provenance:d};});return {...own,data:[...curated,...(own.data??[])]}; }
