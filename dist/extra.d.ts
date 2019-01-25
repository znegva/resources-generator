import * as gm from "gm";
export interface ItargetSpec {
    fileName: string;
    width: number;
    height: number;
}
export interface IsplashDefinition {
    description: string;
    sourceFile: string;
    targetDir: string;
    targets: Array<ItargetSpec>;
}
export declare function getImageDim(filename: string, im: gm.SubClass): Promise<gm.Dimensions>;
