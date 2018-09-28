
/*
Source:
stackoverflow
User: Euler Junior
Link: https://stackoverflow.com/questions/3080421/javascript-color-gradient
*/

function hex (c) {
    var s = "0123456789abcdef";
    var i = parseInt (c);
    if (i == 0 || isNaN (c))
      return "00";
    i = Math.round (Math.min (Math.max (0, i), 255));
    return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
  }
  
  /* Convert an RGB triplet to a hex string */
  function convertToHex (rgb) {
    return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  }
  
  /* Remove '#' in color hex string */
  function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
  
  /* Convert a hex string to an RGB triplet */
  function convertToRGB (hex) {
    var color = [];
    color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
    color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
    color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
    return color;
  }
  
  function generateColor(colorStart,colorEnd,colorCount){
  
      // The beginning of your gradient
      var start = convertToRGB (colorStart);    
  
      // The end of your gradient
      var end   = convertToRGB (colorEnd);    
  
      // The number of colors to compute
      var len = colorCount;
  
      //Alpha blending amount
      var alpha = 0.0;
  
      var saida = [];
      
      for (i = 0; i < len; i++) {
          var c = [];
          alpha += (1.0/len);
          
          c[0] = start[0] * alpha + (1 - alpha) * end[0];
          c[1] = start[1] * alpha + (1 - alpha) * end[1];
          c[2] = start[2] * alpha + (1 - alpha) * end[2];
  
          saida.push(convertToHex (c));
          
      }
      
      return saida;
      
  }
  
  // Exemplo de como usar
  /*
  #FFFF19 yellow
  #ffcc00 orange
  #4EF84E green
  #00ff00 lighter green
  #0066ff blue
  */
  var tmp1 = generateColor('#FF0000','#FF0000',20);      // 20 in red
  
  var tmp2 = generateColor('#0066ff','#FF0000',30);      // blue to red, 25 values  #0066ff blue
  
  var tmp3 = generateColor('#00ff00','#0066ff',50);      // green to yellow, 50 values  #00ff00 green
  

  console.log("Joined:")
  console.log( tmp1.concat(tmp2, tmp3) );


  for (cor in tmp2) {
    $('#result_show').append("<div style='padding:8px;color:#FFF;background-color:#"+tmp2[cor]+"'>COLOR "+cor+"° - #"+tmp2[cor]+"</div>")
  }
  for (cor in tmp3) {
    $('#result_show').append("<div style='padding:8px;color:#FFF;background-color:#"+tmp3[cor]+"'>COLOR "+cor+"° - #"+tmp3[cor]+"</div>")
  }



  /*
  Green: #00FF00
  Yellow: #FFFF00
  Blue: #0000FF
  Red: #FF0000  
  */