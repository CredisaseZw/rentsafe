import Container from "@/components/general/Container";
import ServiceCard from "@/components/routes/services/ServiceCard";
import { PRIMARY_GRADIENT, SERVICES } from "@/constants";

export default function ServicesHub() {
   return (
      <div className={`min-h-screen text-[whitesmoke] ${PRIMARY_GRADIENT}`}>
         <Container className={`p-10 pt-30`} small>
            <h1 className="mb-6 w-3/4 px-3 text-3xl font-bold">Services</h1>

            <div className="grid w-3/4 grid-cols-3 gap-4">
               {SERVICES.map((service) => (
                  <ServiceCard key={service.href} service={service} />
               ))}
            </div>
         </Container>
      </div>
   );
}
