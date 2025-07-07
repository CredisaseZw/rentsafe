import type { Service } from "@/interfaces";
import { Link } from "react-router";

export default function ServiceCard({ service }: { service: Service }) {
   return (
      <Link
         to={service.href}
         className="bg-foreground/90 hover:bg-foreground text-background block rounded-lg border p-4 transition-all"
      >
         <div className="flex items-center gap-4">
            <service.icon className="text-background/80 size-7" />
            <div>
               <h3 className="text-lg font-semibold">{service.name}</h3>
               <p className="text-background/80 text-sm">{service.description}</p>
            </div>
         </div>
      </Link>
   );
}
