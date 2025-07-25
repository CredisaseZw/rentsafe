interface HeaderProps {
   title: string;
}

function Header({ title }: HeaderProps) {
   return (
      <div className="w-full rounded border border-blue-500 bg-blue-200 p-4 text-center text-blue-500 dark:bg-blue-800/10 dark:text-white">
         <span className="text-PRIMARY font-bold">{title}</span>
      </div>
   );
}

export default Header;
