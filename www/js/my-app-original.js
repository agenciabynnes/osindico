// Initialize your app
var myApp = new Framework7({
    // Default title for modals
    modalTitle: 'Aptohome',
     // Enable Material theme
    material: true,
    swipePanel: 'left',
    swipePanelNoFollow: 'true',
    swipePanelActiveArea: '80',
    swipeBackPage: false,
    fastClick: true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    notificationCloseOnClick: true,
    notificationHold: 7000,

    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
}); 

//window.screen.lockOrientation('portrait');
//intel.xdk.device.setRotateOrientation("portrait");

// Export selectors engine
var $$ = Dom7;

var $server = 'http://www.aptohome.com.br/admin';

var badgecomunicado = 0;
var badgetransparencia = 0;
var tabindex = 1;
logado();


$("textarea").bind("input", function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")) &&
          $(this).height() < 300
         ) {
        $(this).height($(this).height()+1);
    };
});


$('form,input,select').each(function() {
  if (this.type != "hidden") {
    var $input = $(this);
    $input.attr("tabindex", tabindex);
    tabindex++;
 }
});

function tabenter(event,campo){
    var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //alert("entrei"+tecla+" - "+campo);
    if (tecla==13) {
        //alert("entrei"+tecla+" - "+campo);
        event.preventDefault();
        campo.focus();
        return false;
    }
}

$$('.open-left-panel').on('click', function (e) {
    // 'left' position to open Left panel
    myApp.openPanel('left');
});

$$('.open-right-panel').on('click', function (e) {
    // 'right' position to open Right panel
    myApp.openPanel('right');
});

$$('.panel-close').on('click', function (e) {
    myApp.closePanel();
});

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

///////////////////////// abrir browser
function openURL(alvo){
    //alert(alvo);
    window.open(alvo, '_system', 'location=yes');
}

////////////////////////// rotacao do aparlho

function onportrait(){
    window.screen.lockOrientation('portrait');
}

function onlandscape(){
    window.screen.lockOrientation('landscape');
}


//mainView.router.load({pageName: 'popup-help'});
///////////////////////// help //////////////////////////

    //$$('.help').click(function () {
    function help(){
        //function () { mainView.router.load({pageName: 'popup-help'});
      var mySwiper = myApp.swiper('.swiper-container', {
        pagination:'.swiper-pagination',
        direction: 'horizontal',
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        setWrapperSize: true
      });
        //var mainView = myApp.addView('.view-main');
        //mainView.router.load({pageName: 'popup-help'});
        myApp.popup(".popup-help");
        mySwiper.update(true);
    }
    //});

///////////////////////// login ///////////////////////////

$$('#entrar').on('click', function(){
    $$email = $$('#email').val();
    $$password = $$('#password').val();
    $$token = $$('#token').val();
    $$tipoUsuario = "1";

    $$url = "http://www.aptohome.com.br/admin/functionApplogin.php?email="+$$email+"&password="+$$password+"&token="+$$token+"&tipoUsuario="+$$tipoUsuario+"";
    //$("#videos #internal-page-cont").empty();
    //$("#videos #internal-page-cont").append("<div id='spinner'><img src='img/load.gif'></div>");
    //url+= "&data=" + new Date().getTime();


        $.ajax({
             type: "GET",
             url: $$url,
             async: false,
             beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
              myApp.showIndicator();
         },
         dataType: "json",
         success: function(data){
            myApp.hideIndicator();
            $$.each(data.morador, function (chave,dados)
            {
                localStorage.setItem("moradorEmail", dados.email);
                localStorage.setItem("moradorNome", dados.name);
                localStorage.setItem("moradorIdmorador", dados.idmorador);
                localStorage.setItem("moradorIdcondominio", dados.idcondominio);
                localStorage.setItem("moradorIdbloco", dados.idbloco);
                localStorage.setItem("moradorIddomicilio", dados.iddomicilio);
                localStorage.setItem("comdominioNome", dados.condominio_nome);
                localStorage.setItem("condominioStreet", dados.condominio_street);
                localStorage.setItem("condominioNumber", dados.condominio_number);
                localStorage.setItem("condominioDistrict", dados.condominio_district);
                localStorage.setItem("condominioCityname", dados.condominio_cityname);
                localStorage.setItem("condominioUf", dados.condominio_uf);
                localStorage.setItem("blocoNum", dados.bloco_num);
                localStorage.setItem("domicilioNum", dados.domicilio_num);
                localStorage.setItem("profileImage", dados.profile_image);
                localStorage.setItem("profileImageGuid", dados.profile_image_guid);
                localStorage.setItem("moradorGui", dados.morador_guid);

                profile();
                
                atualizartoken(localStorage.getItem("token"));
                
                if (dados.email!="") {
                myApp.closeModal(".login-screen");
                }
            });
        }
         ,error:function(data){
            myApp.hideIndicator();
            myApp.alert('E-mail e/ou senha inválidos!', 'Aptohome');
         }
        });

});

///////////////////////////// sair ////////////////////////////

//$$('.sair').on('click', function () {
function sair(){
    myApp.confirm('Deseja realmente sair?', function () {
        localStorage.removeItem("moradorEmail");
        localStorage.removeItem("moradorNome");
        localStorage.removeItem("moradorIdmorador");
        localStorage.removeItem("moradorIdcondominio");
        localStorage.removeItem("moradorIdbloco");
        localStorage.removeItem("moradorIddomicilio");
        localStorage.removeItem("comdominioNome");
        localStorage.removeItem("condominioStreet");
        localStorage.removeItem("condominioNumber");
        localStorage.removeItem("condominioDistrict");
        localStorage.removeItem("condominioCityname");
        localStorage.removeItem("condominioUf");
        localStorage.removeItem("blocoNum");
        localStorage.removeItem("domicilioNum");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("profileImageGuid");
        localStorage.removeItem("moradorGui");
        localStorage.removeItem("token");
        window.location = "index.html";
    });
}
//});

///////////////////////////// logado ////////////////////////////

function logado() {
    //logado //
    
    if ((localStorage.getItem("moradorEmail"))&&(localStorage.getItem("moradorEmail")!="undefined")) {
    //alert("email= "+localStorage.getItem("moradorEmail"));
        profile();        
        //console.log(localStorage.getItem("moradorEmail"));
        myApp.closeModal(".login-screen");
    } else {
        myApp.loginScreen();
    } 
}

//////////////////////////// profile /////////////////////////////

function profile(){
//console.log("profile");
    // profile
    var profile_image = "<img src="+localStorage.getItem("profileImage")+">";
    $('.profile_foto').html(profile_image);
    $('.profile_nome').html(localStorage.getItem("moradorNome"));

    if(localStorage.getItem("blocoNum")){
        var bloco_num = localStorage.getItem("blocoNum");
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("comdominioNome") + " <br>Bloco: " + bloco_num + " | Apto: " + localStorage.getItem("domicilioNum");

    $('.profile_detalhes').html(profile_detalhes);
        
        popupBanner();
        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}


////////////////////////////  list edit morador ///////////////////
$$('.edit_morador').on('click', function(){
    $$email = $$('#email').val();
    $$password = $$('#password').val();
    $$token = $$('#token').val();
    $$tipoUsuario = "1";

    $$url = "http://www.aptohome.com.br/admin/functionAppMorador.php?guid="+localStorage.getItem("moradorGui")+"&action=list";

        $.ajax({
             type: "GET",
             url: $$url,
             async: false,
             beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
              myApp.showIndicator();
         },
         dataType: "json",
         success: function(data){
            
            $$.each(data.morador, function (chave,dados)
            {
                $('#moradornome').val(dados.name);
                $('#moradorcpf').val(dados.cpf);
                $('#moradorbirthdate').val(dados.birth_date);
                $('#moradorphonenumber').val(dados.phone_number);
                $('#moradorcellphone').val(dados.cell_phone);
                $('#moradorgender option[value="' + dados.gender + '"]').attr({ selected : "selected" });
                $("#preview-morador").attr('src',localStorage.getItem("profileImage"));
            });
            myApp.hideIndicator();
        }
         ,error:function(data){
            myApp.hideIndicator();
            myApp.alert('Erro! Favor tentar novamente.', 'Aptohome');
         }
        });

});


