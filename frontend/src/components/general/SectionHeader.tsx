interface props{
    title  : string,
    subTitle : string,
    total : number,
    subTotal : number,
}
function SectionHeader({title, subTitle, total, subTotal}: props) {
  return (
    <div>
        <h3 className="pb-1 font-bold text-2xl text-gray-800 dark:text-gray-50 ">{title}</h3>
        <p className="m-0 self-center text-gray-500 dark:text-gray-100 text-sm">Showing {subTotal} of {total} {subTitle}</p>
    </div>
  )
}

export default SectionHeader