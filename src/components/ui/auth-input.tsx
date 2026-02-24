"use client"

type AuthInputProps = {
  label: string
  type: string
  placeholder: string
  focusColor?: "blue" | "orange"
} & React.InputHTMLAttributes<HTMLInputElement>

export function AuthInput({
  label,
  type,
  placeholder,
  focusColor = "blue",
  ...props
}: AuthInputProps) {
  const focus =
    focusColor === "orange"
      ? "focus:ring-orange-500"
      : "focus:ring-blue-600"

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`h-11 rounded-lg bg-[#111827] border border-white/10 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${focus}`}
        {...props}
      />
    </div>
  )
}