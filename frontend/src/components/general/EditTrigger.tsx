import EditIcon from "./EditIcon"

function EditTrigger() {
  return (
    <div className="flex cursor-pointer flex-row gap-3">
        <EditIcon />
        <span className="text-sm">Edit</span>
    </div>
  )
}

export default EditTrigger