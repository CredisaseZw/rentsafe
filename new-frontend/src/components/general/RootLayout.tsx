import { Outlet } from "react-router";

export default function RootLayout() {
   return (
      <div>
         <main className="container mx-auto p-5">
            <Outlet />
         </main>
      </div>
   );
}
