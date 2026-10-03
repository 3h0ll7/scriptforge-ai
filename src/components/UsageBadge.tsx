import { useState } from "react";
import { ChevronDown, Infinity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hasActiveProSubscription } from "@/lib/subscription";
import { useAuth } from "@/hooks/useAuth";

export default function UsageBadge() {
  const { profile, usage } = useAuth();
  const [open,setOpen]=useState(false);
  const navigate=useNavigate();
  if(!profile) return null;
  const isPro=hasActiveProSubscription(profile);
  const count=usage?.generation_count??0;
  const limit=5;
  return <div className="relative">
    <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 rounded-full border border-[#e4e0d8] bg-white/80 px-3 py-1.5 text-[10px] font-bold text-[#59645c] shadow-[0_4px_12px_rgba(60,54,47,.04)]">
      {isPro?<><Infinity className="h-3.5 w-3.5"/>Pro</>:\`\${count}/\${limit}\`}<ChevronDown className="h-3 w-3"/>
    </button>
    {open&&<><div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}/><div className="absolute end-0 top-full z-50 mt-2 w-60 rounded-2xl border border-[#e3dfd7] bg-[#fbfaf7] p-4 shadow-[0_18px_44px_rgba(65,58,50,.13)]">
      <p className="text-sm font-semibold text-[#29302b]">{isPro?"Unlimited scripts — Pro Plan":\`\${count} of \${limit} free scripts used this month\`}</p>
      {!isPro&&<button onClick={()=>{setOpen(false);navigate("/pricing")}} className="mt-3 w-full rounded-xl bg-[#101812] py-2.5 text-xs font-bold text-white hover:bg-[#17231b]">Upgrade to Pro</button>}
    </div></>}
  </div>;
}
