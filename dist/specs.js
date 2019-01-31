"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Splashscreen default definitions
 */
exports.androidSplashDefaults = {
    description: "Splashscreens for Android",
    sourceFile: "./model/splash.png",
    targetDir: "./res/screens/android/",
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
exports.iosSplashDefaults = {
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
/*
 * Icon default definitions
 */
exports.androidIconDefaults = {
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
exports.iosIconDefaults = {
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
/*
 * some special stuff
 */
exports.androidCoverImage = {
    description: "Android Play Store Cover Image",
    sourceFile: "./model/splash.png",
    targetDir: "./res/store/android/",
    targets: [
        //Play Store Icon
        { fileName: "cover-image.png", width: 1024, height: 500 }
    ]
};
//you can also use the script to create other drawables, e.g. your notification-icon
//you need to make sure to copy these files by yourself to 'platforms/android/app/src/main/res/'
exports.androidNotificationIconDefaults = {
    description: "Android Notification Icons (copy to drawable)",
    sourceFile: "./model/android_notification/icon.png",
    keepAlpha: true,
    targetDir: "./res/icons/android_notification/",
    targets: [
        { fileName: "drawable/icon_notification.png", width: 48 },
        { fileName: "drawable-mdpi/icon_notification.png", width: 24 },
        { fileName: "drawable-hdpi/icon_notification.png", width: 36 },
        { fileName: "drawable-xhdpi/icon_notification.png", width: 48 },
        { fileName: "drawable-xxhdpi/icon_notification.png", width: 72 },
        { fileName: "drawable-xxxhdpi/icon_notification.png", width: 96 }
    ]
};
