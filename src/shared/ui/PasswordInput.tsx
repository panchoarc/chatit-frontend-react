import { type FC, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/ui/input";

interface PasswordInputProps {
  name: string; // Nombre del campo
  placeholder?: string;
}

const PasswordInput: FC<PasswordInputProps> = ({
  name,
  placeholder = "Password",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        autoComplete="password"
        {...props}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-gray-500" />
        ) : (
          <Eye className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
