import { Outlet } from "react-router";

export default function RootLayout() {
   return (
      <div>
         <main className="mx-auto max-w-7xl p-5">
            <Outlet />
         </main>
      </div>
   );
}
