import { Dialog, DialogContent } from "@/shared/ui/dialog";

type ImageViewerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
};

const ImageViewerModal = ({
  imageUrl,
  open,
  onOpenChange,
}: ImageViewerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 m-0 rounded-xl flex items-center justify-center"
        showCloseButton
      >
        <img
          src={imageUrl}
          alt="Vista previa"
          className="max-h-[80vh] w-auto rounded-lg shadow-md transition-transform duration-500 hover:scale-105"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerModal;
