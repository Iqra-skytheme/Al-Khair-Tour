// import Link from "next/link";
// import { Plus, Pencil, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { DeleteButton } from "@/components/admin/delete-button";
// import { apiFetch, adminHeaders } from "@/lib/api";
// import { getAdminToken, deleteZiyarat } from "@/lib/admin-actions";

// export default async function AdminZiyaratPage() {
//   const token = await getAdminToken();
//   const packages = await apiFetch("/api/admin/ziyarat", { headers: adminHeaders(token) });

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-semibold">Ziyarat packages</h1>
//           <p className="mt-1 text-sm text-muted-foreground">Manage guided tour packages.</p>
//         </div>
//         <Button asChild className="gap-2">
//           <Link href="/admin/ziyarat/new"><Plus className="h-4 w-4" /> Add package</Link>
//         </Button>
//       </div>

//       <div className="mt-6 grid gap-3">
//         {(packages ?? []).map((p) => (
//           <Card key={p.id}>
//             <CardContent className="flex items-center justify-between gap-4 p-4">
//               <div>
//                 <div className="flex items-center gap-2 font-medium">
//                   <MapPin className="h-3.5 w-3.5 text-primary" /> {p.title}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {p.city} · {p.duration} · SAR {p.price_sar}
//                   {!p.published && <span className="ml-2 text-destructive">(hidden)</span>}
//                 </div>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Button asChild variant="ghost" size="icon">
//                   <Link href={`/admin/ziyarat/${p.id}`}><Pencil className="h-4 w-4" /></Link>
//                 </Button>
//                 <DeleteButton action={deleteZiyarat.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//         {(!packages || packages.length === 0) && (
//           <p className="text-sm text-muted-foreground">No packages yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import { Plus, Pencil, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken, deleteZiyarat } from "@/lib/admin-actions";

export default async function AdminZiyaratPage() {
  const token = await getAdminToken();
  const packages = await apiFetch("/api/admin/ziyarat", { headers: adminHeaders(token) });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Ziyarat packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage guided tour packages.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/ziyarat/new"><Plus className="h-4 w-4" /> Add package</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(packages ?? []).map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              {p.hero ? (
                <img src={p.hero} alt={p.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary">
                    <MapPin className="h-3 w-3" /> {p.city}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold">{p.title}</div>
                </div>
                {!p.published && (
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Hidden
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                {p.duration && (
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {p.duration}</span>
                )}
                <span className="font-medium text-foreground">SAR {p.price_sar}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href={`/admin/ziyarat/${p.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                </Button>
                <DeleteButton action={deleteZiyarat.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
              </div>
            </CardContent>
          </Card>
        ))}
        {(!packages || packages.length === 0) && (
          <p className="text-sm text-muted-foreground">No packages yet.</p>
        )}
      </div>
    </div>
  );
}