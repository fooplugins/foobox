# Boilerplate

A Freemius WordPress plugin boilerplate.

## Freemius

The `gulpfile.js` relies on a `fs-config.js` existing in the root directory containing the Freemius specific sensitive information. This file should contain the following fields:

```json
{
  "developer_id": -1,
  "plugin_id": -1,
  "public_key": "",
  "secret_key": ""
}
``` 

## Scripts

In the `package.json` there are 5 primary built-in scripts:

1. `build` - Executes both the `build:free` and `build:pro` scripts.
2. `build:free` - Builds the free version of the plugins admin, blocks and public assets.
3. `build:pro` - Builds the pro version of the plugins admin, blocks and public assets.
4. `package` - Generates the `.pot` file for translations and outputs the packaged plugin as a versioned `.zip` file in the `./dist/` folder.
5. `deploy` - Uses the `gulp-freemius-deploy` package and the `fs-config.json` file to push the latest `.zip` to Freemius.

## @wordpress/scripts

The blocks build is handled by this package, with a few modifications:

### Configuration

The default `@wordpress/scripts/config/webpack.config.js` file is imported and then overridden in the `/config/webpack.helper.js` file. The changes made are listed below:

1. Sourcemaps are output even when using the `wp-scripts build` command.
2. The `@wordpress/dependency-extraction-webpack-plugin` configuration is altered so polyfills are not automatically included as a dependency.
3. All entry points for the free and pro versions of the plugin are respectively located within `webpack.free.js` and `webpack.pro.js`