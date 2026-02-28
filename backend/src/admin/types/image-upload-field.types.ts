export type ImageUploadFieldProps = {
  property: {
    path: string;
    custom?: {
      /** Folder prefix for storage path, e.g. "apartments" or "blog-post". */
      uploadPathPrefix?: string;
      /** Message when record is unsaved. */
      saveFirstMessage?: string;
    };
  };
  record?: { params?: Record<string, unknown> } | null;
  onChange?: (path: string, value: unknown) => void;
  where: 'show' | 'list' | 'edit' | 'filter';
};

/** Result of useImageUploadField; passed to Edit view. */
export type ImageUploadFieldState = {
  field: {
    path: string;
    isMultiple: boolean;
    urls: string[];
    uploadingFiles: File[];
    uploadPath: string | null;
    uploadPathPrefix: string | undefined;
    recordId: string | undefined;
    saveFirstMessage: string;
  };
  status: { uploading: boolean; error: string | null };
  actions: {
    handleFiles: (files: File[]) => Promise<void>;
    removeUrl: (index: number) => void;
  };
};
