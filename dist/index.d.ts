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
export declare function generateTargets(def: IsplashDefinition): void;
