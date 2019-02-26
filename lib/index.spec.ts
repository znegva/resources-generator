import { generateResource, ResourceDefinition } from "./index";
import {
  iosSplashDefaults,
  androidSplashDefaults,
  androidIconDefaults
} from "./specs";
import * as fs from "fs-extra";
import * as gm from "gm";
import * as path from "path";
import * as util from "util";
import { expect } from "chai";
import "mocha";

describe("source and target specifications", () => {
  after(() => {
    //remove the target-dir
    fs.removeSync("./testfiles/target/");
  });

  beforeEach(() => {});

  it("should be a function", () => {
    const result = "hello";
    expect(generateResource).to.be.a("function");
  });

  it("should reject for unfound source files", done => {
    let res: ResourceDefinition = {
      description: "resource definition with not present sourceFile",
      sourceFile: "./thisFileDoesNotExist.png",
      targetDir: "./testfiles/target/",
      targets: [{ fileName: "dontcare.png", width: 100 }]
    };
    generateResource(res)
      .then(() => {
        done(new Error("Promise got resolved"));
      })
      .catch(() => {
        done();
      });
  });

  it("should generate the targetDir if not already present", done => {
    let res: ResourceDefinition = {
      description: "a basic resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/target/",
      targets: [{ fileName: "a.png", width: 100 }]
    };
    //make sure it is not there
    fs.removeSync(res.targetDir);

    generateResource(res).then(() => {
      //check if the dir now exists
      if (fs.pathExistsSync(res.targetDir)) {
        done();
      } else {
        done(new Error("directory is not found"));
      }
    });
  });

  it("should not depend on closing slash of targetDir", done => {
    let res: ResourceDefinition = {
      description: "a basic resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/target", //NO closing slash
      targets: [{ fileName: "a.png", width: 100 }]
    };

    generateResource(res).then(() => {
      //check if the dir now exists
      if (fs.existsSync(path.join(res.targetDir, res.targets[0].fileName))) {
        done();
      } else {
        done(new Error("file not found"));
      }
    });
  });

  it("should not depend on leading dot in sourceFile or targetDir", done => {
    let res: ResourceDefinition = {
      description: "a basic resource definition",
      sourceFile: "testfiles/icon.png",
      targetDir: "testfiles/target/", //NO leading dot!
      targets: [{ fileName: "nodot_test.png", width: 100 }]
    };

    generateResource(res).then(() => {
      //check if the dir now exists
      if (fs.existsSync(path.join(res.targetDir, res.targets[0].fileName))) {
        done();
      } else {
        done(new Error("file not found"));
      }
    });
  });

  it("should skip if we would overwrite our sourceFile", done => {
    let res: ResourceDefinition = {
      description: "a lazy designed resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/", //save it to the same dir as our sourcefile
      targets: [{ fileName: "icon.png", width: 100 }]
    };

    generateResource(res)
      .then(() => {
        done(new Error("sourceFile has been overwritten"));
      })
      .catch(() => {
        done();
      });
  });

  it("should NOT skip if source and target just have the same fileName", done => {
    let res: ResourceDefinition = {
      description: "a maybe misleadingly designed resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/",
      targets: [{ fileName: "testfiles/icon.png", width: 100 }]
    };

    generateResource(res)
      .then(() => {
        //remove the generated dir+file!
        fs.removeSync("./testfiles/testfiles/");

        done();
      })
      .catch(() => {
        done(new Error("skipped just bc of same filename"));
      });
  });
});

