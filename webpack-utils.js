const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// --------------------------------------------------------------------------------------------------------------------
// README -------------------------------------------------------------------------------------------------------------

/**
 * WEBPACK CONFIGURATION FILE
 * 
 * Seriously, read this first.
 * 
 * First, don't be scared. This is a big file, but it's well organized and the concepts behind it are fairly simple to
 * understand.
 * 
 * This file is divided into sections to improve readability. They are:
 * 
 *   Types
 *     Typescript types to improve maintainability.
 *   Settings
 *     Settings derived from the environment and arguments.
 *     Those settings will drive how each of Webpack's configuration is set-up.
 *   Main Webpack Configuration Builder (IMPORTANT!!!)
 *     The main function of this file that will generated the final, aggregated, configuration.
 *     THIS IS THE MOST IMPORTANT SECTION OF THIS FILE. YOU SHOULD START HERE IF YOU'RE CONFUSED.
 *   Webpack Configurations
 *     Small functions each taking care of a small piece of the whole Webpack configuration.
 *     This will use loaders and plugins.
 *   Webpack Loaders
 *     Loaders defining how files will be processed by Webpack.
 *   Webpack Plugins
 *     Plugins extending Webpack's behavior.
 *   Exports
 *     Actual exported function of this file that'll be called by Webpack.
 * 
 * Each section is documented to explain what it is for. You can scroll to any section and read a small introduction
 * right after the section's title, and it should give enough information to understand it.
 * 
 * However, before moving forward, it's important to understand one small concept used throughout this file: the 
 * approach used here is to configure Webpack using small functions that generate equally small pieces of the complete
 * configuration that will drive the bundling process.
 * 
 * Almost every single function of this file follows this pattern: a function that receives settings as argument and
 * spits a small bit of configuration.
 * 
 *   someFunction(settings) => SomeConfiguration
 * 
 * This is important because it allows us to think about Webpack configuration not as a whole, but as small independent
 * pieces that can be joined together to drive the bundle's generation.
 * 
 * Since each function receives a "settings" object, we can make environment specific decisions for each of those 
 * sections independently from other sections. This means that we can have a single file for multiple environments,
 * like development and production, and we can easily see the differences between environments in each small part of 
 * Webpack's configuration.
 * 
 * Want to know what's the difference between source maps generated for production and for development? Easy! Go to the
 * function(s) responsible for that and ignore everything else.
 * 
 * And last, but not least, it's important to enumerate the principles behind this file, since they affected most of
 * the decisions made here:
 * 
 * 1. A single configuration file that can be easily shared between multiple projects and "just works". You can
 *    literally just copy and paste this file into a new project and it should work. Like magic.
 * 2. Modularity when building Webpack's configuration (small pieces, instead of whole configuration blocks).
 * 3. OVER DOCUMENTATION (like, seriously, this file can actually help you learn Webpack).
 * 4. Maintainability. It should be easy to change/improve/modify this file.
 * 
 * Having said that, this file has a very specific and opinionated development stack: Typescript, React and CSS-In-JS
 * with PostCSS and support to stage 3 CSS features.
 * However, due to the way the file is written, it should be very easy to make changes to this stack.
 * 
 * DEPENDENCIES
 * 
 * Before using this file, you'll need to install all required dependencies. You can do that by adding the following
 * dependencies to your `package.json` file:
 * 
 * ----------------------------------------------------------------------------

  "dependencies": {
    "@babel/runtime": "^7.14.8",
    "@soaphealth/utils": "^1.0.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.14.8",
    "@babel/plugin-transform-runtime": "^7.14.5",
    "@babel/preset-env": "^7.14.7",
    "@babel/preset-react": "^7.14.5",
    "@babel/preset-typescript": "^7.14.5",
    "@types/dotenv-webpack": "^7.0.3",
    "@types/jest": "^26.0.24",
    "@types/node": "^16.4.3",
    "@types/postcss-import": "^12.0.1",
    "@types/postcss-preset-env": "^6.7.3",
    "@types/react": "^17.0.14",
    "@types/react-dom": "^17.0.9",
    "@types/tailwindcss": "^2.2.1",
    "@types/webpack-dev-server": "^3.11.5",
    "astroturf": "^1.0.0-beta.22",
    "babel-loader": "^8.2.2",
    "css-loader": "^6.2.0",
    "dotenv-webpack": "^7.0.3",
    "html-webpack-plugin": "^5.3.2",
    "jest": "^27.0.6",
    "path": "^0.12.7",
    "postcss": "^8.3.6",
    "postcss-import": "^14.0.2",
    "postcss-loader": "^6.1.1",
    "postcss-preset-env": "^6.7.0",
    "source-map-loader": "^3.0.0",
    "style-loader": "^3.2.1",
    "tailwindcss": "^2.2.7",
    "typescript": "^4.3.5",
    "webpack": "^5.45.1",
    "webpack-bundle-analyzer": "^4.4.2",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2"
  },

 * ----------------------------------------------------------------------------
 * 
 * And then running `yarn`.
 * 
 *   > yarn
 * 
 * Note that the dependencies above specify versions since those were the ones used when this file was written, but you
 * should feel encouraged to update any packages. Just make sure to consider breaking changes on any updated packages.
 * 
 * PACKAGE SCRIPTS
 * 
 * You should also add the following scripts to your `package.json` file.
 * 
 * ----------------------------------------------------------------------------

  "scripts": {
    "clean": "yarn rimraf dist *.tsbuildinfo",
    "build": "yarn clean && yarn webpack --mode production",
    "start": "yarn webpack serve",
    "analyze-build": "yarn webpack --analyze"
  }

 * ----------------------------------------------------------------------------
 * 
 * Note: Yes, you should be using YARN. But you can easily adapt this to use NPM, if you prefer.
 */

