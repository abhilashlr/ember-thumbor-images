ember-thumbor-images
==============================================================================

This is a simple addon that constructs your ember-apps's images with your thumbor services's url during build. It also provides a helper and a component. The helper is useful for generating the image `src` attribute while the component is more powerful. The component generates responsive picture tags that would be added with `<source>` tags which add the right thumbor image src to the html at runtime. Thanks to @kaliber5 for `ember-responsive-image` from which this build time url image manipulation is inspired. 


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.13 or above
* Ember CLI v3.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-thumbor-images
```


Usage
------------------------------------------------------------------------------

This addon assumes you already have a thumbor service running in your servers. For example, I host my thumbor on a heroku instance and my image assets are in a different server.

In order to use secure URL generation, you need to set environment variable `THUMBOR_SECRET_KEY` to use your secret key which you would have defined in thumbor's config (thumbor.conf). (NOTE: If you do not use this key, the url will default to `unsafe` usage).

### Configurations

#### `sourceDir`: Type: String (Default: 'assets/images/')
Use your image source paths to allow this addon to generate URLs for

#### `sizes`: Type: Array (Default: [1024])

#### `extensions`: Type: Array (Default: ['jpg', 'jpeg', 'png', 'gif'])
PS: Do not change the `enabled` flag yet. This is WIP.

### Helper

#### `{{thumbor-src <path> <size>}}`
This helper takes a path and size as argument. And returns back the thumbor secure URL back to be used.

#### `<ResponsiveImage @src={{path}} />`
This is a component that generates responsive image using `<picture>` tag along with a combination of `<source>` and `<img>` tags. Based on the sizes config that is set, the source tags are generated.

TODO: More to be added.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
