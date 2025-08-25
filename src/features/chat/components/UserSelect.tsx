import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/ui/command";
import { Badge } from "@/shared/ui/badge";
import { X } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  keycloakId: string;
}

interface Props {
  users: User[];
  multiple?: boolean;
  value: string[]; // ids seleccionados
  onChange: (value: string[]) => void;
}
export default function UserSelect({
  users,
  multiple,
  value,
  onChange,
}: Props) {
  const handleSelect = (keycloakId: string) => {
    if (multiple) {
      if (value.includes(keycloakId)) {
        onChange(value.filter((v) => v !== keycloakId));
      } else {
        onChange([...value, keycloakId]);
      }
    } else {
      onChange([keycloakId]); // solo 1
    }
  };

  const removeUser = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-2">
      <Command>
        <CommandInput placeholder="Buscar usuario..." />
        <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
        <CommandGroup>
          {users.map((user) => {
            return (
              <CommandItem
                key={user.keycloakId}
                onSelect={() => handleSelect(user.keycloakId)}
              >
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2"
                />
                {user.firstName + " " + user.lastName}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </Command>

      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((keycloakId) => {
          const user = users.find((u) => u.keycloakId === keycloakId);
          if (!user) return null;
          return (
            <Badge
              key={keycloakId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {user.firstName + " " + user.lastName}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUser(user.keycloakId);
                }}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
