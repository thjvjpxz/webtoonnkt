import { CategoryResponse, ComicCreateUpdate, ComicResponse } from "./api";

export type DeleteComicModalProps = {
  comicTitle: string;
  onClose: () => void;
  onConfirm: () => void;
};

export type ViewComicModalProps = {
  comic: ComicResponse;
  onClose: () => void;
};

export type ComicModalProps = {
  comic: ComicResponse | null;
  categories: CategoryResponse[];
  onClose: () => void;
  onSave: (comic: ComicCreateUpdate, file?: File) => Promise<void>;
};
