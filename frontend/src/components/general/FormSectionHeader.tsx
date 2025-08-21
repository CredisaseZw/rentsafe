interface props {
    title? :string
}
function FormSectionHeader({title}:props) {
  return (
   <div className="mt-8 mb-8 w-full p-3 text-center rounded border bg-gray-800  text-white dark:border-blue-500 dark:bg-blue-800/10">
      <span className="font-bold">{title}</span>
    </div>
  )
}

export default FormSectionHeader