/////////////////////////// camera morador //////////////////////////////

function cameraMorador() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessMorador, onFailMorador, {
    quality: 50,
    allowEdit : true,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileMorador(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessMorador, onFailMorador, {
    quality: 50,
    allowEdit : true,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessMorador(imageData) {
    var image = document.getElementById('preview-morador');
    image.src = "data:image/jpeg;base64," + imageData;
    //$(".img-preview::before").css("content", "Clique para editar");
    //document.getElementById('upload-ocorrencia').value = imageData;
}
function onFailMorador(message) {
//alert('Failed because: ' + message);
}

//////////////////////// camera morador options ////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('editmorador', function (page) {
    var actionOptionCameraMorador = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraMorador();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileMorador();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraMorador').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraMorador);
        //alert("but edit morador");
    });
    
});

/////////////////////////// acao editar morador ////////////////////////

$('#buteditmorador').on('click', function(){
    //alert("enviar");
    if (($$('#moradornome').val()!="") &&  ($$('#moradorcpf').val()!="") && ($$('#moradorphonenumber').val()!="")){

            enviarmorador();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }
});

/////////////////////////// inserir morador ///////////////////////////
function enviarmorador()
{
 
        imagem = $('#preview-morador').attr("src");
        $$guid = localStorage.getItem("moradorGui");
        $$imageguid = localStorage.getItem("profileImageGuid");
        $$idmorador = localStorage.getItem("moradorIdmorador");
        $$moradornome = $$('#moradornome').val();
        $$moradorcpf = $$('#moradorcpf').val();
        $$moradorbirthdate = $$('#moradorbirthdate').val();
        $$moradorphonenumber = $$('#moradorphonenumber').val();
        $$moradorcellphone = $$('#moradorcellphone').val();
        $$moradorgender = $$('#moradorgender').val();
        $$moradorpassword = $$('#moradorpassword').val();


        $('#forminserirmorador').each (function(){
          this.reset();
        });
        $("#preview-morador").attr('src',"");
 
        $$url = "http://www.aptohome.com.br/admin/functionAppMorador.php?";
        $.ajax({
             type: "post",
             url: $$url,
             data: "txtName="+$$moradornome+"&guid="+$$guid+"&guid_image="+$$imageguid+"&idmorador="+$$idmorador+"&imagem="+imagem+"&txtCpf="+$$moradorcpf+"&txtBirth_date="+$$moradorbirthdate+"&txtPhone_number="+$$moradorphonenumber+"&txtCell_phone="+$$moradorcellphone+"&rdbGender="+$$moradorgender+"&txtPassword="+$$moradorpassword+"&action=add",
             async: false,
             beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
              myApp.showIndicator();
         },
         dataType: "json",
         success: function(data){
            myApp.hideIndicator();
            $$.each(data.morador, function (chave,dados)
            {
                localStorage.setItem("moradorNome", "");
                localStorage.setItem("moradorNome", dados.name);
                localStorage.setItem("profileImage", "");
                localStorage.setItem("profileImage", dados.profile_image);
                localStorage.setItem("profileImageGuid", "");
                localStorage.setItem("profileImageGuid", dados.profile_image_guid);

                profile();
                
                myApp.hideIndicator();
                myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'index'});});
            });
        }
         ,error:function(data){
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
         }
        });

}

