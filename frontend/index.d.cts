declare module "@monolith/frontend" {
  export function getPublicDir(): string;
  export function getServerBuild(): Promise<any>;
  export function startDevServer(app: any): Promise<void>;
}
