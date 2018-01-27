var listaArr=[] ;
var musicaArr=[] ;
var comprueboCambio;
var tiempoStart;
var contadorMusica=0;
var contadorEjercicio=0;
var barraTotal=$('#barra').width();
var anchoBarraTrans=0;
var miroTiempo=1;
var pasaMusica;
var empiezaSesion=true;
var temaTitulo='';
var temas=[];
var colorBarra ='';
var temaSonando ='';
var totalEjercicio=[];
var sonidoEjercicio;
//creo una musica

soundManager.setup({
  // where to find flash audio SWFs, as needed
  url: '/path/to/swf-files/',
  // optional: prefer HTML5 over Flash for MP3/MP4
  preferFlash: false,
  onready: function() {
    // SM2 is ready to play audio!
  }
});









//funcion para sumar el tiempo

function pongo_musica() {


    var musicaTiempo=1;
    var musicaEjercicio=0;

    for(var x=0; x < listaArr.length; x++){

        musicaArr[x] = new Array(2);
        //el nombre de es el mismo en los dos arrays
        musicaArr[x][0]= listaArr[x][0];x
        musicaArr[x][1]=musicaTiempo;

        //creo un array con el ejercicio y el tiempo en el que tiene que empezar la musica
        musicaTiempo=parseFloat(musicaTiempo)+parseFloat(parseFloat(listaArr[x][1])*60);
        /*alert(musicaTiempo);*/

    }



}



/* funcion que pasa lostemas*/


function siguienteTema(sonidoEjercicio,sonidoTema) {

    codigoTema='';


    /* tengo que enviar el nombre del ejaercio en contadorEjercico pa que funcione */

    temas=seleccion_ejercicio(sonidoEjercicio, sonidoTema);



    for (var i = 0; i < temas.length; i++) {
        /*añado el codigo, temaSonando es el id de la cancion que luego tengo que parar*/
        var temaId=temas[i];
        codigoTema=codigoTema+"temaSonando='"+temaId+"';soundManager.createSound({id: '"+temaId+"',url: '"+temaId+"', onfinish: function() {";
    }
    for (var i = 0; i < temas.length; i++) {
        /*cierro las llaves*/
        codigoTema=codigoTema+"}}).play()";
    }
	

    return codigoTema;
}


function final(){

        soundManager.stop(temaSonando);
        //campana final
        soundManager.createSound({
            id:'campana-fin',
            url: 'assets/sonidos/campana.mp3',
            autoPlay: true,
            multiShot: false
        });

        clearInterval(comprueboCambio);
        //pongo el tamaño de la barra como al principio
        anchoBarraTrans =0;
        //pongo el contador de musica a 0
        contadorMusica=0;
        contadorEjercicio=0;

}

function cambio_musica() {

    var cuentaAtras=parseFloat(clock.getTime());
    var tiempoTotal=parseFloat(tiempoStart)
    var tiempoTranscurrido=tiempoTotal-cuentaAtras;


     // la barra crece segun el tiempo

    anchoBarraTrans= (tiempoTranscurrido*barraTotal)/tiempoTotal;
    $('#barraDecreciente').css({ width: anchoBarraTrans });

    //cuando el reloj llega a 0 paro toda la musica
    if(cuentaAtras<1){
        final();
    }

    //fin barra

   if(tiempoTranscurrido==miroTiempo){

		//paro la cancion con el id sonando
       soundManager.destroySound(temaSonando);
       // miro el ejercico para el titulo

       sonidoTema='sonidoTemas';
       sonidoTitulo='sonidoTitulo';

       miroEjercicio=musicaArr[contadorEjercicio][0];
       contadorEjercicio=contadorEjercicio+1;





		// create "mySound"...
	    pasaMusica=soundManager.createSound({
		id:'campana',
	    url: 'assets/sonidos/campana.mp3',
	    autoPlay: false,
		multiShot: false,
		 //cunado el primero termina digo el nombre de la actividad...
		onfinish: function() {
			/*finish uno*/
			
			 soundManager.createSound({
			
			 url: seleccion_ejercicio(miroEjercicio, sonidoTitulo),
			 /*finish2*/
			 onfinish: function() {

				 
			     temaSonando='tema'+seleccion_ejercicio(miroEjercicio, sonidoTitulo);
                 eval(siguienteTema(miroEjercicio,sonidoTema));
	  		 }
			 /*fin finish dos*/
		     }).play();
		    /*fin finsih1*/
	  	   }
		});

		pasaMusica.play();
       contadorMusica=contadorMusica+1;
       miroTiempo= musicaArr[contadorMusica][1]

    }

}
function creo_barra_decreciente() {
    //creamos su barrita de  la barra con el color
    var barraDec=$('<div id="barraDecreciente" style="width:0px; background:#000;display:block;position:absolute;height:20px;opacity:0.5"/>');
    $('#barra').prepend(barraDec);


}

