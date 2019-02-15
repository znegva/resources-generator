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
export declare function generateResource(def: ResourceDefinition): Promise<any>;