// --------------------------------------------------------------------------------------------------------------------
// TYPES --------------------------------------------------------------------------------------------------------------

/**
 * You can mostly ignore this section if you want to.
 * 
 * Those are just JSDoc types in order to improve maintainability of this file.
 */

/**
 * Enumerates the possible build modes.
 */
const BuildMode = {
  development: 'development',
  production: 'production',
};

/**
 * @typedef {import('webpack').Configuration} Configuration
 * @typedef {import('webpack').RuleSetRule} RuleSetRule
 * @typedef {import('webpack').ResolveOptions} ResolveOptions
 * @typedef {import('webpack').WebpackPluginInstance} WebpackPluginInstance
 */

/**
 * Interface for an object containing paths that will be used by `Webpack`'s build process.
 * @typedef IBuildPaths
 * @type {object}
 * @property {string} entryFile The entry file that `Webpack` will use to start building the bundle.
 * @property {string} outputPath The output path where the output bundle files will be created.
 * @property {string} indexHtmlTemplate The `HTML` file to use as a template for the bundle's `index.html` file.
 * @property {string} devServerContentPath The base content path for `Webpack`'s development server.
 */

/**
 * Interface for an object containing regular expressions to be used to match files that will be processed by
 * `Webpack`'s loaders.
 * @typedef IFilesPatterns
 * @type {object}
 * @property {RegExp} dependenciesFiles Matches the 'node_modules' folder. This should be used to exclude dependencies files from being processed by Webpack loaders.
 * @property {RegExp} sourceMapFiles Matches '.js' and '.jsx' files. This should be used to process and load source maps from dependencies.
 * @property {RegExp} javascriptFiles Matches '.js' and '.jsx' files. This should be used to process and load Javascript files.
 * @property {RegExp} typescriptFiles Matches '.ts' and '.tsx' files. This should be used to process and load Typescript files.
 * @property {RegExp} cssFiles Matches '.css' files. This should be used to process and load CSS files.
 * @property {RegExp} imageFiles Matches '.png', '.svg', '.jpg', '.jpeg' and '.gif' files. This should be used to process and load image files.
 * @property {RegExp} fontFiles Matches '.woff', '.woff2', '.eot', '.ttf' and '.otf' files. This should be used to process and load font files.
 * @property {RegExp} wasmFiles Matches '.wasm' files. This should be used to process and load WebAssembly files.
 * @property {RegExp} unityFiles Matches '.unity' files. This should be used to process and load **Unity** files.
 */

