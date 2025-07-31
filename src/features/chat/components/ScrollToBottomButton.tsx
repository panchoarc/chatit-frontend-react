type Props = {
  onClick: () => void;
};

export const ScrollToBottomButton = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
  >
    🔽 Ver últimos mensajes
  </button>
);
