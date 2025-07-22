import { BrowserRouter, Route, Routes } from "react-router";
import { RENTSAFE_ROUTES, ROOT_ROUTES } from "./constants";
import RentsafeLayout from "./components/routes/rent-safe/Layout";
import RootLayout from "./components/general/RootLayout";
import ProtectRoute from "./lib/PrivateRoute";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers/ReactQueryProvider";

export default function App() {
   return (
      <ReactQueryProvider>
         <BrowserRouter>
            <Routes>
               <Route element={<RootLayout />}>
                  {ROOT_ROUTES.map((route) => (
                     <Route key={route.path} path={route.path} element={<route.pageComponent />} />
                  ))}
                  <Route element={<ProtectRoute />}>
                     <Route element={<RentsafeLayout />}>
                        {RENTSAFE_ROUTES.map((route) => (
                           <Route key={route.path} path={route.path} element={<route.pageComponent />} />
                        ))}
                     </Route>
                  </Route>
               </Route>
            </Routes>
         </BrowserRouter>

         <Toaster dismissible position="top-left" duration={10 * 1000} />
      </ReactQueryProvider>
   );
}
