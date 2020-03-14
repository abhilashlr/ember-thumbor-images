'use strict';

const Funnel = require('broccoli-funnel');
const map = require('broccoli-stew').map;
const find = require('broccoli-stew').find;
const mergeTrees = require('broccoli-merge-trees');
const ThumborWriter = require('./broccoli-thumbor-writer');

function defaultConfig(env) {
  let defaultConfig = {
    enabled: env === 'production',
    sourceDir: 'assets/images/',
    sizes: [1024],
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
    host: '',
    assetPrepend: ''
  };

  return defaultConfig;
}

module.exports = {
  name: require('./package').name,
  addonOptions: {},
  metaData: {},

  config(env, baseConfig) {
    if (!env) {
      return;
    }

    let config = baseConfig['thumbor'];
    let url = baseConfig.rootURL || baseConfig.baseURL || '';

    config.rootURL = url;

    this.addonOptions = Object.assign({}, defaultConfig(env), config);

    this.metaData.sizes = this.addonOptions.sizes;
    this.metaData.host = this.addonOptions.host;
  },

  included(app, parentAddon) {
    this._super.included.apply(this, arguments);

    this.app = (parentAddon || app);
  },

  postprocessTree(type, tree) {
    if (type === 'all') {
      let trees = [];
      let imageTree = this.generateThumborURLs(tree, this.addonOptions);

      trees.push(imageTree);

      let pattern = /["']__ember_thumbor_image_meta__["']/;
      let mapMeta = (content) => content.replace(pattern, JSON.stringify(this.metaData));

      trees = trees.concat([
        tree,
        map(find(tree, '**/*.js'), mapMeta),
        map(find(tree, '**/index.html'), mapMeta)
      ]);

      return mergeTrees(trees, { overwrite: true });
    }

    return tree;
  },

  generateThumborURLs(tree, options) {
    let extensions = options.extensions.join('|');
    let funnel = new Funnel(tree, {
      srcDir: options.sourceDir,
      include: [`**/*.+(${extensions})`],
      allowEmpty: true,
      destDir: '/'
    });

    return new ThumborWriter([funnel], options, this.metaData, this.ui);
  },

  contentFor(type) {
    // TODO:: Figure our if its possible to push this as a separate file and optimise build times 
    // from that instead of writing this everytime.
    if (type === 'head-footer') {
      let txt = [
        '<script type="text/javascript">',
          'window.thumborConfig = () => { return \'__ember_thumbor_image_meta__\'; }',
        '</script>'
      ];
      return txt.join("\n");
    }
  }
};
