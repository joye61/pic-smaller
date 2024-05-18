/// <reference types="vite/client" />

interface DataTransferItem {
  getAsFileSystemHandle?: () => Promise<FileSystemHandle>;
}

interface Window {
  showDirectoryPicker?: (option?: {
    id: string;
  }) => Promise<FileSystemDirectoryHandle>;
}
