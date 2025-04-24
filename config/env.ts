export interface Env {
	server: {
		port: number;
	};
	database: {
		databaseUrl: string;
	};
	auth: {
		accessTokenSecret: string;
		refreshTokenSecret: string;
	};
	whitelist: {
		domains: string[];
	};
	s3_config: {
		accessKeyId: string;
		secretAccessKey: string;
		bucketName: string;
	};
}

export const env: Env = {
	server: {
		port: getEnvNumber("PORT", 3000),
	},
	database: {
		databaseUrl: getEnvOrThrow("DATABASE_URL"),
	},
	auth: {
		accessTokenSecret: getEnvOrThrow("ACCESS_TOKEN_SECRET"),
		refreshTokenSecret: getEnvOrThrow("REFRESH_TOKEN_SECRET"),
	},
	whitelist: {
		domains: getEnv("WHITELIST_DOMAINS", "localhost").split(","),
	},
	s3_config: {
		accessKeyId: getEnvOrThrow("S3_ACCESS_KEY_ID"),
		secretAccessKey: getEnvOrThrow("S3_SECRET_ACCESS_KEY"),
		bucketName: getEnvOrThrow("S3_BUCKET_NAME"),
	},
};

function getEnv(key: string, defaultValue: string): string {
	return process.env[key] ?? defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
	const value = process.env[key];
	if (!value) {
		return defaultValue;
	}
	return Number(value);
}

function getEnvOrThrow(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}