/*
 ====
 Variable Globales
 ====
*/
var MAX_WIDTH = 650;
var MAX_HEIGHT = 450;

function readImage() {

  /*
   ===
   Función para leer el archivo seleccionado o tomado desde celular
   Se leerá el archivo y se pondra en un contenedor de IMG
   Se inicializará el plugin para manipular la imágen
   ===
  */

  var idImg = "img-camera";
  console.log("Funcion para leer la imagen seleccionada o tomada por el usuario");
    if ( this.files && this.files[0] ) {

      console.log("Se está leyendo el archivo");
      var FR = new FileReader();
      FR.onload = function(e) {
        var image = new Image();
        image.onload = function() {
          if(image.height > MAX_HEIGHT) {
      			image.width *= MAX_HEIGHT / image.height;
      			image.height = MAX_HEIGHT;
            var center = (MAX_WIDTH / 2) - (image.width / 2);
      		}
          console.log("width: " + image.width + " Height: " + image.height + " Center: " + center);
          var imgPhoto = document.getElementById(idImg);
          imgPhoto.src = image.src;

          // Step two
          setManipulation();

        };
        image.src = e.target.result;
      };
      FR.readAsDataURL( this.files[0] );

    }

}

var setManipulation = function(){
  /*
   ===
   Función para preparar la manipulación de la imágen subida por el usuario
   ===
  */
  console.log("Se da la opcionde manipular la imagen subida");
  $(".button.pick").addClass("hidden");
  $(".button.camera").addClass("hidden");
  $(".button.terminar").removeClass("hidden");
  $('#img-camera').cropimg({
    resultWidth:600,
    resultHeight:450,
    onChange: function() {
      console.log("Está cambiando la imagen subida por el usuario");
    }
  });
  $("nav").removeClass("hidden");
  $(".tool-bar-images").removeClass("hidden");
};

var sendImageToServer = function(){

  var canvasFinal = document.getElementById('canvas-preview'),
	context = canvasFinal.getContext('2d');

  var imgBack = document.getElementById("img-back");
  var imgCamera = document.getElementById("img-camera");
  var imgFrame = document.getElementById("img-frame");

  var actualW = $("#img-frame").width();
  var actualH = $("#img-frame").height();
  /*
   Obtener todos los parametros de la imagen para mandarla al canvas final */

  var str = $("#img-camera").attr("style");

  str = str.replace(/width: /g, "");
  str = str.replace(/height: /g, "");
  str = str.replace(/max-/g, "");
  str = str.replace(/min-/g, "");
  str = str.replace(/top: /g, "");
  str = str.replace(/left: /g, "");
  str = str.replace(/ /g, "");
  str = str.replace(/\t/g, "");
  str = str.replace(/\n/g, "");

  str = str.split("px;");

  //console.log(str[0], str[1], str[6], str[7]);
  var w, h, t, l;
  if(str[0] == "" || str[0] == null){
    w = 0;
  }else{ w = str[0]; }
  if(str[1] == "" || str[1] == null){
    h = 0;
  }else{ h = str[1]; }
  if(str[6] == "" || str[6] == null){
    t = 0;
  }else{ t = str[6]; }
  if(str[7] == "" || str[7] == null){
    l = 0;
  }else{ l = str[7]; }
	context.drawImage(imgBack, 0, 0, actualW, actualH);
  context.drawImage(imgCamera, l, t, w, h);
	context.drawImage(imgFrame, 0, 0, actualW, actualH);

	var dataURL = canvasFinal.toDataURL();

	$.ajax({
		type: "POST",
		url: "/recursos/php/saveImage.php",
		data: {
			imgBase64: dataURL
		}
	}).done(function(data) {

	});

}

var initCropImage = function(){
  /*
    ===
    Función para manipular la imágen que el usuario ha selecionado
    ===
  */
  console.log("Funcion para mover, cropear y manipular la imegen seleccionada por el usuario");

};

$(document).ready(function(){

  /*
   ====
   Controlar el mostrar y ocultar las tres diferentes opciones de imagenes
   ====
  */
  $("#d-fondo").on("click", function(){
    $(this).toggleClass("active");
    $("#img-back").toggleClass("hidden");
  });
  /*
   * Se ha deshabilitado por razones de forzar al usuario a usar por default su imagen
  $("#d-foto").on("click", function(){
    $(this).toggleClass("active");
    $("#img-container").toggleClass("hidden");
  });*/
  $("#d-marco").on("click", function(){
    $(this).toggleClass("active");
    $("#img-frame").toggleClass("hidden");
  });

  /*
   ====
   Controlar el mostrar y ocultar el menu principal
   ====
  */
  $("nav span i").on("click", function(){
    $("#menu").toggleClass("hidden");
  });
  $("#menu").on("click", function(){
    $(this).toggleClass("hidden");
  });
  $("#backs .close-menu i, #frames .close-menu i, .inner-menu-collapsed").on("click", function(){
    $("#backs").css({"right":"-40%"});
    $("#frames").css({"right":"-40%"});
    $("body").css({"margin-left":"0"});
    $(".inner-menu-collapsed").addClass("hidden");
  });

    /* ==== Opciones del menu interno ==== */
  $("#menu .main-menu li a").on("click", function(e){
    e.preventDefault();
    $("#menu .main-menu li a").each(function(){
      $(this).removeClass("active");
    });
    $(this).addClass("active");
    var link = $(this).attr("data-link-menu");

    if(link == "backs"){
      $("#backs").css({"right":"0px"});
      $("body").css({"margin-left":"-40%"});
      $(".inner-menu-collapsed").removeClass("hidden");
    }
    if(link == "frames"){
      $("#frames").css({"right":"0px"});
      $("body").css({"margin-left":"-40%"});
      $(".inner-menu-collapsed").removeClass("hidden");
    }

  });

  $(".button.pick").on("click", function(e){
    /*
     ===
     Click para escoger una foto desde el celular
     ===
    */
    e.preventDefault();
    console.log("Button pick click");
    $("#pick").trigger("click");

  });

  $(".button.camera").on("click", function(e){
    /*
     ===
     Click para tomar una foto desde el celular
     ===
    */
    e.preventDefault();
    console.log("Button camera click");
    $("#camera").trigger("click");

  });

  $(".button.terminar").on("click", function(){
    /*
     ====
     Click para mandar los resultados del preview
     ====
    */

    /*
      Se genera un canvas final donde estará toda la información que el usuario ha realizado */
    sendImageToServer();
  });

  /*
   ===
   Función para detectar cualquier cambio en el input
   ===
  */
  document.getElementById("pick").addEventListener("change", readImage, false);
  document.getElementById("camera").addEventListener("change", readImage, false);

  /*
   ====
   Función para cambiar el fondo en el preview
   ====
  */
  $("#backs .back img").on("click", function(){
    var src = $(this).attr("src");
    $("#img-back").attr("src", src);
  });

  /*
   ====
   Función para cambiar el marco en el preview
   ====
  */
  $("#frames .frame img").on("click", function(){
    var src = $(this).attr("src");
    $("#img-frame").attr("src", src);
  });

});
