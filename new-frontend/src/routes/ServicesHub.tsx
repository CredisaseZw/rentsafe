import Container from "@/components/general/Container";
import ServiceCard from "@/components/routes/services/ServiceCard";
import { SERVICES } from "@/constants";

export default function ServicesHub() {
   return (
      <Container>
         <h1 className="mb-4 text-2xl font-bold">Services</h1>

         <div className="grid grid-cols-4 gap-4">
            {SERVICES.map((service) => (
               <ServiceCard key={service.href} service={service} />
            ))}
         </div>
      </Container>
   );
}
