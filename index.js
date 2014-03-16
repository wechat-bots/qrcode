var debug = require('debug')('wechat:qrcode');

var qr = require('qr-js');
var hat = require('hat');
var mkdirp = require('mkdirp');
var util = require('util');

/*
  @param {wechat.API} api wechat api instance
 */
module.exports = function createQRCode(options) {
  var api = options.api;
  var path = options.path || '.tmp';
  mkdirp.sync(path);

  function QRCode(req, res, next) {
    var message = req.weixin;
    var matches;

    if (message.MsgType !== 'text') return next();

    matches = /qr\w*(.*)/.exec(message.Content);
    if (matches) {
      var text = matches[1];
      var file = util.format('%s/%d.jpg', path, hat());
      qr.save({
        mime: 'image/jpeg',
        path: file,
        value: text
      }, QRSaved);
    } else {
      return next();
    }

    function QRSaved(err, written) {
      if (!err) {
        debug('QR code saved to %s', file);
        api.uploadImage(file, imageUploaded);
      } else {
        next(err);
      }
      function imageUploaded(err, result) {
        if (!err) {
          debug('image uploaded, id = %s', result.media_id);
          res.reply({
            type: 'image',
            content: {
              mediaId: result.media_id
            }
          });
        } else {
          next(err);
        }
      }
    }
  }
  QRCode.help = 'qr <text> to create QR code';
  return QRCode;
};
