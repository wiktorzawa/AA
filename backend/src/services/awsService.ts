import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Config } from "../config/aws";

// Serwis do obsługi RDS
export const rdsService = {
  async executeQuery(
    sql: string,
    parameters: (string | number | boolean | null)[] = [],
  ) {
    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, parameters }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error) {
      console.error("Error executing RDS query:", error);
      throw error;
    }
  },
};

// Serwis do obsługi S3 - tymczasowo zakomentowany
export const awsService = {
  async uploadFile(
    fileBuffer: Buffer,
    key: string,
  ): Promise<{ Location: string }> {
    console.log(`🚀 S3 Upload: ${key}, size: ${fileBuffer.length} bytes`);

    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: "application/octet-stream",
    });

    try {
      const response = await s3Client.send(command);
      const location = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
      console.log(`✅ S3 Upload completed: ${location}`);
      return { Location: location };
    } catch (error) {
      console.error("❌ Error uploading file to S3:", error);
      throw error;
    }
  },

  async getFile(key: string) {
    console.log(`🔍 S3 GetFile: ${key}`);

    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    try {
      const response = await s3Client.send(command);
      console.log(`✅ S3 GetFile completed: ${key}`);
      return response;
    } catch (error) {
      console.error("❌ Error getting file from S3:", error);
      throw error;
    }
  },
};

// Zachowaj kompatybilność wsteczną
export const s3Service = awsService;
