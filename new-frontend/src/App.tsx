import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./components/general/RootLayout";
import { RENTSAFE_ROUTES, ROOT_ROUTES } from "./constants/routes";
import RentsafeLayout from "./components/routes/rent-safe/Layout";

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<RootLayout />}>
               {ROOT_ROUTES.map((route) => (
                  <Route index={route.isIndex} key={route.path} path={route.path} element={<route.component />} />
               ))}

               <Route path="/services/rent-safe" element={<RentsafeLayout />}>
                  {RENTSAFE_ROUTES.map((route) => (
                     <Route
                        index={route.isIndex}
                        key={route.path}
                        path={"/services/rent-safe" + route.path}
                        element={<route.component />}
                     />
                  ))}
               </Route>
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
