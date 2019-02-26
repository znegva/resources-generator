Generate automatically resized splashscreens and icons for mobile platforms,
e.g. for Cordova based projects.  

- [Installation](#installation)
- [Usage](#usage)
  - [From the command-line](#from-the-command-line)
  - [In your own scripts](#in-your-own-scripts)
  - [Special cases](#special-cases)
    - [NinePatch images](#ninepatch-images)
    - [Transparency](#transparency)
    - [Small templates](#small-templates)
- [Specifications](#specifications)
- [Add to your Cordova project](#add-to-your-cordova-project)
- [Thanks](#thanks)

## Installation

Inside of your project directory:

```bash
 % npm install resources-generator
```

The script depends on imageMagick, it needs to be installed:

macOS:
```bash
 % brew install imagemagick
```
Linux / apt:
```
 % sudo apt-get install imagemagick
```


## Usage

Your splash template should be a 2732x2732px image, and the main content 
should fit a center square of 1200x1200px.

Your icon template should be a 1024x1024px image.
For Android you have to take care of the rounded corners yourself, everything you 
don't want to see must be transparent - so your best choice is to use a png-template.
Please also note [chapter transparency](#transparency) below.

When using the [default specifications](specifications) or the [command-line version](#from-the-command-line) you need to prepare your templates as following:

- Splashscreen template for Android and iOS as `./model/splash.png`
- Icon template for Android as `./model/android/icon.png`
- Icon template for iOS as `./model/ios/icon.png`

For any individual requirements please see [chapter _in your own scripts_](#in-your-own-scripts). 

### From the command-line

The package includes a binary that can be called as `resources-generator` 
from within your project (or from everywhere when the package was installed globally).
When called without any parameters a hint on how to use it is given:

```bash
 % resources-generator
Usage: resources-generator --platform=(android|ios) --type=(splash|icon) [--source="./image.png"] [--targetDir="./put/it/here/"]
Please provide at least platform and type.
```

The _binary_ uses the default targets for Android respectively iOS as described 
in [specifications](#specifications), you can change the source-image 
(via `--source="./myimage.png"`) and the directory where the results shall 
be saved (via `--targetDir`).

**Hint:** To be able to directly use locally installed node binaries make sure 
to add the following to your `.bashrc` or `.zshrc`:

```bash
# use locally installed node bins
PATH="./node_modules/.bin:$PATH"
```

### In your own scripts

If you want to define your own specifications the best choice is to build your own script.  
A good starting point are the predefined specifications from [`dist/specs`](./dist/specs.js).

Example:

```typescript
import { 
  generateResource,
  ResourceDefinition 
} from "resources-generator";
import {
  androidSplashDefaults,
  androidIconDefaults,
  androidNotificationIconDefaults,
  iosSplashDefaults,
  iosIconDefaults
} from "resources-generator/dist/specs";

//change the template for Android splashcreens
androidSplashDefaults.sourceFile = "./model/android/splash.png";

//add additional 256px Android icon
androidIconDefaults.targets.push({
  fileName: "icon-256.png",
  width: 256
});

// create icons for our PWA, based on the android icon template
let pwa:ResourceDefinition = {
  description: "PWA icons",
  sourceFile: "./model/android/icon.png",
  targetDir: "./src/assets/icon/",
  keepAlpha: true,
  targets: [
    { fileName: "icon-192.png", width: 192 },
    { fileName: "icon-512.png", width: 512 },
    { fileName: "favicon.ico", width: 64 }
  ]
};

//collect all resources we want to generate
let resources = [
  androidSplashDefaults,
  androidIconDefaults,
  androidNotificationIconDefaults,
  iosSplashDefaults,
  iosIconDefaults,
  pwa
];

//create one after the other
resources.reduce((func, resource) => {
  return func
    .then(_ => generateResource(resource))
    .catch(e => {
      return;
    });
}, Promise.resolve());
```

You may save this script inside of your projects as  `scripts/generate-resources.ts` and add to your `package.json`:

```
{
...
  "scripts": {
    ...
    "resources:generate": "cross-env TS_NODE_COMPILER_OPTIONS='{ \"module\": \"commonjs\" }' ts-node scripts/generate-resources.ts"
  },
  ...
}
```

Now you are able to call `npm run resources:generate` to regenerate your resources.

For a plain node example please see [`bin/resources-generator`](bin/resources-generator).

### Special cases

#### NinePatch images

Android supports [NinePatch drawables](https://developer.android.com/guide/topics/graphics/drawables#nine-patch) 
for its splashscreens - this project automatically generates them when your targets `fileName` 
has the extension `*.9.png` , e.g. `screen-mdpi-portrait.9.png`.

The Android splashscreen defaults in `dist/specs` are configured to generate NinePatch files.

**Hint:** To make nine-patch splashscreen work in Cordova projects you need to set

```xml
<preference name="SplashMaintainAspectRatio" value="false" />
```

in your `config.xml`!

#### Transparency

When nothing else is declared Alpha channel (transparency) is removed from the resulting resource images.  
If you want to keep transparency you need to set this in your `ResourceDefinition` by declaring `keepAlpha` as `true`.
The Android icon defaults in `dist/specs` are configured to preserve transparency.

As [NinePatch images](#ninepatch-images) are based on transparent areas alpha channel is preserved here in every case.

#### Small templates

As noted your templates should be 2732x2732px for splashscreens.
This requirement is based on the required image size for iPad Pro splashscreens, see 
[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/launch-screen/).

If you request the script to generate a resource image that is bigger then the provided template
the template is never scaled up! Instead we stretch the most outer regions until the desired size is met
(this kind-of imitates what is done with NinePatch images).

## Specifications

To generate resources your input needs to follow some specifications, they are 
described by interfaces that can be imported from the package.

```typescript
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
```

To make the script usable straight away we defined some defaults for splashscreens and icons for Android and iOS.

They can be imported from [`dist/specs`](./dist/specs.js).

We predefined the following:

<details>
<summary>
  Android splashscreens (uses 9-Patch!, ldpi to xxxhdpi)
</summary>

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

<details>
<summary>
  iOS splashscreens (Storyboards)
</summary>

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

<details>
<summary>
  Android icons (ldpi to xxxhdpi, Play Store Icon)
</summary>

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

<details>
<summary>
  iOS icons (for all current devices, App Store Icon)
</summary>

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


## Add to your Cordova project

You can add the resources generated by the specifications described above to your Cordova project `config.xml` in the following way:

```xml
    <platform name="android">
        <allow-intent href="market:*" />
        <icon density="ldpi" src="res/icons/android/icon-36-ldpi.png" />
        <icon density="mdpi" src="res/icons/android/icon-48-mdpi.png" />
        <icon density="hdpi" src="res/icons/android/icon-72-hdpi.png" />
        <icon density="xhdpi" src="res/icons/android/icon-96-xhdpi.png" />
        <icon density="xxhdpi" src="res/icons/android/icon-144-xxhdpi.png" />
        <icon density="xxxhdpi" src="res/icons/android/icon-192-xxxhdpi.png" />
        <splash density="land-hdpi" src="res/screens/android/screen-hdpi-landscape.9.png" />
        <splash density="land-ldpi" src="res/screens/android/screen-ldpi-landscape.9.png" />
        <splash density="land-mdpi" src="res/screens/android/screen-mdpi-landscape.9.png" />
        <splash density="land-xhdpi" src="res/screens/android/screen-xhdpi-landscape.9.png" />
        <splash density="land-xxhdpi" src="res/screens/android/screen-xxhdpi-landscape.9.png" />
        <splash density="land-xxxhdpi" src="res/screens/android/screen-xxxhdpi-landscape.9.png" />
        <splash density="port-hdpi" src="res/screens/android/screen-hdpi-portrait.9.png" />
        <splash density="port-ldpi" src="res/screens/android/screen-ldpi-portrait.9.png" />
        <splash density="port-mdpi" src="res/screens/android/screen-mdpi-portrait.9.png" />
        <splash density="port-xhdpi" src="res/screens/android/screen-xhdpi-portrait.9.png" />
        <splash density="port-xxhdpi" src="res/screens/android/screen-xxhdpi-portrait.9.png" />
        <splash density="port-xxxhdpi" src="res/screens/android/screen-xxxhdpi-portrait.9.png" />
    </platform>
    <preference name="SplashMaintainAspectRatio" value="false" />

    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
        <icon src="res/icons/ios/icon-60@3x.png" width="180" height="180" />
        <icon src="res/icons/ios/icon-60.png" width="60" height="60" />
        <icon src="res/icons/ios/icon-60@2x.png" width="120" height="120" />
        <icon src="res/icons/ios/icon-76.png" width="76" height="76" />
        <icon src="res/icons/ios/icon-76@2x.png" width="152" height="152" />
        <icon src="res/icons/ios/icon-40.png" width="40" height="40" />
        <icon src="res/icons/ios/icon-40@2x.png" width="80" height="80" />
        <icon src="res/icons/ios/icon.png" width="57" height="57" />
        <icon src="res/icons/ios/icon@2x.png" width="114" height="114" />
        <icon src="res/icons/ios/icon-72.png" width="72" height="72"/>
        <icon src="res/icons/ios/icon-72@2x.png" width="144" height="144"/>
        <icon src="res/icons/ios/icon-167.png" width="167" height="167"/>
        <icon src="res/icons/ios/icon-small.png" width="29" height="29"/>
        <icon src="res/icons/ios/icon-small@2x.png" width="58" height="58"/>
        <icon src="res/icons/ios/icon-small@3x.png" width="87" height="87"/>
        <icon src="res/icons/ios/icon-50.png" width="50" height="50"/>
        <icon src="res/icons/ios/icon-50@2x.png" width="100" height="100" />
        <icon src="res/icons/ios/icon-83.5@2x.png" width="167" height="167"/>
        <icon src="res/icons/ios/icon-20.png" width="20" height="20"/>
        <icon src="res/icons/ios/icon-24@2.png" width="48" height="48"/>
        <icon src="res/icons/ios/icon-27.5@2.png" width="55" height="55"/>
        <icon src="res/icons/ios/icon-86@2.png" width="172" height="172"/>
        <icon src="res/icons/ios/icon-98@2.png" width="196" height="196"/>
        <icon src="res/icons/ios/icon-1024.png" width="1024" height="1024"/>
        <splash src="res/screens/ios/Default@2x~universal~anyany.png" />
        <splash src="res/screens/ios/Default@2x~universal~comany.png" />
        <splash src="res/screens/ios/Default@2x~universal~comcom.png" />
        <splash src="res/screens/ios/Default@3x~universal~anyany.png" />
        <splash src="res/screens/ios/Default@3x~universal~anycom.png" />
        <splash src="res/screens/ios/Default@3x~universal~comany.png" />
    </platform>
```

## Thanks

This script is inspired by [splashicon-generator](https://github.com/znegva/splashicon-generator) and [TiCons](https://github.com/jasonkneen/TiCons-CLI).

It makes use of [gm](http://aheckmann.github.io/gm/) and [imageMagick](http://www.imagemagick.org/).
