import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { EnvConfig } from "../config/env";

export interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

@Injectable()
export class CloudinaryService {
  private configured = false;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

  signUploadParams(paramsToSign: Record<string, string | number>): UploadSignature {
    this.ensureConfigured();

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign, timestamp },
      this.configService.get("cloudinaryApiSecret", { infer: true }),
    );

    return {
      timestamp,
      signature,
      apiKey: this.configService.get("cloudinaryApiKey", { infer: true }),
      cloudName: this.configService.get("cloudinaryCloudName", { infer: true }),
    };
  }

  async destroyAsset(publicId: string, resourceType: string): Promise<void> {
    this.ensureConfigured();

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Failed to remove asset from Cloudinary: ${result.result}`);
    }
  }

  private ensureConfigured(): void {
    if (this.configured) {
      return;
    }
    cloudinary.config({
      cloud_name: this.configService.get("cloudinaryCloudName", { infer: true }),
      api_key: this.configService.get("cloudinaryApiKey", { infer: true }),
      api_secret: this.configService.get("cloudinaryApiSecret", { infer: true }),
    });
    this.configured = true;
  }
}
