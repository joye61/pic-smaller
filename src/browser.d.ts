interface DataTransferItem {
  getAsFileSystemHandle(): Promise<FileSystemHandle>;
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}