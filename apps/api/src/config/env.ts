export interface EnvConfig {
  port: number;
  databaseUrl: string;
}

export default (): EnvConfig => ({
  port: parseInt(process.env.PORT ?? "4000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
});
