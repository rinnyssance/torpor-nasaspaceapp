import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';
export type RecordTable = 'candidate_measurements' | 'references' | 'roadmap_items' | 'research_notes';
export type ResearchRecord = { id: string; title: string; data: Record<string, string>; created_at: string };
const Context = createContext<{ user: User | null; ready: boolean; signIn: () => void; closeAuth: () => void; authOpen: boolean }>({ user: null, ready: false, signIn: () => {}, closeAuth: () => {}, authOpen: false });
export function ResearchProvider({ children }: { children: ReactNode }) {
 const [user,setUser] = useState<User|null>(null); const [ready,setReady] = useState(false); const [authOpen,setAuthOpen] = useState(false); const cache = useQueryClient();
 useEffect(() => { supabase.auth.getUser().then(({ data }) => {setUser(data.user);setReady(true)}); const {data} = supabase.auth.onAuthStateChange((event, session) => {if (!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) return;setUser(session?.user??null);setReady(true);if(event==='SIGNED_IN')setAuthOpen(false);cache.removeQueries({queryKey:['private']});}); return () => data.subscription.unsubscribe(); }, [cache]);
 return <Context.Provider value={{user,ready,authOpen,signIn:()=>setAuthOpen(true),closeAuth:()=>setAuthOpen(false)}}>{children}</Context.Provider>;
}
export const useResearch = () => useContext(Context);
export function useRecords(table: RecordTable) { const {user,ready}=useResearch();return useQuery({queryKey:['private',user?.id,table],enabled:ready&&!!user,queryFn:async()=>{const {data,error}=await supabase.from(table).select('id,title,data,created_at').order('created_at',{ascending:false});if(error)throw error;return (data??[]) as ResearchRecord[];}}); }
export function useAnalyses() {const {user,ready}=useResearch();return useQuery({queryKey:['private',user?.id,'analyses'],enabled:ready&&!!user,queryFn:async()=>{const {data,error}=await supabase.from('analyses').select('*').order('created_at',{ascending:false});if(error)throw error;return data??[];}});}
export function useSaveRecord(table: RecordTable) {const {user,signIn}=useResearch();const cache=useQueryClient();return async(title:string,data:Record<string,string>,id?:string)=>{if(!user){signIn();return false;}const row={title,data:data as Json,owner_id:user.id};const result=id?await supabase.from(table).update(row).eq('id',id):await supabase.from(table).insert(row);if(result.error){toast.error(result.error.message);return false;}await cache.invalidateQueries({queryKey:['private',user.id,table]});toast.success('Research record saved');return true;};}