/**
 * Instructions to copy required files.
 * @typedef CopyInstruction
 * @type {object}
 * @property {string} to Source files pattern.
 * @property {string} from Destination path pattern.
 */

/**
 * Interface for a build settings object.
 * @typedef ISettings
 * @type {object}
 * @property {'development' | 'production'} mode The mode under which `Webpack` will run.`
 * @property {IBuildPaths} paths Paths to be used by `Webpack`.
 * @property {IFilesPatterns} patterns File matching patterns to be used by `Webpack`.
 * @property {CopyInstruction[]} [copyExistingFiles] List of patterns to copy existing files to the final `dist` folder.
 */

// MAIN EXPORT --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

/**
 * Returns a basic `Webpack` configuration for an application that use Typescript and React.
 * 
 * @param {unknown} env
 * @param {Record<string, string>} argv
 * @returns {Configuration} The `Webpack` configuration object.
 */
function getBasicTypeScriptReactWebAppConfiguration(env, argv) {
  const settings = loadSettings(env, argv);
  return buildWebpackConfiguration(settings);
}

// --------------------------------------------------------------------------------------------------------------------
// SETTINGS -----------------------------------------------------------------------------------------------------------

/**
 * On this section we have methods that'll read environment variables and arguments to build a `settings object`.
 * 
 * This `settings object` is then passed on to every other method in other to build environment specific 
 * configurations.
 */

/**
 * Builds the settings object to be used to configure `Webpack`.
 * 
 * @param {unknown} env
 * @param {Record<string, string>} argv
 * @returns {ISettings} The settings object.
 */
function loadSettings(env, argv) {
  console.log(
    "\n» ⚙ Environment Variables and Arguments:\n\n",
    {
      env,
      argv,
      'process.env': { NODE_ENV: process.env.NODE_ENV },
    }
  );
  
  const environment = process.env.NODE_ENV || argv['mode'] || 'development';
  const basePath = process.cwd();
  const srcPath = path.join(basePath, 'src');
  const distPath = path.join(basePath, 'dist');
  
  /** @type {ISettings} */
  const settings = {
    mode: environment === 'production' ? BuildMode.production : BuildMode.development,
    paths: {
      entryFile: path.join(srcPath, 'index.ts'),
      outputPath: distPath,
      indexHtmlTemplate: path.join(srcPath, 'index.html'),
      devServerContentPath: distPath,
    },
    patterns: {
      dependenciesFiles: /node_modules/,
      sourceMapFiles: /\.jsx?$/i,
      javascriptFiles: /\.jsx?$/i,
      typescriptFiles: /\.tsx?$/i,
      cssFiles: /\.css$/i,
      imageFiles: /\.(png|svg|jpg|jpeg|gif)$/i,
      fontFiles: /\.(woff|woff2|eot|ttf|otf)$/i,
      wasmFiles: /\.wasm$/i,
      unityFiles: /\.unity$/i,
    },
  };
  
  console.log(
    "\n» ⚙ Build Settings:\n\n",
    settings
  );
  
  return settings;
}

// --------------------------------------------------------------------------------------------------------------------
// MAIN WEBPACK CONFIGURATION BUILDER ---------------------------------------------------------------------------------

/**
 * >>> !!! IMPORTANT !!! <<<<
 * 
 * This is the most important section of this file.
 * 
 * The method below will receive the settings, call each smaller configuration function, and aggregate those smaller 
 * configurations into the final `Webpack` configuration.
 * 
 * You should use this function to navigate through this file and check how each smaller configuration is defined, what
 * it is doing and also makes changes, if that's what you need.
 */

/**
 * Aggregates all configuration functions calls in order to build the final `Webpack` configuration.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The final `Webpack` configuration.
 */
function buildWebpackConfiguration(settings) {
  console.log("\n» ⚙ Webpack Output:\n");
  
  return {
    ...configureBuildMode(settings),
    ...configureAppEntryPoints(settings),
    ...configureBundleOutput(settings),
    ...configureNodeJsBasicPolyfills(settings),
    resolve: {
      ...configureSupportedFileExtensions(settings),
      ...configureNodeJsFallbacks(settings),
    },
    ...configureLoaders(settings),
    ...configureSourceMapsGeneration(settings),
    ...configureDevelopmentServer(settings),
    ...configurePlugins(settings),
    ...configureLogLevel(settings),
  };
}

