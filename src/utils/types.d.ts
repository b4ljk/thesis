interface User {
  id: number;
  name: string;
  email: string;
}

export interface PresignedUrl {
  url: string;
  fields: {
    key: string;
    bucket: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    Policy: string;
    "X-Amz-Signature": string;
  };
}
