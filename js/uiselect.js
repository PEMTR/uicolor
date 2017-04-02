var colorselect = new Vue({
      el: '#colorselect',
      data: {
          RGB: [{
                  name: 'R',
                  value: 255
              },
              {
                  name: 'G',
                  value: 0
              },
              {
                  name: 'B',
                  value: 0
              }
          ],
          HSL: [{
                  name: 'H',
                  value: 1
              },
              {
                  name: 'S',
                  value: 0
              },
              {
                  name: 'L',
                  value: 0
              }
          ],

          colorValue: ["", "", ""],
          flag: false,
          cssColor: "",
          midColor: "rgb(255,0,0)",
          mid: true,
          rgbValueChangeEvent: false,
          hslValueChangeEvent: false


      },
      watch: {


          RGB: {
              handler: function(a) {
                  if (!this.flag && !this.hslValueChangeEvent) {

                      var { R, G, B } = { R: a[0].value, G: a[1].value, B: a[2].value };
                      if (R == "") R = "0"
                      if (G == "") G = "0"
                      if (B == "") B = "0"

                      var drawing = document.getElementById("drawing");

                      var ctx = drawing.getContext("2d");

                      ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
                      ctx.fillRect(0, 0, 400, 400);
                      var hsl = rgbtohsl([R, G, B]);
                      colorselect.HSL[0].value = hsl[0];
                      colorselect.HSL[1].value = hsl[1];
                      colorselect.HSL[2].value = hsl[2];

                      this.rgbValueChangeEvent = true;
                  }
                  this.hslValueChangeEvent = false;


              },
              deep: true
          },
          HSL: {
              handler: function(a) {
                  if (!this.flag && !this.rgbValueChangeEvent) {

                      var { H, S, L } = { H: a[0].value, S: a[1].value, L: a[2].value };
                      if (H == "") H = "0";
                      if (S == "") S = "0";
                      if (L == "") L = "0";
                      var [R, G, B] = hsltorgb([parseFloat(H), parseFloat(S), parseFloat(L)]);

                      var drawing = document.getElementById("drawing");

                      var ctx = drawing.getContext("2d");

                      ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
                      ctx.fillRect(0, 0, 400, 400);
                      colorselect.RGB[0].value = R;
                      colorselect.RGB[1].value = G;
                      colorselect.RGB[2].value = B;
                      this.hslValueChangeEvent = true;
                  }
                  this.rgbValueChangeEvent = false;
                  this.flag = false;

              },
              deep: true
          }
      },
      methods: {
          clickpicker: function(event) {
              var x = event.offsetX,
                  y = event.offsetY;



              var point = {};
              point.x = x;
              point.y = y;

              this.drawpickerclick(point);
          },
          drawpickerclick: function(point) {
              var drawing = document.getElementById("drawing");
              var ctx = drawing.getContext("2d");
              var imagedata = ctx.getImageData(point.x, point.y, 1, 1);
              var gradient = ctx.createLinearGradient(0, 0, 400, 400);
              gradient.addColorStop(0, "rgb(255,255,255)");
              gradient.addColorStop(0.5, this.midColor);
              gradient.addColorStop(1, "rgb(0,0,0)");
              if (this.mid == true) {
                  ctx.fillStyle = gradient;
              } else {
                  ctx.fillStyle = rgbToCssColor(imagedata.data);
              }
              ctx.fillRect(0, 0, 400, 400);
              ctx.beginPath();
              ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI, false);
              ctx.stroke();
              var imagedata = ctx.getImageData(point.x, point.y, 1, 1);
              var hsl = rgbtohsl(imagedata.data);
              colorselect.RGB[0].value = imagedata.data[0];
              colorselect.RGB[1].value = imagedata.data[1];
              colorselect.RGB[2].value = imagedata.data[2];
              colorselect.HSL[0].value = hsl[0];
              colorselect.HSL[1].value = hsl[1];
              colorselect.HSL[2].value = hsl[2];
              colorselect.flag = true;

              this.colorValue[0] = rgbToCssColor(imagedata.data);
              this.colorValue[1] = "RGB(" + imagedata.data[0].toString() + "," + imagedata.data[1].toString() + "," + imagedata.data[2].toString() + ")";
              this.colorValue[2] = "HSL(" + hsl[0].toString() + "," + hsl[1].toString() + "," + hsl[2].toString() + ")";

          },

          setColor: function() {

              if (this.cssColor.length == 7 && this.cssColor[0] == "#") {
                  var drawing = document.getElementById("drawing");

                  var ctx = drawing.getContext("2d");

                  ctx.fillStyle = this.cssColor;
                  ctx.fillRect(0, 0, 400, 400);
                  this.midColor = this.cssColor;
                  var rgb = cssColorToRgb(this.cssColor);
                  var hsl = rgbtohsl(rgb);
                  this.colorValue[0] = this.cssColor;
                  this.colorValue[1] = "RGB(" + rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString() + ")";
                  this.colorValue[2] = "HSL(" + hsl[0].toString() + "," + hsl[1].toString() + "," + hsl[2].toString() + ")";
                  Vue.set(this.colorValue, 0, this.cssColor);
                  this.mid = false;
              }


          }
      }
  })


  function cssColorToRgb(cssColor) {
      var rgb = [];
      rgb[0] = parseInt("0x" + cssColor[1] + cssColor[2]);
      rgb[1] = parseInt("0x" + cssColor[3] + cssColor[4]);
      rgb[2] = parseInt("0x" + cssColor[5] + cssColor[6]);
      return rgb;
  }

  function rgbToCssColor(rgb) {
      var r, g, b;
      switch (true) {
          case rgb[0] == 16:
              r = rgb[0].toString(16) + "0";
              break;
          case rgb[0] == 0:
              r = "00";
              break;
          case rgb[0] <= 15:
              r = "0" + rgb[0].toString(16);
              break;
          default:
              r = rgb[0].toString(16);
      }
      switch (true) {
          case rgb[1] == 16:
              g = rgb[1].toString(16) + "0";
              break;
          case rgb[1] == 0:
              g = "00";
              break;
          case rgb[1] <= 15:
              g = "0" + rgb[1].toString(16);
              break;
          default:
              g = rgb[1].toString(16);
      }
      switch (true) {
          case rgb[2] == 16:
              b = rgb[2].toString(16) + "0";
              break;
          case rgb[2] == 0:
              b = "00";
              break;
          case rgb[2] <= 15:
              b = "0" + rgb[2].toString(16);
              break;
          default:
              b = rgb[2].toString(16);
      }

      return "#" + r + g + b;
  }

  function rgbtohsl(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255;

      var h, s, l;
      var max = Math.max(r, g, b),
          min = Math.min(r, g, b);


      if (max == min) {
          h = 0;
      } else if (max == r && g >= b) {
          h = 60 * (g - b) / (max - min);
      } else if (max == r && g < b) {
          h = 60 * (g - b) / (max - min) + 360;
      } else if (max == g) {
          h = 60 * (b - r) / (max - min) + 120;
      } else if (max == b) {
          h = 60 * (r - g) / (max - min) + 240;
      }

      l = (max + min) / 2;

      if (l == 0 || max == min) {
          s = 0;
      } else if (0 < l && l <= 1 / 2) {
          s = (max - min) / (max + min);
      } else if (l > 1 / 2) {
          s = (max - min) / (2 - (max + min));
      }

      return [Math.round(h), Math.round(s * 100) / 100, Math.round(l * 100) / 100];
  }

  function hsltorgb(hsl) {
      var h = hsl[0],
          s = hsl[1],
          l = hsl[2];
      var r, g, b, q, p, k;

      if (s == 0) {
          var v = Math.round(l * 255);
          return [v, v, v];
      }
      if (l < 1 / 2) {
          q = l * (1 + s);
      } else {
          q = l + s - l * s;
      }
      p = 2 * l - q;
      k = h / 360;

      function colorcalculation(t) {
          if (t < 0) {
              t = t + 1;
          } else if (t > 1) {
              t = t - 1;
          }
          var rgbvalue;
          if (t < 1 / 6) {
              rgbvalue = p + (q - p) * 6 * t;
          } else if (1 / 6 < t && t < 1 / 2) {
              rgbvalue = q;
          } else if (1 / 2 < t && t < 2 / 3) {
              rgbvalue = p + (q - p) * 6 * (2 / 3 - t);
          } else {
              rgbvalue = p;
          }
          return rgbvalue;
      }
      r = colorcalculation(k + 1 / 3)
      g = colorcalculation(k)
      b = colorcalculation(k - 1 / 3)
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  function rgbtocsscolor(rgb) {

      var csscolor = "#";
      for (var n = 0; n < 3; n++) {
          if (rgb[n] < 16) {
              csscolor = csscolor + "0" + rgb[n].toString(16);
          } else {
              csscolor = csscolor + rgb[n].toString(16);
          }
      }
      return csscolor;
  }

  var drawing2 = document.getElementById("drawing2")
  if (drawing2.getContext) {
      var ctx = drawing2.getContext("2d");
      var gradient = ctx.createLinearGradient(0, 0, 20, 400);
      gradient.addColorStop(0, "rgb(255,0,0)");

      gradient.addColorStop(0.16, "rgb(255,255,0)");
      gradient.addColorStop(0.33, "rgb(0,255,0)");
      gradient.addColorStop(0.5, "rgb(0,255,255)");
      gradient.addColorStop(0.66, "rgb(0,0,255)");
      gradient.addColorStop(0.83, "rgb(255,0,255)");
      gradient.addColorStop(1, "rgb(255,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 20, 400);
  }

  var drawing = document.getElementById("drawing");
  if (drawing.getContext) {
      var ctx = drawing.getContext("2d");
      var gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(1, "rgb(0,0,0)");
      gradient.addColorStop(0, "rgb(255,255,255)");
      gradient.addColorStop(0.5, "rgb(255,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);
  }

  function drawpicker(rgb) {
      var r = rgb[0].toString(),
          g = rgb[1].toString(),
          b = rgb[2].toString();
      var drawing = document.getElementById("drawing");
      var ctx = drawing.getContext("2d");
      var gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, "rgb(255,255,255)");
      gradient.addColorStop(0.5, "rgb(" + r + "," + g + "," + b + ")");
      gradient.addColorStop(1, "rgb(0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);
      colorselect.midColor = "rgb(" + r + "," + g + "," + b + ")";


  }


  function drawpicker2() {
      var drawing2 = document.getElementById("drawing2")
      if (drawing2.getContext) {
          var ctx = drawing2.getContext("2d");
          var gradient = ctx.createLinearGradient(0, 0, 20, 400);
          gradient.addColorStop(0, "rgb(255,0,0)");

          gradient.addColorStop(0.16, "rgb(255,255,0)");
          gradient.addColorStop(0.33, "rgb(0,255,0)");
          gradient.addColorStop(0.5, "rgb(0,255,255)");
          gradient.addColorStop(0.66, "rgb(0,0,255)");
          gradient.addColorStop(0.83, "rgb(255,0,255)");
          gradient.addColorStop(1, "rgb(255,0,0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 20, 400);
          colorselect.mid = true;
      }
  }

  

  function drawpickerclick2(point) {
      var ctx = drawing2.getContext("2d");
      var gradient = ctx.createLinearGradient(0, 0, 20, 400);
      gradient.addColorStop(0, "rgb(255,0,0)");

      gradient.addColorStop(0.16, "rgb(255,255,0)");
      gradient.addColorStop(0.33, "rgb(0,255,0)");
      gradient.addColorStop(0.5, "rgb(0,255,255)");
      gradient.addColorStop(0.66, "rgb(0,0,255)");
      gradient.addColorStop(0.83, "rgb(255,0,255)");
      gradient.addColorStop(1, "rgb(255,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 20, 400);
      ctx.beginPath();
      ctx.arc(10, point.y, 10, 0, 2 * Math.PI, false);
      ctx.stroke();
      var imageData = ctx.getImageData(point.x, point.y, 1, 1);
      var data = imageData.data;
      drawpicker(data);

  }

 

  function clickpicker2(ev) {
      var x = ev.offsetX,
          y = ev.offsetY;

      var point = {};
      point.x = x;
      point.y = y;
      drawpickerclick2(point)

  }