// --------------------------------------------------------------------------------------------------------------------
// WEBPACK CONFIGURATIONS ---------------------------------------------------------------------------------------------

/**
 * Configures `Webpack` build mode.
 * 
 * Depending on the build mode, `Webpack` will apply optimizations to the generated bundle.
 * 
 * See: https://webpack.js.org/configuration/mode/
 * 
 * @param {ISettings} settings Build settings object.
 * @returns {Configuration} The `mode` configuration.
 */
function configureBuildMode(settings) {
  return {
    mode: settings.mode,
  };
}

/**
 * Configures the application's entry point so `Webpack` can start building the dependency tree of the bundle.
 * 
 * See: https://webpack.js.org/concepts/entry-points/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `entry` configuration.
 */
function configureAppEntryPoints(settings) {
  return {
    entry: settings.paths.entryFile,
  }
}

/**
 * Configures where `Webpack` will generate the output files and its bundle file.
 * 
 * See: https://webpack.js.org/concepts/output
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `output` configuration.
 */
function configureBundleOutput(settings) {
  return {
    output: {
      path: settings.paths.outputPath,
      filename: 'bundle.js',
      publicPath: '/',
    }
  };
}

/**
 * Configures Node JS basic polyfills: `global`, `__filename` and `__dirname`.
 * 
 * This setup will simply ignore any references to these Node JS variables.
 * 
 * See https://webpack.js.org/configuration/node/
 * 
 * @param {ISettings} settings 
 * @returns {Configuration}
 */
function configureNodeJsBasicPolyfills(settings) {
  return {
    node: {
      global: true,
      __filename: false,
      __dirname: false,
    },
  };
}

/**
 * Configure the extensions `Webpack` will use when trying to resolve files from `import` statements.
 * 
 * For instance, 'import * from "./my-file";' can resolve to './my-file', './my-file.js', './my-file.ts', etc.
 * 
 * The default ones are specified by the '...' entry and are: '.js', '.json' and '.wasm'.
 * 
 * See: https://webpack.js.org/configuration/resolve/#resolveextensions
 * 
 * @param {ISettings} settings The settings object.
 * @returns {ResolveOptions} The `extensions` configuration of the `resolve` property of `Webpack`'s configuration.
 */
function configureSupportedFileExtensions(settings) {
  return {
    extensions: ['.ts', '.tsx', '...']
  };
}

/**
 * Configure fallbacks to use whenever `Webpack` finds code that's referencing Node JS specific libraries, like `fs` or
 * `path`.
 * 
 * See: https://webpack.js.org/configuration/resolve/#resolvefallback
 * 
 * @param {ISettings} settings The settings object.
 * @returns {ResolveOptions} The `fallback` configuration of the `resolve` property of `Webpack`'s configuration.
 */
function configureNodeJsFallbacks(settings) {
  return {
    fallback: {
      fs: false,
      path: false,
    }
  };
}

/**
 * Configures how `Webpack` will process and load different files.
 * 
 * See: https://webpack.js.org/concepts/loaders/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `module` configuration.
 */
function configureLoaders(settings) {
  const rules = [];
  
  // Add CSS styles support.
  rules.push(...createStylesLoader(settings));
  
  // Add language support.
  // This may include modern Javascript, Typescript, JSX syntax, etc.
  rules.push(...createLanguageLoader(settings));
  
  // Add images support.
  rules.push(...createImagesLoader(settings));
  
  // Add fonts support.
  rules.push(...createFontsLoader(settings));
  
  // Add support for `.wasm` (WebAssembly) files.
  rules.push(...createWasmLoader(settings));
  
  // Add support for `.unity` (Unity) files.
  rules.push(...createUnityLoader(settings));
  
  return {
    module: {
      rules: [
        // If on `development`, load dependencies source-maps, if available.
        // This needs to be loaded first and outside the `oneOf` rule set.
        ...(settings.mode === BuildMode.development ? createSourceMapsLoader(settings) : []),
        {
          oneOf: [ ...rules ]
        }
      ]
    }
  };
}