describe("correct sizes etc.", () => {
  after(() => {
    //remove the target-dir
    fs.removeSync("./testfiles/target/");
  });

  it("should generate single target with the given name and width", done => {
    let res: ResourceDefinition = {
      description: "a basic resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/target/",
      targets: [{ fileName: "a.png", width: 123 }]
    };
    let t = res.targets[0];

    generateResource(res).then(() => {
      //read the file
      let im = gm.subClass({
        imageMagick: true
      });
      im(path.join(res.targetDir, t.fileName))
        .ping()
        .size((err, size) => {
          //check its size
          if (size.width == t.width) {
            done();
          } else {
            done(new Error(`Image has wrong size: ${size}`));
          }
        });
    });
  });

  it("should generate square target if only width is given", done => {
    let res: ResourceDefinition = {
      description: "a basic resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/target/",
      targets: [{ fileName: "a.png", width: 123 }]
    };
    let t = res.targets[0];

    generateResource(res).then(() => {
      let t = res.targets[0];
      //read the file
      let im = gm.subClass({
        imageMagick: true
      });
      im(path.join(res.targetDir, t.fileName))
        .ping()
        .size((err, size) => {
          //check its size
          if (size.width == t.width && size.width == size.height) {
            done();
          } else {
            done(new Error(`Image has wrong size: ${size}`));
          }
        });
    });
  });

  it("should generate resource as defined (all target, correct size)", done => {
    //generate all ios-splash targets and check if they are generated correctly
    let res: ResourceDefinition = JSON.parse(JSON.stringify(iosSplashDefaults));
    res.sourceFile = "./testfiles/splash.png";
    res.targetDir = "./testfiles/target/";
    generateResource(res)
      .then(() => {
        //check all targets, their size etc.
        let im = gm.subClass({
          imageMagick: true
        });
        res.targets.forEach(target => {
          im(path.join(res.targetDir, target.fileName))
            .ping()
            .size((err, size) => {
              //if an error occured the test has failed
              if (err) done(err);

              //if sizes dont match, test has failed (target.height might not be defined!)
              if (size.width != target.width)
                done(new Error(`${target.fileName} has wrong width!`));

              if (target.height && size.height != target.height)
                done(new Error(`${target.fileName} has wrong height!`));

              if (!target.height && size.height != target.width)
                done(new Error(`${target.fileName} has wrong height!`));
            });
        });
        //if we reach this point, the test is passed
        done();
      })
      .catch(() => {
        done(new Error("Promise rejected"));
      });
  }).timeout(20000);

  it("should generate NinePatch (extra border, transparency) when .9.png as target-extension (uses androidSplashDefaults)", done => {
    //generate all android-splash targets and check if they are generated correctly
    let res: ResourceDefinition = JSON.parse(
      JSON.stringify(androidSplashDefaults)
    );
    res.sourceFile = "./testfiles/splash.png";
    res.targetDir = "./testfiles/target/";
    generateResource(res)
      .then(() => {
        //check all targets, their size etc.
        let im = gm.subClass({
          imageMagick: true
        });
        res.targets.forEach(target => {
          im(path.join(res.targetDir, target.fileName))
            .ping()
            .size((err, size) => {
              //if an error occured the test has failed
              if (err) done(err);

              //if sizes dont match, test has failed (target.height might not be defined!)
              //NinePatch images get an extra border, so size is +2 in each direction!
              if (size.width != target.width + 2)
                done(new Error(`${target.fileName} has wrong width!`));

              if (target.height && size.height != target.height + 2)
                done(new Error(`${target.fileName} has wrong height!`));

              if (!target.height && size.height != target.width + 2)
                done(new Error(`${target.fileName} has wrong height!`));
            })
            .identify((err, imageInfo) => {
              let infos = imageInfo as { [key: string]: any }; //we need to define our own "type"
              if (!infos["Alpha"])
                done(new Error(`${target.fileName} has no Alpha Channel!`));
            });
        });
        //if we reach this point, the test is passed
        done();
      })
      .catch(() => {
        done(new Error("Promise rejected"));
      });
  }).timeout(15000);
  /*
  it("should keep Alpha-Channel if told to do so", done => {
    done("TODO");
  });
  */
});

describe("binary", () => {
  after(() => {
    //remove the target-dir
    fs.removeSync("./testfiles/bintest/");
  });

  it("should generate all android icons when told to do so (using custom source and targetDir)", done => {
    //call the binary
    let exec = util.promisify(require("child_process").exec);
    let sourceFile = "./testfiles/icon.png";
    let targetDir = "./testfiles/bintest/";
    exec(
      `./bin/resources-generator --platform=android --type=icon --source="${sourceFile}" --targetDir="${targetDir}"`
    )
      .then((ret: { stdout: string; stderr: string }) => {
        if (ret.stderr)
          done(new Error(`Error during executing binary: ${ret.stderr}`));

        //test if all files are there!
        androidIconDefaults.targets.forEach(target => {
          if (!fs.existsSync(path.join(targetDir, target.fileName))) {
            done(new Error(`file ${target.fileName} not found`));
          }
        });

        //when we reach this point all files are there :)
        done();
      })
      .catch(() => {
        done(new Error("Error during executing binary"));
      });
  }).timeout(15000);
});
