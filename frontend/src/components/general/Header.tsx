interface HeaderProps {
  title: string;
  variant?: "default" | "danger";
}

function Header({ title, variant = "default" }: HeaderProps) {
  const baseClasses =
    "w-full rounded border p-4 text-center text-white font-bold";
  const variantClasses =
    variant === "danger"
      ? "bg-red-600 border-red-700 dark:bg-red-800/20 dark:border-red-500"
      : "bg-gray-800 border-gray-700 dark:bg-blue-800/10 dark:border-blue-500";

  return <div className={`${baseClasses} ${variantClasses}`}>{title}</div>;
}

export default Header;
