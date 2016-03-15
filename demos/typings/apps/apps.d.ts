declare type HashMap<T> = { [key: string]: T };
declare function require<T>(name: string): T;

declare class App {
  view: any;
}

declare class ExternalRendererApp extends App {
  simulatedWaterEnabled: boolean;
  waveSize: number;
  waterVelocity: number;

  constructor(readyHandler: () => void);
}

declare module "app/ExternalRendererApp" {
  export = ExternalRendererApp;
}
