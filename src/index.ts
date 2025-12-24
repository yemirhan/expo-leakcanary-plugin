import {
  ConfigPlugin,
  withAppBuildGradle,
  withMainApplication,
} from "@expo/config-plugins";

type LeakCanaryPluginOptions = {
  /**
   * LeakCanary version to use
   * @default "2.14"
   */
  version?: string;
  /**
   * Whether to only include in debug builds
   * @default true
   */
  debugOnly?: boolean;
  /**
   * Whether to automatically install LeakCanary in the Application class
   * @default false (LeakCanary auto-installs by default in v2+)
   */
  manualInstall?: boolean;
};

const DEFAULT_LEAKCANARY_VERSION = "2.14";

/**
 * Adds LeakCanary dependency to app/build.gradle
 */
const withLeakCanaryGradle: ConfigPlugin<LeakCanaryPluginOptions> = (
  config,
  options = {}
) => {
  return withAppBuildGradle(config, (config) => {
    const version = options.version ?? DEFAULT_LEAKCANARY_VERSION;
    const debugOnly = options.debugOnly ?? true;

    const leakCanaryDependency = debugOnly
      ? `    debugImplementation 'com.squareup.leakcanary:leakcanary-android:${version}'`
      : `    implementation 'com.squareup.leakcanary:leakcanary-android:${version}'`;

    // Check if LeakCanary is already added
    if (config.modResults.contents.includes("leakcanary-android")) {
      console.log("LeakCanary dependency already exists in build.gradle");
      return config;
    }

    // Find the dependencies block and add LeakCanary
    const dependenciesRegex = /dependencies\s*\{/;
    
    if (dependenciesRegex.test(config.modResults.contents)) {
      config.modResults.contents = config.modResults.contents.replace(
        dependenciesRegex,
        `dependencies {\n${leakCanaryDependency}`
      );
      console.log(`Added LeakCanary ${version} to build.gradle`);
    } else {
      console.warn("Could not find dependencies block in build.gradle");
    }

    return config;
  });
};

/**
 * Optionally configures LeakCanary in MainApplication
 * Note: LeakCanary 2.x auto-installs, so this is only needed for custom configuration
 */
const withLeakCanaryApplication: ConfigPlugin<LeakCanaryPluginOptions> = (
  config,
  options = {}
) => {
  if (!options.manualInstall) {
    return config;
  }

  return withMainApplication(config, (config) => {
    const mainApplication = config.modResults;

    // Add import if not present
    if (!mainApplication.contents.includes("import leakcanary.LeakCanary")) {
      // Find the package declaration and add import after it
      const packageRegex = /^package\s+[\w.]+;?\s*$/m;
      mainApplication.contents = mainApplication.contents.replace(
        packageRegex,
        (match) => `${match}\n\nimport leakcanary.LeakCanary;`
      );
    }

    // Check if LeakCanary is already configured in onCreate
    if (mainApplication.contents.includes("LeakCanary")) {
      return config;
    }

    return config;
  });
};

/**
 * Expo config plugin that adds LeakCanary for Android memory leak detection
 *
 * @example
 * // app.json or app.config.js
 * {
 *   "expo": {
 *     "plugins": [
 *       ["expo-leakcanary-plugin", { "version": "2.14" }]
 *     ]
 *   }
 * }
 */
const withLeakCanary: ConfigPlugin<LeakCanaryPluginOptions | void> = (
  config,
  options = {}
) => {
  const pluginOptions = options ?? {};

  config = withLeakCanaryGradle(config, pluginOptions);
  config = withLeakCanaryApplication(config, pluginOptions);

  return config;
};

export default withLeakCanary;
