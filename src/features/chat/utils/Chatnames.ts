type Member = {
  keycloakId: string;
  firstName: string;
  lastName: string;
};

type Chat = {
  id: string;
  name: string;
  type: "GROUP" | "DM";
  members: Member[];
};

export function getConversationDisplayName(
  conv: Chat,
  currentUserId: string
): string {
  if (conv.type === "GROUP") {
    // Para grupo, mostrar el nombre del grupo
    return conv.name ?? "Grupo sin nombre";
  } else if (conv.type === "DM") {
    // Para DM, mostrar el nombre del otro usuario (no tú)
    const otherUser = conv.members.find((m) => m.keycloakId !== currentUserId);
    if (!otherUser) return "Usuario desconocido";
    return `${otherUser.firstName} ${otherUser.lastName}`;
  }
  return "Conversación desconocida";
}

export function getChatDisplayName(chat: Chat, currentUserId: string): string {
  if (chat.type === "GROUP") {
    return chat.name ?? "Grupo sin nombre";
  }

  // Si hay exactamente dos miembros, devolver el otro
  if (chat.members.length === 2) {
    const other = chat.members.find((m) => m.keycloakId !== currentUserId);
    return other
      ? `${other.firstName} ${other.lastName}`
      : "Usuario desconocido";
  }

  // Si hay solo uno (yo mismo), mostrarlo claro pero indicar que falta info
  if (
    chat.members.length === 1 &&
    chat.members[0].keycloakId === currentUserId
  ) {
    return "Usuario desconocido"; // o "Esperando al otro usuario"
  }

  // Si hay más de dos miembros, algo anda raro pero los mostramos todos
  return (
    chat.members
      .filter((m) => m.keycloakId !== currentUserId)
      .map((m) => `${m.firstName} ${m.lastName}`)
      .join(", ") || "Usuario desconocido"
  );
}