function creo_barras(timeTotal) {
    //borro la barra anterior
    $('#barra').empty();


    var anchoBarra=0;
    var $liNuevoBarra='';

    for(var x=0; x < listaArr.length; x++){

        barraTiempo= listaArr[x][1];
        barraNombre= listaArr[x][0];
        barraColor= 'colorBarras';
        //calculo el ancho de las barras
        anchoBarra= (barraTiempo*barraTotal)/timeTotal;
	

        //creamos su barrita de  la barra con el color
        $liNuevoBarra=$('<div class="barraTiempo" style="width:'+anchoBarra+'px; background:'+seleccion_ejercicio(barraNombre,barraColor)+';"/>');
        $('#barra').append($liNuevoBarra);
    }

}

function calcular_total() {
	 //vacio el array
		listaArr.length = 0;
    var funTiempo;
    var funNombre;
    var timeTotal = 0
    var contador = 0



    $('#divLista').find('li').each(function(){
       

        funTiempo = $(this).children('.ejercicioTiempo').html();
        funNombre = $(this).children('.ejercicioNombre').html();

        listaArr[contador] = new Array(2);
        listaArr[contador][0]= funNombre ;
        listaArr[contador][1]= funTiempo ;


        timeTotal += parseFloat(funTiempo);
        contador=contador+1;

    });


     //reloj
    $('#total').val(timeTotal);
	//anado el tiempo al reloj
	$('#divContenedor').find('.cronometro').each(function(){
		clock.setTime(timeTotal*60);
		});
	
    creo_barras(timeTotal) ;
    tiempoStart= timeTotal*60;
	
	
}