/**
 * Configures `Webpack` to generate source-maps if on `development`.
 * 
 * See: https://webpack.js.org/configuration/devtool/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `devtool` configuration.
 */
function configureSourceMapsGeneration(settings) {
  return {
    devtool: settings.mode === BuildMode.development ? 'inline-cheap-module-source-map' : false,
  };
}

/**
 * Configures `Webpack` to run a development server if on `development`.
 * 
 * See: https://webpack.js.org/configuration/dev-server/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `devServer` configuration.
 */
function configureDevelopmentServer(settings) {
  if (settings.mode !== BuildMode.development) {
    return {
      devServer: undefined,
    };
  }
  
  return {
    devServer: {
      contentBase: settings.paths.devServerContentPath,
      compress: true,
      port: 9000,
      https: true,
      open: true,
      // This will make the dev server process output the generated files to the disk.
      // This is important if you have existing files being copied to the output path.
      // See: https://github.com/webpack/webpack-dev-middleware#writetodisk
      writeToDisk: true,
      historyApiFallback: true,
    },
  };
}

/**
 * Configures any plugins to be added to `Webpack`'s process.
 * 
 * See: https://webpack.js.org/concepts/#plugins
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `plugins` configuration.
 */
 function configurePlugins(settings) {
  return {
    plugins: [
      createEnvironmentVariablesPlugin(settings),
      createHtmlBundleInjectionPlugin(settings),
      createFileCopyPlugin(settings),
    ].filter(Boolean),
  };
}

/**
 * Configures `Webpack` logging during the build process.
 * 
 * See: https://webpack.js.org/configuration/stats/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {Configuration} The `stats` configuration.
 */
function configureLogLevel(settings) {
  return {
    stats: 'normal',
  };
}

// --------------------------------------------------------------------------------------------------------------------
// WEBPACK LOADERS ----------------------------------------------------------------------------------------------------

/**
 * Creates a rule to process and load source-maps of dependencies.
 * 
 * This is useful specially if you're on a monorepo and have your other packages generating source-maps that you want 
 * to use to debug this package.
 * 
 * See: https://webpack.js.org/loaders/source-map-loader/
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The source-maps `rule`.
 */
function createSourceMapsLoader(settings) {
  return [
    {
      test: settings.patterns.sourceMapFiles,
      exclude: settings.patterns.dependenciesFiles,
      // This loader must use the 'pre' category.
      // This seems to be related to the type of loader 'source-map-loader' is.
      // TODO: Research webpack loader categories.
      enforce: 'pre',
      // Webpack loader responsible for appending the source-maps.
      use: ['source-map-loader'],
    },
  ];
}

/**
 * Creates a rule to process and load Typescript (.ts) and React files (.tsx).
 * 
 * This will use Babel to transpile files from Typescript to a Javascript version supported by a subset of 
 * browsers (as specified in the 'targets' option).
 * 
 * All files from this package MUST be Typescript files, otherwise they will be ignored. This is intentional.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The Typescript and React `rule`.
 */
