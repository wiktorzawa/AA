// Mock dla AWS SDK S3
export const S3 = jest.fn().mockImplementation(() => ({
  upload: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Location:
        "https://test-bucket.s3.amazonaws.com/deliveries/test-file.xlsx",
      Key: "deliveries/test-file.xlsx",
      Bucket: "test-bucket",
      ETag: '"mock-etag-12345"',
    }),
  }),

  deleteObject: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      DeleteMarker: false,
      VersionId: "mock-version-id",
    }),
  }),

  getSignedUrl: jest.fn().mockImplementation((operation, params) => {
    return Promise.resolve(
      `https://test-bucket.s3.amazonaws.com/signed-url/${params.Key}`,
    );
  }),

  headObject: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      ContentLength: 1024,
      ContentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      LastModified: new Date(),
      ETag: '"mock-etag-12345"',
    }),
  }),

  listObjectsV2: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Contents: [
        {
          Key: "deliveries/test-file.xlsx",
          LastModified: new Date(),
          ETag: '"mock-etag-12345"',
          Size: 1024,
          StorageClass: "STANDARD",
        },
      ],
      IsTruncated: false,
      KeyCount: 1,
      MaxKeys: 1000,
    }),
  }),
}));

// Mock dla konfiguracji AWS
export const config = {
  update: jest.fn().mockImplementation((configUpdate) => {
    console.log("AWS Config updated:", configUpdate);
  }),

  region: "eu-west-1",
  accessKeyId: "test-access-key",
  secretAccessKey: "test-secret-key",
};

// Mock dla Credentials
export const Credentials = jest
  .fn()
  .mockImplementation((accessKeyId, secretAccessKey) => ({
    accessKeyId,
    secretAccessKey,
    sessionToken: null,
  }));

// Eksport domyślny
export default {
  S3,
  config,
  Credentials,
};
