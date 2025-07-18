import { cn } from "@/lib/utils";

type LogoProps = {
   className?: string;
   imageClassName?: string;
};

export default function Logo({ className, imageClassName }: LogoProps) {
   return (
      <h1 className={cn("flex items-center justify-center gap-2 text-3xl", className)}>
         <img src="/logo.svg" className={cn("w-5", imageClassName)} />
         Credisafe
      </h1>
   );
}
