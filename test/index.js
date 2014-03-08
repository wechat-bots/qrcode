var expect = require('chai').expect,
    wechatQrcode = require('..');

describe('wechat-qrcode', function() {
  it('should say hello', function(done) {
    expect(wechatQrcode()).to.equal('Hello, world');
    done();
  });
});
