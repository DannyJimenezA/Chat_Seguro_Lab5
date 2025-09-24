// modulo de ejemplo.

module.exports = {


    // logica que valida si un telefono esta correcto...
    is_valid_phone: function (phone) {
      // Solo acepta formato dddd-dddd
      var re = /^\d{4}-\d{4}$/;
      return re.test(phone);
    },

    is_valid_url_image: function (url) {
      // Solo acepta URLs que terminan en imagen válida
      var re = /^https?:\/\/.+\.(jpg|jpeg|gif|png|bmp)$/i;
      return re.test(url);
    },

    is_valid_yt_video: function (url) {
      // Solo acepta URLs válidas de YouTube
      var re = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}/i;
      return re.test(url);
    },
  
    getYTVideoId: function(url){
  
      return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
    },
  
    getEmbeddedCode: function (url){
      var id = this.getYTVideoId(url);
      var code = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+ '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      return code;
    },
  
    getImageTag: function(url){
      var tag = '<img src="'+url+'" style="max-height: 400px;max-width: 400px;">';
      return tag;
    },
  
    validateMessage: function(msg){
      // Handle invalid input
      if (!msg || typeof msg !== 'string') {
        return JSON.stringify({ mensaje: '' });
      }

      try {
        var obj = JSON.parse(msg);
  
      if(this.is_valid_url_image(obj.mensaje)){
        console.log("Es una imagen!")
        obj.mensaje = this.getImageTag(obj.mensaje);
      }
      else if(this.is_valid_yt_video(obj.mensaje)){
        console.log("Es un video!")
        obj.mensaje = this.getEmbeddedCode(obj.mensaje);
      }
      else{
        console.log("Es un texto!")
      }
      
      return JSON.stringify(obj);
      } catch (e) {
        console.log('Error processing message:', e);
        return JSON.stringify({ mensaje: msg }); // Return original message on error
      }
    },
  
    // Nueva funcionalidad propuesta
    validateMessageSanitized: function(msg) {
      try {
          let obj = JSON.parse(msg);

          // Sanitiza el nombre SIEMPRE
          obj.nombre = sanitizeText(obj.nombre);

          // Si es URL válida de imagen
          if (this.is_valid_url_image(obj.mensaje)) {
              obj.mensaje = this.getImageTag(obj.mensaje);
          }
          // Si es URL válida de video YouTube
          else if (this.is_valid_yt_video(obj.mensaje)) {
              obj.mensaje = this.getEmbeddedCode(obj.mensaje);
          }
          // Si es URL pero NO válida
          else if (/^https?:\/\/.+/.test(obj.mensaje)) {
              obj.mensaje = '[URL no permitida]';
          }
          // Si es texto normal, sanitiza para prevenir XSS
          else {
              obj.mensaje = sanitizeText(obj.mensaje);
          }

          return JSON.stringify(obj);
      } catch (e) {
          return JSON.stringify({nombre: "Anonimo", mensaje: "[Mensaje inválido]", color: "#000"});
      }
    }

    // fin del modulo
  };

  // Sanitiza texto para evitar XSS
  function sanitizeText(text) {
      return String(text).replace(/[<>&"'`]/g, function (c) {
          return ({
              '<': '&lt;',
              '>': '&gt;',
              '&': '&amp;',
              '"': '&quot;',
              "'": '&#39;',
              '`': '&#96;'
          })[c];
      });
  }

  // Valida URLs de imágenes y videos
  function isValidMediaUrl(url) {
      var imgRegex = /^https?:\/\/.+\.(jpeg|jpg|gif|png)$/i;
      var mp4Regex = /^https?:\/\/.+\.(mp4|webm|ogg)$/i;
      var ytRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
      return imgRegex.test(url) || mp4Regex.test(url) || ytRegex.test(url);
  }
