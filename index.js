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

  treeForAddon() {
    let trees = [];

    let imageTree = this.generateThumborURLs(this.addonOptions);

    trees.push(imageTree);

    let pattern = /["']__ember_thumbor_image_meta__["']/;
    let mapMeta = (content) => content.replace(pattern, JSON.stringify(this.metaData));

    trees = trees.concat([
      map(find(this._super.treeForAddon.apply(this, arguments), '**/*.js'), mapMeta)
    ]);

    return mergeTrees(trees, { overwrite: true });
  },

  generateThumborURLs(options) {
    let extensions = (options.extensions || []).join('|');
    let funnel = new Funnel('public', {
      srcDir: options.sourceDir,
      include: [`**/*.+(${extensions})`],
      allowEmpty: true,
      destDir: '/'
    });

    return new ThumborWriter([funnel], options, this.metaData, this.ui);
  },

  isDevelopingAddon() {
    return true;
  }
};
