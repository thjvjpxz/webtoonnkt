import { ComicResponse } from "./api";

export type DeleteComicModalProps = {
  comicTitle: string;
  onClose: () => void;
  onConfirm: () => void;
};

export type ViewComicModalProps = {
  comic: ComicResponse;
  onClose: () => void;
}