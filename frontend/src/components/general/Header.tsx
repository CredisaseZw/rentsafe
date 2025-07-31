interface HeaderProps {
   title: string;
}

function Header({ title }: HeaderProps) {
   return (
      <div className="text-blue- w-full rounded border bg-gray-800 p-4 text-center text-white dark:border-blue-500 dark:bg-blue-800/10">
         <span className="font-bold">{title}</span>
      </div>
   );
}

export default Header;
