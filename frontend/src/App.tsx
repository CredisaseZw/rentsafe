import { BrowserRouter, Route, Routes } from "react-router";
import { RENTSAFE_ROUTES, ROOT_ROUTES } from "./constants";
import RentsafeLayout from "./components/routes/rent-safe/Layout";
import RootLayout from "./components/general/RootLayout";

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<RootLayout />}>
               {ROOT_ROUTES.map((route) => (
                  <Route key={route.path} path={route.path} element={<route.pageComponent />} />
               ))}

               <Route element={<RentsafeLayout />}>
                  {RENTSAFE_ROUTES.map((route) => (
                     <Route key={route.path} path={route.path} element={<route.pageComponent />} />
                  ))}
               </Route>
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
