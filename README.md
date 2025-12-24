# expo-leakcanary-plugin

An Expo config plugin that automatically adds [LeakCanary](https://square.github.io/leakcanary/) to your Android project for memory leak detection during development.

## What is LeakCanary?

LeakCanary is a memory leak detection library for Android. It helps you detect and fix memory leaks during development, before they ship to production.

## Installation

### Option 1: Local plugin (recommended for single project)

1. Copy this plugin folder into your Expo project (e.g., `plugins/expo-leakcanary-plugin`)

2. Build the plugin:
   ```bash
   cd plugins/expo-leakcanary-plugin
   npm install
   npm run build
   ```

3. Add to your `app.json` or `app.config.js`:
   ```json
   {
     "expo": {
       "plugins": ["./plugins/expo-leakcanary-plugin"]
     }
   }
   ```

### Option 2: npm package

1. Install the plugin:
   ```bash
   npm install expo-leakcanary-plugin
   ```

2. Add to your `app.json` or `app.config.js`:
   ```json
   {
     "expo": {
       "plugins": ["expo-leakcanary-plugin"]
     }
   }
   ```

## Configuration Options

You can customize the plugin behavior with options:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-leakcanary-plugin",
        {
          "version": "2.14",
          "debugOnly": true
        }
      ]
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `version` | `string` | `"2.14"` | LeakCanary version to use |
| `debugOnly` | `boolean` | `true` | Only include in debug builds (recommended) |
| `manualInstall` | `boolean` | `false` | Enable manual LeakCanary configuration (v2+ auto-installs) |

## Usage

After adding the plugin:

1. Run prebuild to generate native code:
   ```bash
   npx expo prebuild
   ```

2. Build and run your app in debug mode:
   ```bash
   npx expo run:android
   ```

3. LeakCanary will automatically detect memory leaks and show a notification when one is found.

## How LeakCanary Works

LeakCanary 2.x automatically:
- Detects retained objects (Activities, Fragments, Views, ViewModels, Services)
- Dumps the heap when a leak is detected  
- Analyzes the heap dump to find the leak trace
- Shows a notification with the leak information

You don't need to write any code - just install and run your app!

## Viewing Leaks

When a memory leak is detected:
1. A notification will appear on your device
2. Tap the notification to see the leak trace
3. The leak trace shows the chain of references preventing garbage collection

You can also view all detected leaks by:
- Opening the LeakCanary app from your app drawer
- Running `adb shell am start -n "your.package.name/leakcanary.internal.activity.LeakActivity"`

## Best Practices

1. **Keep debugOnly: true** - LeakCanary should only be in debug builds
2. **Fix leaks as you find them** - Don't let leaks accumulate
3. **Test all screens** - Navigate through your entire app to catch leaks
4. **Rotate the device** - Configuration changes often reveal leaks

## Troubleshooting

### Plugin not working after prebuild

Make sure to clean and rebuild:
```bash
npx expo prebuild --clean
npx expo run:android
```

### LeakCanary not showing notifications

1. Ensure you're running a debug build
2. Check that notifications are enabled for LeakCanary
3. Trigger a leak by rotating the device on a screen with retained references

### Build errors

If you get Gradle errors, try:
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Resources

- [LeakCanary Documentation](https://square.github.io/leakcanary/)
- [LeakCanary GitHub](https://github.com/square/leakcanary)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)

## License

MIT
