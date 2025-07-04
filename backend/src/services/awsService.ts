import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Config } from "../config/aws";
import { logger } from "../utils/logger";

// Serwis do obsługi S3
export const awsService = {
  async uploadFile(
    fileBuffer: Buffer,
    key: string,
  ): Promise<{ Location: string }> {
    logger.info("S3 Upload started", { key, size: fileBuffer.length });

    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: "application/octet-stream",
    });

    try {
      await s3Client.send(command);
      const location = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
      logger.info("S3 Upload completed", { location });
      return { Location: location };
    } catch (error) {
      logger.error("Error uploading file to S3", { error });
      throw error;
    }
  },

  async getFile(key: string) {
    logger.info("S3 GetFile started", { key });

    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    try {
      const response = await s3Client.send(command);
      logger.info("S3 GetFile completed", { key });
      return response;
    } catch (error) {
      logger.error("Error getting file from S3", { error, key });
      throw error;
    }
  },
};

// Zachowaj kompatybilność wsteczną, jeśli inne części systemu używają s3Service
export const s3Service = awsService;
