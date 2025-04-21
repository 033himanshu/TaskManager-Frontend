import { useRef, useState } from "react"
import { Pencil } from "lucide-react"
import User from "@/api/user"

export default function AvatarSection({ avatar }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(avatar)

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar', file); // 'avatar' must match the key expected by your backend

      await User.updateAvatar(formData); // This should send a multipart/form-data request
    }
  }

  return (
    <div className="relative w-40 h-40">
      <img src={preview} alt="avatar" className="w-full h-full rounded-full object-cover" />
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition"
        onClick={() => fileRef.current.click()}
      >
        <Pencil className="text-white w-6 h-6" />
      </div>
      <input type="file" ref={fileRef} className="hidden" onChange={handleImageChange} />
    </div>
  )
}
