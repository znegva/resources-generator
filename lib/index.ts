import * as fs from "fs-extra";
import * as gm from "gm";

interface ItargetSpec {
  fileName: string;
  width: number;
  height: number;
}

interface IimageSpecs {
  width: number;
  height: number;
}

interface IsplashDefinition {
  description: string;
  sourceFile: string;
  targetDir: string; //directory where to store the generated splashes
  targets: Array<ItargetSpec>;
}

async function getImageSpecs(
  filename: string,
  im: gm.SubClass
): Promise<IimageSpecs> {
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

function generateTarget(
  sourceFile: string,
  targetDir: string,
  target: ItargetSpec
): void {
  if (sourceFile === target.fileName) {
    console.error(
      `Skipping ${target.fileName}, output would overwrite input file`
    );
    return;
  }

  let applyNinePatch = target.fileName.indexOf(".9.png") > -1;

  fs.exists(sourceFile, async exists => {
    if (exists) {
      //create output dir, if needed
      fs.ensureDirSync(targetDir);

      let im = gm.subClass({
        imageMagick: true
      });

      let input: IimageSpecs = await getImageSpecs(sourceFile, im);

      //open the input file
      let convert = im(sourceFile);

      //REVIEW: maybe we should flatten input files (layers etc)

      //if the target is larger than the input, we fill up
      //no filling needed if we want nine-patch (which will be applied later!)
      if (
        (input.height < target.height || input.width < target.width) &&
        !applyNinePatch
      ) {
        //fill up until target specs are met! WE NEVER SCALE UP!
        console.log("filling the splash, its too small");
        let paddingVer = Math.floor((target.height - input.height) / 2);
        let paddingHor = Math.floor((target.width - input.width) / 2);
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

      //save the file
      convert.write(targetDir + target.fileName, error => {
        if (error) {
          console.log(
            `Could not write ${target.fileName}, please check your config.`
          );
        } else {
          console.log(`Generating ${target.fileName} finished. ${applyNinePatch?"(Nine-Patch applied)":""}`);
        }
      });
    } else {
      console.log(`Sourcefile ${sourceFile} not found, skipping.`);
    }
  });
}

//lets try it
let android: IsplashDefinition = {
  description: "Splashscreens for android",
  sourceFile: "splash.png",
  targetDir: "android/",
  targets: [
    {
      fileName: "screen-ldpi-portrait.9.png",
      width: 320,
      height: 426
    },
    {
      fileName: "screen-ldpi-landscape.9.png",
      width: 426,
      height: 320
    },
    {
      fileName: "screen-hdpi-portrait.9.png",
      width: 480,
      height: 640
    }, // 320x480
    {
      fileName: "screen-hdpi-landscape.9.png",
      width: 640,
      height: 480
    }, // 480x320
    {
      fileName: "screen-mdpi-portrait.9.png",
      width: 320,
      height: 470
    }, // 480x800
    {
      fileName: "screen-mdpi-landscape.9.png",
      width: 470,
      height: 320
    }, // 800x480
    {
      fileName: "screen-xhdpi-portrait.9.png",
      width: 720,
      height: 960
    }, // 720x1280
    {
      fileName: "screen-xhdpi-landscape.9.png",
      width: 960,
      height: 720
    }, // 1280x720
    {
      fileName: "screen-xxhdpi-portrait.9.png",
      width: 960,
      height: 1600
    }, // 960x1600
    {
      fileName: "screen-xxhdpi-landscape.9.png",
      width: 1600,
      height: 960
    }, // 1600x960
    {
      fileName: "screen-xxxhdpi-portrait.9.png",
      width: 1280,
      height: 1920
    }, // 1280x1920
    {
      fileName: "screen-xxxhdpi-landscape.9.png",
      width: 1920,
      height: 1280
    } // 1920x1280
  ]
};

export function generateTargets(def: IsplashDefinition) {
  def.targets.forEach(target => {
    generateTarget(def.sourceFile, def.targetDir, target);
  });
}

generateTargets(android);
