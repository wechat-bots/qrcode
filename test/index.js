var expect = require('chai').expect,
    wechatQrcode = require('..');

describe('wechat-qrcode', function() {
  it('should create bot', function() {
    expect(wechatQrcode()).to.be.a('function');
  });
});
