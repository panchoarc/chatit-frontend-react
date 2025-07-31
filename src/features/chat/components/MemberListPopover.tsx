import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";

type Member = {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

type MemberListPopoverProps = {
  members: Member[];
  triggerLabel: string;
};

const MemberListPopover = ({
  members,
  triggerLabel,
}: MemberListPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="text-blue-600 hover:underline cursor-pointer">
          {triggerLabel}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4">
        <p className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2">
          Miembros del grupo
        </p>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {members.map((member, index) => {
            const initials = `${member.firstName?.[0] ?? ""}${
              member.lastName?.[0] ?? ""
            }`.toUpperCase();

            return (
              <li key={index} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={member.avatarUrl || ""}
                    alt={`${member.firstName} ${member.lastName}`}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <span className="text-sm">
                  {member.firstName} {member.lastName}
                </span>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default MemberListPopover;
