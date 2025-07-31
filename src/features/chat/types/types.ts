export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  keycloakId: string;
  avatarUrl: string | null;
};

export type Chat = {
  id: number;
  name: string;
  type: "GROUP" | "DM";
  avatarUrl: string | null;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  type: "TEXT" | "FILE";
};
