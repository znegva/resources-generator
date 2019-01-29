import * as gm from "gm";
export interface TargetSpecification {
    fileName: string;
    width: number;
    height?: number;
}
export interface ResourceDefinition {
    description: string;
    sourceFile: string;
    targetDir: string;
    targets: Array<TargetSpecification>;
}
export declare function getImageDim(filename: string, im: gm.SubClass): Promise<gm.Dimensions>;
