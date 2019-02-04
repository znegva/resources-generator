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

The _binary_ uses the defaults for Android respectively iOS as described in [specifications](#specifications).

__Hint:__ To be able to directly use locally installed node binaries make sure to add the following to your `.bashrc` or `.zshrc`:

```bash
# use locally installed node bins
PATH="./node_modules/.bin:$PATH"
```

### in your own scripts

TODO

## Specifications

To make the script usable straight away we defined some defaults for splashscreens and icons for Android and iOS.  
The can be found in [`lib/specs.ts`](./lib/specs.ts) / [`dist/specs.js`](./dist/specs.js).  

We predefined the following:
<details><summary>Android splashscreens (uses 9-Patch!, mdpi to xxxhdpi)</summary>

```typescript
export let androidSplashDefaults: ResourceDefinition = {
  description: "Splashscreens for Android",
  sourceFile: "./model/splash.png",
  targetDir: "./res/screens/android/",
  targets: [
    { fileName: "screen-ldpi-portrait.9.png", width: 320, height: 426 },
    { fileName: "screen-ldpi-landscape.9.png", width: 426, height: 320 },
    { fileName: "screen-hdpi-portrait.9.png", width: 480, height: 640 }, // 320x480
    { fileName: "screen-hdpi-landscape.9.png", width: 640, height: 480 }, // 480x320
    { fileName: "screen-mdpi-portrait.9.png", width: 320, height: 470 }, // 480x800
    { fileName: "screen-mdpi-landscape.9.png", width: 470, height: 320 }, // 800x480
    { fileName: "screen-xhdpi-portrait.9.png", width: 720, height: 960 }, // 720x1280
    { fileName: "screen-xhdpi-landscape.9.png", width: 960, height: 720 }, // 1280x720
    { fileName: "screen-xxhdpi-portrait.9.png", width: 960, height: 1600 }, // 960x1600
    { fileName: "screen-xxhdpi-landscape.9.png", width: 1600, height: 960 }, // 1600x960
    { fileName: "screen-xxxhdpi-portrait.9.png", width: 1280, height: 1920 }, // 1280x1920
    { fileName: "screen-xxxhdpi-landscape.9.png", width: 1920, height: 1280 } // 1920x1280
  ]
};
```
</details>

<details><summary>iOS splashscreens (Storyboards)</summary>

```typescript
export let iosSplashDefaults: ResourceDefinition = {
  description: "Splashscreens for iOS (Storyboards)",
  sourceFile: "./model/splash.png",
  targetDir: "./res/screens/ios/",
  targets: [
    { fileName: "Default@2x~universal~anyany.png", width: 2732, height: 2732 },
    { fileName: "Default@2x~universal~comany.png", width: 1278, height: 2732 },
    { fileName: "Default@2x~universal~comcom.png", width: 1334, height: 750 },
    { fileName: "Default@3x~universal~anyany.png", width: 2208, height: 2208 },
    { fileName: "Default@3x~universal~anycom.png", width: 2208, height: 1242 },
    { fileName: "Default@3x~universal~comany.png", width: 1242, height: 2208 }
  ]
};
```
</details>

<details><summary>Android icons (mdpi to xxxhdpi, Play Store Icon)</summary>

```typescript
export let androidIconDefaults: ResourceDefinition = {
  description: "Icon files for Android",
  sourceFile: "./model/android/icon.png",
  keepAlpha: true,
  targetDir: "./res/icons/android/",
  targets: [
    //Play Store Icon
    { fileName: "icon-512.png", width: 512 },
    //Icons for densities ldpi to xxxhdpi
    { fileName: "icon-36-ldpi.png", width: 36 },
    { fileName: "icon-48-mdpi.png", width: 48 },
    { fileName: "icon-72-hdpi.png", width: 72 },
    { fileName: "icon-96-xhdpi.png", width: 96 },
    { fileName: "icon-144-xxhdpi.png", width: 144 },
    { fileName: "icon-192-xxxhdpi.png", width: 192 }
  ]
};
```
</details>

<details><summary>iOS icons (for all current devices, App Store Icon)</summary>

```typescript
export let iosIconDefaults: ResourceDefinition = {
  description: "Icon files for iOS",
  sourceFile: "./model/ios/icon.png",
  targetDir: "./res/icons/ios/",
  targets: [
    //App Store Icon
    { fileName: "icon-1024.png", width: 1024 },
    //iOS 8.0+
    //iPhone 6 Plus
    { fileName: "icon-60@3x.png", width: 180 },
    //iOS 7.0+
    //iPhone / iPod Touch
    { fileName: "icon-60.png", width: 60 },
    { fileName: "icon-60@2x.png", width: 120 },
    //iPad
    { fileName: "icon-76.png", width: 76 },
    { fileName: "icon-76@2x.png", width: 152 },
    //Spotlight Icon
    { fileName: "icon-40.png", width: 40 },
    { fileName: "icon-40@2x.png", width: 80 },
    //iOS 6.1
    //iPhone / iPod Touch
    { fileName: "icon.png", width: 57 },
    { fileName: "icon@2x.png", width: 114 },
    //iPad
    { fileName: "icon-72.png", width: 72 },
    { fileName: "icon-72@2x.png", width: 144 },
    //iPad Pro
    { fileName: "icon-167.png", width: 167 },
    //iPhone Spotlight and Settings Icon
    { fileName: "icon-small.png", width: 29 },
    { fileName: "icon-small@2x.png", width: 58 },
    { fileName: "icon-small@3x.png", width: 87 },
    //iPad Spotlight and Settings Icon
    { fileName: "icon-50.png", width: 50 },
    { fileName: "icon-50@2x.png", width: 100 },
    //iPad Pro
    { fileName: "icon-83.5@2x.png", width: 167 },

    // we also need 20x20 for iPad Notification 20pt@1
    { fileName: "icon-20.png", width: 20 },

    //Apple-Watch
    { fileName: "icon-24@2.png", width: 48 },
    { fileName: "icon-27.5@2.png", width: 55 },
    { fileName: "icon-86@2.png", width: 172 },
    { fileName: "icon-98@2.png", width: 196 }
  ]
};
```
</details>

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
