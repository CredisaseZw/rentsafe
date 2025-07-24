import { User } from "lucide-react";

interface SDFooter {
   username: string;
}

function SidebarFooterContent({ username }: SDFooter) {
   return (
      <div className="p-2">
         <div className="align-center bg-primary-dark flex flex-row justify-center gap-3 rounded-xl p-3 text-white">
            <User className="self-center" size={18} />
            <h6>{username}</h6>
         </div>
      </div>
   );
}

export default SidebarFooterContent;
