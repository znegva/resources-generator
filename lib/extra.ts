import * as gm from "gm";

/*
 * Interfaces
 */
export interface ItargetSpec {
  fileName: string;
  width: number;
  height: number;
}

export interface IsplashDefinition {
  description: string;
  sourceFile: string;
  targetDir: string; //directory where to store the generated splashes
  targets: Array<ItargetSpec>;
}

/*
 * helper functions
 */
export async function getImageDim(
  filename: string,
  im: gm.SubClass
): Promise<gm.Dimensions> {
  return new Promise((resolve, reject) => {
    im(filename)
      .ping()
      .size((err, size) => {
        if (!err) {
          resolve(size);
        } else {
          reject();
        }
      });
  });
}
