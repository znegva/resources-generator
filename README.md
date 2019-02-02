This project is **work-in-progress**!

When finished it can be used to generate all needed splashscreen and icon files for Cordova projects based on single source files.

# cordova-resources-gen

Generate splashscreens and icons for your Cordova based project.  
Use this project to automatically resize a given splashscreen or icon image for all your platforms (iOS + Android atm).

## Installation

Inside of your project directory:

```bash
 % npm install "https://github.com/znegva/splashicon-generator.git"
```

Atm only installation directly from GitHub is possible, adding this project to the npm repository is planned.

## Usage

### from the command-line

The package includes a binary that can be called as `cordova-resources-gen` from within your project (or from everywhere when the package was installed globally).
When called without any parameters a hint on how to use it is given:

```bash
 % cordova-resources-gen
Usage: cordova-resources-gen --platform=(android|ios) --type=(splash|icon) [--source="./image.png"] [--targetDir="./put/it/here/"]
Please provide at least platform and type.
```

To be able to directly use locally installed node binaries make sure to add the following to your `.bashrc` or `.zshrc`:

```bash
# use locally installed node bins
PATH="./node_modules/.bin:$PATH"
```

### in your own scripts

TODO

## Specifications

TODO

### Android

Android supports [NinePatch drawables](https://developer.android.com/guide/topics/graphics/drawables#nine-patch) for its splashscreens - this project automatically generates them when your targets `fileName` has the extension `*.9.png` , e.g. `screen-mdpi-portrait.9.png`.

The Android defaults in `dist/splashspecs.js` are configured to generate 9-Patch files for the Android target.

**Hint:** To make nine-patch splashscreen work you need to set

```xml
<preference name="SplashMaintainAspectRatio" value="false" />
```

in your `config.xml`!

## ToDo

- [ ] `README.md`
  - [x] Android
  - [ ] iOS
  - [ ] explain defaultSpecs
  - [x] How-to use binary
  - [ ] How-to include in your own project
- [x] add to `./bin/` <s>that uses default-specs</s>
- [ ] add tests
- ..