//funcion coloreo barras
function seleccion_ejercicio(ejercicio,envioVuelta) {

/* lleno el los ejercios*/
		switch (ejercicio) {
			case ('Calentamiento'):
                 temaTitulo='assets/sonidos/calentamiento.mp3';
                 temas=["assets/sonidos/calentamiento/tema2.mp3", "assets/sonidos/calentamiento/tema1.mp3" , "assets/sonidos/calentamiento/tema3.mp3","assets/sonidos/calentamiento/tema4.mp3"];
				 colorBarra = 'efb953';
				break;
			case ('Lucha'):
                 temaTitulo='assets/sonidos/lucha.mp3';
                 temas=["assets/sonidos/lucha/tema2.mp3", "assets/sonidos/lucha/tema1.mp3" , "assets/sonidos/lucha/tema3.mp3","assets/sonidos/lucha/tema4.mp3"];
				 colorBarra = '#eb0ff9';
				break;
			case ('Patada Frontal'):
                 temaTitulo='assets/sonidos/patada-frontal.mp3';
                 temas=["assets/sonidos/patada-frontal/tema1.mp3", "assets/sonidos/patada-frontal/tema2.mp3", "assets/sonidos/patada-frontal/tema3.mp3","assets/sonidos/patada-frontal/tema4.mp3"];
                 colorBarra ='#07F0F4';
				break;
				
			case ('Patada Abanico'):
                 temaTitulo='assets/sonidos/patada-abanico.mp3';
                 temas=["assets/sonidos/patada-abanico/tema1.mp3", "assets/sonidos/patada-abanico/tema2.mp3", "assets/sonidos/patada-abanico/tema3.mp3", "assets/sonidos/patada-abanico/tema4.mp3"];
                 colorBarra ='#32F407';
				break;	
			
			case ('Patada Lateral'):
                 temaTitulo='assets/sonidos/patada-lateral.mp3';
                 temas=["assets/sonidos/patada-lateral/tema1.mp3", "assets/sonidos/patada-lateral/tema2.mp3", "assets/sonidos/patada-lateral/tema3.mp3", "assets/sonidos/patada-lateral/tema4.mp3"];
                 colorBarra ='#071FF4';
				break;
			case ('Patada Trasera'):
                 temaTitulo='assets/sonidos/patada-trasera.mp3';
                 temas=["assets/sonidos/patada-trasera/tema1.mp3", "assets/sonidos/patada-trasera/tema2.mp3", "assets/sonidos/patada-trasera/tema3.mp3", "assets/sonidos/patada-trasera/tema4.mp3"];
                 colorBarra ='#5357ef';
				break;
				
			case ('Mixto'):
                 temaTitulo='assets/sonidos/mixto.mp3';
                 temas=["assets/sonidos/mixto/tema1.mp3", "assets/sonidos/mixto/tema2.mp3", "assets/sonidos/mixto/tema3.mp3", "assets/sonidos/mixto/tema4.mp3"];
                 colorBarra ='#1e6f0b';
				break;
				
			case ('Punos'):
                 temaTitulo='assets/sonidos/punos.mp3';
                 temas=["assets/sonidos/punos/tema1.mp3", "assets/sonidos/punos/tema2.mp3", "assets/sonidos/punos/tema3.mp3", "assets/sonidos/punos/tema4.mp3"];
                 colorBarra ='f1f90f';
				break;
				
            case ('Descanso'):
                 temaTitulo='assets/sonidos/descanso.mp3';
                 temas=["assets/sonidos/descanso/tema1.mp3", "assets/sonidos/descanso/tema2.mp3", "assets/sonidos/descanso/tema3.mp3", "assets/sonidos/descanso/tema4.mp3"];
                 colorBarra ='#363636';
                break;

			default:
		}
    /* cargo el array con el pedido*/
        totalEjercicio=[ temaTitulo ,temas , colorBarra];
    /* envio lo que me piden*/
        switch (envioVuelta) {
            case ('sonidoTitulo'):
                    return totalEjercicio[0];
                break;
            case ('sonidoTemas'):
                    return totalEjercicio[1];
                break;
            case ('colorBarras'):
                    return totalEjercicio[2];

                break;
            default:
        }

}




//funcion que solo deja escribir numeros
function soloNumeros(e)
        {
        var keynum = window.event ? window.event.keyCode : e.which;
        if ((keynum == 8) || (keynum == 46))
        return true;
         
        return /\d/.test(String.fromCharCode(keynum));
        }



