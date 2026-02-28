export type MulterFile = {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
};

export type UploadFilePayload = {
  buffer: Buffer;
  originalname: string;
  mimetype?: string;
};
