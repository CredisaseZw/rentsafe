import { User } from "lucide-react";

interface SDFooter {
   username: string;
}

function SidebarFooterContent({ username }: SDFooter) {
   return (
      <div className="p-2">
         <div className="align-center flex flex-row justify-center gap-3 rounded-xl bg-gray-200 p-3 text-gray-800 dark:bg-zinc-900 dark:text-white">
            <User className="self-center" size={18} />
            <h6 className="">{username}</h6>
         </div>
      </div>
   );
}

export default SidebarFooterContent;
