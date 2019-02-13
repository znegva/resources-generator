import { generateResource } from "./index";
import {
  ResourceDefinition,
  iosSplashDefaults,
  androidSplashDefaults
} from "./specs";
import * as fs from "fs-extra";
import * as gm from "gm";
import * as path from "path";
import { expect } from "chai";
import "mocha";

describe("main function", () => {
  let unknownSourceFileDef: ResourceDefinition;
  let simpleResourceDef: ResourceDefinition;

  after(() => {
    //remove the target-dir
    fs.removeSync("./testfiles/target/");
  });

  beforeEach(() => {
    unknownSourceFileDef = {
      description: "targets without a source",
      sourceFile: "./thisFileDoesNotExist.png",
      targetDir: "./testfiles/target/",
      targets: []
    };
    simpleResourceDef = {
      description: "a basic resource definition",
      sourceFile: "./testfiles/icon.png",
      targetDir: "./testfiles/target/",
      targets: [{ fileName: "a.png", width: 100 }]
    };
  });

  it("should be a function", () => {
    const result = "hello";
    expect(generateResource).to.be.a("function");
  });

  it("should reject for unfound source files", done => {
    let ret = generateResource(unknownSourceFileDef);
    ret
      .then(() => {
        done(new Error("Promise got resolved"));
      })
      .catch(() => {
        done();
      });
  });

  it("should generate the targetDir if not already present", done => {
    //make sure it is not there
    fs.removeSync(simpleResourceDef.targetDir);
    generateResource(simpleResourceDef).then(() => {
      //check if the dir now exists
      if (fs.pathExistsSync(simpleResourceDef.targetDir)) {
        done();
      } else {
        done(new Error("directory is not found"));
      }
    });
  });

  it("should not depend on closing slash of targetDir", done => {
    //make sure it is not there
    fs.removeSync(simpleResourceDef.targetDir);
    let res: ResourceDefinition = JSON.parse(JSON.stringify(simpleResourceDef));
    res.targetDir = './testfiles/target'; //NO closing slash
    generateResource(res).then(() => {
      //check if the dir now exists
      if (fs.existsSync(path.join( res.targetDir, res.targets[0].fileName))) {
        done();
      } else {
        done(new Error("file not found"));
      }
    });
  });

  it("should not depend on leading dot in sourceFile or targetDir", done => {
    //make sure it is not there
    fs.removeSync(simpleResourceDef.targetDir);
    let res: ResourceDefinition = JSON.parse(JSON.stringify(simpleResourceDef));
    res.targetDir = 'testfiles/target'; //NO leading dot!
    res.sourceFile = "testfiles/splash.png";
    generateResource(res).then(() => {
      //check if the dir now exists
      if (fs.existsSync(path.join( res.targetDir, res.targets[0].fileName))) {
        done();
      } else {
        done(new Error("file not found"));
      }
    });
  });

  it("should skip if we would overwrite our sourceFile", done => {
    //make sure it is not there
    fs.removeSync(simpleResourceDef.targetDir);
    let res: ResourceDefinition = JSON.parse(JSON.stringify(simpleResourceDef));
    res.targets.push({
      fileName: res.sourceFile,
      width: 99
    });
    res.targetDir = "./"; //save it to the same dir as our sourcefile (relative from whereever we call!)
    generateResource(res).then(() => {
      done(new Error("sourceFile has been overwritten"));
    }).catch(()=>{
      done();
    });
  });

  it("should NOT skip if source and target just have the same fileName", done => {
    //make sure it is not there
    fs.removeSync(simpleResourceDef.targetDir);
    let res: ResourceDefinition = JSON.parse(JSON.stringify(simpleResourceDef));
    res.targets.push({
      fileName: res.sourceFile,
      width: 99
    });
    generateResource(res).then(() => {
      done();
    }).catch(()=>{
      done(new Error("skipped just bc of same filename"));
    });
  });

  it("should generate single target with the given name and width", done => {
    generateResource(simpleResourceDef).then(() => {
      let t = simpleResourceDef.targets[0];
      //read the file
      let im = gm.subClass({
        imageMagick: true
      });
      im(path.join(simpleResourceDef.targetDir, t.fileName))
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
    generateResource(simpleResourceDef).then(() => {
      let t = simpleResourceDef.targets[0];
      //read the file
      let im = gm.subClass({
        imageMagick: true
      });
      im(path.join(simpleResourceDef.targetDir, t.fileName))
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
          im(path.join(simpleResourceDef.targetDir, target.fileName))
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
  }).timeout(10000);

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
          im(path.join(simpleResourceDef.targetDir, target.fileName))
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
              let infos = imageInfo as { [key: string]: any };  //we need to define our own "type"
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
  }).timeout(10000);
  /*
  it("should keep Alpha-Channel if told to do so", done => {
    done("TODO");
  });
  */
});
