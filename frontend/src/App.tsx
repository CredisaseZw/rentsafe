import { BrowserRouter, Route, Routes } from "react-router";
import { ROOT_ROUTES, SYSTEM_ROUTES } from "./constants";
import RentsafeLayout from "./components/routes/rent-safe/Layout";
import RootLayout from "./components/general/RootLayout";
import ProtectRoute from "./lib/PrivateRoute";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { IndividualDialogProvider } from "./contexts/IndividualDialogueContext";
import { CompanyDialogProvider } from "./contexts/CompanyDialogueContext";

export default function App() {
   return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         <ReactQueryProvider>
            <BrowserRouter>
               <CurrencyProvider>
                  <IndividualDialogProvider>
                     <CompanyDialogProvider>
                           <Routes>
                              <Route element={<RootLayout />}>
                                 {ROOT_ROUTES.map((route) => (
                                    <Route key={route.path} path={route.path} element={<route.pageComponent />} />
                                 ))}
                                    <Route element={<ProtectRoute />}>
                                       <Route element={<RentsafeLayout />}>
                                          {SYSTEM_ROUTES.map((route) => (
                                             <Route key={route.path} path={route.path} element={<route.pageComponent />} />
                                          ))}
                                    </Route>
                                 </Route>
                              </Route>
                           </Routes>
                     </CompanyDialogProvider>
                  </IndividualDialogProvider>
               </CurrencyProvider>
            </BrowserRouter>
            <Toaster dismissible position="top-left" duration={10 * 1000} />
         </ReactQueryProvider>
      </ThemeProvider>
   );
} 