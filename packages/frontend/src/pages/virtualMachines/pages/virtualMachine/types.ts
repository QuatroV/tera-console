export type InstanceProperties = {
  instanceName: string;
  instanceType: string;
  createdAt: string;
  link: string;
  lastBackupBucket: string;
  lastBackupKey: string;
  lastBackupAt: string;
};

export type VMTab = "main" | "monitoring" | "console" | "logs";