function createLanguageLoader(settings) {
  return [
    // Load Javascript files ('.js' or '.jsx' files).
    {
      test: settings.patterns.javascriptFiles,
      exclude: settings.patterns.dependenciesFiles,
      use: [
        {
          loader: 'babel-loader',
          options: {
            targets: 'defaults',
            sourceMaps: settings.mode === BuildMode.development,
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ],
          }
        }
      ],
    },
    // Load Typescript files ('.ts' or '.tsx' files).
    {
      test: settings.patterns.typescriptFiles,
      exclude: settings.patterns.dependenciesFiles,
      use: [
        // Load files into webpack using Babel.
        // See: https://webpack.js.org/loaders/babel-loader/
        {
          loader: 'babel-loader',
          options: {
            // Tell Babel to transpile files into a Javascript standard supported by the specified targets.
            // For now, using 'defaults' (most browsers).
            // TODO: Further specify targets to reduce bundle size.
            targets: "defaults",
            // Make sure Babel generates source-maps files if on `development`.
            sourceMaps: settings.mode === BuildMode.development,
            /**
             * BABEL PRESETS
             * 
             * Presets will load pre-defined plugins and configurations that will determine how files are parsed.
             * See: https://babeljs.io/docs/en/presets
             * 
             * The order of the 'presets' is important and they will be executed in reverse order.
             * This means: Transform Typescript -> Parse JSX -> Transform for specific targets (providing 'shims').
             */
            presets: [
              // Provides 'shims' for Javascript features based on the specified 'targets'.
              // See: https://babeljs.io/docs/en/babel-preset-env
              '@babel/preset-env',
              // Parses React specific files (JSX syntax).
              // See: https://babeljs.io/docs/en/babel-preset-react
              [
                '@babel/preset-react',
                {
                  // Will automatically import `React` on files.
                  // This means you don't need to import `React` on all component files.
                  runtime: 'automatic',
                  // If on development, extra development specific code is generated.
                  development: settings.mode === BuildMode.development,
                }
              ],
              // Transforms Typescript files into Javascript files.
              // See: https://babeljs.io/docs/en/babel-preset-typescript
              '@babel/preset-typescript',
            ],
            /**
             * BABEL PLUGINS
             * 
             * Extra, ad-hoc, plugins.
             * See: https://babeljs.io/docs/en/plugins/
             */
            plugins: [
              // Imports the Babel runtime file into each generated file instead of injecting the full runtime itself.
              // The objective is to reduce output file sizes.
              // Must have '@babel/runtime' installed as a runtime dependency.
              // See: https://babeljs.io/docs/en/babel-plugin-transform-runtime
              // And: https://babeljs.io/docs/en/babel-runtime
              '@babel/plugin-transform-runtime',
              // Handles/transforms class properties.
              // See: https://babeljs.io/docs/en/babel-plugin-proposal-class-properties.html
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
        // Extract CSS-In-JS into CSS files to be processed.
        // This will not process the CSS in any way. It will only extract it.
        // The extracted CSS may be processed by other loaders down the line.
        // See: https://4catalyzer.github.io/astroturf/introduction
        {
          loader: 'astroturf/loader',
          options: {
            // The CSS will be extracted into file with the '.module.css' extension.
            extension: '.module.css',
          },
        },
      ],
    },
  ];
}

/**
 * Creates a rule to process and load styles files (CSS files).
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The styles loaders `rule`.
 */
function createStylesLoader(settings) {
  return [
    {
      test: settings.patterns.cssFiles,
      use: [
        // Responsible for injecting CSS into the DOM.
        // See: https://webpack.js.org/loaders/style-loader/
        'style-loader',
        // Process 'import' statements referencing CSS files.
        // See: https://webpack.js.org/loaders/css-loader/
        'css-loader',
        // Run CSS through PostCSS.
        // PostCSS is a CSS processor similar to what Babel is to JS.
        // See: https://postcss.org/
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                // Adds support to CSS `@import` statements.
                // This is required since `TailwindCSS` may use it to import its modules.
                // See: https://github.com/postcss/postcss-import
                'postcss-import',
                // `TailwindCSS` uses custom syntax that may break regular nesting.
                // This plugin is compatibility layer to make sure nesting is not broken by custom syntax.
                // See: https://tailwindcss.com/docs/using-with-preprocessors#nesting
                'tailwindcss/nesting',
                // This will load `TailwindCSS` on the `PostCSS` process.
                // See: https://tailwindcss.com/docs/using-with-preprocessors
                [
                  'tailwindcss',
                  {
                    // This will remove from the final output any unused `TailwindCSS` modules.
                    // This executes a naive text search on the files specified on the `content` property.
                    // This means that it will just look for the actual full names of `TailwindCSS` classes.
                    // See: https://tailwindcss.com/docs/optimizing-for-production
                    purge: {
                      // Only remove unused classes from the production build.
                      // Those classes may be useful during development for quick prototyping.
                      enabled: settings.mode === BuildMode.production,
                      // Do the text search for `TailwindCSS` classes on `.html`, `.ts` and `.tsx` files.
                      content: [
                        './src/**/*.html',
                        './src/**/*.ts',
                        './src/**/*.tsx',
                      ],
                    },
                  },
                ],
                // Add modern, stage 3, features to CSS.
                // This will allow developers to write CSS with the latest features, even if not currently supported by
                // the targeted browsers.
                // This will use the `browserslist` property on `package.json` to select which features to
                // include/translate.
                // See: https://github.com/csstools/postcss-preset-env
                [
                  'postcss-preset-env',
                  {
                    // Enable `stage 3` CSS features.
                    // See: https://cssdb.org/
                    stage: 3,
                    // Need to disable nesting since `TailwindCSS` will handle it for compatibility.
                    // See `TailwindCSS` settings in this file.
                    features: { 'nesting-rules': false },
                  },
                ],
              ],
            },
          }
        },
      ],
    },
  ];
}

