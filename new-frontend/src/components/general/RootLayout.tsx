import { Outlet } from "react-router";

export default function RootLayout() {
   return (
      <div>
         <main className="mx-auto max-w-[1440px] p-2">
            <Outlet />
         </main>
      </div>
   );
}
