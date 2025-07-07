export type Route = {
   label: string;
   path: string;
   component: React.FC;
   isIndex?: boolean;
};

export type NavLink = {
   label: string;
   path?: string;
   subLinks?: NavLink[];
   _component?: React.FC;
};
