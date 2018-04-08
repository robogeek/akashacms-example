
'use strict';

const akasha  = require('akasharender');
const path    = require('path');
const util    = require('util');

const log    = require('debug')('akashacms-example:configuration');
const error  = require('debug')('akashacms-example:error-configuration');

const config = new akasha.Configuration();

config.rootURL("https://example.akashacms.com");

config.configDir = __dirname;

config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addDocumentsDir({
        src: 'node_modules/epub-skeleton/documents',
        dest: 'epub-skeleton',
        baseMetadata: {
            bookHomeURL: "/epub-skeleton/toc.html"
        }
    })
    .addPartialsDir('partials');

config
    .use(require('akashacms-theme-bootstrap'))
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('akashacms-booknav'))
    .use(require('akashacms-dlassets'))
    .use(require('akashacms-document-viewers'))
    .use(require('akashacms-embeddables'))
    .use(require('akashacms-external-links'))
    .use(require('akashacms-footnotes'))
    .use(require('akashacms-affiliates'))
    .use(require('akashacms-tagged-content'))
    .use(require('epub-website'));

config.plugin("akashacms-base").generateSitemap(config, true);

config.plugin("akashacms-affiliates")
    .amazonAffiliateCode(config, 'com', 'thereikipage')
    .loadAffiliateProducts(config, 'affiliate-products.yml')
    .noSkimlinksDomain(config, 'amazon.com')
    .noViglinksDomain(config, 'amazon.com');

config.plugin("akashacms-external-links")
    // TARGET=_blank test
    .setTargetBlank(config, true)

    // FAVICON test
    // .setShowFavicons(config, "after")
    .setShowFavicons(config, "before")
    // .setShowFavicons(config, "never")

    // ICON test
    .setShowIcon(config, "after")
    // .setShowIcon(config, "before")
    // .setShowIcon(config, "never")

    // NOFOLLOW test
    .setPreferNofollow(config, false)
    .addBlacklistEntry(config, 'google.com')
    .addBlacklistEntry(config, 'docs.google.com')
    .addBlacklistEntry(config, 'cnn.com')
    .addBlacklistEntry(config, 'bbc.co.uk')
    .addWhitelistEntry(config, '7gen.com')
    // .addWhitelistEntry(config, 'visforvoltage.org')
    // .addWhitelistEntry(config, 'thereikipage.com');
    ;

config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js"  })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap-theme.min.css" })
    .addStylesheet({       href: "/style.css" });

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true,
    decodeEntities: true
});

config.plugin("akashacms-tagged-content")
    .sortBy('title')
    .headerTemplate("---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p>Pages with tag @tagName@</p>")
    .tagsDirectory('/tags/');

config.addMahabhuta(
    [
      function($, metadata, dirty, done) {
          $('helloworld').replaceWith('<p class="hello-world">Hello world! '+ metadata.title +'</p>');
          done();
      }
    ]);

config.prepare();

// console.log(`AssetDirs: ${util.inspect(config.assetDirs)}`);
// console.log(`DocumentDirs: ${util.inspect(config.documentDirs)}`);
// console.log(`PartialDirs: ${util.inspect(config.partialsDirs)}`);
// console.log(`LayoutDirs: ${util.inspect(config.layoutDirs)}`);
// console.log(`RenderDestination: ${util.inspect(config.renderDestination)}`);

module.exports = config;