$(function(){
	
		   
	//cargamos el reloj
	clock = $('.cronometro').FlipClock({
    countdown: true
	});
	
	
	
	//enfocamos el campo para digitar nombres (cuestion de usabilidad)
	$('#liNombre').focus();
	
	//evento al hacer clic en el boton agregar
	$('#btnAgregar').on('click',function(){
		//coloreamos el boton de empezar
		$('#btnEmpezar').css('opacity', '1');
										 
		//obtenemos el nombre digitado por el usuario, y el limite establecido
		//con la funcion parseInt() convertimos de texto a numero
		var $liNombre=$('#liNombre');
        var $txtTiempo=$('#txtTiempo');
		
		
		//verificamos que el campo tiempo no este vacio
		if($.trim($txtTiempo.val())!=''){
			//variable para contener la lista html
			var $ulLista;
			//si la lista html no existe entonces la agregamos al dom
			if(!$('#divLista').find('ul').length) $('#divLista').append('<ul id="sortable"/>');
            $( "#sortable" ).sortable({update: function( event, ui ) {calcular_total($.trim($liNombre.val()));} });
            $( "#sortable" ).disableSelection();

            // hacemos la lista sortable en el movil NO SE SI FUNCIONA



            // fin sortable en el movil


			//obtenemos una instancia de la lista
			$ulLista=$('#divLista').find('ul');
			

            //creamos el item que va a contener el nombre y el boton eliminar
            var $liNuevoNombre=$('<li class="ui-state-default"/>').html('<a class="clsEliminarElemento">&nbsp;</a>'+'<div class="ejercicioNombre">'+$.trim($liNombre.val())+'</div><div class="ejercicioTiempo">'+$.trim($txtTiempo.val())+'</div><div class="ejercicioMin">&nbsp;Min</div>');
			 //lo metmos en el ul
           
                $ulLista.append($liNuevoNombre);
				

				
			 
            calcular_total($.trim($liNombre.val()));
          
		}else{
			alert('Ponle tiempo a tu ejercicio Burra.')
		}
		//limpiamos el campo nombre y lo enfocamos
		$liNombre.val('').focus();
	});
	
	//evento al hacer clic en el boton eliminar de cada item de la lista
	

        $(document).on('click', '.clsEliminarElemento', function() {
		//buscamos la lista
		var $ulLista=$('#divLista').find('ul');
		//buscamos el padre del boton (el tag li en el que se encuentra)
		var $liPadre=$($(this).parents().get(0));
		
		//eliminamos el elemento
		$liPadre.remove();
		//si la listaesta vacia entonces la eliminamos del dom
		if($ulLista.find('li').length==0){
			$ulLista.remove();
			$('#btnEmpezar').css('opacity', '0.4');
		}
		//sumamos el tiempo al tiempo total
		calcular_total();
	});
	

	
	//eliminamos la lista del dom
	$('#btnEliminarTodo').on('click',function(){
		
		//coloreamos el boton de empezar
		$('#btnEmpezar').css('opacity', '0.4');
		$('#divLista ul').remove();
		//sumamos el tiempo al tiempo total
		calcular_total();
		//destruyo la musica
		soundManager.destruct('campana')
	});
	//empezamos
	$('#btnEmpezar').on('click',function(){
        if(empiezaSesion){
             //esto es parq que cueando le das a pause luego actue com play
            empiezaSesion=false ;
            //activo el boton de pausa
            $('#btnPausa').css('opacity', '1');
            $('#btnEmpezar').css('opacity', '0.4');
            pongo_musica();
            //creo la barra decreciente
            creo_barra_decreciente();

        }else{
            $('#btnPausa').css('opacity', '0.4');
            $('#btnEmpezar').css('opacity', '1');
            soundManager.resumeAll();

        }

        clock.start();
        //ponemos la musica para el primer ejercicio
        sonidoEjercicio=listaArr[0][0];
        // creamos un intervalo de actualizacion del reloj
        comprueboCambio = setInterval(cambio_musica, 1000);

	});
	
	//al presionar <ENTER> sobre el campo liNombre llamamos al boton (usabilidad otra vez)
	$('#liNombre').on('keypress',function(eEvento){
		if(eEvento.which==13) $('#btnAgregar').trigger('click');
	});

    $('#btnPausa').on('click',function(){
        //activo el boton de pausa
        $('#btnPausa').css('opacity', '0,4');
        $('#btnEmpezar').css('opacity', '1');
       //paro el reloj
        clock.stop();
        //paro la barra
        clearInterval(comprueboCambio);
        //paro la musica
        soundManager.pauseAll();

    });


});
