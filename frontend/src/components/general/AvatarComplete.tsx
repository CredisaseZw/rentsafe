import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AvatarCompleteProps = {
   src?: string;
   initials: string;
};

export default function AvatarComplete({ src, initials }: AvatarCompleteProps) {
   return (
      <Avatar className="border-foreground border shadow-md">
         <AvatarImage src={src} />
         <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
   );
}
