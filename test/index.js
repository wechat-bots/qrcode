var expect = require('chai').expect,
    wechatQrcode = require('..');

describe('wechat-qrcode', function() {
  it('should create bot', function() {
    var options = {
      api: {}
    };
    expect(wechatQrcode(options)).to.be.a('function');
  });
});
