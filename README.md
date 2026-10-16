# Tailbase Theme Settings

A "Theme Settings" page for the Tailbase theme, built with React (`@wordpress/components`). Settings are stored in
one option and applied by small PHP handlers. (It replaces the former `tt-theme-settings` plugin.)

## Quick start

```bash
npm install
npm run build      # build into build/ (committed, so the plugin works without Node)
npm start          # watch mode
npm run lint:js
```

Activate **Tailbase Theme Settings**. The page is in the admin menu under **Theme Settings**
(`manage_options` capability required).

## What it does

| Tab          | Settings                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Common       | Excerpt length, custom `<body>` classes, hide the WordPress version, SVG uploads, disable XML-RPC, hide the admin bar for non-administrators, disable the plugin/theme file editor |
| Scripts      | Custom code printed in `<head>`, after `<body>` opens (`wp_body_open`) and in the footer               |
| Social Media | A sortable list of `{ platform, url, icon }` items for the theme to render                              |

Every handler only changes WordPress when its setting is on. When it is off, WordPress behaves as if the plugin were
not installed.

## Use the settings in the theme

```php
$excerpt = Tailbase_Settings::get_setting( 'commonSettings.excerptLength', 55 );

foreach ( Tailbase_Settings::get_setting( 'socialMediaSettings', array() ) as $item ) {
	printf(
		'<a href="%s">%s</a>',
		esc_url( $item['url'] ),
		esc_html( $item['platform'] )
	);
}
```

`get_setting()` takes a dot path. Defaults are filled in for missing keys, and a stored `false` or `0` is returned as
is (the default is used only when the key does not exist). Always escape values when you print them.

## Data and security

- **Option:** `tailbase_theme_settings` (autoloaded). Defaults are defined once, in `Tailbase_Settings::defaults()`.
  The React app does not keep its own copy: it reads them from the REST API, and "Reset settings" calls `DELETE`.
- **Sanitizing:** every write goes through `Tailbase_Settings::sanitize()` (REST callback and the option's
  `sanitize_callback`). Unknown keys are dropped, types are enforced, social media URLs are run through
  `esc_url_raw()` and CSS classes through `sanitize_html_class()`.
- **Scripts:** printed as raw HTML on purpose (tracking codes). Only users with the `unfiltered_html` capability can
  change them; for everyone else the saved scripts stay as they are. On multisite that means super admins only.
- **SVG uploads:** off by default. When on, only users with `unfiltered_html` can upload SVG, and files that contain
  scripts, event handlers or similar are rejected. This is a safety net, not a full sanitizer: upload only SVG files
  you trust.
- **Uninstall:** deleting the plugin removes its option (`uninstall.php`).

## REST API

`/wp-json/tailbase/v1/settings`, for users who can `manage_options`.

| Method   | Body                    | Returns                                          |
| -------- | ----------------------- | ------------------------------------------------ |
| `GET`    |                         | all settings                                     |
| `POST`   | `{ "settings": { … } }` | `{ success, message, settings }` (sanitized)     |
| `DELETE` |                         | `{ success, message, settings }` (the defaults)  |

## Migrating from `tt-theme-settings`

On activation (and on the first request after the rename) the settings stored by the old plugin under
`tt_theme_settings` are copied to `tailbase_theme_settings`. The old option is left untouched, and is removed when
the plugin is uninstalled.

## Structure

```
tailbase-theme-settings.php   plugin header, loads the classes
uninstall.php                 removes the option
includes/
  class-tailbase-settings.php                   defaults, get_setting(), sanitizing, migration
  class-tailbase-rest-api.php                   REST routes
  class-tailbase-admin-page.php / assets-loader admin menu page and loading the built app
  class-tailbase-common-settings-handler.php    applies the Common tab
  class-tailbase-scripts-settings-handler.php   prints the Scripts tab
src/                          React app (react-hook-form), built to build/ with @wordpress/scripts
```
