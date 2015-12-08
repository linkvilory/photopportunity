function readImage() {

  /*
   ===
   Función para leer el archivo seleccionado o tomado desde celular
   Se leerá el archivo y se pondra en un contenedor de IMG
   Se inicializará el plugin para manipular la imágen
   ===
  */

  var MAX_WIDTH = 650;
  var MAX_HEIGHT = 450;
  var idCanvas = "canvas-camera";
  var idImg = "img-camera";
  console.log("Funcion para leer la imagen seleccionada o tomada por el usuario");
    if ( this.files && this.files[0] ) {

      console.log("Se está leyendo el archivo");
      var canvasPhoto = document.getElementById(idCanvas);
      var context = canvasPhoto.getContext('2d');
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
          context.drawImage(image, center, 0, image.width, image.height);
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
  $('#img-camera').cropimg({
    resultWidth:600,
    resultHeight:450,
    onChange: function() {
      console.log("Está cambiando la imagen subida por el usuario");
    }
  });
};

var initCropImage = function(){
  /*
    ===
    Función para manipular la imágen que el usuario ha selecionado
    ===
  */
  console.log("Funcion para mover, cropear y manipular la imegen seleccionada por el usuario");

};

$(document).ready(function(){

  $("nav span i").on("click", function(){
    $("#menu").toggleClass("hidden");
  });
  $("#menu").on("click", function(){
    $(this).toggleClass("hidden");
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

  /*
   ===
   Función para detectar cualquier cambio en el input
   ===
  */
  document.getElementById("pick").addEventListener("change", readImage, false);
  document.getElementById("camera").addEventListener("change", readImage, false);

});