////////////////////////////////  cameras de seguranca ///////////////////////////
function camerasdeseguranca(){

    myApp.showIndicator();

        $.ajax({
            data : "get",
            url: "http://www.aptohome.com.br/admin/functionAppCamera.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            success: function(data) {
                
                if (data!="") {
                    myApp.hideIndicator();
                    $('#camerasdeseguranca-cont').html(data);
                }else{
                    myApp.hideIndicator();
                    $('#camerasdeseguranca-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            }
             ,error:function(data){
                console.log(data);
                myApp.hideIndicator();
                $('#camerasdeseguranca-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
    //alert("Entrei");


}

//////////////////////////////// exibe cameras de seguranca //////////////////////
function exibecamerasdeseguranca(data){

    //$('#exibecamerasdeseguranca-cont').html(data);
    //intel.xdk.device.setRotateOrientation("landscape");
    //onlandscape();
    $("#exibecamerasdeseguranca-cont").attr('src',data);
    
}


// Pull to refresh content
var ptrContent = $$('.muraldeanuncios');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        muraldeanuncios();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

/////////////////////////////////////  mural de anuncios ///////////////////////
function muraldeanuncios(){

    myApp.showIndicator();
    //$('#muraldeanuncios-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppAnuncios.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                //console.log(data);
                if (data!=null) {
                    var qtd = data.anuncio.length;
                    var imgAnuncio = "";
                    for (var i = 0; i < qtd; i++) {
                        if (data.anuncio[i].urlAnuncio!="images/sem_foto_cont.jpg") {
                            imgAnuncio = '<div class="card-content"><img src="'+data.anuncio[i].urlAnuncio+'" width="100%"></div>';
                        }
                        $('#muraldeanuncios-cont').append('<li><a href="#muraldeanuncioscont" onclick="muraldeanuncioscont('+data.anuncio[i].idAnuncio+');" class="item-link"><div class="card-cont ks-facebook-card"><div class="card-header"><div class="ks-facebook-avatar"><img src="'+data.anuncio[i].urlAvatar+'" width="34"></div><div class="ks-facebook-name">'+data.anuncio[i].nameMorador+'</div><div class="ks-facebook-date">'+data.anuncio[i].numBlocoApto+'</div></div>'+imgAnuncio+'<div class="card-content-inner"><div class="facebook-date">'+data.anuncio[i].dataAnuncio+'</div><p class="facebook-title">'+data.anuncio[i].titleAnuncio+'</p><p class="color-green facebook-price">'+data.anuncio[i].priceAnuncio+'</p></div></div></div></a></li>');
                        imgAnuncio = "";
                    }

                myApp.hideIndicator();
                }else{
                    myApp.hideIndicator();
                    $('#muraldeanuncios-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            }
             ,error:function(data){
                myApp.hideIndicator();
                $('#muraldeanuncios-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
}

/////////////////////////////////////  mural de anuncios conteudo /////////////////////////
function muraldeanuncioscont(id){

    myApp.showIndicator();
    $('#muraldeanuncioscont-cont').html("");
    var datamural = "";
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppAnuncios.php?idanuncio="+id+"&action=list",
            dataType : "json",
            success: function(data) {

                    var qtd = data.anuncio.length;
                    var imgAnuncio = "";
                    for (var i = 0; i < qtd; i++) {
                        if (data.anuncio[i].urlAnuncio!="images/sem_foto_cont.jpg") {
                            imgAnuncio = '<div class="card-content-cont"><img src="'+data.anuncio[i].urlAnuncio+'" width="100%"></div>';
                        }
                        datamural += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+imgAnuncio+
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.anuncio[i].urlAvatar+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.anuncio[i].nameMorador+'</div>'+
                                                '<div class="ks-facebook-date">'+data.anuncio[i].numBlocoApto+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<div class="facebook-date">'+data.anuncio[i].dataAnuncio+'</div>'+
                                                '<p class="facebook-title">'+data.anuncio[i].titleAnuncio+'<br>'+data.anuncio[i].descricaoAnuncio+'</p>'+
                                                '<p class="color-green facebook-price">'+data.anuncio[i].priceAnuncio+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                            imgAnuncio = "";
                        $('#muraldeanuncioscont-cont').html(datamural);
                        if (data.anuncio[i].whatsappAnuncio=="1") {
                            //$('.whatsapp').addClass("visivel");
                        };
                        $('.whatsapp').attr('onclick',"cordova.plugins.Whatsapp.send('"+data.anuncio[i].phoneAnuncio+"');");
                        $('.tel-anuncio').attr('onclick',"navigator.app.loadUrl('tel:"+data.anuncio[i].phoneAnuncio+", { openExternal:true }');");
                    };

                myApp.hideIndicator();
            }
             ,error:function(data){
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
}

///////////////////////////// camera anuncios ///////////////////////////

function cameraAnuncios() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessAnuncios, onFailAnuncios, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileAnuncios(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessAnuncios, onFailAnuncios, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessAnuncios(imageData) {
    var image = document.getElementById('preview-anuncios');
    image.src = "data:image/jpeg;base64," + imageData;
    //document.getElementById('upload-ocorrencia').value = imageData;
}
function onFailAnuncios(message) {
//alert('Failed because: ' + message);
}

//////////////////////// camera anuncios options /////////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirmuraldeanuncios', function (page) {
    var actionOptionCameraAnuncios = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraAnuncios();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileAnuncios();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraanuncios').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraAnuncios);
        //alert("but inserir ocorrencias");
    });
    
});

/////////////////////////// acao inserir anuncios ////////////////////////////

$('#butinseriranuncios').on('click', function(){
    //alert($$('#txttitanuncio').val()+" - "+$$('#txtanuncio').val()+" - "+$$('#txtvaloranuncio').val());
    if (($$('#txttitanuncio').val()!="") && ($$('#txtanuncio').val()!="") && ($$('#txtphonenumber').val()!="") && ($$('#txtvaloranuncio').val()!="")) {

            enviaranuncios();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }
});

///////////////////////////// inserir anuncios ///////////////////////////
function enviaranuncios()
{
 
        imagem = $('#preview-anuncios').attr("src");
        $$idmorador = localStorage.getItem("moradorIdmorador");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$txttitanuncio = $$('#txttitanuncio').val();
        $$txtDescricao = $$('#txtanuncio').val();
        $$txtPhoneNumber = $$('#txtphonenumberanuncio').val();
        $$txtWhatsapp = $$('#txtwhatsappanuncio').val();
        $$txtvalor = $$('#txtvaloranuncio').val();

        $('#forminseriranuncios').each (function(){
          this.reset();
        });
        $("#preview-anuncios").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppAnuncios.php?', {
            type: "post",
            data: "idmorador="+$$idmorador+"&imagem="+imagem+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&txtTitulo="+$$txttitanuncio+"&txtDescricao="+$$txtDescricao+"&txtvalor="+$$txtvalor+"&txtPhoneNumber="+$$txtPhoneNumber+"&txtWhatsapp="+$$txtWhatsapp+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Anúncio inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'muraldeanuncios'}); muraldeanuncios();});
            }
          });
}


// Pull to refresh content
var ptrContent = $$('.livroocorrencias');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        livroocorrencias();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

/////////////////////////////////////  livro de ocorrencias ///////////////////////////
function livroocorrencias(){

    myApp.showIndicator();
    //$('#ocorrencias-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppOcorrencia.php?idmorador="+localStorage.getItem("moradorIdmorador")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    var qtd = data.ocorrencia.length;
                    for (var i = 0; i < qtd; i++) {

                        $('#ocorrencias-cont').append('<li><a href="#livroocorrenciascont" onclick="livroocorrenciascont('+data.ocorrencia[i].idOcorrencia+')" class="item-link item-content"><div class="item-media"><img src="'+data.ocorrencia[i].urlOcorrencia+'"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.ocorrencia[i].nameMorador+'</div></div><div class="item-subtitle">'+data.ocorrencia[i].numMorador+' - '+data.ocorrencia[i].dataOcorrencia+'</div><div class="item-text">'+data.ocorrencia[i].descricaoOcorrencia+'</div></div></a></li>');
                    }
                    myApp.hideIndicator();
                }else{
                    myApp.hideIndicator();
                    $('#ocorrencias-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }

            },error:function(data){
                myApp.hideIndicator();
                $('#ocorrencias-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
}

/////////////////////////////////////  livro de ocorrencias conteudo ///////////////////////////
function livroocorrenciascont(id){

    myApp.showIndicator();
    $('#livroocorrenciascont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppOcorrencia.php?idocorrencia="+id+"&action=list",
            dataType : "json",
            success: function(data) {
                var qtd = data.ocorrencia.length;
                for (var i = 0; i < qtd; i++) {

                    var imgOcorrencia = "";
                    
                    if (data.ocorrencia[i].urlOcorrencia!="images/sem_foto_icone.jpg") {
                        var imgOcorrencia = '<div class="card-content-cont"><img src="'+data.ocorrencia[i].urlOcorrencia+'" width="100%"></div>';
                    }

                    $('#ocorrenciascont-cont').html('<li><div class="card-cont ks-facebook-card">'+imgOcorrencia+'<div class="card-header"><div class="ks-facebook-avatar"><img src="'+data.ocorrencia[i].urlMorador+'" width="34"></div><div class="ks-facebook-name">'+data.ocorrencia[i].nameMorador+'</div><div class="ks-facebook-date">'+data.ocorrencia[i].numMorador+'</div></div><div class="card-content-inner"><div class="facebook-date">'+data.ocorrencia[i].dataOcorrencia+'</div><p class="facebook-title">'+data.ocorrencia[i].descricaoOcorrencia+'</p></div></div></div></li>');
                    //$('#ocorrenciascont-cont').html('<li><div class="item-media"><img src="'+data.ocorrencia[i].urlOcorrencia+'"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.ocorrencia[i].nameMorador+'</div></div><div class="item-subtitle">'+data.ocorrencia[i].numMorador+' - '+data.ocorrencia[i].dataOcorrencia+'</div><div class="item-text">'+data.ocorrencia[i].descricaoOcorrencia+'</div></div></li>');
                    imgAnuncio = "";
                }
                myApp.hideIndicator();
            }
        });
}

///////////////////////////// camera ocorrencia ///////////////////////////

function cameraOcorrencia() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessOcorrencias, onFailOcorrencias, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileOcorrencia(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessOcorrencias, onFailOcorrencias, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessOcorrencias(imageData) {
    var image = document.getElementById('preview-ocorrencias');
    image.src = "data:image/jpeg;base64," + imageData;
    //document.getElementById('upload-ocorrencia').value = imageData;
}
function onFailOcorrencias(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera ocorrencia options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirocorrencias', function (page) {
    var actionOptionCameraOcorrencia = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraOcorrencia();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileOcorrencia();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraOcorrencias').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraOcorrencia);
        //alert("but inserir ocorrencias");
    });
    
});

///////////////////////////// acao inserir ocorrencias ///////////////////////////

$('#butinserirocorrencias').on('click', function(){
    //alert("enviar");
    if (($$('#idtipoocorrencia').val()!="") &&  ($$('#idlocalocorrencia').val()!="") && ($$('#txtocorrencia').val()!="")){

            enviarocorrencias();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }
});

///////////////////////////// inserir ocorrencias ///////////////////////////
function enviarocorrencias()
{
 
        imagem = $('#preview-ocorrencias').attr("src");
        $$idmorador = localStorage.getItem("moradorIdmorador");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$idtipoocorrencia = $$('#idtipoocorrencia').val();
        $$idlocalocorrencia = $$('#idlocalocorrencia').val();
        $$txtDescricao = $$('#txtocorrencia').val();

        $('#forminserirocorrencias').each (function(){
          this.reset();
        });
        $("#preview-ocorrencias").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppOcorrencia.php?', {
            type: "post",
            data: "idmorador="+$$idmorador+"&imagem="+imagem+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&idtipoocorrencia="+$$idtipoocorrencia+"&idlocalocorrencia="+$$idlocalocorrencia+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Ocorrência inserida com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'livroocorrencias'}); livroocorrencias();});
            }
          });
}


// Pull to refresh content
var ptrContent = $$('.transparenciadecontas');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        transparenciadecontas();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// transparencia de contas ///////////////////////////
function transparenciadecontas(){

    myApp.showIndicator();

    $('.badgetransparencia').html();
    badgetransparencia=0;
    //var datatransparencia;
    //$('#transparenciadecontas-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppTransparencia.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datatransparencia = "";
                    var qtd = data.transparencia.length;
                    for (var i = 0; i < qtd; i++) {
                    datatransparencia += '<li>'+
                                              '<a href="#transparenciadecontascont" onclick="transparenciadecontascont('+data.transparencia[i].idTransparencia+')" class="item-link item-content">'+
                                                '<div class="item-media">'+
                                                  '<img src="'+data.transparencia[i].urlSindico+'" >'+
                                                '</div>'+
                                                '<div class="item-inner">'+
                                                  '<div class="item-title-row">'+
                                                    '<div class="item-title">'+data.transparencia[i].tituloTransparencia+'</div>'+
                                                  '</div>'+
                                                  '<div class="item-subtitle">'+data.transparencia[i].dataTransparencia+'</div>'+
                                                  '<div class="item-text">'+data.transparencia[i].descricaoTransparencia+'</div>'+
                                                '</div>'+
                                              '</a>'+
                                            '</li>';
                    $('#transparenciadecontas-cont').html(datatransparencia);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#transparenciadecontas-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                $('#transparenciadecontas-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}


///////////////////////////////////// transparencia de contas conteudo ///////////////////////////
function transparenciadecontascont(id){

    if (badgetransparencia>0) {
        badgetransparencia--;
        $('.badgetransparencia').html('<span class="badge bg-red">'+badgetransparencia+'</span>');
    }

    myApp.showIndicator();
    //var datatransparencia;
    $('#transparenciadecontascont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppTransparencia.php?idtransparencia="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datatransparencia = "";
                var qtd = data.transparencia.length;
                var imgTransparencia = "";
                for (var i = 0; i < qtd; i++) {

                if (data.transparencia[i].urlTransparencia!="images/sem_foto_icone.jpg") {
                    imgTransparencia = '<div class="card-content-cont">'+
                                                '<img src="'+data.transparencia[i].urlTransparencia+'" width="100%">'+
                                            '</div>';
                }

                datatransparencia += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgTransparencia +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.transparencia[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.transparencia[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">'+data.transparencia[i].dataTransparencia+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.transparencia[i].descricaoTransparencia+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgTransparencia = "";
                $('#transparenciadecontascont-cont').html(datatransparencia);
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera transparencia ///////////////////////////

function cameraTransparencia() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessTransparencia, onFailTransparencia, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileTransparencia(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessTransparencia, onFailTransparencia, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessTransparencia(imageData) {
    var image = document.getElementById('preview-transparencia');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailTransparencia(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera transparencia options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirtransparenciadecontas', function (page) {
    var actionOptionCameraTransparencia = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraTransparencia();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileTransparencia();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraTransparencia').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraTransparencia);
    });
    
});

///////////////////////////// acao inserir transparencia ///////////////////////////
$('#butinserirtransparencia').on('click', function(){
    //alert("enviar");

    if (($$('#txttit').val()!="") &&  ($$('#txtdescricao').val()!="")) {

            enviartransparencia();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir transparencia ///////////////////////////
function enviartransparencia()
{
 
 //alert("entrei");
        imagem = $('#preview-transparencia').attr("src");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$idsindico = "1";
        $$txtTitulo = $$('#txttit').val();
        $$txtDescricao = $$('#txtdescricao').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $("#preview-transparencia").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppTransparencia.php?', {
            type: "post",
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if ((data!="ok") && (data!=" ok")) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Transparência inserida com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'transparenciadecontas'}); transparenciadecontas();});
            }
          });
}


// Pull to refresh content
var ptrContent = $$('.servico');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        servico();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// servicos terceirizados ///////////////////////////
function servico(){

    myApp.showIndicator();
    //var datatransparencia;
    //$('#servico-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppServico.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var dataservico = "";
                    var qtd = data.servico.length;
                    for (var i = 0; i < qtd; i++) {

                        dataservico += '<li>'+
                                                  '<a href="#servicocont" onclick="servicocont('+data.servico[i].idServico+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.servico[i].urlServico+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+data.servico[i].tituloServico+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+data.servico[i].descricaoServico+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#servico-cont').html(dataservico);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#servico-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                myApp.hideIndicator();
                $('#servico-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}


///////////////////////////////////// servico conteudo ///////////////////////////
function servicocont(id){

    myApp.showIndicator();
    //var dataservico;
    $('#servicocont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppServico.php?idservico="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var dataservico = "";
                var qtd = data.servico.length;
                var imgServico = "";
                for (var i = 0; i < qtd; i++) {

                if (data.servico[i].urlServico!="images/sem_foto_icone.jpg") {
                    imgServico = '<div class="card-content-cont">'+
                                                '<img src="'+data.servico[i].urlServico+'" width="100%">'+
                                            '</div>';
                }

                dataservico += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgServico +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.servico[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.servico[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">Condomínio: '+localStorage.getItem("comdominioNome")+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.servico[i].tituloServico+'</p>'+
                                                '<p class="item-text">'+data.servico[i].descricaoServico+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgServico = "";
                $('#servicocont-cont').html(dataservico);
                $('.tel-anuncio').attr('onclick',"navigator.app.loadUrl('tel:"+data.servico[i].phoneServico+", { openExternal:true }');");
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera servico ///////////////////////////

function cameraServico() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessServico, onFailServico, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileServico(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessServico, onFailServico, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessServico(imageData) {
    var image = document.getElementById('preview-servico');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailServico(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera servico options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirservico', function (page) {
    var actionOptionCameraServico = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraServico();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileServico();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraServico').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraServico);
    });
    
});

///////////////////////////// acao inserir servico ///////////////////////////
$('#butinserirservico').on('click', function(){
    //alert("enviar");

    if (($$('#txttitservico').val()!="") && ($$('#txtdescricaoservico').val()!="") && ($$('#txtphoneservico').val()!="")) {

            enviarservico();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir servico ///////////////////////////
function enviarservico()
{
 
 //alert("entrei");
        imagem = $('#preview-servico').attr("src");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$idsindico = "1";
        $$txtTitulo = $$('#txttitservico').val();
        $$txtDescricao = $$('#txtdescricaoservico').val();
        $$txtPhone = $$('#txtphoneservico').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $('#forminserirservico').each (function(){
          this.reset();
        });
        $("#preview-servico").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppServico.php?', {
            type: "post",
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&txtTitulo="+$$txtTitulo+"&txtPhone="+$$txtPhone+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Serviço inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'servico'}); servico();});
            }
          });
}


// Pull to refresh content
var ptrContent = $$('.cronograma');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        cronograma();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// cronograma de funcionarios ///////////////////////////
function cronograma(){

    myApp.showIndicator();
    //var datatransparencia;
    //$('#cronograma-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppCronograma.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacronograma = "";
                    var qtd = data.cronograma.length;
                    for (var i = 0; i < qtd; i++) {

                        datacronograma += '<li>'+
                                                  '<a href="#cronogramacont" onclick="cronogramacont('+data.cronograma[i].idCronograma+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.cronograma[i].urlCronograma+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+data.cronograma[i].tituloCronograma+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+data.cronograma[i].descricaoCronograma+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#cronograma-cont').html(datacronograma);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#cronograma-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                myApp.hideIndicator();
                $('#cronograma-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}


///////////////////////////////////// cronograma conteudo ///////////////////////////
function cronogramacont(id){

    myApp.showIndicator();
    //var dataservico;
    $('#cronogramacont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppCronograma.php?idcronograma="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datacronograma = "";
                var qtd = data.cronograma.length;
                var imgCronograma = "";
                for (var i = 0; i < qtd; i++) {

                if (data.cronograma[i].urlCronograma!="images/sem_foto_icone.jpg") {
                    imgCronograma= '<div class="card-content-cont">'+
                                                '<img src="'+data.cronograma[i].urlCronograma+'" width="100%">'+
                                            '</div>';
                }

                datacronograma += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgCronograma +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.cronograma[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.cronograma[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">Condomínio: '+localStorage.getItem("comdominioNome")+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.cronograma[i].tituloCronograma+'</p>'+
                                                '<p class="item-text">'+data.cronograma[i].descricaoCronograma+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgCronograma = "";
                $('#cronogramacont-cont').html(datacronograma);
                $('.tel-cronograma').attr('onclick',"navigator.app.loadUrl('tel:"+data.cronograma[i].phoneCronograma+", { openExternal:true }');");
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera Cronograma ///////////////////////////

function cameraCronograma() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessCronograma, onFailServico, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileCronograma(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessCronograma, onFailCronograma, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessCronograma(imageData) {
    var image = document.getElementById('preview-cronograma');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailCronograma(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera Cronograma options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserircronograma', function (page) {
    var actionOptionCameraCronograma = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraCronograma();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileCronograma();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraCronograma').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraCronograma);
    });
    
});

///////////////////////////// acao inserir Cronograma ///////////////////////////
$('#butinserircronograma').on('click', function(){
    //alert("enviar");

    if (($$('#txttitcronograma').val()!="") && ($$('#txtdescricaocronograma').val()!="") && ($$('#txtphonecronograma').val()!="")) {

            enviarcronograma();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir Cronograma ///////////////////////////
function enviarcronograma()
{
 
 //alert("entrei");
        imagem = $('#preview-cronograma').attr("src");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$idsindico = "1";
        $$txtTitulo = $$('#txttitcronograma').val();
        $$txtDescricao = $$('#txtdescricaocronograma').val();
        $$txtPhone = $$('#txtphonecronograma').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $('#forminserircronograma').each (function(){
          this.reset();
        });
        $("#preview-cronograma").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppCronograma.php?', {
            type: "post",
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&txtTitulo="+$$txtTitulo+"&txtPhone="+$$txtPhone+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Cronograma inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'cronograma'}); cronograma();});
            }
          });
}


// Pull to refresh content
var ptrContent = $$('.comunicado');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        comunicado();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// Comunicado ///////////////////////////
function comunicado(){

    myApp.showIndicator();
    //var datatransparencia;
    $('.badgecomunicado').html();
    badgecomunicado=0;
    //$('#comunicado-cont').html("");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunicado.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacomunicado = "";
                    var qtd = data.comunicado.length;
                    for (var i = 0; i < qtd; i++) {
                        datacomunicado += '<li>'+
                                                  '<a href="#comunicadocont" onclick="comunicadocont('+data.comunicado[i].idComunicado+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.comunicado[i].urlSindico+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+data.comunicado[i].tituloComunicado+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-subtitle">'+data.comunicado[i].dataComunicado+'</div>'+
                                                      '<div class="item-text">'+data.comunicado[i].descricaoComunicado+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#comunicado-cont').html(datacomunicado);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#comunicado-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }            
            },error: function(data) {
                myApp.hideIndicator();
                $('#comunicado-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}


///////////////////////////////////// comunicado conteudo ///////////////////////////
function comunicadocont(id){

    
    if (badgecomunicado>0) {
        badgecomunicado--;
        $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
    } else {
        $('.badgecomunicado').html('');
    }
    
    myApp.showIndicator();
    //var datatransparencia;
    $('#comunicadocont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunicado.php?idcomunicado="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datacomunicado = "";
                var qtd = data.comunicado.length;
                var imgTransparencia = "";
                var imgComunicado = "";
                for (var i = 0; i < qtd; i++) {

                if (data.comunicado[i].urlComunicado!="images/sem_foto_icone.jpg") {
                    imgComunicado = '<div class="card-content-cont">'+
                                                '<img src="'+data.comunicado[i].urlComunicado+'" width="100%">'+
                                            '</div>';
                }

                datacomunicado += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgComunicado +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.comunicado[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.comunicado[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">'+data.comunicado[i].dataComunicado+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.comunicado[i].descricaoComunicado+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgComunicado = "";
                $('#comunicadocont-cont').html(datacomunicado);
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera comunicado ///////////////////////////

function cameraComunicado() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessComunicado, onFailComunicado, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileComunicado(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessComunicado, onFailComunicado, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessComunicado(imageData) {
    var image = document.getElementById('preview-comunicado');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailComunicado(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera comunicado ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserircomunicado', function (page) {
    var actionOptionCameraComunicado = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraComunicado();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileComunicado();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraComunicado').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraComunicado);
    });
    
});

///////////////////////////// acao inserir comunicado ///////////////////////////
$('#butinserircomunicado').on('click', function(){
    //alert("enviar");

    if (($$('#txttitcomunicado').val()!="") &&  ($$('#txtdescricaocomunicado').val()!="")) {

            enviarcomunicado();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir comunicado ///////////////////////////
function enviarcomunicado()
{
 
 //alert("entrei");
        imagem = $('#preview-comunicado').attr("src");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$idsindico = "1";
        $$txtTitulo = $$('#txttitcomunicado').val();
        $$txtDescricao = $$('#txtdescricaocomunicado').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $("#preview-comunicado").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppComunicado.php?', {
            type: "post",
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if ((data!="ok") && (data!=" ok")) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Aviso inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'comunicado'}); comunicado();});
            }
          });
}




// Pull to refresh content
var ptrContent = $$('.banner');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        banner();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// Popup Banner ///////////////////////////

/*$('.back-banner').on('click', function(){
    mainView.router.load({pageName: 'banner'});
});*/

function popupBanner(){
//console.log("popupBanner");
    //$('#comunicado-cont').html("");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppBanner.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                
                if (data!=null) {
                    //console.log(data);
                    myApp.hideIndicator();
                    var databanner = "";
                    var qtd = data.banner.length;
                    var idRand = Math.floor(Math.random() * qtd);
                    var idBanner = data.banner[idRand].idBanner;
                    bannercont(idBanner);
                }             
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// Listar Banner ///////////////////////////


function banner(){

    myApp.showIndicator();

    //$('#comunicado-cont').html("");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppBanner.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var databanner = "";
                    var qtd = data.banner.length;
                    for (var i = 0; i < qtd; i++) {

                        databanner += '<div class="img-banner" id="img-banner">'+
                                            '<a href="#bannercont" onclick="bannercont('+data.banner[i].idBanner+')" class="item-link"><img src="'+data.banner[i].urlBanner+'" ></a>'+
                                        '</div>';
                    
                    }
                    $('#banner-cont').html(databanner);
                }else{
                    myApp.hideIndicator();
                    $('#banner-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }               
            },error: function(data) {
                myApp.hideIndicator();
                $('#banner-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// banner conteudo ///////////////////////////
function bannercont(id){
//console.log(id);
    myApp.showIndicator();
    //var datatransparencia;
    $('.banner-full').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppBanner.php?idbanner="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var databanner = "";
                var qtd = data.banner.length;
                var imgBanner = "";
                var linkurl = "";
                for (var i = 0; i < qtd; i++) {

                if (data.banner[i].urlBanner!="images/sem_foto_icone.jpg") {
                    imgBanner = '<img src="'+data.banner[i].urlBanner+'">';
                }
                if (data.banner[i].url!="") {
                    linkurl = "onclick=openURL('"+data.banner[i].url+"');";
                }
                databanner = '<a href="#" '+linkurl+'>'+imgBanner+'</a>';
                imgBanner = "";
                
                $('.banner-full').html(databanner);
                myApp.popup(".popup-bannercont");
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });

        /*var lastTapTime="0";
        $$(document).on("click", ".banner-full", function(e){
            //try detect double tap
            var timeDiff = (new Date()).getTime() - lastTapTime;
            if(timeDiff < 300){ 
                //wow! double tap! 
                //myApp.addNotification({ hold: 800, title: '', message: 'dOUBLE TAP HERE!' });
            } 
                lastTapTime = (new Date()).getTime();
        });*/


}

///////////////////////////// camera banner ///////////////////////////

function cameraBanner() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessBanner, onFailBanner, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileBanner(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessBanner, onFailBanner, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessBanner(imageData) {
    var image = document.getElementById('preview-banner');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailBanner(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera banner ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirbanner', function (page) {
    var actionOptionCameraBanner = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            // First button
            {
                text: 'Câmera',
                onClick: function () {
                    cameraBanner();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileBanner();
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.optionCameraBanner').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionCameraBanner);
    });
    
});

///////////////////////////// acao inserir banner ///////////////////////////
$('#butinserirbanner').on('click', function(){
    //alert("enviar");
    //if ($$('#txttitbanner').val()!="") {
    if (($$('#txttitbanner').val()!="") &&  ($$('#preview-banner').attr('src')!="")) {

            enviarbanner();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir banner ///////////////////////////
function enviarbanner()
{
 
 //alert("entrei");
        imagem = $('#preview-banner').attr("src");
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$txtTitulo = $$('#txttitbanner').val();
        $$txtUrl= $$('#txturlbanner').val();
        $$txtlink= $$('#txtlinkbanner').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $("#preview-banner").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppBanner.php?', {
            type: "post",
            data: "imagem="+imagem+"&idcondominio="+$$idcondominio+"&txtTitulo="+$$txtTitulo+"&txtUrl="+$$txtUrl+"&txtlink="+$$txtlink+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if ((data!="ok") && (data!=" ok")) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Banner inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'banner'}); banner();});
            }
          });
}






///////////////////////////// agendamento espaço /////////////////////////////

    var localSelected = "1";
    var localDescSelected = "Salão de festas";

    function agendamentodeespaco() {
        //console.log("entrei");
        var mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
        mesSelected = mesSelected+++1;
        var diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
        
        if (diaSelected<10) {
            diaSelected = "0"+diaSelected;
        }
        var anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
        var dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
        
        var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

        $('.selecionarespaco').html(localDescSelected);
        $("#dataagendamento").val(dataSelectedBr);
        espaco(dataSelected,localSelected);
    }

myApp.onPageInit('agendamentodeespaco', function (page) {
    var actionOptionAgendamento = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Selecione uma opção',
                label: true
            },
            {
                text: 'Salão de festas',
                onClick: function () {
                    localSelected = "1";
                    localDescSelected = "Salão de festas";
                    espaco(dataSelected,localSelected);
                    $('.selecionarespaco').html(localDescSelected);
                }
            },
            {
                text: 'Piscina',
                onClick: function () {
                    localSelected = "2";
                    localDescSelected = "Piscina";
                    espaco(dataSelected,localSelected);
                    $('.selecionarespaco').html(localDescSelected);
                }
            },
            {
                text: 'Churrasqueira',
                onClick: function () {
                    localSelected = "3";
                    localDescSelected = "Churrasqueira";
                    espaco(dataSelected,localSelected);
                    $('.selecionarespaco').html(localDescSelected);
                }
            },
            {
                text: 'Quadra',
                onClick: function () {
                    localSelected = "4";
                    localDescSelected = "Quadra";
                    espaco(dataSelected,localSelected);
                    $('.selecionarespaco').html(localDescSelected);
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                color: 'red'
            }
        ]
    ];
    $$('.actionOptionAgendamento').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionOptionAgendamento);
    });
    
});


function espaco(dia,idlocalespaco){

    myApp.showIndicator();
    $('#espaco-cont').html("");
    $$('#calendar-inline-container div span').removeClass("marcado");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&idlocalespaco="+idlocalespaco+"&action=list",
            dataType : "json",
            success: function(data) {
                myApp.hideIndicator();
                var dataespaco = "";
                var qtd = data.espaco.length;
                for (var i = 0; i < qtd; i++) {

                    var splithoraini = data.espaco[i].horaIni;
                    splithoraini = splithoraini.split(" ");

                    var splithorater = data.espaco[i].horaTer;
                    splithorater = splithorater.split(" ");

                    var horater = splithorater[1];
                    var horaini = splithoraini[1];
                    var dataini = splithoraini[0];

                    //console.log(horaini+" - "+dataini);

                    dataini = dataini.split("-");
                    dataini[1] = dataini[1]-1;
                    if (dataini[2]<10) {
                        dataini[2] = dataini[2].substring(1); 
                    }

                    dataini = dataini[0]+"-"+dataini[1]+"-"+dataini[2];

                    horaini = horaini.substring(0,5);
                    horater = horater.substring(0,5);


                    $$('#calendar-inline-container div[data-date="'+dataini+'"] span').addClass("marcado");
                    
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });


        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?idcondominio="+localStorage.getItem("moradorIdcondominio")+"&dia="+dia+"&idlocalespaco="+idlocalespaco+"&action=list",
            dataType : "json",
            success: function(data) {

            myApp.hideIndicator();
                var dataespaco = "";
                var qtd = data.espaco.length;
                for (var i = 0; i < qtd; i++) {

                    if (data.espaco[i].vazio=="vazio") {
                        $('#espaco-cont').html('<li><div class="item-content">Nenhuma reserva para data selecionada</div></li>');
                    } else{

                        var splithoraini = data.espaco[i].horaIni;
                        splithoraini = splithoraini.split(" ");

                        var splithorater = data.espaco[i].horaTer;
                        splithorater = splithorater.split(" ");

                        var horater = splithorater[1];
                        var horaini = splithoraini[1];
                        var dataini = splithoraini[0];

                        //console.log(horaini+" - "+dataini);

                        dataini = dataini.split("-");
                        dataini[1] = dataini[1]-1;
                        if (dataini[2]<10) {
                            dataini[2] = dataini[2].substring(1); 
                        }



                        dataini = dataini[0]+"-"+dataini[1]+"-"+dataini[2];

                        horaini = horaini.substring(0,5);
                        horater = horater.substring(0,5);
                        
                        dataespaco += '<li>'+
                                            '<a class="item-content nolink">'+
                                                '<div class="item-media">'+
                                                  '<img src="'+data.espaco[i].urlMorador+'" >'+
                                                '</div>'+
                                                '<div class="item-inner">'+
                                                    '<div class="item-title-row">'+
                                                        '<div class="item-title">'+horaini+" às "+horater+'</div>'+
                                                    '</div>'+
                                                        '<div class="item-subtitle">'+data.espaco[i].nameMorador+'</div>'+
                                                        '<div class="item-text">'+data.espaco[i].nameCondominio+' - '+data.espaco[i].numMorador+'</div>'+
                                                '</div>'+
                                            '</a>'
                                        '</li>';
                        $('#espaco-cont').html(dataespaco);
                    }
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
        //console.log(dia+","+idlocalespaco);
}


///////////////////////////// acao inserir espaco ///////////////////////////
$$('#butinseriragendamento').on('click', function(){

    if (($$('#horainicoagendamento').val()!="00:00") &&  ($$('#horaterminoagendamento').val()!="00:00")) {
        if ($$('#horaterminoagendamento').val()<$$('#horainicoagendamento').val()) {
            myApp.alert('Hora término deve ser maior que hora início', 'Aptohome'); 
        } else if ($$('#horaterminoagendamento').val()==$$('#horainicoagendamento').val()) {
             myApp.alert('Hora início e término devem ser diferentes', 'Aptohome'); 
        } else{
            enviarespaco();
        }
    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir espaco ///////////////////////////
function enviarespaco()
{
        $$idcondominio = localStorage.getItem("moradorIdcondominio");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$idmorador = localStorage.getItem("moradorIdmorador");
        $$idlocalespaco = localSelected;
        $$horaini = dataSelected+" "+$$('#horainicoagendamento').val()+":00";
        $$horater = dataSelected+" "+$$('#horaterminoagendamento').val()+":00";
        $$txtDescricao = $$('#txtdescricaoagendamento').val();

        myApp.showIndicator();

        $.ajax('http://www.aptohome.com.br/admin/functionAppEspaco.php?', {
            type: "post",
            data: "iddomicilio="+$$iddomicilio+"&idmorador="+$$idmorador+"&idcondominio="+$$idcondominio+"&idlocalespaco="+$$idlocalespaco+"&horaini="+$$horaini+"&horater="+$$horater+"&txtDescricao="+$$txtDescricao+"&action=add",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if ((data=="ok") || (data==" ok")) {
                myApp.hideIndicator();
                myApp.alert('Agendamento inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'agendamentodeespaco'});agendamentodeespaco();});

            } else {
                myApp.hideIndicator();
                myApp.alert(data,'Aptohome');            
            }
          });
}


    var today = new Date();
    var minDate = new Date().setDate(today.getDate() - 1);
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto' , 'Setembro' , 'Outubro', 'Novembro', 'Dezembro'];
    var dayNamesShort = ['Dom', 'Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sáb']

    var calendarInline = myApp.calendar({
        container: '#calendar-inline-container',
        input: '#calendar-agendamentodeespaco',
        value: [new Date()],
        dayNamesShort: dayNamesShort,
        dateFormat: 'dd-mm-yyyy',
        minDate: minDate,
        toolbarTemplate: 
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
            
        },
        onChange: function (picker, values, displayValues) {
            mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
            mesSelected = mesSelected+++1;
            diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
            
            if (diaSelected<10) {
                diaSelected = "0"+diaSelected;
            }
            anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
            dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
            
            var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

            $('.selecionarespaco').html(localDescSelected);
            $("#dataagendamento").val(dataSelectedBr);

            espaco(dataSelected,localSelected);

        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            
            mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
            mesSelected = mesSelected+++1;
            diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
            
            if (diaSelected<10) {
                diaSelected = "0"+diaSelected;
            }
            anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
            dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
            
            var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

            $('.selecionarespaco').html(localDescSelected);
            $("#dataagendamento").val(dataSelectedBr);
            espaco(dataSelected,localSelected);
        }
    });


/*
 Limpa os arquivos selecionados
 */
function limpar()
{
    var input = $("#imagem");
    input.replaceWith(input.val('').clone(true));
}

/////////////////////////// atualizar token ///////////////////////////

function atualizartoken(data){
    $.ajax('http://www.aptohome.com.br/admin/functionAppMorador.php?', {
        type: "post",
        data: "action=token&token="+data+"&guid="+localStorage.getItem("moradorGui"),
    })
      .fail(function() {
        //myApp.alert('Erro! Tente novamente.', 'Aptohome');
      })     
      .done(function(data) {
            //myApp.alert('Sucesso!', 'Rádio 93 FM');
            console.log("Token gravado: "+data);
      });
}

/////////////////////////// push ///////////////////////////

        var pushNotification;
        function onDeviceReady() {    
        //window.open = cordova.InAppBrowser.open;

        //document.addEventListener("backbutton", myApp.closeModal(".actions-modal"), false);
                //navigator.splashscreen.hide();
                //intel.xdk.device.hideSplashScreen(); 
                $("#console").append('<p>-> Aplicativo iniciado!</p>');
                
                // Instanciando plugin Push...
                pushNotification = window.plugins.pushNotification;

                // Iniciar serviço de Push no aplicativo...
                pushNotification.register(
                    function (result) {
                        $("#console").append('<p>-> SUCESSO: '+ result+'</p>');
                    }, 
                    function (error) {
                        $("#console").append('<p>-> ERRO: '+error+'</p>');
                    }, 
                    {
                        "senderID":"214666097431",
                        "ecb":"capturarEventos"
                    }
                );
                
            }
            
            // capturar notificações recebidos da API Google Cloud Messaging (GCM)...
            function capturarEventos(e) {
               console.log('EVENTO CAPTURADO:' + e.event);
                switch( e.event )
                {
                    // Dispositivo registrado no GCM!!!
                    case 'registered':
                            
                        console.log('APARELHO REGISTRADO:' + e.regid);
                        localStorage.setItem("token", e.regid);
                        //console.log("TOKEN = " + e.regid);

                        break;
                    
                    // Chegou uma notificação push!!!
                    case 'message':

                        switch( e.payload.item ){
                            case 'comunicado':
                            badgecomunicado++;
                            $('.badge'+e.payload.item).html('<span class="badge bg-red">'+badgecomunicado+'</span>');
                            break;
                            case 'transparencia':
                            badgetransparencia++;
                            $('.badge'+e.payload.item).html('<span class="badge bg-red">'+badgetransparencia+'</span>');
                            break;
                        }
                        
                        // Verificar se push message chegou com o app aberto (em foreground)...
                        // Em caso positivo, lançamos um alerta (som, janela, etc.) para chamar atenção...  

                        if (e.foreground)
                        {
                            console.log('CAPTURADO PUSH COM APP ABERTO!');

                            myApp.addNotification({
                                title: e.payload.title,
                                subtitle: e.payload.subtitle,
                                message: e.payload.message,
                                media: '<img src='+e.payload.media+'>',
                                onClick: function () { 
                                    mainView.router.load({pageName: e.payload.item+'cont'});
                                    switch( e.payload.item ){
                                        case 'comunicado':
                                        comunicadocont(e.payload.id);
                                        break;
                                        case 'transparencia':
                                        transparenciacont(e.payload.id);
                                        break;
                                    }
                                }
                            });
                        }
                        else
                        {   
                            // caso contrário, foram lançados porque o usuário tocou uma notificação na bandeja de notificação...
                            if (e.coldstart){
                                mainView.router.load({pageName: e.payload.item+'cont'});
                                switch( e.payload.item ){
                                    case 'comunicado':
                                    comunicadocont(e.payload.id);
                                    break;
                                    case 'transparencia':
                                    transparenciacont(e.payload.id);
                                    break;
                                }

                                console.log('CAPTURADO PUSH COM APP EM COLDSTART!');
                            }else{
                                mainView.router.load({pageName: e.payload.item+'cont'});
                                switch( e.payload.item ){
                                    case 'comunicado':
                                    comunicadocont(e.payload.id);
                                    break;
                                    case 'transparencia':
                                    transparenciacont(e.payload.id);
                                    break;
                                }
                                console.log('CAPTURADO PUSH COM APP EM BACKGROUND!');
                        }
                        }
                        console.log('TITULO: ' + e.payload.title);
                        console.log('SUBTITULO: ' + e.payload.subtitle);
                        console.log('MEDIA: ' + e.payload.media);
                        console.log('MENSAGEM: ' + e.payload.message);
                        console.log('ID: ' + e.payload.id);
                        
                        break;
                    
                    case 'error':
                          console.log('<p>-> ERRO:' + e.msg+'</p>' );
                        break;
                    
                    default:
                          console.log('<p>-> EVENTO: Desconhecido, um envento estranho foi capturado.</p>');
                        break;
                }
            }
        
        document.addEventListener('app.Ready', onDeviceReady, true);
/*
        function onDeviceReady() {

            var push = PushNotification.init({ "android": {"senderID": "214666097431"},
                 "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );

            push.on('registration', function(data) {
                console.log('APARELHO REGISTRADO:' + data.registrationId);
                localStorage.setItem("token", data.registrationId);
                // data.registrationId
            });

            push.on('notification', function(data) {
                if (data.additionalData.foreground) {

                    console.log('CAPTURADO PUSH COM APP ABERTO!');

                    myApp.addNotification({
                        title: data.title,
                        subtitle: data.subtitle,
                        message: data.message,
                        media: '<img src='+data.media+'>',
                        onClick: function () { 
                            mainView.router.load({pageName: data.item+'cont'});
                            switch( data.item ){
                                case 'comunicado':
                                comunicadocont(data.id);
                                break;
                                case 'transparencia':
                                transparenciacont(data.id);
                                break;
                            }
                        }
                    });
                }

                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
                console.log('TITULO: ' + data.title);
                console.log('SUBTITULO: ' + data.subtitle);
                console.log('MEDIA: ' + data.media);
                console.log('MENSAGEM: ' + data.message);
                console.log('ID: ' + data.id);
                console.log('ITEMALVO: ' + action+'('+data.id+')');
            });

            push.on('error', function(e) {
                console.log(e.message);
                // e.message
            });
        }

        document.addEventListener('app.Ready', onDeviceReady, true);
*/
///////////////// alerta de chegada /////////////////////

$('.buttonalertadechegada').on('click', function(){
    //alert("enviar");
    myApp.confirm('Deseja realmente ativar alerta?', function () {
        myApp.alert("Portaria notificada");
    });

});

$('.buttonpanico').on('click', function(){
    //alert("enviar");
    myApp.confirm('Deseja realmente ativar pânico?', function () {
        myApp.alert("Portaria notificada");
    });

});

    function alertadechegada(){
        //alert("aqui");
        initLocationProcedure();
        // Resultado para quando conseguir capturar a posição GPS...
            var map,
                currentPositionMarker,
                directionsService,
                mapCenter,
                directionsDisplay;
                //mapCenter = new google.maps.LatLng(40.700683, -73.925972);

            navigator.geolocation.getCurrentPosition(mapCenterInt);
                function mapCenterInt(){
                    mapCenter = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
                }

            function initializeMap()
            {
                console.log("initializeMap ");
                document.getElementById('map-canvas').html = "";
                directionsService = new google.maps.DirectionsService;
                directionsDisplay = new google.maps.DirectionsRenderer;
                map = "";
                map = new google.maps.Map(document.getElementById('map-canvas'), {
                   zoom: 17,
                   center: mapCenter,
                   disableDefaultUI: true,
                   mapTypeId: google.maps.MapTypeId.ROADMAP
                 });

                directionsDisplay.setMap(map);
                calculateAndDisplayRoute(directionsService, directionsDisplay);
                
                directionsDisplay.addListener('directions_changed', function() {
                    computeTotalDistance(directionsDisplay.getDirections());
                });
            }


            function formatTime(secs){
               var times = new Array(3600, 60, 1);
               var time = '';
               var tmp;
               for(var i = 0; i < times.length; i++){
                  tmp = Math.floor(secs / times[i]);
                  if(tmp < 1){
                     tmp = '00';
                  }
                  else if(tmp < 10){
                     tmp = '0' + tmp;
                  }
                  time += tmp;
                  if(i < 2){
                     time += ':';
                  }
                  secs = secs % times[i];
               }
               return time;
            }

            function computeTotalDistance(result) {
                var total = 0;
                var time = 0;
                var myroute = result.routes[0];
                for (var i = 0; i < myroute.legs.length; i++) {
                    total += myroute.legs[i].distance.value;
                    time += myroute.legs[i].duration.value;
                }
                total = total / 1000;
                //time = time / 60;
                document.getElementById('total').innerHTML = 'Distância = ' + total + ' km | Tempo = ' + formatTime(time) + 'min';
            }

            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            
                var onSuccess = function(position) {
                    console.log('coordenadas= '+position.coords.latitude+','+position.coords.longitude);
                    console.log(localStorage.getItem("condominioStreet")+', '+localStorage.getItem("condominioNumber")+', '+localStorage.getItem("condominioDistrict")+', '+localStorage.getItem("condominioCityname")+', '+localStorage.getItem("condominioUf"));
                    
                    directionsService.route({
                        origin: position.coords.latitude+','+position.coords.longitude,
                        destination: localStorage.getItem("condominioStreet")+', '+localStorage.getItem("condominioNumber")+', '+localStorage.getItem("condominioDistrict")+', '+localStorage.getItem("condominioCityname")+', '+localStorage.getItem("condominioUf"),
                        /*origin: document.getElementById('start').value,
                        destination: document.getElementById('end').value,*/
                        travelMode: google.maps.TravelMode.DRIVING
                        }, function(response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                          directionsDisplay.setDirections(response);
                        } else {
                          window.alert('Directions request failed due to ' + status);
                        }
                    });
                }
                navigator.geolocation.getCurrentPosition(onSuccess);
            }

            function locError(error) {
                // the current position could not be located
                alert("The current position could not be found!");
            }

            function setCurrentPosition(pos) {
                console.log("setCurrentPosition ");

                var image = 'http://iconizer.net/files/Brightmix/orig/monotone_location_pin_marker.png';
                currentPositionMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    ),
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 0, //tamaño 0
                    },
                    map: map,
                    labelClass: "iconMarker" // the CSS class for the label
                });
                /*currentPositionMarker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    ),
                    //icon: image,
                    //labelClass: "iconMarker",
                    title: "Current Position"
                });*/

                /*map.panTo(new google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    ));*/
            }

            function displayAndWatch(position) {
                console.log("displayAndWatch ");
                // set current position
                setCurrentPosition(position);
                // watch position
                watchCurrentPosition();
            }

            function watchCurrentPosition() {
                console.log("watchCurrentPosition ");
                var positionTimer = navigator.geolocation.watchPosition(
                    function (position) {
                        setMarkerPosition(
                            currentPositionMarker,
                            position
                        );
                        calculateAndDisplayRoute(directionsService, directionsDisplay);
                        //mapCenterInt();
                    });
            }

            function setMarkerPosition(marker, position) {
                console.log("setMarkerPosition ");
                marker.setPosition(
                    new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude)
                );
                //map.panTo(marker.getPosition());
            }

            function initLocationProcedure() {
                console.log("initLocationProcedure ");
                initializeMap();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
                } else {
                    alert("Your browser does not support the Geolocation API");
                }
            }

//document.addEventListener("app.Ready", initLocationProcedure, false);




    }