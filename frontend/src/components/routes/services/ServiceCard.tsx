import type { Service } from "@/interfaces";
import { Link } from "react-router";

export default function ServiceCard({ service }: { service: Service }) {
   return (
      <Link
         to={service.href}
         className="hover:bg-background text-foreground block rounded-lg border bg-white/90 p-4 backdrop-blur-3xl transition-all"
      >
         <div className="flex items-end gap-4">
            <service.icon className="text-foreground/80 size-9" />
            <div>
               <h3 className="text-lg font-semibold">{service.name}</h3>
               <p className="text-foreground/80 text-sm">{service.description}</p>
            </div>
         </div>
      </Link>
   );
}
