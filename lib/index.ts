import * as fs from "fs-extra";
import * as gm from "gm";
import { TargetSpecification, ResourceDefinition, getImageDim } from "./extra";

import {
  androidSplashDefaults,
  iosSplashDefaults,
  iosIconDefaults,
  androidIconDefaults,
  androidCoverImage,
  androidNotificationIconDefaults
} from "./specs";

function generateTarget(
  sourceFile: string,
  targetDir: string,
  target: TargetSpecification
): void {
  if (sourceFile === target.fileName) {
    console.error(
      `Skipping ${target.fileName}, output would overwrite input file`
    );
    return;
  }

  let applyNinePatch = target.fileName.slice(-6) == ".9.png";
  let needFlatten = sourceFile.slice(-4) == ".psd"; //combine layers etc.

  fs.exists(sourceFile, async exists => {
    if (exists) {

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
        convert = convert
          .gravity("Center")
          .crop(target.width, target.height, 0, 0);
        //convert = convert.in("-resize").in(`${spec.width}x${spec.height}`);
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
      convert = convert.noProfile();

      //create output dir, if needed
      let fullTarget = targetDir + target.fileName;
      fs.ensureFileSync(fullTarget);

      //save the file
      convert.write(fullTarget, error => {
        if (error) {
          console.log(
            `Could not write ${target.fileName}, please check your config.`
          );
        } else {
          console.log(
            `Generating ${target.fileName} finished. ${
              applyNinePatch ? "(Nine-Patch applied)" : ""
            }`
          );
        }
      });
    } else {
      console.log(`Sourcefile ${sourceFile} not found, skipping.`);
    }
  });
}

//lets try it
export function generateTargets(def: ResourceDefinition) {
  console.log(`Generating:${def.description} from ${def.sourceFile}`);
  def.targets.forEach(target => {
    generateTarget(def.sourceFile, def.targetDir, target);
  });
}

generateTargets(androidSplashDefaults);
generateTargets(iosSplashDefaults);

generateTargets(androidIconDefaults);
generateTargets(iosIconDefaults);

generateTargets(androidNotificationIconDefaults);