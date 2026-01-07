type variantTypes = "default" | "danger" | "success";
interface HeaderProps {
  title: string;
  variant?: variantTypes;
}
const variants:Record<variantTypes, string> = {
  "danger" : "bg-red-600 border-red-700 dark:bg-red-800/20 dark:border-red-500",
  "default" :"bg-gray-800 border-gray-700 dark:bg-blue-800/10 dark:border-blue-500",
  "success" : "bg-green-600 border-green-600 dark:bg-green-600/15"

} 
function Header({ title, variant = "default" }: HeaderProps) {
  const baseClasses = "w-full rounded border p-4 text-center text-white font-bold";
  return <div className={`${baseClasses} ${variants[variant]}`}>{title}</div>;
}

export default Header;
