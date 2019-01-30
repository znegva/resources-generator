This project is **work-in-progress**!

When finished it can be used to generate all needed splashscreen and icon files for Cordova projects based on single source files.

# Android

Android supports [NinePatch drawables](https://developer.android.com/guide/topics/graphics/drawables#nine-patch) for its splashscreens - this project automatically generates them when your targets `fileName` has the extension `*.9.png` , e.g. `screen-mdpi-portrait.9.png`.

The Android defaults in `dist/splashspecs.js` are configured to generate 9-Patch files for the Android target.

**Hint:** To make nine-patch splashscreen work you need to set

```xml
<preference name="SplashMaintainAspectRatio" value="false" />
```

in your `config.xml`!

## ToDo

- [x] add icon defaults
  - [x] we need to make sure transparent is working (e.g. for corners on Android icons)
- [ ] `README.md`
  - [x] Android
  - [ ] iOS
  - [ ] Howto use
  - [ ] Howto include in your own project
- [ ] add `./bin/` that uses default-specs
  - explain default specs in readme
- [ ] add tests
- ..
