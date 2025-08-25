import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import UserSelect from "./UserSelect";
import UserService from "@/features/user/services/UserService";
import ConversationService from "../services/ConversationService";
import { toast } from "sonner";

const formSchema = z.object({
  type: z.enum(["GROUP", "DM"]),
  name: z.string().optional(),
  memberIds: z.array(z.string()).min(1, "Selecciona al menos un usuario"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentUserId: string;
}

export default function CreateChatModal({
  open,
  setOpen,
  currentUserId,
}: Props) {
  const [users, setUsers] = useState<any[]>([]);

  // cargar usuarios desde tu endpoint

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers();
        // Filtrar al usuario actual
        setUsers(
          response.data.filter((u: User) => u.keycloakId !== currentUserId)
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: "GROUP", name: "", memberIds: [] },
  });

  const type = form.watch("type"); // 👈 declara type aquí

  useEffect(() => {
    if (type === "DM" && form.getValues("memberIds").length > 1) {
      form.setValue("memberIds", []); // resetea porque en DM solo puede 1
    }
  }, [type]);

  useEffect(() => {
    if (!open) {
      form.reset({
        type: "GROUP",
        name: "",
        memberIds: [],
      });
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    console.log("DATA: ", data);
    try {
      await ConversationService.createNewChat(data);
      toast.success("Chat creado correctamenteF");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear nuevo chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={form.getValues("type")}
              onValueChange={(val) =>
                form.setValue("type", val as "GROUP" | "DM")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GROUP">Grupo</SelectItem>
                <SelectItem value="DM">Mensaje directo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "GROUP" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del grupo</Label>
              <Input
                id="name"
                placeholder="Ej: Dev Team"
                {...form.register("name")}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Usuarios</Label>
            <UserSelect
              users={users}
              multiple={type === "GROUP"} // solo multiple si es grupo
              value={form.watch("memberIds")}
              onChange={(val) => {
                if (type === "GROUP") {
                  form.setValue("memberIds", val);
                } else if (type === "DM") {
                  // DM: siempre tomar solo el primer usuario que selecciones
                  form.setValue("memberIds", val.slice(0, 1));
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="hover:bg-blue-500 hover:text-white"
              type="submit"
            >
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
