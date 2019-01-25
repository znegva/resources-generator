"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.android = {
    description: "Splashscreens for Android",
    sourceFile: "splash.png",
    targetDir: "android/",
    targets: [
        { fileName: "screen-ldpi-portrait.9.png", width: 320, height: 426 },
        { fileName: "screen-ldpi-landscape.9.png", width: 426, height: 320 },
        { fileName: "screen-hdpi-portrait.9.png", width: 480, height: 640 },
        { fileName: "screen-hdpi-landscape.9.png", width: 640, height: 480 },
        { fileName: "screen-mdpi-portrait.9.png", width: 320, height: 470 },
        { fileName: "screen-mdpi-landscape.9.png", width: 470, height: 320 },
        { fileName: "screen-xhdpi-portrait.9.png", width: 720, height: 960 },
        { fileName: "screen-xhdpi-landscape.9.png", width: 960, height: 720 },
        { fileName: "screen-xxhdpi-portrait.9.png", width: 960, height: 1600 },
        { fileName: "screen-xxhdpi-landscape.9.png", width: 1600, height: 960 },
        { fileName: "screen-xxxhdpi-portrait.9.png", width: 1280, height: 1920 },
        { fileName: "screen-xxxhdpi-landscape.9.png", width: 1920, height: 1280 } // 1920x1280
    ]
};
exports.ios = {
    description: "Splashscreens for iOS",
    sourceFile: "splash.png",
    targetDir: "./ios/",
    targets: [
        { fileName: "Default@2x~universal~anyany.png", width: 2732, height: 2732 },
        { fileName: "Default@2x~universal~comany.png", width: 1278, height: 2732 },
        { fileName: "Default@2x~universal~comcom.png", width: 1334, height: 750 },
        { fileName: "Default@3x~universal~anyany.png", width: 2208, height: 2208 },
        { fileName: "Default@3x~universal~anycom.png", width: 2208, height: 1242 },
        { fileName: "Default@3x~universal~comany.png", width: 1242, height: 2208 }
    ]
};