/**
 * Creates a rule to process and export image files.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The images `rule`.
 */
function createImagesLoader(settings) {
  return [
    {
      test: settings.patterns.imageFiles,
      // Exports a separate file and a URL for it.
      // See: https://webpack.js.org/guides/asset-modules/
      type: 'asset/resource',
    },
  ];
}

/**
 * Creates a rule to process and export font files.
 * 
 * This will use `Webpack`'s built-in asset loader to load fonts.
 * For a font to be properly loaded you need to use a `@font-face` declaration.
 * 
 * See: https://webpack.js.org/guides/asset-management/#loading-fonts
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The fonts `rule`.
 */
function createFontsLoader(settings) {
  return [
    {
      test: settings.patterns.fontFiles,
      // Exports a separate file and a URL for it.
      // See: https://webpack.js.org/guides/asset-modules/
      type: 'asset/resource',
    }
  ];
}

/**
 * Creates a rule to process and load '.wasm' (Web Assembly) files.
 * 
 * '.wasm' files are exported as separate files and loaded via URL.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The '.wasm' files rule.
 */
function createWasmLoader(settings) {
  return [
    {
      test: settings.patterns.wasmFiles,
      // Exports a separate file and a URL for it.
      // See: https://webpack.js.org/guides/asset-modules/
      type: 'asset/resource',
    }
  ];
}

/**
 * Creates a rule to process and load '.unity' (Unity) files.
 * 
 * '.unity' files are exported as separate files and loaded via URL.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {RuleSetRule[]} The '.unity' files rule.
 */
function createUnityLoader(settings) {
  return [
    {
      test: settings.patterns.unityFiles,
      // Exports a separate file and a URL for it.
      // See: https://webpack.js.org/guides/asset-modules/
      type: 'asset/resource',
    }
  ];
}

// --------------------------------------------------------------------------------------------------------------------
// WEBPACK PLUGINS ----------------------------------------------------------------------------------------------------

/**
 * Instantiates a plugin to inject the final `Webpack` bundle into the app's index `HTML` file.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {WebpackPluginInstance} The resulting plugin instance.
 */
function createHtmlBundleInjectionPlugin(settings) {
  return new HtmlWebpackPlugin({
    template: settings.paths.indexHtmlTemplate
  });
}

/**
 * Instantiates a plugin to set and inject environment variables into JS code.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {WebpackPluginInstance} The resulting plugin instance.
 */
function createEnvironmentVariablesPlugin(settings) {
  return new Dotenv({
    path: `./.env.${settings.mode}`,
    systemvars: true,
  });
}

/**
 * Instantiates a plugin to copy pre-existing files to the `dist` folder.
 * 
 * @param {ISettings} settings The settings object.
 * @returns {WebpackPluginInstance | undefined} The resulting plugin instance.
 */
function createFileCopyPlugin(settings) {
  if (!settings.copyExistingFiles || settings.copyExistingFiles.length === 0) return;
  
  return new CopyPlugin({
    patterns: settings.copyExistingFiles,
  });
}

// Exports ------------------------------------------------------------------------------------------------------------

module.exports = {
  getBasicTypeScriptReactWebAppConfiguration,
};