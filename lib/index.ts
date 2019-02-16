import * as fs from "fs-extra";
import * as path from "path";
import * as gm from "gm";

/*
 * Interfaces
 */
export interface TargetSpecification {
  fileName: string;
  width: number;
  height?: number; //height is optional, if only width is given we assume a square target
}

export interface ResourceDefinition {
  description: string;
  sourceFile: string;
  keepAlpha?: boolean; //sometimes we need to keep the Alpha-Channel (e.g. Android icons)
  targetDir: string; //directory where to store the generated resources
  targets: Array<TargetSpecification>;
}

/*
 * helper functions
 */
async function getImageDim(
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

//dont console.log when in test env
function log(m: any){
  if(!(process.env.NODE_ENV == "test")){
    console.log(m);
  }
}

/*
 * generate a single target with given specs
 */
async function generateTarget(
  sourceFile: string,
  targetDir: string,
  keepAlpha: boolean,
  target: TargetSpecification
): Promise<void> {
  let applyNinePatch = target.fileName.slice(-6) == ".9.png";
  let needFlatten = sourceFile.slice(-4) == ".psd"; //combine layers etc.
  let fullTargetName = path.join(targetDir , target.fileName);

  //make sure we are not overwriting our source-file
  if (path.relative(sourceFile, fullTargetName) == '') {
    log(
      `Skipped generation of ${fullTargetName}, output would overwrite input file`
    );
    return Promise.reject();
  }

  let im = gm.subClass({
    imageMagick: true
  });

  //prepare our dimensions (source and target)
  let sourceDim: gm.Dimensions = await getImageDim(sourceFile, im);
  //targets without height are assumed to become square
  target.height = target.height ? target.height : target.width;

  //open the input file
  let convert = im(sourceFile);

  if (needFlatten) {
    convert = convert.flatten();
  }

  //if the target is larger than the input, we fill up
  //no filling needed if we want nine-patch (which will be applied later!)
  if (
    (sourceDim.height < target.height || sourceDim.width < target.width) &&
    !applyNinePatch
  ) {
    //fill up until target specs are met! WE NEVER SCALE UP!
    //this imitates what 9-Patch stretching would do
    let paddingVer = Math.floor((target.height - sourceDim.height) / 2);
    let paddingHor = Math.floor((target.width - sourceDim.width) / 2);
    convert = convert
      .in("-define")
      .in(
        "distort:viewport=" +
          target.width +
          "x" +
          target.height +
          "-" +
          paddingHor +
          "-" +
          paddingVer
      )
      .in("-distort")
      .in("SRT")
      .in("0")
      .in("+repage");
  } else if (
    sourceDim.height == target.height &&
    sourceDim.width == target.width
  ) {
    // we dont need to resize or crop!
  } else {
    //we need to crop and/or resize
    //first resize to biggest dimension
    convert = convert.resize(target.width, target.height, "^");
    //crop anything we dont want
    convert = convert.gravity("Center").crop(target.width, target.height, 0, 0);
  }

  //now we have the correctly sized image (as defined in spec),
  //see if we also want to apply nine-patch
  if (applyNinePatch) {
    // extent with 1px transparent border
    convert = convert.borderColor("none").border(1, 1);

    // draw black pixels
    convert = convert
      .fill("black")

      // stretchable area
      .drawPoint(1, 0)
      .drawPoint(target.width, 0)
      .drawPoint(0, 1)
      .drawPoint(0, target.height)

      // padding box (required since API 21)
      .drawLine(target.width + 1, 1, target.width + 1, target.height)
      .drawLine(1, target.height + 1, target.width, target.height + 1);
  }

  //dont store color profile
  convert = convert.noProfile().strip();

  //remove the alpha-channel, except we are forced to keep it
  if (keepAlpha || applyNinePatch) {
    //dont remove alpha!!
  } else {
    convert = convert.out("-background", "white", "-alpha", "off");
  }

  //create output dir, if needed
  fs.ensureFileSync(fullTargetName);

  //save the file
  return new Promise((resolve, reject) => {
    convert.write(fullTargetName, error => {
      if (error) {
        log(
          ` ✖ Could not write ${target.fileName}, please check your config.`
        );
        reject();
      } else {
        log(
          ` ✔ ${target.fileName} generated${
            applyNinePatch ? " (Nine-Patch applied)" : ""
          }${keepAlpha ? " (Alpha Channel preserved)" : ""}.`
        );
        resolve();
      }
    });
  });
}

/*
 * our main export
 */
export function generateResource(def: ResourceDefinition): Promise<any> {
  log(`\nGenerating: ${def.description}`);
  log(
    `(source file: ${def.sourceFile}, target directory: ${def.targetDir})`
  );

  return new Promise((resolve, reject) => {
    if (fs.existsSync(def.sourceFile)) {
      let promises: Array<Promise<any>> = [];
      def.targets.forEach((target: TargetSpecification) => {
        promises.push(
          generateTarget(
            def.sourceFile,
            def.targetDir,
            def.keepAlpha == true,
            target
          )
        );
      });
      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch(e => {
          reject();
        });
    } else {
      log(`Sourcefile ${def.sourceFile} not found, skipping.`);
      reject();
    }
  });
}
