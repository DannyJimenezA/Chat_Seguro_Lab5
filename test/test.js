var val = require('../libs/unalib');
var assert = require('assert');


describe('unalib', function(){


  describe('funcion is_valid_phone', function(){

    it('deberia devolver true para 8297-8547', function(){

      assert.equal(val.is_valid_phone('8297-8547'), true);

    });

    it('deberia devolver false para 8297p-8547', function(){

      assert.equal(val.is_valid_phone('8297p-8547'), false);

    });

  });


  describe('validacion de URLs de imagenes', function() {
    it('deberia devolver false para una url que no es imagen', function() {
      assert.equal(val.is_valid_url_image('http://image.com/file.txt'), false);
    });
    it('deberia devolver true para una imagen png', function() {
      assert.equal(val.is_valid_url_image('https://site.com/pic.png'), true);
    });
    it('deberia devolver false para una url sin http', function() {
      assert.equal(val.is_valid_url_image('site.com/pic.jpg'), false);
    });
  });

  describe('validacion de URLs de videos', function() {
    it('deberia devolver true para un video de youtube', function() {
      assert.equal(val.is_valid_yt_video('https://youtu.be/qYwlqx-JLok'), true);
    });
    it('deberia devolver false para una url que no es video', function() {
      assert.equal(val.is_valid_yt_video('https://site.com/video.mp4'), false);
    });
    it('deberia devolver false para una url de imagen', function() {
      assert.equal(val.is_valid_yt_video('https://site.com/pic.jpg'), false);
    });
  });

  describe('prevencion de inyeccion de scripts', function() {
    it('deberia sanitizar script tags en validateMessageSanitized', function() {
      const msg = JSON.stringify({nombre: "user", mensaje: "<script>alert('xss')</script>", color: "#000"});
      const result = JSON.parse(val.validateMessageSanitized(msg));
      assert.equal(result.mensaje.includes('<script>'), false);
      assert.equal(result.mensaje.includes('&lt;script&gt;'), true);
    });
    it('deberia bloquear url maliciosa en validateMessageSanitized', function() {
      const msg = JSON.stringify({nombre: "user", mensaje: "http://malicious.com/file.exe", color: "#000"});
      const result = JSON.parse(val.validateMessageSanitized(msg));
      assert.equal(result.mensaje, '[URL no permitida]');
    });
  });

});







