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
  $(".button.camera").addClass("hidden");
  $(".button.terminar").removeClass("hidden");
  $('#img-camera').cropimg({
    resultWidth:600,
    resultHeight:450,
    onChange: function() {
      console.log("Está cambiando la imagen subida por el usuario");
    }
  });
  $("#img-camera").draggable();
  $(".img-element").draggable();
  $("nav").removeClass("hidden");
  $(".tool-bar-images").removeClass("hidden");
};

var sendImageToServer = function(){

  /*
   =====
   Función para mandar al servidor la imágen producida por el usuario
   =====
  */
  var canvasFinal = document.getElementById('canvas-preview'),
	context = canvasFinal.getContext('2d');
  context.clearRect(0, 0, 600, 450);

  var imgBack = document.getElementById("img-back");
  var imgCamera = document.getElementById("img-camera");
  var imgFrame = document.getElementById("img-frame");

  var actualW = $("#img-frame").width();
  var actualH = $("#img-frame").height();
  /*
   Obtener todos los parametros de la imagen para mandarla al canvas final */

  var str = $("#img-camera").attr("style");
  var w, h, t, l;
  var arrCoor = new Array();
  arrCoor.push(0);
  arrCoor.push(0);
  arrCoor.push(0);
  arrCoor.push(0);

  str = str.replace(/ /g, "");
  str = str.replace(/position: relative;/g, "");
  str = str.replace(/right:auto;/g, "");
  str = str.replace(/bottom:auto;/g, "");
  str = str.split("px;");

  for(var i = 0; i < str.length; i++){
    if(str[i].search("width") == 0){
      arrCoor[0] = str[i].replace("width:", "");
    }
    if(str[i].search("height") == 0){
      arrCoor[1] = str[i].replace("height:", "");
    }
    if(str[i].search("top") == 0){
      arrCoor[2] = str[i].replace("top:", "");
    }
    if(str[i].search("left") == 0){
      arrCoor[3] = str[i].replace("left:", "");
    }
  }

  /*
   Se asegura de que ningun valor sea nulo y se iguala a 0 en el caso de que se cumpla la condición */
  if(arrCoor[0] == "" || arrCoor[0] == null){
    w = 0;
  }else{ w = arrCoor[0]; }
  if(arrCoor[1] == "" || arrCoor[1] == null){
    h = 0;
  }else{ h = arrCoor[1]; }
  if(arrCoor[2] == "" || arrCoor[2] == null){
    t = 0;
  }else{ t = arrCoor[2]; }
  if(arrCoor[3] == "" || arrCoor[3] == null){
    l = 0;
  }else{ l = arrCoor[3]; }

  /*
   * Sección para dibujar el fondo dependiendo si esta seleccionado o no */
  if(!$("#img-back").hasClass("hidden")){
    context.drawImage(imgBack, 0, 0, 600, 450); /* Se dibuja el fondo */
  }

  /*
   * Sección para dibujar la imagen modificada del usuario */
  if(actualW == 600 && actualH == 450){
    /*
     En esta parte se deja los parametros exactamente igual ya que el canvas esta
     en su tamaño original 600 x 450 y no se necesitan mayores cambios. */
    context.drawImage(imgCamera, l, t, w, h); /* Se dibuja la imagen del usuario */
  }else{
    /*
     En esta parte el canvas estará reducido al tamaño del dispositivo móvil del usuario
     y se tendrá que hacer algunos cambios en los parametros obtenidos para arrojar una imagen
     con el tamaño deseado de 600 x 450, es una simple operación de regla de tres. */
    var customL = parseFloat((600 * l) / actualW);
    var customT = parseFloat((450 * t) / actualH);

    var customW = parseFloat((600 * w) / actualW);
    var customH = parseFloat((450 * h) / actualH);

    context.drawImage(imgCamera, customL, customT, customW, customH); /* Se dibuja la imagen del usuario */
  }

  /*
   * Sección para dibujar cada uno de los elementos adicionales dependiendo si estan seleccionados o no */
  if($(".img-elements img").length > 0){
    $(".img-elements img").each(function(){
      var imgFrame = $(this)[0];
      context.drawImage(imgFrame, 20, 20, 100, 100); /* Se dibuja la imagen del usuario */
    });
  }

  /*
   * Sección para dibujar el marco dependiendo si esta seleccionado o no */
  if(!$("#img-frame").hasClass("hidden")){
    context.drawImage(imgFrame, 0, 0, 600, 450); /* Se dibuja el cuadro */
  }

	var dataURL = canvasFinal.toDataURL();
  /*
   ====
   Se envia por medio de ajax la información de la imágen para guardarse en el servidor */
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
  console.log("Funcion para mover, cropear y manipular la imagen seleccionada por el usuario");

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
  $("#d-elementos").on("click", function(){
    $(this).toggleClass("active");
    $("#img-elements").toggleClass("hidden");
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
