var debug = require('debug')('wechat:qrcode');

var qr = require('qr-js');
var hat = require('hat');

/*
  @param {wechat.API} api wechat api instance
 */
module.exports = function wechatQRCode(api) {
  return function wechatQRCode(req, res, next) {
    var message = req.weixin;
    var matches;

    if (message.MsgType !== 'text') return next();

    matches = /qr\w*(.*)/.exec(message.Content);
    if (matches) {
      var text = matches[1];
      var file = process.env.HOME +'/.qrcode/' + hat() + '.jpg';
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
  };
};
