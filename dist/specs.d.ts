export interface TargetSpecification {
    fileName: string;
    width: number;
    height?: number;
}
export interface ResourceDefinition {
    description: string;
    sourceFile: string;
    keepAlpha?: boolean;
    targetDir: string;
    targets: Array<TargetSpecification>;
}
export declare let androidSplashDefaults: ResourceDefinition;
export declare let iosSplashDefaults: ResourceDefinition;
export declare let androidIconDefaults: ResourceDefinition;
export declare let iosIconDefaults: ResourceDefinition;
export declare let androidCoverImage: ResourceDefinition;
export declare let androidNotificationIconDefaults: ResourceDefinition;
