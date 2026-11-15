import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { metadata } from '@/lib/research';
import { Shell, PageHeading } from '@/components/research/shell';
export const Route = createFileRoute('/reset-password')({head:()=>metadata('Reset Password','Set a new password for your TORPOR research account.'),component:Page});
function Page(){const [message,setMessage]=useState('');return <Shell><PageHeading title="Reset password" description="Choose a new password for your research account."/><form className="article" onSubmit={async e=>{e.preventDefault();const form=new FormData(e.currentTarget);const {error}=await supabase.auth.updateUser({password:String(form.get('password'))});setMessage(error?error.message:'Password updated. You can return to your research workspace.');}}><div className="field"><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" minLength={8} autoComplete="new-password" required/></div><Button type="submit">Update password</Button><p role="status" className="section-sub mt-4">{message}</p></form></Shell>}