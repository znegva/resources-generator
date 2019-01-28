import { IsplashDefinition } from "./extra";

export let androidSplashDefaults: IsplashDefinition = {
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

export let iosSplashDefaults: IsplashDefinition = {
  description:"Splashscreens for iOS (Storyboards)",
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
