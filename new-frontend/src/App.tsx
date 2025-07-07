import { BrowserRouter, Route, Routes } from "react-router";
import { ROUTES } from "./constants";
import RootLayout from "./components/layout/RootLayout";

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<RootLayout />}>
               {ROUTES.map((route) => (
                  <Route index={route.isIndex} key={route.href} path={route.href} element={<route.component />} />
               ))}
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
