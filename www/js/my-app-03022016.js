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

///////////////////////// iniciar dom /////////////////////////
var $$ = Dom7;

var $server = 'http://www.aptohome.com.br/admin';

var badgecomunicado = 0;
var badgetransparencia = 0;
var tabindex = 1;
var bannerview = 0;
logado();
document.addEventListener("offline", onOffline, false);

function onOffline() {
    /*myApp.addNotification({
        title: "Conexão falhou!",
        //subtitle: e.payload.subtitle,
        message: 'Você precisa de conexão com a internet para acessar o Aptohome',
        media: '<img src='+e.payload.media+'>',
    });*/
    myApp.alert('Você precisa de conexão com a internet');
}
function onOnline() {
    //myApp.popup(".popup-off");
}

document.addEventListener("online", onOnline, false);

myApp.onPageInit('index', function (page) {

    if (localStorage.getItem("portariaIdportaria")) {
        // seleciona dashboard portaria
        $$('.pageindex').addClass('invisivel');
        $$('.pageportaria').removeClass('invisivel');
        
        comunportariahome();

        //servico();
        // seleciona itens menu portaria
        $$('.menucadastros').addClass('invisivel');
        $$('.menuocorrencia').addClass('invisivel');
        $$('.menutransparencia').addClass('invisivel');
        $$('.menuanuncios').addClass('invisivel');
        $$('.menubanner').addClass('invisivel');
        $$('.menucronograma').addClass('invisivel');
    };

    if (localStorage.getItem("administradoraIdadministradora")) {
        profileAdministradora();
        // seleciona itens menu administradora
        $$('.menualerta').addClass('invisivel');
        $$('.menuespaco').addClass('invisivel');
        $$('.menucadastros').addClass('invisivel');
        $$('.menucamera').addClass('invisivel');
        $$('.menuanuncios').addClass('invisivel');
        $$('.menubanner').addClass('invisivel');
    };

    if (localStorage.getItem("sindicoIdsindico") && !localStorage.getItem("moradorIdmorador")) {
        // seleciona itens menu sindico
        $$('.menualerta').addClass('invisivel');
        $$('.menucadastros').addClass('invisivel');
    };

    if (localStorage.getItem("sindicoCondominioNome")!=null) {
        profileSindico();
    };
});

///////////////////////// textarea height automatico /////////////////////////
$("textarea").bind("input", function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")) &&
          $(this).height() < 300
         ) {
        $(this).height($(this).height()+1);
    };
});


///////////////////////// inserir tabindex /////////////////////////
$('form,input,select').each(function() {
  if (this.type != "hidden") {
    var $input = $(this);
    $input.attr("tabindex", tabindex);
    tabindex++;
 }
});

///////////////////////// tab enter ///////////////////////////////
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
///////////////////////// abrir panel left /////////////////////////
$$('.open-left-panel').on('click', function (e) {
    // 'left' position to open Left panel
    myApp.openPanel('left');
});

///////////////////////// abrir panel right /////////////////////////
$$('.open-right-panel').on('click', function (e) {
    // 'right' position to open Right panel
    myApp.openPanel('right');
});

// fechar panel
$$('.panel-close').on('click', function (e) {
    myApp.closePanel();
});

///////////////////////// Add view /////////////////////////
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});


$$(window).on('popstate', function (e) {
    myApp.closeModal('.popup.modal-in');
});
/*$$(window).on('click', '.close-popup', function () {
    window.history.back();
});*/

///////////////////////// abrir ligacao /////////////////////////
function openURL(alvo){
    //alert(alvo);
    window.open(alvo);
    //window.open(alvo, '_system', 'location=yes');
}

///////////////////////// abrir browser /////////////////////////
function openURLBrowser(alvo){
    //alert(alvo);
    //window.open(alvo);
    window.open(alvo, '_system', 'location=yes');
}


///////////////////// retirar caracteres em branco ////////////////////////////////
    function trimespaco(alvo) {

        while(alvo.indexOf(" ") != -1){
            alvo = alvo.replace(" ", "");
        }

        return alvo;
    }
////////////////////////// rotacao do aparelho /////////////////////////

function onportrait(){
    window.screen.lockOrientation('portrait');
    return;
}

function onlandscape(){
    window.screen.lockOrientation('landscape');
    return;
}


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

    $$url = "http://www.aptohome.com.br/admin/functionApplogin.php?email="+$$email+"&password="+$$password+"&token="+$$token+"";

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
            
            if (data.login.morador && data.login.sindico) {

                $i = 0;
                var arrayCondominioId = [];
                $$.each(data.login.sindico, function (chave,dados)
                {
                    localStorage.setItem("sindicoEmail", dados.email);
                    localStorage.setItem("sindicoNome", dados.name);
                    localStorage.setItem("sindicoIdsindico", dados.idsindico);
                    localStorage.setItem("sindicoProfileImage", dados.profile_image);
                    localStorage.setItem("sindicoProfileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("sindicoGuid", dados.idsindico_guid);

                    //localStorage.setItem("sindicoIdbloco", dados.bloco.idbloco);
                    //localStorage.setItem("blocoNum", dados.condominio.bloco_num);
                    //localStorage.setItem("sindicoCondominioId", dados.condominio[0].idcondominio);
                    localStorage.setItem("sindicoCondominioNome", dados.condominio[0].condominio_nome);
                    localStorage.setItem("sindicoCondominioStreet", dados.condominio[0].condominio_street);
                    localStorage.setItem("sindicoCondominioNumber", dados.condominio[0].condominio_number);
                    localStorage.setItem("sindicoCondominioDistrict", dados.condominio[0].condominio_district);
                    localStorage.setItem("sindicoCondominioCityname", dados.condominio[0].condominio_cityname);
                    localStorage.setItem("sindicoCondominioUf", dados.condominio[0].condominio_uf);
                    
                    atualizartokenSindico(localStorage.getItem("token"));

                    for (var i = 0; i < dados.condominio.length; i++) {
                        arrayCondominioId.push(dados.condominio[i].idcondominio);
                        //console.log(arrayCondominioId);
                    };

                    if (dados.condominio.length>1) {
                    //console.log(arrayCondominioId);
                        localStorage.setItem("sindicoArrayCondominioId", arrayCondominioId);
                    }

                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                    $i++;
                });

                $$.each(data.login.morador, function (chave,dados)
                {   
                    localStorage.setItem("moradorNome", dados.name);
                    localStorage.setItem("moradorIdmorador", dados.idmorador);
                    localStorage.setItem("moradorIdsindico", dados.idsindico);
                    localStorage.setItem("moradorIdadministradora", dados.idadministradora);
                    localStorage.setItem("condominioId", dados.idcondominio);
                    localStorage.setItem("moradorIdbloco", dados.idbloco);
                    localStorage.setItem("moradorIddomicilio", dados.iddomicilio);
                    localStorage.setItem("condominioNome", dados.condominio_nome);
                    localStorage.setItem("condominioStreet", dados.condominio_street);
                    localStorage.setItem("condominioNumber", dados.condominio_number);
                    localStorage.setItem("condominioDistrict", dados.condominio_district);
                    localStorage.setItem("condominioCityname", dados.condominio_cityname);
                    localStorage.setItem("condominioUf", dados.condominio_uf);
                    localStorage.setItem("blocoNum", dados.bloco_num);
                    localStorage.setItem("domicilioNum", dados.domicilio_num);
                    localStorage.setItem("profileImage", dados.profile_image);
                    localStorage.setItem("profileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("guid", dados.morador_guid);

                    //profile();
                    
                    atualizartoken(localStorage.getItem("token"));
                    popupBanner();

                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                });

                $.ajax({
                    url: "http://www.aptohome.com.br/admin/functionAppSindico.php?idcondominio="+localStorage.getItem('sindicoArrayCondominioId')+"&action=listCondominioSindico",
                    dataType : "json",
                    success: function(data) {
                            var listCond = '<div class="popover">'+
                                              '<div class="popover-inner">'+
                                                '<div class="list-block">'+
                                                  '<ul>';
                            
                        $$.each(data.condominio, function (chave,dados)
                        {
                                    listCond += '<li><a href="#" onclick="updateCond('+dados.idcondominio+');" class="item-link list-button">Cond. '+dados.condominio_nome+'</li>';
                        });
                                listCond +=  '</ul>'+
                                                    '</div>'+
                                                  '</div>'+
                                                '</div>';
                        localStorage.setItem("sindicoListCond", listCond);
                           
                    },error: function(data) {
                    }
                });

            profileSindico();

            } else if (data.login.morador) {
                $$.each(data.login.morador, function (chave,dados)
                {
                    localStorage.setItem("moradorEmail", dados.email);
                    localStorage.setItem("moradorNome", dados.name);
                    localStorage.setItem("moradorIdmorador", dados.idmorador);
                    localStorage.setItem("moradorIdsindico", dados.idsindico);
                    localStorage.setItem("moradorIdadministradora", dados.idadministradora);
                    localStorage.setItem("condominioId", dados.idcondominio);
                    localStorage.setItem("moradorIdbloco", dados.idbloco);
                    localStorage.setItem("moradorIddomicilio", dados.iddomicilio);
                    localStorage.setItem("condominioNome", dados.condominio_nome);
                    localStorage.setItem("condominioStreet", dados.condominio_street);
                    localStorage.setItem("condominioNumber", dados.condominio_number);
                    localStorage.setItem("condominioDistrict", dados.condominio_district);
                    localStorage.setItem("condominioCityname", dados.condominio_cityname);
                    localStorage.setItem("condominioUf", dados.condominio_uf);
                    localStorage.setItem("blocoNum", dados.bloco_num);
                    localStorage.setItem("domicilioNum", dados.domicilio_num);
                    localStorage.setItem("profileImage", dados.profile_image);
                    localStorage.setItem("profileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("guid", dados.morador_guid);

                    profile();
                    popupBanner();
                    atualizartoken(localStorage.getItem("token"));
                    
                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                });
            } else if (data.login.sindico) {

            $('.menualerta').addClass('invisivel');
            $('.menucadastros').addClass('invisivel');

                $i = 0;
                var arrayCondominioId = [];
                $$.each(data.login.sindico, function (chave,dados)
                {
                    localStorage.setItem("sindicoEmail", dados.email);
                    localStorage.setItem("sindicoNome", dados.name);
                    localStorage.setItem("sindicoIdsindico", dados.idsindico);
                    localStorage.setItem("sindicoProfileImage", dados.profile_image);
                    localStorage.setItem("sindicoProfileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("sindicoGuid", dados.idsindico_guid);
                    localStorage.setItem("condominioId", dados.condominio[0].idcondominio);
                    //localStorage.setItem("sindicoIdbloco", dados.bloco.idbloco);
                    //localStorage.setItem("blocoNum", dados.condominio.bloco_num);
                    //localStorage.setItem("sindicoCondominioId", dados.condominio[0].idcondominio);
                    localStorage.setItem("sindicoCondominioNome", dados.condominio[0].condominio_nome);
                    localStorage.setItem("sindicoCondominioStreet", dados.condominio[0].condominio_street);
                    localStorage.setItem("sindicoCondominioNumber", dados.condominio[0].condominio_number);
                    localStorage.setItem("sindicoCondominioDistrict", dados.condominio[0].condominio_district);
                    localStorage.setItem("sindicoCondominioCityname", dados.condominio[0].condominio_cityname);
                    localStorage.setItem("sindicoCondominioUf", dados.condominio[0].condominio_uf);

                    for (var i = 0; i < dados.condominio.length; i++) {
                        arrayCondominioId.push(dados.condominio[i].idcondominio);
                        //console.log(arrayCondominioId);
                    };
                    if (dados.condominio.length>1) {
                    //console.log(arrayCondominioId);
                        localStorage.setItem("sindicoArrayCondominioId", arrayCondominioId);
                    }

                    $.ajax({
                        url: "http://www.aptohome.com.br/admin/functionAppSindico.php?idcondominio="+localStorage.getItem('sindicoArrayCondominioId')+"&action=listCondominioSindico",
                        dataType : "json",
                        success: function(data) {
                                var listCond = '<div class="popover">'+
                                                  '<div class="popover-inner">'+
                                                    '<div class="list-block">'+
                                                      '<ul>';
                                
                            $$.each(data.condominio, function (chave,dados)
                            {
                                        listCond += '<li><a href="#" onclick="updateCond('+dados.idcondominio+');" class="item-link list-button">Cond. '+dados.condominio_nome+'</li>';
                            });
                                    listCond +=  '</ul>'+
                                                        '</div>'+
                                                      '</div>'+
                                                    '</div>';
                            localStorage.setItem("sindicoListCond", listCond);
                               
                        },error: function(data) {
                        }
                    });

                    profileSindico();
                    //popupBanner();
                    atualizartokenSindico(localStorage.getItem("token"));

                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                    $i++;
                });
            } else if (data.login.administradora) {

                $i = 0;
                var arrayCondominioId = [];
                $$.each(data.login.administradora, function (chave,dados)
                {
                    localStorage.setItem("administradoraEmail", dados.email);
                    localStorage.setItem("administradoraNome", dados.nome_fantasia);
                    localStorage.setItem("administradoraIdadministradora", dados.idadministradora);
                    localStorage.setItem("administradoraProfileImage", dados.profile_image);
                    localStorage.setItem("administradoraProfileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("administradoraGuid", dados.idadministradora_guid);
                    localStorage.setItem("condominioId", dados.condominio[0].idcondominio);
                    //localStorage.setItem("sindicoIdbloco", dados.bloco.idbloco);
                    //localStorage.setItem("blocoNum", dados.condominio.bloco_num);
                    //localStorage.setItem("sindicoCondominioId", dados.condominio[0].idcondominio);
                    localStorage.setItem("administradoraCondominioNome", dados.condominio[0].condominio_nome);
                    localStorage.setItem("administradoraCondominioStreet", dados.condominio[0].condominio_street);
                    localStorage.setItem("administradoraCondominioNumber", dados.condominio[0].condominio_number);
                    localStorage.setItem("administradoraCondominioDistrict", dados.condominio[0].condominio_district);
                    localStorage.setItem("administradoraCondominioCityname", dados.condominio[0].condominio_cityname);
                    localStorage.setItem("administradoraCondominioUf", dados.condominio[0].condominio_uf);

                    for (var i = 0; i < dados.condominio.length; i++) {
                        arrayCondominioId.push(dados.condominio[i].idcondominio);
                        //console.log(arrayCondominioId);
                    };
                    if (dados.condominio.length>1) {
                    //console.log(arrayCondominioId);
                        localStorage.setItem("administradoraArrayCondominioId", arrayCondominioId);
                    }

                    $.ajax({
                        url: "http://www.aptohome.com.br/admin/functionAppAdministradora.php?idcondominio="+localStorage.getItem('administradoraArrayCondominioId')+"&action=listCondominioAdministradora",
                        dataType : "json",
                        success: function(data) {
                                var listCond = '<div class="popover">'+
                                                  '<div class="popover-inner">'+
                                                    '<div class="list-block">'+
                                                      '<ul>';
                                
                            $$.each(data.condominio, function (chave,dados)
                            {
                                        listCond += '<li><a href="#" onclick="updateCondAdministradora('+dados.idcondominio+');" class="item-link list-button">Cond. '+dados.condominio_nome+'</li>';
                            });
                                    listCond +=  '</ul>'+
                                                        '</div>'+
                                                      '</div>'+
                                                    '</div>';
                            localStorage.setItem("administradoraListCond", listCond);

                        },error: function(data) {
                        }
                    });

                    profileAdministradora();
                    //popupBanner();
                    atualizartokenAdministradora(localStorage.getItem("token"));

                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                    $i++;
                });
            } else if (data.login.portaria) {

                // girar tela para landscape 
                //onlandscape();

                $$.each(data.login.portaria, function (chave,dados)
                {
                    localStorage.setItem("portariaEmail", dados.email);
                    localStorage.setItem("portariaNome", dados.name);
                    localStorage.setItem("portariaIdportaria", dados.idportaria);
                    localStorage.setItem("condominioId", dados.idcondominio);
                    localStorage.setItem("portariaIdbloco", dados.idbloco);
                    localStorage.setItem("condominioNome", dados.condominio_nome);
                    localStorage.setItem("condominioStreet", dados.condominio_street);
                    localStorage.setItem("condominioNumber", dados.condominio_number);
                    localStorage.setItem("condominioDistrict", dados.condominio_district);
                    localStorage.setItem("condominioCityname", dados.condominio_cityname);
                    localStorage.setItem("condominioUf", dados.condominio_uf);
                    localStorage.setItem("blocoNum", dados.bloco_num);
                    localStorage.setItem("profileImage", dados.profile_image);
                    localStorage.setItem("profileImageGuid", dados.profile_image_guid);
                    localStorage.setItem("guid", dados.portaria_guid);

                    profilePortaria();
                    atualizartokenPortaria(localStorage.getItem("token"));
                    
                    if (dados.email!="") {
                    myApp.closeModal(".login-screen");
                    }
                });
            } else {
                myApp.hideIndicator();
                myApp.alert('E-mail e/ou senha inválidos!', 'Aptohome');
            }

        }
         ,error:function(data){
            //console.log(data);
            myApp.hideIndicator();
            myApp.alert('E-mail e/ou senha inválidos!', 'Aptohome');
         }
        });

});

/////////////////////////// atualizar token ///////////////////////////

function atualizartoken(data){
    $.ajax('http://www.aptohome.com.br/admin/functionAppMorador.php?', {
        type: "post",
        data: "action=token&token="+data+"&guid="+localStorage.getItem("guid"),
    })
      .fail(function() {
        //myApp.alert('Erro! Tente novamente.', 'Aptohome');
      })     
      .done(function(data) {
            //myApp.alert('Sucesso!', 'Rádio 93 FM');
            console.log("Token gravado: "+data);
      });
}

/////////////////////////// atualizar token sindico ///////////////////////////

function atualizartokenSindico(data){
    $.ajax('http://www.aptohome.com.br/admin/functionAppSindico.php?', {
        type: "post",
        data: "action=token&token="+data+"&guid="+localStorage.getItem("sindicoGuid"),
    })
      .fail(function() {
        //myApp.alert('Erro! Tente novamente.', 'Aptohome');
      })     
      .done(function(data) {
            //myApp.alert('Sucesso!', 'Rádio 93 FM');
            console.log("Token gravado: "+data);
      });
}

/////////////////////////// atualizar token administradora ///////////////////////////

function atualizartokenAdministradora(data){
    $.ajax('http://www.aptohome.com.br/admin/functionAppAdministradora.php?', {
        type: "post",
        data: "action=token&token="+data+"&guid="+localStorage.getItem("administradoraGuid"),
    })
      .fail(function() {
        //myApp.alert('Erro! Tente novamente.', 'Aptohome');
      })     
      .done(function(data) {
            //myApp.alert('Sucesso!', 'Rádio 93 FM');
            console.log("Token gravado: "+data);
      });
}

/////////////////////////// atualizar token portaria ///////////////////////////

function atualizartokenPortaria(data){
    $.ajax('http://www.aptohome.com.br/admin/functionAppPortaria.php?', {
        type: "post",
        data: "action=token&token="+data+"&guid="+localStorage.getItem("guid"),
    })
      .fail(function() {
        //myApp.alert('Erro! Tente novamente.', 'Aptohome');
      })     
      .done(function(data) {
            //myApp.alert('Sucesso!', 'Rádio 93 FM');
            console.log("Token gravado: "+data);
      });
}

///////////////////////////// sair ////////////////////////////

function sair() {
    myApp.confirm('Deseja realmente sair?', function () {
        localStorage.clear();
        window.location = "index.html";
    });
}

///////////////////////////// logado ////////////////////////////

function logado() {
    //logado //
    
    if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {

        profileSindico();     
        myApp.closeModal(".login-screen");
        //popupBanner();
        console.log("morador/sindico");

    } else if (localStorage.getItem("sindicoEmail")) {

        profileSindico();        
        myApp.closeModal(".login-screen"); 
        //popupBanner();   
        console.log("sindico");    

    } else if (localStorage.getItem("moradorEmail")) {

        profile();        
        myApp.closeModal(".login-screen");
        //popupBanner();
        console.log("morador");

    } else if (localStorage.getItem("administradoraEmail")) {

        profileAdministradora();        
        myApp.closeModal(".login-screen");
        //popupBanner();
        console.log("administradora");

    } else if (localStorage.getItem("portariaEmail")) {

        profilePortaria();        
        myApp.closeModal(".login-screen");
        //popupBanner();
        console.log("portaria");

    }

    else {
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
        var bloco_num = "Bloco: " + localStorage.getItem("blocoNum") + " | ";
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("condominioNome") + " <br>"+ bloco_num + "Apto: " + localStorage.getItem("domicilioNum");

    $('.profile_detalhes').html(profile_detalhes);
        
        //popupBanner();
        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}

//////////////////////////// profile sindico /////////////////////////////
function profileSindico(){

    if (localStorage.getItem("sindicoIdsindico") && !localStorage.getItem("moradorIdmorador")) {
        // seleciona itens menu sindico
        $$('.menualerta').addClass('invisivel');
        $$('.menucadastros').addClass('invisivel');
    }

    // profile
    var profile_image = "<img src="+localStorage.getItem("sindicoProfileImage")+">";
    $('.profile_foto').html(profile_image);
    $('.profile_nome').html(localStorage.getItem("sindicoNome"));

    if(localStorage.getItem("blocoNum")){
        var bloco_num = localStorage.getItem("blocoNum");
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("sindicoCondominioNome");

    $('.nameHome').html("Cond. " +localStorage.getItem("sindicoCondominioNome"));

    if (localStorage.getItem("sindicoArrayCondominioId")!=null) {
        $('.iconRight').html('<a href="#" class="filterCond link icon-only" onclick="listCond();"><i class="icon fa fa-filter"></i></a>');
    }
    $('.profile_detalhes').html(profile_detalhes);

        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}

function listCond(){
    var clickedLinkListCond = $('.filterCond');
    myApp.popover(localStorage.getItem("sindicoListCond"), clickedLinkListCond);

}

function updateCond(id){
    myApp.showIndicator();
    $.ajax({
        url: "http://www.aptohome.com.br/admin/functionAppSindico.php?idcondominio="+id+"&action=listCondominioSindico",
        dataType : "json",
        success: function(data) {
            myApp.hideIndicator();
            $$.each(data.condominio, function (chave,dados)
            {
                localStorage.setItem("condominioId", dados.idcondominio);
                localStorage.setItem("sindicoCondominioNome", dados.condominio_nome);
                localStorage.setItem("sindicoCondominioStreet", dados.condominio_street);
                localStorage.setItem("sindicoCondominioNumber", dados.condominio_number);
                localStorage.setItem("sindicoCondominioDistrict", dados.condominio_district);
                localStorage.setItem("sindicoCondominioCityname", dados.condominio_cityname);
                localStorage.setItem("sindicoCondominioUf", dados.condominio_uf);

                profileSindico();
                myApp.closeModal();
            });
        },error: function(data) {
            myApp.hideIndicator();
            //console.log(data);
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
        }
    });

}

//////////////////////////// profile administradora /////////////////////////////
function profileAdministradora(){

    // seleciona itens menu administradora
    $$('.menualerta').addClass('invisivel');
    $$('.menuespaco').addClass('invisivel');
    $$('.menucadastros').addClass('invisivel');
    $$('.menucamera').addClass('invisivel');
    $$('.menuanuncios').addClass('invisivel');
    $$('.menubanner').addClass('invisivel');

    // profile
    var profile_image = "<img src="+localStorage.getItem("administradoraProfileImage")+">";
    $('.profile_foto').html(profile_image);
    $('.profile_nome').html(localStorage.getItem("administradoraNome"));

    if(localStorage.getItem("blocoNum")){
        var bloco_num = localStorage.getItem("blocoNum");
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("administradoraCondominioNome");

    $('.nameHome').html("Cond. " +localStorage.getItem("administradoraCondominioNome"));

    if (localStorage.getItem("administradoraArrayCondominioId")!=null) {
        console.log("profile");
        $('.iconRight').html('<a href="#" class="filterCond link icon-only" onclick="listCondAdministradora();"><i class="icon fa fa-filter"></i></a>');
    }
    $('.profile_detalhes').html(profile_detalhes);

        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}

function listCondAdministradora(){
    var clickedLinkListCond = $('.filterCond');
    myApp.popover(localStorage.getItem("administradoraListCond"), clickedLinkListCond);

}

function updateCondAdministradora(id){
    myApp.showIndicator();
    $.ajax({
        url: "http://www.aptohome.com.br/admin/functionAppAdministradora.php?idcondominio="+id+"&action=listCondominioAdministradora",
        dataType : "json",
        success: function(data) {
            myApp.hideIndicator();
            $$.each(data.condominio, function (chave,dados)
            {
                localStorage.setItem("condominioId", dados.idcondominio);
                localStorage.setItem("administradoraCondominioNome", dados.condominio_nome);
                localStorage.setItem("administradoraCondominioStreet", dados.condominio_street);
                localStorage.setItem("administradoraCondominioNumber", dados.condominio_number);
                localStorage.setItem("administradoraCondominioDistrict", dados.condominio_district);
                localStorage.setItem("administradoraCondominioCityname", dados.condominio_cityname);
                localStorage.setItem("administradoraCondominioUf", dados.condominio_uf);

                profileAdministradora();
                myApp.closeModal();
            });
        },error: function(data) {
            myApp.hideIndicator();
            //console.log(data);
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
        }
    });

}

////////////////////////////  profile portaria ///////////////////
function profilePortaria(){

    //girar tela para landscape 
    //onlandscape();
    // seleciona itens menu portaria
    $$('.menucadastros').addClass('invisivel');
    $$('.menuocorrencia').addClass('invisivel');
    $$('.menutransparencia').addClass('invisivel');
    $$('.menuanuncios').addClass('invisivel');
    $$('.menubanner').addClass('invisivel');
    $$('.menucronograma').addClass('invisivel');
    // seleciona dashboard portaria
    $$('.pageindex').addClass('invisivel');
    $$('.pageportaria').removeClass('invisivel');
    comunportariahome();
    //servico();

    // profile
    var profile_image = "<img src="+localStorage.getItem("profileImage")+">";
    $('.profile_foto').html(profile_image);
    $('.profile_nome').html(localStorage.getItem("portariaNome"));

    if(localStorage.getItem("blocoNum")){
        var bloco_num = localStorage.getItem("blocoNum");
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("condominioNome") + " <br>Bloco: " + bloco_num;

    $('.profile_detalhes').html(profile_detalhes);
    
        //popupBanner();
        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}


/////////////////////////// search home portaria //////////////////////////////

    var mySearchbar = myApp.searchbar('.searchbar', {

        searchList: '.list-block-search',
        searchIn: '.item-title',
        removeDiacritics: true,
        //customSearch: true,

        onEnable: function(s){
            //console.log('enable');
            searchhomeportaria();
            //$('.inputsearchportariahome').attr("disabled", true);
        },

        onSearch: function(s){
            //console.log(s.value);
        },

        onDisable: function(s){
            console.log("clear");
            $('#searchportariahome-cont').html("");
        }
    });


function searchhomeportaria(){

    //myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppSearch.php?idcondominio="+localStorage.getItem("condominioId")+"&action=listall",
            dataType : "json",
            success: function(data) {

                $('#searchportariahome-cont').html("");

                if (data!=null) {
                    //myApp.hideIndicator();
                    var datasearch = "";
                    var qtdvisitante = data.search.visitante.visitante.length;
                    var delvisitante ="";
                    var cor="";

                    var name ="";
                    var email ="";
                    var exibecont = "";

                    datasearch += '<li class="item-divider"> Visitantes</li>';

                    for (var i = 0; i < qtdvisitante; i++) {

                        name = data.search.visitante.visitante[i].name ? data.search.visitante.visitante[i].name : "";
                        email = data.search.visitante.visitante[i].email ? data.search.visitante.visitante[i].email : "";
                        dataini = data.search.visitante.visitante[i].horaini ? data.search.visitante.visitante[i].horaini : "";
                        horater = data.search.visitante.visitante[i].horater ? data.search.visitante.visitante[i].horater : "";
                        datavisit = 'Início: '+convertMysqldate(dataini)+'<br> Término: '+convertMysqldate(horater);

                        if (data.search.visitante.visitante[i].tipo=="1") {
                            cor="#3f51b5";
                            exibecont = email;
                        } else{
                            cor="#f44336";
                            exibecont = datavisit;
                        }

                        if(data.search.visitante.visitante[i].num_bloco!="Sem bloco"){
                            var num_bloco = "/" + data.search.visitante.visitante[i].num_bloco;
                        }

                        datasearch += '<li class="item-content">'+
                                                  '<a href="#visitantecont" onclick="visitantecont('+data.search.visitante.visitante[i].idvisitante+')" class="item-link item-content">'+
                                                    '<div class="item-media" style="border:solid 4px '+cor+'">'+
                                                      '<img src="'+data.search.visitante.visitante[i].urlVisitante+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+name+' ('+data.search.visitante.visitante[i].num_domicilio+num_bloco+')</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+exibecont+'</div>'+
                                                      '<div class="item-text">Apto:'+data.search.visitante.visitante[i].num_domicilio+num_bloco+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';

                    }
                    
                    var dataveiculo = "";
                    var qtdveiculo = data.search.veiculo.veiculo.length;
                    var tipo ="";
                    var delveiculo ="";

                    datasearch += '<li class="item-divider"> Veículos</li>';

                    for (var i = 0; i < qtdveiculo; i++) {

                        if (data.search.veiculo.veiculo[i].tipo=="1") {
                            tipo = "Carro";
                        } else {
                            tipo = "Moto";
                        }

                        if(data.search.veiculo.veiculo[i].num_bloco!="Sem bloco"){
                            var num_bloco = "/" + data.search.veiculo.veiculo[i].num_bloco;
                        }

                        datasearch += '<li class="item-content">'+
                                                  '<a href="#veiculocont" onclick="veiculocont('+data.search.veiculo.veiculo[i].idveiculo+')" class="item-link item-content">'+
                                                    '<div class="item-media" style="border:solid 4px '+data.search.veiculo.veiculo[i].cor+'">'+
                                                      '<img src="'+data.search.veiculo.veiculo[i].urlVeiculo+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title item-title-veiculo">'+data.search.veiculo.veiculo[i].placa+' ('+data.search.veiculo.veiculo[i].num_domicilio+num_bloco+')</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+tipo+'</div>'+
                                                      '<div class="item-text">'+data.search.veiculo.veiculo[i].marca+' - '+data.search.veiculo.veiculo[i].modelo+'</div>'+
                                                      '<div class="item-text">Apto:'+data.search.veiculo.veiculo[i].num_domicilio+num_bloco+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                                                
                    }


                    var datamorador = "";
                    var qtdmorador = data.search.morador.morador.length;
                    var delmorador = "";

                    datasearch += '<li class="item-divider"> Moradores</li>';

                    for (var i = 0; i < qtdmorador; i++) {

                        if(data.search.morador.morador[i].num_bloco!="Sem bloco"){
                            var num_bloco = "/" + data.search.morador.morador[i].num_bloco;
                        }
                     
                        datasearch += '<li class="item-content">'+
                                                  '<a href="#moradorcont" onclick="moradorcont('+data.search.morador.morador[i].idmorador+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.search.morador.morador[i].urlMorador+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+data.search.morador.morador[i].name+' ('+data.search.morador.morador[i].num_domicilio+num_bloco+')</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+data.search.morador.morador[i].email+'</div>'+
                                                      '<div class="item-text">Apto:'+data.search.morador.morador[i].num_domicilio+num_bloco+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                    }


                    $('#searchportariahome-cont').html(datasearch);

                }else{
                    //myApp.hideIndicator();
                    //$('#visitante-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                //myApp.hideIndicator();
                //$('#visitante-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

////////////////////////////  list morador editar ///////////////////
$$('.edit_morador').on('click', function(){
    $$email = $$('#email').val();
    $$password = $$('#password').val();
    $$token = $$('#token').val();
    $$tipoUsuario = "1";

    $$url = "http://www.aptohome.com.br/admin/functionAppMorador.php?guid="+localStorage.getItem("guid")+"&action=list";

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
                $('#moradorbirthdate').val(dataamericana(dados.birth_date));
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
    targetWidth: 1000,
    targetHeight: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileMorador(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessMorador, onFailMorador, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    targetHeight: 1000,
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
        myApp.actions(actionOptionCameraMorador);
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

/////////////////////////// eidtar morador ///////////////////////////
function enviarmorador()
{
 
        imagem = $('#preview-morador').attr("src");
        $$guid = localStorage.getItem("guid");
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


///////////////////////////////////// Popup Banner ///////////////////////////

/*$('.back-banner').on('click', function(){
    mainView.router.load({pageName: 'banner'});
});*/

function popupBanner(){
//console.log("popupBanner");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppBanner.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var databanner = "";
                    var qtd = data.banner.length;
                    var idRand = Math.floor(Math.random() * qtd);
                    var idBanner = data.banner[idRand].idBanner;
                    bannercont(idBanner);
                }             
            },error: function(data) {
                myApp.hideIndicator();
                //console.log(data);
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

////////////////////////////////  cameras de seguranca ///////////////////////////
function camerasdeseguranca(){

    myApp.showIndicator();

        $.ajax({
            data : "get",
            url: "http://www.aptohome.com.br/admin/functionAppCamera.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
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

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inserirmuraldeanuncios').removeClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico") || localStorage.getItem("portariaIdportaria")) {
            $('.inserirmuraldeanuncios').addClass('invisivel');
        }
        if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {
            $('.inserirmuraldeanuncios').removeClass('invisivel');
        }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppAnuncios.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
            dataType : "json",
            success: function(data) {
                //console.log(data);
                if (data!=null) {
                    var qtd = data.anuncio.length;
                    var imgAnuncio = "";
                    var dataAnuncio = "";
                    var delanuncio = "";
                    var swipeout = "";
                    var invisivel = "invisivel";

                    for (var i = 0; i < qtd; i++) {

                        if (localStorage.getItem("moradorIdmorador") == data.anuncio[i].idmorador) {
                            
                            swipeout = "swipeout";
                            invisivel= "";
                            console.log("idmorador = "+localStorage.getItem("moradorIdmorador"));
                            console.log("idmoradorocorrencia = "+data.anuncio[i].idmorador);

                        }


                        if (data.anuncio[i].urlAnuncio!="images/sem_foto_cont.jpg") {
                            imgAnuncio = '<div class="card-content"><img src="'+data.anuncio[i].urlAnuncio+'" width="100%"></div>';
                        }
                        delanuncio = "onclick = delanuncio('"+data.anuncio[i].guid+"',"+i+");"
                        dataAnuncio += '<li class="'+swipeout+' swipeout-anuncio" data-index="'+i+'">'+
                                            '<a href="#muraldeanuncioscont" onclick="muraldeanuncioscont('+data.anuncio[i].idAnuncio+');" class="swipeout-content item-link">'+
                                                '<div class="card-cont ks-facebook-card">'+
                                                    '<div class="card-header">'+
                                                        '<div class="ks-facebook-avatar"><img src="'+data.anuncio[i].urlAvatar+'" width="34"></div>'+
                                                            '<div class="ks-facebook-name">'+data.anuncio[i].nameMorador+'</div>'+
                                                            '<div class="ks-facebook-date">'+data.anuncio[i].numBlocoApto+'</div>'+
                                                        '</div>'+
                                                        imgAnuncio+
                                                        '<div class="card-content-inner">'+
                                                            '<div class="facebook-date">'+data.anuncio[i].dataAnuncio+'</div>'+
                                                            '<p class="facebook-title">'+data.anuncio[i].titleAnuncio+'</p>'+
                                                            '<p class="color-green facebook-price">'+data.anuncio[i].priceAnuncio+'</p>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</a>'+
                                            '<div class="'+invisivel+' swipeout-actions-right">'+
                                                '<a href="#" '+delanuncio+' class="action1 bg-red">Delete</a>'+
                                            '</div>'+
                                        '</li>';
                        //$('#muraldeanuncios-cont').append('<li><a href="#muraldeanuncioscont" onclick="muraldeanuncioscont('+data.anuncio[i].idAnuncio+');" class="item-link"><div class="card-cont ks-facebook-card"><div class="card-header"><div class="ks-facebook-avatar"><img src="'+data.anuncio[i].urlAvatar+'" width="34"></div><div class="ks-facebook-name">'+data.anuncio[i].nameMorador+'</div><div class="ks-facebook-date">'+data.anuncio[i].numBlocoApto+'</div></div>'+imgAnuncio+'<div class="card-content-inner"><div class="facebook-date">'+data.anuncio[i].dataAnuncio+'</div><p class="facebook-title">'+data.anuncio[i].titleAnuncio+'</p><p class="color-green facebook-price">'+data.anuncio[i].priceAnuncio+'</p></div></div></div></a></li>');
                        imgAnuncio = "";
                        swipeout = "";
                        invisivel = "invisivel";
                    }

                    $('#muraldeanuncios-cont').html(dataAnuncio);

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
/////////////////////////////////////  deletar anuncio ///////////////////////////
function delanuncio(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppAnuncios.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-anuncio').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
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
                    var imgZoom;
                    for (var i = 0; i < qtd; i++) {

                        myPhotoBrowserAnuncio = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.anuncio[i].urlAnuncio],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserAnuncio.open();";

                        if (data.anuncio[i].urlAnuncio!="images/sem_foto_cont.jpg") {
                            imgAnuncio = '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-search-plus fa-3x"></i><img src="'+data.anuncio[i].urlAnuncio+'" '+imgZoom+' width="100%"></div>';
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
                        $('.tel-anuncio').attr('onclick','openURL("tel:'+trimespaco(data.anuncio[i].phoneAnuncio)+'")');
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
        myApp.actions(actionOptionCameraAnuncios);

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
        $$idcondominio = localStorage.getItem("condominioId");
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

    // retirar botão inserir
    if (localStorage.getItem("moradorIdmorador")) {
        $('.inserirocorrencias').removeClass('invisivel');
    }
    if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico") || localStorage.getItem("portariaIdportaria")) {
        $('.inserirocorrencias').addClass('invisivel');
    }
    if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {
        $('.inserirocorrencias').removeClass('invisivel');
    }

    myApp.showIndicator();
    //$('#ocorrencias-cont').html("");
    var idmorador = localStorage.getItem("moradorIdmorador");
    var idcondominio ="";

    if (localStorage.getItem("sindicoIdsindico") && localStorage.getItem("moradorIdmorador")) {
        idmorador = "";
        idcondominio = localStorage.getItem("condominioId");
    } else if (localStorage.getItem("administradoraIdadministradora") && localStorage.getItem("moradorIdmorador")) {
        idmorador = "";
        idcondominio = localStorage.getItem("condominioId");
    }

    $.ajax({
        url: "http://www.aptohome.com.br/admin/functionAppOcorrencia.php?idmorador="+idmorador+"&idcondominio="+idcondominio+"&action=list",
        dataType : "json",
        success: function(data) {
            if (data!=null) {
                var dataocorrencia = "";
                var qtd = data.ocorrencia.length;
                var delocorrencia = "";
                var swipeout = "";
                var invisivel = "invisivel";

                for (var i = 0; i < qtd; i++) {

                    if (localStorage.getItem("moradorIdmorador")==data.ocorrencia[i].idmorador) {
                        
                        swipeout = "swipeout";
                        invisivel= "";
                        console.log("idmorador = "+localStorage.getItem("moradorIdmorador"));
                        console.log("idmoradorocorrencia = "+data.ocorrencia[i].idmorador);

                    }

                    delocorrencia = "onclick = delocorrencia('"+data.ocorrencia[i].guid+"',"+i+");"
                    dataocorrencia += '<li class="'+swipeout+' swipeout-ocorrencia" data-index="'+i+'">'+
                                              '<a href="#livroocorrenciascont" onclick="livroocorrenciascont('+data.ocorrencia[i].idOcorrencia+')" class="swipeout-content item-link item-content">'+
                                                '<div class="item-media">'+
                                                  '<img src="'+data.ocorrencia[i].urlOcorrencia+'" >'+
                                                '</div>'+
                                                '<div class="item-inner">'+
                                                  '<div class="item-title-row">'+
                                                    '<div class="item-title">'+data.ocorrencia[i].nameMorador+'</div>'+
                                                  '</div>'+
                                                  '<div class="item-subtitle">'+data.ocorrencia[i].numMorador+' - '+data.ocorrencia[i].dataOcorrencia+'</div>'+
                                                  '<div class="item-text">'+data.ocorrencia[i].descricaoOcorrencia+'</div>'+
                                                '</div>'+
                                              '</a>'+
                                                  '<div class="'+invisivel+' swipeout-actions-right">'+
                                                    '<a href="#" '+delocorrencia+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
                                            '</li>';
                    $('#ocorrencias-cont').html(dataocorrencia);
                
                    swipeout = "";
                    invisivel = "invisivel";

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
/////////////////////////////////////  deletar ocorrencias ///////////////////////////
function delocorrencia(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppOcorrencia.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-ocorrencia').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
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
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                        myPhotoBrowserOcorrencia = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.ocorrencia[i].urlOcorrencia],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserOcorrencia.open();";


                    var imgOcorrencia = "";
                    
                    if (data.ocorrencia[i].urlOcorrencia!="images/sem_foto_icone.jpg") {
                        var imgOcorrencia = '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-search-plus fa-3x"></i><img src="'+data.ocorrencia[i].urlOcorrencia+'" '+imgZoom+' width="100%"></div>';
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
        myApp.actions(actionOptionCameraOcorrencia);
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
        $$idcondominio = localStorage.getItem("condominioId");
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

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inserirtransparenciadecontas').addClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
            $('.inserirtransparenciadecontas').removeClass('invisivel');
        }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppTransparencia.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datatransparencia = "";
                    var qtd = data.transparencia.length;
                    var deltransparencia = "";
                    var invisivel ="invisivel";
                    var swipeout ="";

                    for (var i = 0; i < qtd; i++) {

                        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
                            swipeout = "swipeout ";
                            invisivel="";
                        }

                    deltransparencia = "onclick = deltransparencia('"+data.transparencia[i].guid+"',"+i+");"
                    datatransparencia += '<li class="'+swipeout+' swipeout-transparencia" data-index="'+i+'">'+
                                              '<a href="#transparenciadecontascont" onclick="transparenciadecontascont('+data.transparencia[i].idTransparencia+')" class="swipeout-content item-link item-content">'+
                                                '<div class="item-media">'+
                                                  '<img src="'+data.transparencia[i].urlProfile+'" >'+
                                                '</div>'+
                                                '<div class="item-inner">'+
                                                  '<div class="item-title-row">'+
                                                    '<div class="item-title">'+data.transparencia[i].tituloTransparencia+'</div>'+
                                                  '</div>'+
                                                  '<div class="item-subtitle">'+data.transparencia[i].dataTransparencia+'</div>'+
                                                  '<div class="item-text">'+data.transparencia[i].descricaoTransparencia+'</div>'+
                                                '</div>'+
                                              '</a>'+
                                              '<div class="'+invisivel+' swipeout-actions-right">'+
                                                '<a href="#" '+deltransparencia+' class="action1 bg-red">Delete</a>'+
                                              '</div>'+                                            
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

/////////////////////////////////////  deletar transparencia ///////////////////////////
function deltransparencia(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppTransparencia.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-transparencia').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

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
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                        myPhotoBrowserTransparencia = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.transparencia[i].urlTransparencia],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserTransparencia.open();";

                if (data.transparencia[i].urlTransparencia!="images/sem_foto_icone.jpg") {
                    imgTransparencia = '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                '<img src="'+data.transparencia[i].urlTransparencia+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                datatransparencia += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgTransparencia +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.transparencia[i].urlProfile+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.transparencia[i].name+'</div>'+
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
        myApp.actions(actionOptionCameraTransparencia);
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
        $$idcondominio = localStorage.getItem("condominioId");
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
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idcondominio="+$$idcondominio+"&idadministradora="+$$idadministradora+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
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

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inserirservico').addClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
            $('.inserirservico').removeClass('invisivel');
        }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppServico.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var dataservico = "";
                    var qtd = data.servico.length;
                    var delservico = "";
                    var invisivel ="invisivel ";
                    var swipeout ="";

                    for (var i = 0; i < qtd; i++) {

                    if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
                        swipeout = "swipeout ";
                        invisivel="";
                    }

                        delservico = "onclick = delservico('"+data.servico[i].guid+"',"+i+");"
                        dataservico += '<li class="'+swipeout+' swipeout-servico" data-index="'+i+'">'+
                                                  '<a href="#servicocont" onclick="servicocont('+data.servico[i].idServico+')" class="swipeout-content item-link item-content">'+
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
                                                    '<div class="'+invisivel+'swipeout-actions-right">'+
                                                    '<a href="#" '+delservico+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
                                                '</li>';
                        $('#alertadechegadahome-cont').html(dataservico);
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

/////////////////////////////////////  deletar servico ///////////////////////////
function delservico(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppServico.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-servico').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

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
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                       myPhotoBrowserServicos = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.servico[i].urlServico],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserServicos.open();";

                if (data.servico[i].urlServico!="images/sem_foto_icone.jpg") {
                    imgServico = '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                '<img src="'+data.servico[i].urlServico+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                dataservico += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgServico +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.servico[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.servico[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">Condomínio: '+localStorage.getItem("condominioNome")+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.servico[i].tituloServico+'</p>'+
                                                '<p class="item-text">'+data.servico[i].descricaoServico+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgServico = "";
                $('#servicocont-cont').html(dataservico);
                $('.tel-anuncio').attr('onclick','openURL("tel:'+trimespaco(data.servico[i].phoneServico)+'")');
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
        myApp.actions(actionOptionCameraServico);
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
        $$idcondominio = localStorage.getItem("condominioId");
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

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inserircronograma').addClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
            $('.inserircronograma').removeClass('invisivel');
        }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppCronograma.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacronograma = "";
                    var qtd = data.cronograma.length;
                    var delcronograma = "";
                    var invisivel ="invisivel ";
                    var swipeout ="";
                    
                    for (var i = 0; i < qtd; i++) {

                    if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
                        swipeout = "swipeout ";
                        invisivel="";
                    }
                        delcronograma = "onclick = delcronograma('"+data.cronograma[i].guid+"',"+i+");"
                        datacronograma += '<li class="'+swipeout+' swipeout-cronograma" data-index="'+i+'">'+
                                                  '<a href="#cronogramacont" onclick="cronogramacont('+data.cronograma[i].idCronograma+')" class="swipeout-content item-link item-content">'+
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
                                                  '<div class="'+invisivel+'swipeout-actions-right">'+
                                                    '<a href="#" '+delcronograma+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
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

/////////////////////////////////////  deletar cronograma ///////////////////////////
function delcronograma(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppCronograma.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-cronograma').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

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
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                       myPhotoBrowserCronograma = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.cronograma[i].urlCronograma],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserCronograma.open();";

                if (data.cronograma[i].urlCronograma!="images/sem_foto_icone.jpg") {
                    imgCronograma= '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                '<img src="'+data.cronograma[i].urlCronograma+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                datacronograma += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgCronograma +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.cronograma[i].urlSindico+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.cronograma[i].nameSindico+'</div>'+
                                                '<div class="ks-facebook-date">Condomínio: '+localStorage.getItem("condominioNome")+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.cronograma[i].tituloCronograma+'</p>'+
                                                '<p class="item-text">'+data.cronograma[i].descricaoCronograma+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgCronograma = "";
                $('#cronogramacont-cont').html(datacronograma);
                $('.tel-cronograma').attr('onclick','openURL("tel:'+trimespaco(data.cronograma[i].phoneCronograma)+'")');
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
        myApp.actions(actionOptionCameraCronograma);
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
        $$idcondominio = localStorage.getItem("condominioId");
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
var ptrContent = $$('.morador');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        morador();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// morador ///////////////////////////
function morador(){

    myApp.showIndicator();
    //var datatransparencia;
    //$('#cronograma-cont').html("");

    // retirar botão inserir
    if (localStorage.getItem("moradorIdmorador")) {
        $('.inseriraddmorador').removeClass('invisivel');
    } else if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {
        $('.inseriraddmorador').removeClass('invisivel');
    } else if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico") || localStorage.getItem("portariaIdportaria")) {
        $('.inseriraddmorador').addClass('invisivel');
    }


        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?idcondominio="+localStorage.getItem("condominioId")+"&iddomicilio="+localStorage.getItem("moradorIddomicilio")+"&idbloco="+localStorage.getItem("moradorIdbloco")+"&action=listall",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datamorador = "";
                    var qtd = data.morador.length;
                    var delmorador = "";
                    for (var i = 0; i < qtd; i++) {
                        delmorador = "onclick = delmorador('"+data.morador[i].guid+"',"+i+");"
                        datamorador += '<li class="swipeout swipeout-morador" data-index="'+i+'">'+
                                                  '<a href="#moradorcont" onclick="moradorcont('+data.morador[i].idmorador+')" class="swipeout-content item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.morador[i].urlMorador+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+data.morador[i].name+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+data.morador[i].email+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                  '<div class="swipeout-actions-right">'+
                                                    '<a href="#" '+delmorador+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
                                                '</li>';
                        $('#morador-cont').html(datamorador);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#morador-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                myApp.hideIndicator();
                $('#morador-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}
////////////////////// deletar morador /////////////////////////
function delmorador(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-morador').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

}

///////////////////////////////////// morador conteudo ///////////////////////////
function moradorcont(id){

    myApp.showIndicator();
    //var dataservico;
    $('#moradorcont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?idmorador="+id+"&action=listall",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datamorador = "";
                var qtd = data.morador.length;
                var imgMorador = "";
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                       myPhotoBrowserMorador = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.morador[i].urlMorador],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserMorador.open();";


                if (data.morador[i].urlMorador!="images/sem_avatar_icone.jpg") {
                    imgMorador= '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-3x fa-search-plus"></i>'+
                                                '<img src="'+data.morador[i].urlMorador+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                datamorador += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgMorador +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-name">'+data.morador[i].name+'</div>'+
                                                '<div class="ks-facebook-date">'+data.morador[i].email+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                    imgMorador = "";
                $('#moradorcont-cont').html(datamorador);

                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera Morador ///////////////////////////

function cameraAddMorador() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessAddMorador, onFailAddMorador, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileAddMorador(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessAddMorador, onFailAddMorador, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessAddMorador(imageData) {
    var image = document.getElementById('preview-addmorador');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailAddMorador(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera Morador options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inseriraddmorador', function (page) {
    var actionOptionCamerAaddMorador = [
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
                    cameraAddMorador();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileAddMorador();
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
    $$('.optionCameraAddMorador').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCamerAaddMorador);
    });
    
});

///////////////////////////// acao inserir Add Morador ///////////////////////////
$('#butinseriraddmorador').on('click', function(){
    //alert("enviar");

    if (($$('#txtnomeaddmorador').val()!="") && ($$('#txtemailaddmorador').val()!="")) {

            enviaraddmorador();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});


///////////////////////////// inserir add morador ///////////////////////////
function enviaraddmorador()
{
 
 //alert("entrei");
        imagem = $('#preview-addmorador').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$txtNomeAddMorador = $$('#txtnomeaddmorador').val();
        $$txtEmailAddMorador = $$('#txtemailaddmorador').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $('#forminseriraddmorador').each (function(){
          this.reset();
        });
        $("#preview-addmorador").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppMorador.php?', {
            type: "post",
            data: "imagem="+imagem+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&txtNomeAddMorador="+$$txtNomeAddMorador+"&txtEmailAddMorador="+$$txtEmailAddMorador+"&action=addMorador",
        })
          .fail(function() {
            myApp.hideIndicator();
            myApp.alert('Erro! Tente novamente.', 'Aptohome');
          })     
          .done(function(data) {
            if (data=="ok") {
               myApp.hideIndicator();
                myApp.alert('Morador inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'morador'}); morador();});
            } else if (data=="erro"){
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert(data, 'Aptohome');
            }

          });
}




// Pull to refresh content
var ptrContent = $$('.visitante');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        visitante();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// visitante ///////////////////////////
function visitante(){

    myApp.showIndicator();
    //var datatransparencia;
    //$('#cronograma-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVisitante.php?idcondominio="+localStorage.getItem("condominioId")+"&iddomicilio="+localStorage.getItem("moradorIddomicilio")+"&idbloco="+localStorage.getItem("moradorIdbloco")+"&action=listall",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datavisitante = "";
                    var qtd = data.visitante.length;
                    var delvisitante ="";
                    var cor="";

                    var name ="";
                    var email ="";
                    var exibecont = "";

                    for (var i = 0; i < qtd; i++) {

                        name = data.visitante[i].name ? data.visitante[i].name : "";
                        email = data.visitante[i].email ? data.visitante[i].email : "";
                        dataini = data.visitante[i].horaini ? data.visitante[i].horaini : "";
                        horater = data.visitante[i].horater ? data.visitante[i].horater : "";
                        datavisit = 'Início: '+convertMysqldate(dataini)+'<br> Término: '+convertMysqldate(horater);

                        if (data.visitante[i].tipo=="1") {
                            cor="#3f51b5";
                            exibecont = email;
                        } else{
                            cor="#f44336";
                            exibecont = datavisit;
                        }

                        delvisitante = "onclick = delvisitante('"+data.visitante[i].guid+"',"+i+");"
                        datavisitante += '<li class="swipeout swipeout-visitante" data-index="'+i+'">'+
                                                  '<a href="#visitantecont" onclick="visitantecont('+data.visitante[i].idvisitante+')" class="swipeout-content item-link item-content">'+
                                                    '<div class="item-media" style="border:solid 4px '+cor+'">'+
                                                      '<img src="'+data.visitante[i].urlVisitante+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title">'+name+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+exibecont+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                  '<div class="swipeout-actions-right">'+
                                                    '<a href="#" '+delvisitante+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
                                                '</li>';
                        $('#visitante-cont').html(datavisitante);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#visitante-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                myApp.hideIndicator();
                $('#visitante-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

function delvisitante(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVisitante.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-visitante').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

}

///////////////////////////////////// visitante conteudo ///////////////////////////
function visitantecont(id){

    myApp.showIndicator();

    $('#visitantecont-cont').html("");
    var iddomicilio = localStorage.getItem("moradorIddomicilio") ? localStorage.getItem("moradorIddomicilio") : "";
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVisitante.php?idvisitante="+id+"&iddomicilio="+iddomicilio+"&action=listall",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datavisitante = "";
                var qtd = data.visitante.length;
                var imgVisitante = "";
                var imgZoom;
                var tempVisitante = "";

                var num_domicilio = "";
                var name = "";
                var cpf = "";
                var phone ="";
                var email ="";
                for (var i = 0; i < qtd; i++) {


                num_domicilio = data.visitante[i].num_domicilio ? data.visitante[i].num_domicilio : "";
                name = data.visitante[i].name ? data.visitante[i].name : "";
                cpf = data.visitante[i].cpf ? data.visitante[i].cpf : "";
                phone = data.visitante[i].phone ? data.visitante[i].phone : "";
                email = data.visitante[i].email ? data.visitante[i].email : "";

                myPhotoBrowserVisitante = myApp.photoBrowser({
                    theme: 'dark',
                    ofText: 'de',
                    backLinkText: '',
                    spaceBetween: 0,
                    navbar: true,
                    toolbar: false,
                    photos : [data.visitante[i].urlVisitante],
                    type: 'popup'
                });
                imgZoom = "onclick=myPhotoBrowserVisitante.open();";

                if (data.visitante[i].tipo==2) {
                    tempVisitante= '<div class="card-content-inner">'+
                                        '<p class="facebook-title">Visitante temporário</p>'+
                                        '<p class="facebook-date">Inicio: '+convertMysqldate(data.visitante[i].horaini)+' <br>Término: '+convertMysqldate(data.visitante[i].horater)+'</p>'+
                                    '</div>';
                }

                if (data.visitante[i].urlVisitante!="images/sem_avatar_icone.jpg") {
                    imgVisitante= '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-3x fa-search-plus"></i>'+
                                                '<img src="'+data.visitante[i].urlVisitante+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                datavisitante += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgVisitante +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-number">'+num_domicilio+'</div>'+
                                                '<div class="ks-facebook-name">'+name+'</div>'+
                                                '<div class="ks-facebook-date">'+cpf+'</div>'+
                                                '<div class="ks-facebook-date">'+phone+'</div>'+
                                                '<div class="ks-facebook-date">'+email+'</div>'+
                                            '</div>'+
                                            tempVisitante
                                        '</div>'+
                                    '</li>';

                    imgVisitante = "";
                $('#visitantecont-cont').html(datavisitante);

                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera visitante ///////////////////////////

function cameraVisitante() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessVisitante, onFailVisitante, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    targetHeight: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileVisitante(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessVisitante, onFailVisitante, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    targetHeight: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessVisitante(imageData) {
    var image = document.getElementById('preview-visitante');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailVisitante(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera Visitante options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirvisitante', function (page) {
    var actionOptionCameraVisitante = [
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
                    cameraVisitante();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileVisitante();
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
    $$('.optionCameraVisitante').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraVisitante);
    });
    
});

$$('.label-radio-visitante-temp').on('click', function (e) {

        $$('.inserirvisitantehora').addClass("visivel");
});
$$('.label-radio-visitante-per').on('click', function (e) {

        $$('.inserirvisitantehora').removeClass("visivel");
});

///////////////////////////// acao inserir Visitante ///////////////////////////
$('#butinserirvisitante').on('click', function(){
    //alert("enviar");

    if (($$('#txtnomevisitante').val()!="")) {

            enviarvisitante();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir visitante ///////////////////////////
function enviarvisitante()
{
 
 //alert("entrei");
        imagem = $('#preview-visitante').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$txtNomeVisitante = $$('#txtnomevisitante').val();
        $$txtEmailVisitante = $$('#txtemailvisitante').val();
        $$txtCpfVisitante = $$('#txtcpfvisitante').val();
        $$txtPhoneVisitante = $$('#txtphonevisitante').val();
        $$txtTipoVisitante = $$('#txttipovisitante:checked').val();
        $$txtHoraInicio = $$('#txthorainiciotempvisitante').val();
        $$txtHoraTermino = $$('#txthoraterminotempvisitante').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $('#forminserirvisitante').each (function(){
          this.reset();
        });
        $("#preview-visitante").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppVisitante.php?', {
            type: "post",
            data: "imagem="+imagem+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&txtNomeVisitante="+$$txtNomeVisitante+"&txtEmailVisitante="+$$txtEmailVisitante+"&txtCpfVisitante="+$$txtCpfVisitante+"&txtPhoneVisitante="+$$txtPhoneVisitante+"&txtTipoVisitante="+$$txtTipoVisitante+"&txtHoraInicio="+$$txtHoraInicio+"&txtHoraTermino="+$$txtHoraTermino+"&action=add",
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
                myApp.alert('Visitante inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'visitante'}); visitante();});
            }
          });
}




// Pull to refresh content
var ptrContent = $$('.veiculo');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        veiculo();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// veiculo ///////////////////////////
function veiculo(){

    myApp.showIndicator();
    //var datatransparencia;
    //$('#cronograma-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVeiculo.php?idcondominio="+localStorage.getItem("condominioId")+"&iddomicilio="+localStorage.getItem("moradorIddomicilio")+"&idbloco="+localStorage.getItem("moradorIdbloco")+"&action=listall",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var dataveiculo = "";
                    var qtd = data.veiculo.length;
                    var tipo ="";
                    var delveiculo ="";
                    for (var i = 0; i < qtd; i++) {

                        if (data.veiculo[i].tipo=="1") {
                            tipo = "Carro";
                        } else {
                            tipo = "Moto";
                        }

                        delveiculo = "onclick = delveiculo('"+data.veiculo[i].guid+"',"+i+");"
                        dataveiculo += '<li class="swipeout swipeout-veiculo" data-index="'+i+'">'+
                                                  '<a href="#veiculocont" onclick="veiculocont('+data.veiculo[i].idveiculo+')" class="swipeout-content item-link item-content">'+
                                                    '<div class="item-media" style="border:solid 4px '+data.veiculo[i].cor+'">'+
                                                      '<img src="'+data.veiculo[i].urlVeiculo+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row">'+
                                                        '<div class="item-title item-title-veiculo">'+data.veiculo[i].placa+'</div>'+
                                                      '</div>'+
                                                      '<div class="item-text">'+tipo+'</div>'+
                                                      '<div class="item-text">'+data.veiculo[i].marca+' - '+data.veiculo[i].modelo+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                  '<div class="swipeout-actions-right">'+
                                                    '<a href="#" '+delveiculo+' class="action1 bg-red">Delete</a>'+
                                                  '</div>'+
                                                '</li>';
                        $('#veiculo-cont').html(dataveiculo);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#veiculo-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            },error: function(data) {
                myApp.hideIndicator();
                $('#veiculo-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// deletar veiculo ///////////////////////////
function delveiculo(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVeiculo.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-veiculo').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

}

///////////////////////////////////// veiculo conteudo ///////////////////////////
function veiculocont(id){

    myApp.showIndicator();

    $('#veiculocont-cont').html("");
    var iddomicilio = localStorage.getItem("moradorIddomicilio") ? localStorage.getItem("moradorIddomicilio") : "";
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppVeiculo.php?idveiculo="+id+"&iddomicilio="+iddomicilio+"&action=listall",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var dataveiculo = "";
                var qtd = data.veiculo.length;
                var imgVeiculo = "";
                var tipo;
                var imgZoom;
                for (var i = 0; i < qtd; i++) {

                       myPhotoBrowserVeiculo = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.veiculo[i].urlVeiculo],
                            type: 'popup'
                        });
                        imgZoom = "onclick=myPhotoBrowserVeiculo.open();";

                if (data.veiculo[i].tipo=="1") {
                    tipo = "Carro";
                } else {
                    tipo = "Moto";
                }

                if (data.veiculo[i].urlVeiculo!="images/sem_foto_icone.jpg") {
                    imgVeiculo= '<div class="card-content-cont"><i '+imgZoom+' class="fa fa-3x fa-search-plus"></i>'+
                                                '<img src="'+data.veiculo[i].urlVeiculo+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                dataveiculo += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgVeiculo +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-number" style="background:'+data.veiculo[i].cor+'">'+data.veiculo[i].num_domicilio+'</div>'+
                                                '<div class="ks-facebook-name">'+data.veiculo[i].placa+'</div>'+
                                                '<div class="ks-facebook-date">'+tipo+'</div>'+
                                                '<div class="ks-facebook-date">'+data.veiculo[i].marca+'</div>'+
                                                '<div class="ks-facebook-date">'+data.veiculo[i].modelo+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';

                    imgVeiculo = "";
                $('#veiculocont-cont').html(dataveiculo);

                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
}

///////////////////////////// camera Veiculo ///////////////////////////

function cameraVeiculo() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessVeiculo, onFailVeiculo, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    targetHeight: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileVeiculo(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessVeiculo, onFailVeiculo, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    targetHeight: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessVeiculo(imageData) {
    var image = document.getElementById('preview-veiculo');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailVeiculo(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera Veiculo options ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserirveiculo', function (page) {
    var actionOptionCameraVeiculo = [
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
                    cameraVeiculo();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileVeiculo();
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
    $$('.optionCameraVeiculo').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraVeiculo);
    });
    
});

///////////////////////////// acao inserir Veiculo ///////////////////////////
$('#butinserirveiculo').on('click', function(){
    //alert("enviar");

    if (($$('#txttipoveiculo').val()!="") && ($$('#txtmarcaveiculo').val()!="") && ($$('#txtmodeloveiculo').val()!="") && ($$('#txtcorveiculo').val()!="") && ($$('#txtplacaveiculo').val()!="")) {

            enviarveiculo();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir veiculo ///////////////////////////
function enviarveiculo()
{
 
 //alert("entrei");
        imagem = $('#preview-veiculo').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$txtTipoVeiculo = $$('#txttipoveiculo').val();
        $$txtMarcaVeiculo = $$('#txtmarcaveiculo').val();
        $$txtModeloVeiculo = $$('#txtmodeloveiculo').val();
        $$txtCorVeiculo = $$('#txtcorveiculo').val();
        $$txtPlacaVeiculo = $$('#txtplacaveiculo').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $('#forminserirveiculo').each (function(){
          this.reset();
        });
        $("#preview-veiculo").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppVeiculo.php?', {
            type: "post",
            data: "imagem="+imagem+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&txtTipoVeiculo="+$$txtTipoVeiculo+"&txtMarcaVeiculo="+$$txtMarcaVeiculo+"&txtModeloVeiculo="+$$txtModeloVeiculo+"&txtCorVeiculo="+$$txtCorVeiculo+"&txtPlacaVeiculo="+$$txtPlacaVeiculo+"&action=add",
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
                myApp.alert('Veículo inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'veiculo'}); veiculo();});
            }
          });
}



///////////////////////////// acao inserir comunicado condominio ///////////////////////////
$('#inserircomuncondominio').on('click', function(){
    //alert("enviar");
    listBloco();
});

////////////////// listar blocos form comunicados /////////////////
    function listBloco(){
        $('.domiciliolistcomunicadoli').removeClass("visivel");
        $('.moradorlistcomunicadoli').removeClass("visivel");

        myApp.showIndicator();
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?idcondominio="+localStorage.getItem("condominioId")+"&action=listBlocos",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var semBloco = "";
                    var idBloco ="";
                    var qtd = data.blocos.length;
                    var blocolistcomunicado = "";
                    var selected = "";
                    var adminSind = "";

                    if ((localStorage.getItem("administradoraEmail")) || (localStorage.getItem("sindicoEmail") || (localStorage.getItem("portariaIdportaria")))) {
                        adminSind = '<option value="" selected="selected">Todos</option>';
                    }
                    if ((localStorage.getItem("sindicoIdsindico")) && (localStorage.getItem("moradorIdmorador"))) {
                        adminSind = '';
                    }

                        blocolistcomunicado += adminSind;
                        
                    for (var i = 0; i < qtd; i++) {

                        semBloco = data.blocos[i].numBloco;
                        idBloco = data.blocos[i].idBloco;

                        if ((!localStorage.getItem("administradoraEmail")) && (!localStorage.getItem("sindicoEmail"))) {
                            if (idBloco==localStorage.getItem("moradorIdbloco")){
                                var selected = 'selected="selected"';
                                listDomicilio(localStorage.getItem("moradorIdbloco"));
                                console.log(idBloco);
                                console.log(localStorage.getItem("moradorIdbloco"));
                            }
                        }

                        blocolistcomunicado += '<option '+selected+' value="'+data.blocos[i].idBloco+'">'+data.blocos[i].numBloco+'</option>';
                        selected = "";
                    }

                    if (semBloco=="Sem Bloco") {
                        blocolistcomunicado = "";
                        listDomicilio(idBloco);
                    }
                }
                $('.blocolistcomunicadoli').addClass("visivel");
                $('.blocolistcomunicado').html(blocolistcomunicado);
                myApp.hideIndicator(); 
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro ao carregar dados, tente novamente!', 'Aptohome', function () { mainView.router.load({pageName: 'comuncondominio'}); comuncondominio();});
            }
        });
    }

////////////////// listar domicílios form comunicados /////////////////
    function listDomicilio(idBloco){
        $('.moradorlistcomunicadoli').removeClass("visivel");
        if (idBloco==null) {
            console.log("idBloco = null");
            if ((localStorage.getItem("administradoraIdadministradora")) || (localStorage.getItem("sindicoIdsindico") && !localStorage.getItem("moradorIdmorador"))) {
                idBloco=$$("#blocolist").val();
            } else if ((localStorage.getItem("sindicoIdsindico")) && (localStorage.getItem("moradorIdmorador"))) {
                idBloco=$$("#blocolistmorador").val();
            } else if (localStorage.getItem("portariaIdportaria")) {
                idBloco=$$("#blocolistportaria").val();
            } else if (localStorage.getItem("moradorIdmorador")) {
                idBloco=$$("#blocolistmorador").val();
            }
        }
        myApp.showIndicator();
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?idbloco="+idBloco+"&idcondominio="+localStorage.getItem("condominioId")+"&action=listDomicilios",
            dataType : "json",
            success: function(data) {
                console.log("entrei-success");
                $('.domiciliolistcomunicado').html("");
                if (data!=null) {
                    myApp.hideIndicator();
                    var qtd = data.domicilios.length;
                    var domiciliolistcomunicado = "";
                    var adminSind = "";
                    var idDomicilio = "";

                    if ((localStorage.getItem("administradoraEmail")) || (localStorage.getItem("sindicoEmail") || (localStorage.getItem("portariaIdportaria")))) {
                        adminSind = '<option value="">Todos</option>';
                        console.log(adminSind);
                    } else{
                        adminSind = '<option value="">Selecione um Apto</option>';
                    }

                    domiciliolistcomunicado += adminSind;

                    for (var i = 0; i < qtd; i++) {

                        idDomicilio = data.domicilios[i].idDomicilio

                        if ((!localStorage.getItem("administradoraEmail")) && (!localStorage.getItem("sindicoEmail"))) {
                            if (idDomicilio==localStorage.getItem("moradorIddomicilio")){
                                var selected = 'selected="selected"';
                                listMoradores(idDomicilio);
                            }
                        }


                        domiciliolistcomunicado += '<option '+selected+' value="'+data.domicilios[i].idDomicilio+'">'+data.domicilios[i].numDomicilio+'</option>';
                    
                    }

                }
                $('.domiciliolistcomunicadoli').addClass("visivel");
                $('.domiciliolistcomunicado').html(domiciliolistcomunicado);
                myApp.hideIndicator();
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro ao carregar dados, tente novamente!');
                $('.domiciliolistcomunicado').html("");

            }
        });
        idBloco = null;
    }                          


////////////////// listar moradores form comunicados /////////////////
    function listMoradores(idDomicilio){
        if (idDomicilio==null) {
            if ((localStorage.getItem("administradoraIdadministradora")) || (localStorage.getItem("sindicoIdsindico") && !localStorage.getItem("moradorIdmorador"))) {
                idDomicilio=$$("#domiciliolist").val();
            } else if ((localStorage.getItem("sindicoIdsindico")) && (localStorage.getItem("moradorIdmorador"))) {
                idDomicilio=$$("#domiciliolistmorador").val();
            } else if (localStorage.getItem("portariaIdportaria")) {
                idDomicilio=$$("#domiciliolistportaria").val();
            } else if (localStorage.getItem("moradorIdmorador")) {
                if ($$("#domiciliolistmorador").val()!="") {
                    idDomicilio=$$("#domiciliolistmorador").val();
                    console.log(idDomicilio);
                }else{
                    return false;
                }
            }
        }

        myApp.showIndicator();
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppMorador.php?iddomicilio="+idDomicilio+"&idcondominio="+localStorage.getItem("condominioId")+"&action=listMoradores",
            dataType : "json",
            success: function(data) {
                console.log("entrei-success");
                $('.moradorlistcomunicado').html("");
                if (data!=null) {
                    myApp.hideIndicator();
                    var qtd = data.moradores.length;
                    var moradorlistcomunicado = "";
                    var adminSind = "";

                    if ((localStorage.getItem("administradoraEmail")) || (localStorage.getItem("sindicoEmail") || (localStorage.getItem("portariaIdportaria")))) {
                        adminSind = '<option value="">Todos</option>';
                        console.log(adminSind);
                    }

                    moradorlistcomunicado += adminSind;

                    for (var i = 0; i < qtd; i++) {

                                    moradorlistcomunicado += '<option value="'+data.moradores[i].idMorador+'">'+data.moradores[i].name+'</option>';
                    
                    }
                                moradorlistcomunicado += '</select>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>';
                }
                $('.moradorlistcomunicadoli').addClass("visivel");
                $('.moradorlistcomunicado').html(moradorlistcomunicado);
                myApp.hideIndicator();
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro ao carregar dados, tente novamente!');
                $('.domiciliolistcomunicado').html("");
                $('.moradorlistcomunicado').html("");

            }
        });
        idDomicilio = null;
    }  



// Pull to refresh content
var ptrContent = $$('.comuncondominio');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        comuncondominio();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// Comunicado comuncondominio ///////////////////////////

function comuncondominio(alvo){
    //console.log("alvo = "+alvo);
    myApp.showIndicator();
    //var datatransparencia;
    $('.badgecomunicado').html();
    badgecomunicado=0;

    $('.tab-link').removeClass('active');
    $('.tab-1').addClass('active');
    $('.tab-1').addClass('active');

    if (localStorage.getItem("administradoraIdadministradora")) {
        $('#comuncondominio').removeClass('with-subnavbar');
        $('.tabbar').removeClass('toolbar');
    }
    if (localStorage.getItem("administradoraIdadministradora")) {
        $('#comuncondominio').removeClass('with-subnavbar');
        $('.tabbar').removeClass('toolbar');
    }
    if (localStorage.getItem("sindicoIdsindico") && !localStorage.getItem("moradorIdmorador")) {
        $('#comuncondominio').removeClass('with-subnavbar');
        $('.tabbar').removeClass('toolbar');
    }

    if (localStorage.getItem("portariaIdportaria")) {
        $('#comuncondominio').removeClass('with-subnavbar');
        $('.tabbar').removeClass('toolbar');
        comunportaria();
        return false;
    }

    $('.comunportaria').addClass('invisivel');
    $('.comunmorador').addClass('invisivel');
    $('.comuncondominio').removeClass('invisivel');
    $('.inserircomuncondominio').removeClass('invisivel');
    $('.inserircomunportaria').addClass('invisivel');
    $('.inserircomunmorador').addClass('invisivel');

    if (localStorage.getItem("moradorIdmorador")) {
        $('.inserircomuncondominio').addClass('invisivel');

    }
    if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {
        $('.inserircomuncondominio').removeClass('invisivel');
    }
    if (localStorage.getItem("administradoraIdadministradora")) {
        $('.inserircomuncondominio').removeClass('invisivel');
    }
    var iddomicilio = localStorage.getItem("moradorIddomicilio");
    var idbloco = localStorage.getItem("moradorIdbloco");
    var iddestino = localStorage.getItem("moradorIdmorador");
    var idportaria = localStorage.getItem("portariaIdportaria");

    if (localStorage.getItem("sindicoIdsindico")) {
        var idsindico = localStorage.getItem("sindicoIdsindico");
        iddomicilio = "";
        idbloco = "";
        iddestino = "";
    } else{
        var idsindico = "";
    }
    /*}else{
        var idsindico = localStorage.getItem("moradorIdsindico");
    }*/

    if (localStorage.getItem("administradoraIdadministradora")) {
        var idadministradora = localStorage.getItem("administradoraIdadministradora");
        iddomicilio = "";
        idbloco = "";
        iddestino = "";
    } else{
        var idadministradora = "";
    }
    /*}else{
        var idadministradora = localStorage.getItem("moradorIdadministradora");
    }*/

    if (idportaria ==null){idportaria=""};

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunCondominio.php?idcondominio="+localStorage.getItem("condominioId")+"&idadministradora="+idadministradora+"&iddestino="+iddestino+"&idbloco="+idbloco+"&iddomicilio="+iddomicilio+"&idsindico="+idsindico+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacomunicado = "";
                    var qtd = data.comunicado.length;

                    for (var i = 0; i < qtd; i++) {

                        if ((data.comunicado[i].name==localStorage.getItem("sindicoNome")) || (data.comunicado[i].name==localStorage.getItem("moradorNome")) || (data.comunicado[i].name==localStorage.getItem("administradoraNome"))) {
                            send = 'right';
                            colorsend = ' color-green';
                        } else {
                            send = 'left';
                            colorsend = ' color-red';
                        }

                        datacomunicado += '<li date-date="'+data.comunicado[i].dataComunicado+'">'+
                                                  '<a href="#comunicadocont" onclick="comuncomunicadocont('+data.comunicado[i].idComunicado+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.comunicado[i].urlProfile+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row no-arrow">'+
                                                        '<div class="item-title">'+data.comunicado[i].name+'</div>'+
                                                        '<div class="item-after"><i class="fa fa-lg fa-arrow-circle-'+send+colorsend+'"></i></div>'+
                                                      '</div>'+
                                                      '<div class="item-subtitle">'+data.comunicado[i].dataComunicado+'</div>'+
                                                      '<div class="item-text">'+data.comunicado[i].tituloComunicado+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                    $("#comuncondominio-cont").html(datacomunicado);
    
                    }

                ////// reordenar lista por data decrescente ///////
                var mylist = $('#comuncondominio-cont');
                var listitems = mylist.children('li').get();
                listitems.sort(function(a, b) {
                   var compA = convertToAmericanDate($(a).attr('date-date'));
                   var compB = convertToAmericanDate($(b).attr('date-date'));

                   return (compB < compA) ? -1 : (compB > compA) ? 1 : 0;
                })
                $.each(listitems, function(idx, itm) { mylist.append(itm); });               

                }else{
                    myApp.hideIndicator();
                    $("#comuncondominio-cont").html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }            
            },error: function(data) {
                myApp.hideIndicator();
                $("#comuncondominio-cont").html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// comuncomunicado conteudo ///////////////////////////
function comuncomunicadocont(id){
    
    if (badgecomunicado>0) {
        badgecomunicado--;
        $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
    } else {
        $('.badgecomunicado').html('');
    }
    
    myApp.showIndicator();
    $('#comunicadocont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunCondominio.php?idcomuncondominio="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datacomunicado = "";
                var qtd = data.comunicado.length;
                var imgTransparencia = "";
                var imgComunicado = "";
                var imgZoom;
                var imgTitle = "Aptohome";
                for (var i = 0; i < qtd; i++) {

                    if (data.comunicado[i].urlComunicado!="images/sem_foto_icone.jpg") {

                        myPhotoBrowserComunicadocont = myApp.photoBrowser({
                            theme: 'dark',
                            ofText: 'de',
                            backLinkText: '',
                            spaceBetween: 0,
                            navbar: true,
                            toolbar: false,
                            photos : [data.comunicado[i].urlComunicado],
                            type: 'popup'
                        });

                            imgZoom = "onclick=myPhotoBrowserComunicadocont.open();";
                            imgComunicado = '<div class="card-content-cont">'+
                                                        '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                        '<img src="'+data.comunicado[i].urlComunicado+'" '+imgZoom+' width="100%">'+
                                                    '</div>';
                    }

                    datacomunicado += '<li>'+
                                            '<div class="card-cont ks-facebook-card">'+ imgComunicado +
                                                '<div class="card-header">'+
                                                    '<div class="ks-facebook-avatar">'+
                                                        '<img src="'+data.comunicado[i].urlProfile+'" width="34">'+
                                                    '</div>'+
                                                    '<div class="ks-facebook-name">'+data.comunicado[i].name+'</div>'+
                                                    '<div class="ks-facebook-date">'+data.comunicado[i].dataComunicado+'</div>'+
                                                '</div>'+
                                                '<div class="card-content-inner">'+
                                                    '<p class="facebook-title">'+data.comunicado[i].tituloComunicado+'</p>'+
                                                    '<p class="facebook-date">'+data.comunicado[i].descricaoComunicado+'</p>'+
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

        /////////// lista as respostas //////////
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppResposta.php?idpostdestino="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            
                var dataresposta = '<li class="content-block-title">Respostas</li>';
                var qtd = data.resposta.length;
                var imgResposta = "";
                var imgZoom;
                var imgTitle = "Aptohome";

                for (var i = 0; i < qtd; i++) {

                    if (data.resposta[i].urlResposta!="images/sem_foto_icone.jpg") {

                    myPhotoBrowserRespostacont = myApp.photoBrowser({
                        theme: 'dark',
                        ofText: 'de',
                        backLinkText: '',
                        spaceBetween: 0,
                        navbar: true,
                        toolbar: false,
                        photos : [data.resposta[i].urlResposta],
                        type: 'popup'
                    });

                        imgZoom = "onclick=myPhotoBrowserRespostacont.open();";
                        imgResposta = '<div class="card-content-cont">'+
                                                    '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                    '<img src="'+data.resposta[i].urlResposta+'" '+imgZoom+' width="100%">'+
                                                '</div>';
                    }

                    dataresposta += '<li>'+
                                            '<div class="card-cont ks-facebook-card">'+ imgResposta +
                                                '<div class="card-header">'+
                                                    '<div class="ks-facebook-avatar">'+
                                                        '<img src="'+data.resposta[i].urlProfile+'" width="34">'+
                                                    '</div>'+
                                                    '<div class="ks-facebook-name">'+data.resposta[i].name+'</div>'+
                                                    '<div class="ks-facebook-date">'+data.resposta[i].dataResposta+'</div>'+
                                                '</div>'+
                                                '<div class="card-content-inner">'+
                                                    '<p class="facebook-title">'+data.resposta[i].tituloResposta+'</p>'+
                                                    '<p class="facebook-date">'+data.resposta[i].descricaoResposta+'</p>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li>';
                    imgResposta = "";
                }

                $('#comunicadorespcont-cont').append(dataresposta);

            },error: function(data) {
                //myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });

        dataresp = '<div class="content-block-title">Envie sua resposta</div>'+
                    '<div class="list-block">'+
                      '<ul>'+
                        '<li>'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Título</div>'+
                              '<div class="item-input">'+
                              '<input type="hidden" id="iddestinoresp" value="13">'+
                              '<input type="hidden" id="idpostdestinoresp" value="'+id+'">'+
                              '<input type="text" id="txttitresp" onKeyUp=tabenter(event,getElementById("txtdescricaoresp")) placeholder="Informe um título">'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                        '<li class="align-top">'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Descrição</div>'+
                                '<div class="item-input">'+
                                    '<textarea id="txtdescricaoresp" class="resizable" style="height:76px" placeholder="Informe uma descrição"></textarea>'+
                                '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                        '<li>'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Imagem</div>'+
                              '<div class="item-input">'+
                                '<div id="imagem-resp" class="optionCameraResp custom-file-input" onClick="optionCameraResp()"></div>'+
                                  '<div class="img-preview">'+
                                    '<img src="" id="preview-resp"  width="100" height="80">'+
                                  '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                      '</ul>'+
                    '</div>'+
                    '<div class="content-block"><a href="#" id="butinserirresp" onclick="butinserirresp()" class="button button-big button-fill button-raised color-indigo button-full">ENVIAR</a></div>';
            
            $('.resp-cont').html(dataresp);

}

///////////////////////////// camera comunicado condominio ///////////////////////////

function cameraComuncondominio() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessComuncondominio, onFailComuncondominio, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileComuncondominio(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessComuncondominio, onFailComuncondominio, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessComuncondominio(imageData) {
    var image = document.getElementById('preview-comuncondominio');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailComuncondominio(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera comunicado condominio ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserircomuncondominio', function (page) {
    var actionOptionCameraComuncondominio = [
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
                    cameraComuncondominio();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileComuncondominio();
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
    $$('.optionCameraComuncondominio').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraComuncondominio);
    });
    
});

///////////////////////////// acao inserir comunicado condominio ///////////////////////////
$('#butinserircomuncondominio').on('click', function(){
    //alert("enviar");

    if (($$('#txttitcomuncondominio').val()!="") &&  ($$('#txtdescricaocomuncondominio').val()!="")) {

            enviarcomuncondominio();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir comunicado condominio ///////////////////////////
function enviarcomuncondominio()
{
 
 //alert("entrei");
        imagem = $('#preview-comuncondominio').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");
        $$idbloco = $$('#blocolist').val();
        $$iddomicilio = $$('#domiciliolist').val();
        $$iddestino = $$('#moradorlist').val();
        
        $$txtTitulo = $$('#txttitcomuncondominio').val();
        $$txtDescricao = $$('#txtdescricaocomuncondominio').val();


        if (localStorage.getItem("sindicoIdsindico")) {
            $$idsindico = localStorage.getItem("sindicoIdsindico");
        } else{
            $$idsindico = "";
        }
        /*}else{
            $$idsindico = localStorage.getItem("moradorIdsindico");
        }*/
        if (localStorage.getItem("administradoraIdadministradora")) {
            $$idadministradora = localStorage.getItem("administradoraIdadministradora");
        } else {
            $$idadministradora = "";
        } 


        /*else{
            if ($$iddestino!="") {
                $$idadministradora = "";
            }else{
                $$idadministradora = localStorage.getItem("moradorIdadministradora");
            }
        }*/


        $("#preview-comuncondominio").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppComunCondominio.php?', {
            type: "post",
            data: "imagem="+imagem+"&idsindico="+$$idsindico+"&idadministradora="+$$idadministradora+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&iddestino="+$$iddestino+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
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
                myApp.alert('Comunicado inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'comuncondominio'}); comuncondominio();});
            }
          });
}




// Pull to refresh content
var ptrContent = $$('.comunportaria');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        comunportaria();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});


////////////////// listar porteiros/////////////////
    function listPortaria(){

        myApp.showIndicator();
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunPortaria.php?idcondominio="+localStorage.getItem("condominioId")+"&action=listPortaria",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var idPortaria ="";
                    var qtd = data.portaria.length;
                    var listportaria = "";
                    var selected = "";
                    var adminSind = "";

                        adminSind = '<option value="" selected="selected">Todos</option>';

                        listportaria += adminSind;
                        
                    for (var i = 0; i < qtd; i++) {

                        semBloco = data.portaria[i].numBloco;
                        idBloco = data.portaria[i].idPortaria;

                        listportaria += '<option value="'+data.portaria[i].idPortaria+'">'+data.portaria[i].name+'</option>';
                        selected = "";
                    }
                }

                $('.portarialistportaria').html(listportaria);
                myApp.hideIndicator(); 
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro ao carregar dados, tente novamente!', 'Aptohome', function () { mainView.router.load({pageName: 'comunportaria'}); comunportaria();});
            }
        });
    }

// Pull to refresh content
var ptrContent = $$('.comunportariahome');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        comunportariahome();
        alert("refresh portaria");
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

function teste (){
    alert("setInterval 10 seg");
}

///////////////////////////////////// Comunicado comunportaria home ///////////////////////////

function comunportariahome(alvo){

    myApp.showIndicator();
    //var datatransparencia;
    $('.badgecomunicado').html();
    badgecomunicado=0;

    $('.tab-link').removeClass('active');
    $('.tab-2').addClass('active');

    if (localStorage.getItem("portariaIdportaria")) {
        var idportaria = localStorage.getItem("portariaIdportaria");
    } else{
        var idportaria = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var idmorador = localStorage.getItem("moradorIdmorador");
    } else{
        var idmorador = "";
    }
    if (localStorage.getItem("sindicoIdsindico")) {
        var idsindico = localStorage.getItem("sindicoIdsindico");
    } else{
        var idsindico = "";
    }
    if (localStorage.getItem("administradoraIdadministradora")) {
        var idadministradora = localStorage.getItem("administradoraIdadministradora");
    } else{
        var idadministradora = "";
    }
    if (localStorage.getItem("moradorIddomicilio")) {
        var iddomicilio = localStorage.getItem("moradorIddomicilio");
    } else{
        var iddomicilio = "";
    }
    if (localStorage.getItem("moradorIdbloco")) {
        var idbloco = localStorage.getItem("moradorIdbloco");
    } else{
        var idbloco = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var iddestino = localStorage.getItem("moradorIdmorador");
    } else{
        var iddestino = "";
    }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunPortaria.php?idcondominio="+localStorage.getItem("condominioId")+"&idadministradora="+idadministradora+"&iddestino="+iddestino+"&idmorador="+idmorador+"&idbloco="+idbloco+"&iddomicilio="+iddomicilio+"&idsindico="+idsindico+"&idportaria="+idportaria+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacomunicado = "";
                    var qtd = data.comunicado.length;
                    for (var i = 0; i < qtd; i++) {

                        if ((data.comunicado[i].name==localStorage.getItem("portariaNome")) || (data.comunicado[i].name==localStorage.getItem("moradorNome"))) {
                            send = 'right';
                            colorsend = ' color-green';
                        } else {
                            send = 'left';
                            colorsend = ' color-red';
                        }

                        datacomunicado += '<li>'+
                                                  '<a href="#comunicadocont" onclick="comunportariacont('+data.comunicado[i].idComunicado+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.comunicado[i].urlProfile+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row no-arrow">'+
                                                        '<div class="item-title">'+data.comunicado[i].name+'</div>'+
                                                        '<div class="item-after"><i class="fa fa-lg fa-arrow-circle-'+send+colorsend+'"></i></div>'+
                                                      '</div>'+
                                                      '<div class="item-subtitle">'+data.comunicado[i].dataComunicado+'</div>'+
                                                      '<div class="item-text">'+data.comunicado[i].tituloComunicado+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#comunportariahome-cont').html(datacomunicado);
                    }
                    //setTimeout(comunportariahome, 30000);
                }else{
                    myApp.hideIndicator();
                    $('#comunportariahome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }            
            },error: function(data) {
                myApp.hideIndicator();
                $('#comunportariahome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
    return false;
}

///////////////////////////////////// Comunicado comunportaria ///////////////////////////

function comunportaria(alvo){

    myApp.showIndicator();
    //var datatransparencia;
    $('.badgecomunicado').html();
    badgecomunicado=0;

    $('.tab-link').removeClass('active');
    $('.tab-2').addClass('active');

    $('.comunportaria').removeClass('invisivel');
    $('.comunmorador').addClass('invisivel');
    $('.comuncondominio').addClass('invisivel');
    $('.inserircomunportaria').removeClass('invisivel');
    $('.inserircomuncondominio').addClass('invisivel');
    $('.inserircomunmorador').addClass('invisivel');

    if (localStorage.getItem("portariaIdportaria")) {
        var idportaria = localStorage.getItem("portariaIdportaria");
    } else{
        var idportaria = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var idmorador = localStorage.getItem("moradorIdmorador");
    } else{
        var idmorador = "";
    }
    if (localStorage.getItem("sindicoIdsindico")) {
        var idsindico = localStorage.getItem("sindicoIdsindico");
    } else{
        var idsindico = "";
    }
    if (localStorage.getItem("administradoraIdadministradora")) {
        var idadministradora = localStorage.getItem("administradoraIdadministradora");
    } else{
        var idadministradora = "";
    }
    if (localStorage.getItem("moradorIddomicilio")) {
        var iddomicilio = localStorage.getItem("moradorIddomicilio");
    } else{
        var iddomicilio = "";
    }
    if (localStorage.getItem("moradorIdbloco")) {
        var idbloco = localStorage.getItem("moradorIdbloco");
    } else{
        var idbloco = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var iddestino = localStorage.getItem("moradorIdmorador");
    } else{
        var iddestino = "";
    }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunPortaria.php?idcondominio="+localStorage.getItem("condominioId")+"&idadministradora="+idadministradora+"&iddestino="+iddestino+"&idmorador="+idmorador+"&idbloco="+idbloco+"&iddomicilio="+iddomicilio+"&idsindico="+idsindico+"&idportaria="+idportaria+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacomunicado = "";
                    var qtd = data.comunicado.length;
                    for (var i = 0; i < qtd; i++) {

                        if ((data.comunicado[i].name==localStorage.getItem("portariaNome")) || (data.comunicado[i].name==localStorage.getItem("moradorNome"))) {
                            send = 'right';
                            colorsend = ' color-green';
                        } else {
                            send = 'left';
                            colorsend = ' color-red';
                        }

                        datacomunicado += '<li>'+
                                                  '<a href="#comunicadocont" onclick="comunportariacont('+data.comunicado[i].idComunicado+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.comunicado[i].urlProfile+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                      '<div class="item-title-row no-arrow">'+
                                                        '<div class="item-title">'+data.comunicado[i].name+'</div>'+
                                                        '<div class="item-after"><i class="fa fa-lg fa-arrow-circle-'+send+colorsend+'"></i></div>'+
                                                      '</div>'+
                                                      '<div class="item-subtitle">'+data.comunicado[i].dataComunicado+'</div>'+
                                                      '<div class="item-text">'+data.comunicado[i].tituloComunicado+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#comunportaria-cont').html(datacomunicado);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#comunportaria-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }            
            },error: function(data) {
                myApp.hideIndicator();
                $('#comunportaria-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// comunportariacont conteudo ///////////////////////////
function comunportariacont(id){
    
    if (badgecomunicado>0) {
        badgecomunicado--;
        $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
    } else {
        $('.badgecomunicado').html('');
    }
    
    myApp.showIndicator();
    //var datatransparencia;
    $('#comunicadocont-cont').html("");
    $('#comunicadorespcont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunPortaria.php?idcomunportaria="+id+"&action=listcont",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datacomunicado = "";
                var qtd = data.comunicado.length;
                var imgTransparencia = "";
                var imgComunicado = "";
                var imgZoom;
                var imgTitle = "Aptohome";

                for (var i = 0; i < qtd; i++) {

                    idpostdestino = data.comunicado[i].idComunicado;

                    if (data.comunicado[i].urlComunicado!="images/sem_foto_icone.jpg") {

                    myPhotoBrowserComunicadocont = myApp.photoBrowser({
                        theme: 'dark',
                        ofText: 'de',
                        backLinkText: '',
                        spaceBetween: 0,
                        navbar: true,
                        toolbar: false,
                        photos : [data.comunicado[i].urlComunicado],
                        type: 'popup'
                    });

                        imgZoom = "onclick=myPhotoBrowserComunicadocont.open();";
                        imgComunicado = '<div class="card-content-cont">'+
                                                    '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                    '<img src="'+data.comunicado[i].urlComunicado+'" '+imgZoom+' width="100%">'+
                                                '</div>';
                    }

                    datacomunicado += '<li>'+
                                            '<div class="card-cont ks-facebook-card">'+ imgComunicado +
                                                '<div class="card-header">'+
                                                    '<div class="ks-facebook-avatar">'+
                                                        '<img src="'+data.comunicado[i].urlProfile+'" width="34">'+
                                                    '</div>'+
                                                    '<div class="ks-facebook-name">'+data.comunicado[i].name+'</div>'+
                                                    '<div class="ks-facebook-date">'+data.comunicado[i].dataComunicado+'</div>'+
                                                '</div>'+
                                                '<div class="card-content-inner">'+
                                                    '<p class="facebook-title">'+data.comunicado[i].tituloComunicado+'</p>'+
                                                    '<p class="facebook-date">'+data.comunicado[i].descricaoComunicado+'</p>'+
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

        /////////// lista as respostas //////////
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppResposta.php?idpostdestino="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            
                var dataresposta = '<li class="item-divider border-top-tit">Respostas</li>';
                var qtd = data.resposta.length;
                var imgResposta = "";
                var imgZoom;
                var imgTitle = "Aptohome";

                for (var i = 0; i < qtd; i++) {

                    if (data.resposta[i].urlResposta!="images/sem_foto_icone.jpg") {

                    myPhotoBrowserRespostacont = myApp.photoBrowser({
                        theme: 'dark',
                        ofText: 'de',
                        backLinkText: '',
                        spaceBetween: 0,
                        navbar: true,
                        toolbar: false,
                        photos : [data.resposta[i].urlResposta],
                        type: 'popup'
                    });

                        imgZoom = "onclick=myPhotoBrowserRespostacont.open();";
                        imgResposta = '<div class="card-content-cont">'+
                                                    '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                    '<img src="'+data.resposta[i].urlResposta+'" '+imgZoom+' width="100%">'+
                                                '</div>';
                    }

                    dataresposta += '<li>'+
                                            '<div class="card-cont ks-facebook-card">'+ imgResposta +
                                                '<div class="card-header">'+
                                                    '<div class="ks-facebook-avatar">'+
                                                        '<img src="'+data.resposta[i].urlProfile+'" width="34">'+
                                                    '</div>'+
                                                    '<div class="ks-facebook-name">'+data.resposta[i].name+'</div>'+
                                                    '<div class="ks-facebook-date">'+data.resposta[i].dataResposta+'</div>'+
                                                '</div>'+
                                                '<div class="card-content-inner">'+
                                                    '<p class="facebook-title">'+data.resposta[i].tituloResposta+'</p>'+
                                                    '<p class="facebook-date">'+data.resposta[i].descricaoResposta+'</p>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li>';
                    imgResposta = "";
                }
                
                $('#comunicadorespcont-cont').append(dataresposta);

            },error: function(data) {
                /*myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');*/
            }
        });


        dataresp = '<div class="list-block">'+
                      '<ul>'+
                        '<li class="item-divider border-top-tit">Envie sua resposta</li>'+
                        '<li>'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Título</div>'+
                              '<div class="item-input">'+
                              '<input type="hidden" id="iddestinoresp" value="13">'+
                              '<input type="hidden" id="idpostdestinoresp" value="'+id+'">'+
                              '<input type="text" id="txttitresp" onKeyUp=tabenter(event,getElementById("txtdescricaoresp")) placeholder="Informe um título">'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                        '<li class="align-top">'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Descrição</div>'+
                                '<div class="item-input">'+
                                    '<textarea id="txtdescricaoresp" class="resizable" style="height:76px" placeholder="Informe uma descrição"></textarea>'+
                                '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                        '<li>'+
                          '<div class="item-content">'+
                            '<div class="item-inner">'+
                              '<div class="item-title label">Imagem</div>'+
                              '<div class="item-input">'+
                                '<div id="imagem-resp" class="optionCameraResp custom-file-input" onClick="optionCameraResp()"></div>'+
                                  '<div class="img-preview">'+
                                    '<img src="" id="preview-resp"  width="100" height="80">'+
                                  '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>'+
                      '</ul>'+
                    '</div>'+
                    '<div class="content-block"><a href="#" id="butinserirresp" onclick="butinserirresp()" class="button button-big button-fill button-raised color-indigo button-full">ENVIAR</a></div>';
            
            $('.resp-cont').html(dataresp);

}



///////////////////////////// camera resp ///////////////////////////

function cameraResp() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessResp, onFailResp, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileResp(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessResp, onFailResp, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessResp(imageData) {
    var image = document.getElementById('preview-resp');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailResp(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera resp ///////////////////////////

    var actionOptionCameraResp = [
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
                    cameraResp();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileResp();
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
    function optionCameraResp(e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraResp);
    }


///////////////////////////// acao inserir resposta ///////////////////////////
function butinserirresp(){
    //alert("enviar");

    if (($$('#txttitresp').val()!="") &&  ($$('#txtdescricaoresp').val()!="")) {

            enviarresp();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

}

///////////////////////////// inserir resp ///////////////////////////
function enviarresp()
{
 
        imagem = $('#preview-resp').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");

        if (localStorage.getItem("moradorIdmorador")) {
            $$idmorador = localStorage.getItem("moradorIdmorador");
        } else{
            $$idmorador = "";
        }

        if (localStorage.getItem("portariaIdportaria")) {
            $$idportaria = localStorage.getItem("portariaIdportaria");
        } else{
            $$idportaria = $$('#portarialistportaria').val();
        }

        if (localStorage.getItem("sindicoIdsindico")) {
            $$idsindico = localStorage.getItem("sindicoIdsindico");
        } else{
            $$idsindico = "";
        }

        if (localStorage.getItem("sindicoIdsindico") && localStorage.getItem("moradorIdmorador")) {
            $$idsindico = "";
        }

        if (localStorage.getItem("administradoraIdadministradora")) {
            $$idadministradora = localStorage.getItem("administradoraIdadministradora");
        } else{
            $$idadministradora = "";
        }
        
        $$iddestinoresp = $$('#iddestinoresp').val();
        $$idpostdestinoresp = $$('#idpostdestinoresp').val();
        
        $$txtTitulo = $$('#txttitresp').val();
        $$txtDescricao = $$('#txtdescricaoresp').val();

        $("#preview-resp").attr('src',"");

        myApp.showIndicator();

        $.ajax('http://www.aptohome.com.br/admin/functionAppResposta.php?', {
            type: "post",
            data: "imagem="+imagem+"&idmorador="+$$idmorador+"&idsindico="+$$idsindico+"&idportaria="+$$idportaria+"&idadministradora="+$$idadministradora+"&idcondominio="+$$idcondominio+"&idpostdestino="+$$idpostdestinoresp+"&iddestino="+$$iddestinoresp+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
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
                myApp.alert('Resposta inserida com sucesso!', 'Aptohome', function () { mainView.router.back();});
            }
          });
}




///////////////////////////// camera comunicado portaria ///////////////////////////

function cameraComunportaria() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessComunportaria, onFailComunportaria, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileComunportaria(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessComunportaria, onFailComunportaria, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessComunportaria(imageData) {
    var image = document.getElementById('preview-comunportaria');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailComunportaria(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera comunicado portaria ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserircomunportaria', function (page) {
    var actionOptionCameraComunportaria = [
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
                    cameraComunportaria();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileComunportaria();
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
    $$('.optionCameraComunportaria').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraComunportaria);
    });
    
});

///////////////////////////// acao inserir comunicado portaria ///////////////////////////
$('#inserircomunportaria').on('click', function(){
    //alert("enviar");
    
    if (localStorage.getItem("portariaIdportaria")) {
        $('.blocolistcomunicadoli').addClass('visivel');
        $('.domiciliolistcomunicadoli').addClass('visivel');
        $('.moradorlistcomunicadoli').addClass('visivel');
        listBloco();
    } else {
        listPortaria();
        $('.blocolistcomunicadoli').addClass('invisivel');
        $('.domiciliolistcomunicadoli').addClass('invisivel');
        $('.moradorlistcomunicadoli').addClass('invisivel');
        $('.listportaria').removeClass('invisivel');

    }

});

///////////////////////////// acao inserir comunicado portaria ///////////////////////////
$('#butinserircomunportaria').on('click', function(){
    //alert("enviar");

    if (($$('#txttitcomunportaria').val()!="") &&  ($$('#txtdescricaocomunportaria').val()!="")) {

            enviarcomunportaria();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir comunicado portaria ///////////////////////////
function enviarcomunportaria()
{
 
 //alert("entrei");
        imagem = $('#preview-comunportaria').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");

        if (localStorage.getItem("moradorIdmorador")) {
            $$idmorador = localStorage.getItem("moradorIdmorador");
        } else{
            $$idmorador = "";
        }

        if (localStorage.getItem("portariaIdportaria")) {
            $$idportaria = localStorage.getItem("portariaIdportaria");
        } else{
            $$idportaria = $$('#portarialistportaria').val();
        }

        if (localStorage.getItem("sindicoIdsindico")) {
            $$idsindico = localStorage.getItem("sindicoIdsindico");
        } else{
            $$idsindico = "";
        }

        if (localStorage.getItem("sindicoIdsindico") && localStorage.getItem("moradorIdmorador")) {
            $$idsindico = "";
        }

        if (localStorage.getItem("administradoraIdadministradora")) {
            $$idadministradora = localStorage.getItem("administradoraIdadministradora");
        } else{
            $$idadministradora = "";
        }

        if (localStorage.getItem("moradorIdbloco")) {
            $$idbloco = localStorage.getItem("moradorIdbloco");
        } else{
            $$idbloco = $$('#blocolistportaria').val();
        }

        if (localStorage.getItem("moradorIddomicilio")) {
            $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        } else{
            $$iddomicilio = $$('#domiciliolistportaria').val();
        }
        
        $$iddestino = $$('#moradorlistportaria').val();
        
        $$txtTitulo = $$('#txttitcomunportaria').val();
        $$txtDescricao = $$('#txtdescricaocomunportaria').val();
        //$$fileUpload = dataURL;
        //$$fileUpload = "fterte";
        //myApp.showPreloader();

        $("#preview-comunportaria").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppComunPortaria.php?', {
            type: "post",
            data: "imagem="+imagem+"&idmorador="+$$idmorador+"&idsindico="+$$idsindico+"&idportaria="+$$idportaria+"&idadministradora="+$$idadministradora+"&idcondominio="+$$idcondominio+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&iddestino="+$$iddestino+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
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
                myApp.alert('Comunicado inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'comuncondominio'}); comunportaria();});
            }
          });
}




// Pull to refresh content
var ptrContent = $$('.comunmorador');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        comunmorador();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

///////////////////////////////////// Comunicado morador ///////////////////////////

function comunmorador(alvo){

    $('.tab-link').removeClass('active');
    $('.tab-3').addClass('active');

    $('.comunportaria').addClass('invisivel');
    $('.comuncondominio').addClass('invisivel');
    $('.comunmorador').removeClass('invisivel');
    $('.inserircomuncondominio').addClass('invisivel');
    $('.inserircomunportaria').addClass('invisivel');
    $('.inserircomunmorador').removeClass('invisivel');

    if (localStorage.getItem("condominioId")) {
        var idcondominio = localStorage.getItem("condominioId");
    } else{
        var idcondominio = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var idmorador = localStorage.getItem("moradorIdmorador");
    } else{
        var idmorador = "";
    }
    if (localStorage.getItem("moradorIddomicilio")) {
        var iddomicilio = localStorage.getItem("moradorIddomicilio");
    } else{
        var iddomicilio = "";
    }
    if (localStorage.getItem("moradorIdbloco")) {
        var idbloco = localStorage.getItem("moradorIdbloco");
    } else{
        var idbloco = "";
    }
    if (localStorage.getItem("moradorIdmorador")) {
        var iddestino = localStorage.getItem("moradorIdmorador");
    } else{
        var iddestino = "";
    }

    myApp.showIndicator();
    //var datatransparencia;
    $('.badgecomunicado').html();
    badgecomunicado=0;

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunMorador.php?idcondominio="+idcondominio+"&iddomicilio="+iddomicilio+"&iddestino="+iddestino+"&idbloco="+idbloco+"&idmorador="+idmorador+"&action=list",
            dataType : "json",
            success: function(data) {
                if (data!=null) {
                    myApp.hideIndicator();
                    var datacomunicado = "";
                    var qtd = data.comunicado.length;
                    var send = "";
                    var colorsend = "";

                    for (var i = 0; i < qtd; i++) {

                        if (data.comunicado[i].name==localStorage.getItem("moradorNome")) {
                            send = 'right';
                            colorsend = ' color-green';
                        } else {
                            send = 'left';
                            colorsend = ' color-red';
                        }

                        datacomunicado += '<li>'+
                                                  '<a href="#comunicadocont" onclick="comunmoradorcont('+data.comunicado[i].idComunicado+','+alvo+')" class="item-link item-content">'+
                                                    '<div class="item-media">'+
                                                      '<img src="'+data.comunicado[i].urlProfile+'" >'+
                                                    '</div>'+
                                                    '<div class="item-inner">'+
                                                        '<div class="item-title-row no-arrow">'+
                                                            '<div class="item-title">'+data.comunicado[i].name+'</div>'+
                                                            '<div class="item-after"><i class="fa fa-lg fa-arrow-circle-'+send+colorsend+'"></i></div>'+
                                                        '</div>'+
                                                      '<div class="item-subtitle">'+data.comunicado[i].dataComunicado+'</div>'+
                                                      '<div class="item-text">'+data.comunicado[i].tituloComunicado+'</div>'+
                                                    '</div>'+
                                                  '</a>'+
                                                '</li>';
                        $('#comunmorador-cont').html(datacomunicado);
                    }
                }else{
                    myApp.hideIndicator();
                    $('#comunmorador-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }            
            },error: function(data) {
                myApp.hideIndicator();
                $('#comunmorador-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
            }
        });
    //alert("Entrei");
}

///////////////////////////////////// comunmoradorcont conteudo ///////////////////////////
function comunmoradorcont(id){
    
    if (badgecomunicado>0) {
        badgecomunicado--;
        $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
    } else {
        $('.badgecomunicado').html('');
    }
    
    myApp.showIndicator();
    //var datatransparencia;
    $('#comunmoradorcontcont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppComunMorador.php?idcomunmorador="+id+"&action=list",
            dataType : "json",
            success: function(data) {
            myApp.hideIndicator();
                var datacomunicado = "";
                var qtd = data.comunicado.length;
                var imgTransparencia = "";
                var imgComunicado = "";
                var imgZoom;
                var imgTitle = "Aptohome";
                for (var i = 0; i < qtd; i++) {

                if (data.comunicado[i].urlComunicado!="images/sem_foto_icone.jpg") {

                myPhotoBrowserComunicadocont = myApp.photoBrowser({
                    theme: 'dark',
                    ofText: 'de',
                    backLinkText: '',
                    spaceBetween: 0,
                    navbar: true,
                    toolbar: false,
                    photos : [data.comunicado[i].urlComunicado],
                    type: 'popup'
                });

                    imgZoom = "onclick=myPhotoBrowserComunicadocont.open();";
                    imgComunicado = '<div class="card-content-cont">'+
                                                '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                                '<img src="'+data.comunicado[i].urlComunicado+'" '+imgZoom+' width="100%">'+
                                            '</div>';
                }

                datacomunicado += '<li>'+
                                        '<div class="card-cont ks-facebook-card">'+ imgComunicado +
                                            '<div class="card-header">'+
                                                '<div class="ks-facebook-avatar">'+
                                                    '<img src="'+data.comunicado[i].urlProfile+'" width="34">'+
                                                '</div>'+
                                                '<div class="ks-facebook-name">'+data.comunicado[i].name+'</div>'+
                                                '<div class="ks-facebook-date">'+data.comunicado[i].dataComunicado+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-title">'+data.comunicado[i].tituloComunicado+'</p>'+
                                                '<p class="facebook-date">'+data.comunicado[i].descricaoComunicado+'</p>'+
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

///////////////////////////// camera comunicado morador ///////////////////////////

function cameraComunmorador() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onSuccessComunmorador, onFailComunmorador, {
    quality: 50,
    allowEdit : true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true
    });
}

 
function cameraFileComunmorador(source) {
// Retrieve image file location from specified source
    navigator.camera.getPicture(onSuccessComunmorador, onFailComunmorador, {
    quality: 50,
    allowEdit: true,
    targetWidth: 1000,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
// Called if something bad happens.
//
function onSuccessComunmorador(imageData) {
    var image = document.getElementById('preview-comunmorador');
    image.src = "data:image/jpeg;base64," + imageData;
}
function onFailComunmorador(message) {
//alert('Failed because: ' + message);
}

///////////////////////////// camera comunicado morador ///////////////////////////

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('inserircomunmorador', function (page) {
    var actionOptionCameraComunmorador = [
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
                    cameraComunmorador();
                }
            },
            // Second button
            {
                text: 'Galeria',
                onClick: function () {
                    cameraFileComunmorador();
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
    $$('.optionCameraComunmorador').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(actionOptionCameraComunmorador);
    });
    
});

///////////////////////////// acao inserir comunicado morador ///////////////////////////
$('#inserircomunmorador').on('click', function(){
    //alert("enviar");
    listBloco();

});

///////////////////////////// acao inserir comunicado morador ///////////////////////////
$('#butinserircomunmorador').on('click', function(){
    //alert("enviar");

    if (($$('#txttitcomunmorador').val()!="") &&  ($$('#txtdescricaocomunmorador').val()!="")) {

            enviarcomunmorador();

    }else{
        myApp.alert('Preencha todos os campos.', 'Aptohome');    
    }

});

///////////////////////////// inserir comunicado morador ///////////////////////////
function enviarcomunmorador()
{
 
 //alert("entrei");
        imagem = $('#preview-comunmorador').attr("src");
        $$idcondominio = localStorage.getItem("condominioId");
        $$idmorador = localStorage.getItem("moradorIdmorador");
        
        $$idbloco = localStorage.getItem("moradorIdbloco");
        $$iddomicilio = localStorage.getItem("moradorIddomicilio");
        $$iddestino = $$('#moradorlistmorador').val();
        $$txtTitulo = $$('#txttitcomunmorador').val();
        $$txtDescricao = $$('#txtdescricaocomunmorador').val();

        $("#preview-comunmorador").attr('src',"");

        myApp.showIndicator();
        // Salvando imagem no servidor
        $.ajax('http://www.aptohome.com.br/admin/functionAppComunMorador.php?', {
            type: "post",
            data: "imagem="+imagem+"&idbloco="+$$idbloco+"&iddomicilio="+$$iddomicilio+"&idmorador="+$$idmorador+"&iddestino="+$$iddestino+"&idcondominio="+$$idcondominio+"&txtTitulo="+$$txtTitulo+"&txtDescricao="+$$txtDescricao+"&action=add",
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
                myApp.alert('Comunicado inserido com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'comuncondominio'}); comunmorador();});
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


///////////////////////////////////// Listar Banner ///////////////////////////


function banner(){

    myApp.showIndicator();

    //$('#comunicado-cont').html("");

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inserirbanner').addClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico")) {
            $('.inserirbanner').removeClass('invisivel');
        }

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppBanner.php?idcondominio="+localStorage.getItem("condominioId")+"&action=list",
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
                    linkurl = "onclick=openURLBrowser('"+data.banner[i].url+"');";
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
        myApp.actions(actionOptionCameraBanner);
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
        $$idcondominio = localStorage.getItem("condominioId");
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
        myApp.actions(actionOptionAgendamento);
    });
    
});


function espaco(dia,idlocalespaco){

    myApp.showIndicator();
    $('#espaco-cont').html("");
    $$('#calendar-inline-container div span').removeClass("marcado");
        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?idcondominio="+localStorage.getItem("condominioId")+"&idlocalespaco="+idlocalespaco+"&action=list",
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

        // retirar botão inserir
        if (localStorage.getItem("moradorIdmorador")) {
            $('.inseriragendamentodeespaco').removeClass('invisivel');
        }
        if (localStorage.getItem("administradoraIdadministradora") || localStorage.getItem("sindicoIdsindico") || localStorage.getItem("portariaIdportaria")) {
            $('.inseriragendamentodeespaco').addClass('invisivel');
        }
        if (localStorage.getItem("moradorIdmorador") && localStorage.getItem("sindicoIdsindico")) {
            $('.inseriragendamentodeespaco').removeClass('invisivel');
        }


        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?idcondominio="+localStorage.getItem("condominioId")+"&dia="+dia+"&idlocalespaco="+idlocalespaco+"&action=list",
            dataType : "json",
            success: function(data) {

            myApp.hideIndicator();
                var dataespaco = "";
                var delespaco = "";
                var confespaco = "";
                var invisivel = "";
                var swipeout = "";

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

                        if (data.espaco[i].active=="1") {
                            cor="#4caf50";
                            invisivel="invisivel ";
                        } else {
                            cor="#ffc107";
                            invisivel="invisivel ";
                            if (localStorage.getItem("sindicoIdsindico")) {
                                swipeout = "swipeout ";
                                invisivel="";
                            }
                            
                        }

                        delespaco = "onclick = delespaco('"+data.espaco[i].guid+"',"+i+");"
                        confespaco = "onclick = confespaco('"+data.espaco[i].guid+"',"+i+");"
                        dataespaco += '<li class="'+swipeout+'swipeout-espaco" data-index="'+i+'">'+
                                            '<a href="#espacocont" onclick="espacocont('+data.espaco[i].idEspaco+')" class="swipeout-content item-content item-link">'+
                                                '<div class="item-media" style="border:solid 4px '+cor+'">'+
                                                  '<img src="'+data.espaco[i].urlMorador+'" >'+
                                                '</div>'+
                                                '<div class="item-inner">'+
                                                    '<div class="item-title-row">'+
                                                        '<div class="item-title">'+horaini+" às "+horater+'</div>'+
                                                    '</div>'+
                                                        '<div class="item-subtitle">'+data.espaco[i].nameMorador+'</div>'+
                                                        '<div class="item-text">'+data.espaco[i].nameCondominio+' - '+data.espaco[i].numMorador+'</div>'+
                                                '</div>'+
                                            '</a>'+
                                              '<div class="'+invisivel+'swipeout-actions-right">'+
                                                '<a href="#" '+confespaco+' class="action1 bg-green">Confirmar</a>'+
                                                '<a href="#" '+delespaco+' class="action2 bg-red">Delete</a>'+
                                              '</div>'+
                                        '</li>';
                        $('#espaco-cont').html(dataespaco);
                    }
                    swipeout="";
                    invisivel="";
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
        //console.log(dia+","+idlocalespaco);
}

///////////////////////////// confirmar espaco ///////////////////////////
function confespaco(guid,eq){

    myApp.confirm('Deseja confirmar esse agendamento?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?guid="+guid+"&action=ativar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.alert('Agendamento confirmado com sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'agendamentodeespaco'});agendamentodeespaco();});
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

}

///////////////////////////// deletar espaco ///////////////////////////
function delespaco(guid,eq){

    myApp.confirm('Deseja deletar esse item?', function () {

        myApp.showIndicator();

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?guid="+guid+"&action=deletar",
            data : "get",
            success: function(data) {
            if (data!="ok") {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente ='+data, 'Aptohome');
            } else {
                myApp.hideIndicator();
                myApp.swipeoutDelete($$('li.swipeout-espaco').eq(eq));
            }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    });

}

///////////////////////////////////// espaco conteudo ///////////////////////////
function espacocont(id){

    myApp.showIndicator();

    $('#espacocont-cont').html("");

        $.ajax({
            url: "http://www.aptohome.com.br/admin/functionAppEspaco.php?idespaco="+id+"&action=list",
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

                    var descricaoEspaco = "";
                    if (data.espaco[i].descricao) {
                        descricaoEspaco = data.espaco[i].descricao;
                    }
                        if (data.espaco[i].active=="1") {
                            cor="#4caf50";
                        } else{
                            cor="#ffc107";
                        }
                    dataespaco += '<li>'+
                                            '<div class="card-cont ks-facebook-card">'+
                                                '<div class="card-header">'+
                                                    '<div class="ks-facebook-avatar" style="border:solid 4px '+cor+'"><img src="'+data.espaco[i].urlMorador+'" width="34"></div>'+
                                                    
                                                    '<div class="ks-facebook-name">'+horaini+" às "+horater+'</div>'+
                                                    '<div class="ks-facebook-date">'+data.espaco[i].nameMorador+'</div>'+
                                                '</div>'+
                                                '<div class="card-content-inner">'+
                                                    '<p class="facebook-title">'+data.espaco[i].nameCondominio+' - '+data.espaco[i].numMorador+
                                                    '<br>'+descricaoEspaco+'</p>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li>';

                    $('#espacocont-cont').html(dataespaco);

                }
            
            },error: function(data) {
                myApp.hideIndicator();
                myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
    //alert("Entrei");
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
        $$idcondominio = localStorage.getItem("condominioId");
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
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +' - ' + p.currentYear);
            
            mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
            mesSelected = mesSelected+++1;
            diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
            
            if (diaSelected<10) {
                diaSelected = "0"+diaSelected;
            }
            //diaSelected ="01";
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
                            case 'comuncondominio':
                            badgecomunicado++;
                            $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
                            break;
                            case 'comunportaria':
                            badgecomunicado++;
                            $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
                            break;
                            case 'comunmorador':
                            badgecomunicado++;
                            $('.badgecomunicado').html('<span class="badge bg-red">'+badgecomunicado+'</span>');
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
                                    switch( e.payload.item ){
                                        case 'comuncondominio':
                                        mainView.router.load({pageName: "comunicadocont"});
                                        comuncondominiocont(e.payload.id);
                                        break;
                                        case 'comunportaria':
                                        mainView.router.load({pageName: "comunicadocont"});
                                        comunportariacont(e.payload.id);
                                        break;
                                        case 'comunmorador':
                                        mainView.router.load({pageName: "comunicadocont"});
                                        comunmoradorcont(e.payload.id);
                                        break;
                                        case 'transparencia':
                                        mainView.router.load({pageName: "transparenciacont"});
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
                                
                                switch( e.payload.item ){
                                    case 'comuncondominio':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comuncondominiocont(e.payload.id);
                                    break;
                                    case 'comunportaria':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comunportariacont(e.payload.id);
                                    break;
                                    case 'comunmorador':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comunmoradorcont(e.payload.id);
                                    break;
                                    case 'transparencia':
                                    mainView.router.load({pageName: "transparenciacont"});
                                    transparenciacont(e.payload.id);
                                    break;
                                }

                                console.log('CAPTURADO PUSH COM APP EM COLDSTART!');
                            }else{
                                switch( e.payload.item ){
                                    case 'comuncondominio':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comuncondominiocont(e.payload.id);
                                    break;
                                    case 'comunportaria':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comunportariacont(e.payload.id);
                                    break;
                                    case 'comunmorador':
                                    mainView.router.load({pageName: "comunicadocont"});
                                    comunmoradorcont(e.payload.id);
                                    break;
                                    case 'transparencia':
                                    mainView.router.load({pageName: "transparenciacont"});
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



//////////// com tracking ///////////////////
 
function alertadechegadatracking(){

var ENV = (function() {
    
    var localStorage = window.localStorage;

    return {
        settings: {
            /**
            * state-mgmt
            */
            enabled:    localStorage.getItem('enabled')     || 'true',
            aggressive: localStorage.getItem('aggressive')  || 'false'
        },
        toggle: function(key) {
            var value       = localStorage.getItem(key)
                newValue    = ((new String(value)) == 'true') ? 'false' : 'true';

            localStorage.setItem(key, newValue);
            return newValue;
        }
    }
})()

var app = {
    /**
    * @property {google.maps.Map} map
    */
    map: undefined,
    /**
    * @property {google.maps.Marker} location The current location
    */
    location: undefined,
    /**
    * @property {google.map.PolyLine} path The list of background geolocations
    */
    path: undefined,
    /**
    * @property {Boolean} aggressiveEnabled
    */
    aggressiveEnabled: false,
    /**
    * @property {Array} locations List of rendered map markers of prev locations
    */
    locations: [],
    /**
    * @private
    */
    btnEnabled: undefined,
    btnPace: undefined,
    btnHome: undefined,
    btnReset: undefined,

    // Application Constructor  
    initialize: function() {
        this.bindEvents();
        google.maps.event.addDomListener(window, 'load', app.initializeMap);
        console.log("initialize");
    },
    initializeMap: function() {
        
        var mapOptions = {
          center: { lat: -34.397, lng: 150.644},
          zoom: 12,
          zoomControl: true
        };

        var header = $('.navbar'),
            footer = $('#footer'),
            canvas = $('#map-canvas'),
            canvasHeight = window.innerHeight - header[0].clientHeight - footer[0].clientHeight;
        
        canvas.height(canvasHeight);
        //canvas.width(window.clientWidth);

        app.map = new google.maps.Map(canvas[0], mapOptions);
        console.log("initializeMap");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);

        // Init UI buttons
        this.btnHome        = $('button#btn-home');
        this.btnReset       = $('button#btn-reset');
        this.btnPace        = $('button#btn-pace');
        this.btnEnabled     = $('button#btn-enabled');

        if (ENV.settings.aggressive == 'true') {
            this.btnPace.addClass('btn-danger');
        } else {
            this.btnPace.addClass('btn-success');
        }
        if (ENV.settings.enabled == 'true') {
            this.btnEnabled.addClass('btn-danger');
            this.btnEnabled[0].innerHTML = 'Stop';
        } else {
            this.btnEnabled.addClass('btn-success');
            this.btnEnabled[0].innerHTML = 'Start';
        }
        
        this.btnHome.on('click', this.onClickHome);
        this.btnReset.on('click', this.onClickReset);
        this.btnPace.on('click', this.onClickChangePace);
        this.btnEnabled.on('click', this.onClickToggleEnabled);
        console.log("bindEvents");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.configureBackgroundGeoLocation();
        app.watchPosition();
        console.log("onDeviceReady");
    },
    configureBackgroundGeoLocation: function() {
        var fgGeo = window.navigator.geolocation,
            bgGeo = navigator.plugins.backgroundGeoLocation;

        app.onClickHome();
        console.log("configureBackgroundGeoLocation");

        /**
        * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
        */
        var yourAjaxCallback = function(response) {
            bgGeo.finish();
        };

        /**
        * This callback will be executed every time a geolocation is recorded in the background.
        */
        var callbackFn = function(location) {
            console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
            
            // Update our current-position marker.
            app.setCurrentLocation(location);

            // After you Ajax callback is complete, you MUST signal to the native code, which is running a background-thread, that you're done and it can gracefully kill that thread.
            yourAjaxCallback.call(this);
        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error: '+error);
        };

        // Only ios emits this stationary event
        bgGeo.onStationary(function(location) {
            if (!app.stationaryRadius) {
                app.stationaryRadius = new google.maps.Circle({
                    fillColor: '#cc0000',
                    fillOpacity: 0.4,
                    strokeOpacity: 0,
                    map: app.map
                });
            }
            var radius = (location.accuracy < location.radius) ? location.radius : location.accuracy;
            var center = new google.maps.LatLng(location.latitude, location.longitude);
            app.stationaryRadius.setRadius(radius);
            app.stationaryRadius.setCenter(center);

        });

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            url: 'http://only.for.android.com/update_location.json', // <-- Android ONLY:  your server url to send locations to
            params: {
                auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            },
            desiredAccuracy: 0,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
            notificationText: 'ENABLED', // <-- android only, customize the text of the notification
            activityType: 'AutomotiveNavigation',
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
        });
        
        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        var settings = ENV.settings;

        if (settings.enabled == 'true') {
            bgGeo.start();
        
            if (settings.aggressive == 'true') {
                bgGeo.changePace(true);
            }
        }
    },
    onClickHome: function() {
        var fgGeo = window.navigator.geolocation;

        // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
        //  in order to prompt the user for Location permission.
        fgGeo.getCurrentPosition(function(location) {
            var map     = app.map,
                coords  = location.coords,
                ll      = new google.maps.LatLng(coords.latitude, coords.longitude),
                zoom    = map.getZoom();

            map.setCenter(ll);
            if (zoom < 15) {
                map.setZoom(15);
            }
            app.setCurrentLocation(coords);
        });
        console.log("onClickHome");
    },
    onClickChangePace: function(value) {
        var bgGeo   = navigator.plugins.backgroundGeoLocation,
            btnPace = app.btnPace;

        btnPace.removeClass('btn-success');
        btnPace.removeClass('btn-danger');

        var isAggressive = ENV.toggle('aggressive');
        if (isAggressive == 'true') {
            btnPace.addClass('btn-danger');
            bgGeo.changePace(true);
        } else {
            btnPace.addClass('btn-success');
            bgGeo.changePace(false);
        }
    },
    onClickReset: function() {
        // Clear prev location markers.
        var locations = app.locations;
        for (var n=0,len=locations.length;n<len;n++) {
            locations[n].setMap(null);
        }
        app.locations = [];

        // Clear Polyline.
        app.path.setMap(null);
        app.path = undefined;
    },
    onClickToggleEnabled: function(value) {
        var bgGeo       = window.plugins.backgroundGeoLocation,
            btnEnabled  = app.btnEnabled,
            isEnabled   = ENV.toggle('enabled');
        
        btnEnabled.removeClass('btn-danger');
        btnEnabled.removeClass('btn-success');

        if (isEnabled == 'true') {
            btnEnabled.addClass('btn-danger');
            btnEnabled[0].innerHTML = 'Stop';
            bgGeo.start();
        } else {
            btnEnabled.addClass('btn-success');
            btnEnabled[0].innerHTML = 'Start';
            bgGeo.stop();
        }
    },
    watchPosition: function() {
        var fgGeo = window.navigator.geolocation;
        if (app.watchId) {
            app.stopPositionWatch();
        }
        // Watch foreground location
        app.watchId = fgGeo.watchPosition(function(location) {
            app.setCurrentLocation(location.coords);
        }, function() {}, {
            enableHighAccuracy: true,
            maximumAge: 5000,
            frequency: 10000,
            timeout: 10000
        });
    },
    stopPositionWatch: function() {
        var fgGeo = window.navigator.geolocation;
        if (app.watchId) {
            fgGeo.clearWatch(app.watchId);
            app.watchId = undefined;
        }
    },
    /**
    * Cordova foreground geolocation watch has no stop/start detection or scaled distance-filtering to conserve HTTP requests based upon speed.  
    * You can't leave Cordova's GeoLocation running in background or it'll kill your battery.  This is the purpose of BackgroundGeoLocation:  to intelligently 
    * determine start/stop of device.
    */
    onPause: function() {
        console.log('- onPause');
        app.stopPositionWatch();
    },
    /**
    * Once in foreground, re-engage foreground geolocation watch with standard Cordova GeoLocation api
    */
    onResume: function() {
        console.log('- onResume');
        app.watchPosition();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    setCurrentLocation: function(location) {
        if (!app.location) {
            app.location = new google.maps.Marker({
                map: app.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                    fillColor: 'blue',
                    strokeColor: 'blue',
                    strokeWeight: 5
                }
            });
            app.locationAccuracy = new google.maps.Circle({
                fillColor: '#3366cc',
                fillOpacity: 0.4,
                strokeOpacity: 0,
                map: app.map
            });
        }
        if (!app.path) {
            app.path = new google.maps.Polyline({
                map: app.map,
                strokeColor: '#3366cc',
                fillOpacity: 0.4
            });
        }
        var latlng = new google.maps.LatLng(location.latitude, location.longitude);
        
        if (app.previousLocation) {
            var prevLocation = app.previousLocation;
            // Drop a breadcrumb of where we've been.
            app.locations.push(new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                    fillColor: 'green',
                    strokeColor: 'green',
                    strokeWeight: 5
                },
                map: app.map,
                position: new google.maps.LatLng(prevLocation.latitude, prevLocation.longitude)
            }));
        }

        // Update our current position marker and accuracy bubble.
        app.location.setPosition(latlng);
        app.locationAccuracy.setCenter(latlng);
        app.locationAccuracy.setRadius(location.accuracy);

        // Add breadcrumb to current Polyline path.
        app.path.getPath().push(latlng);
        app.previousLocation = location;
    }
};

app.initialize();

}



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
                var totalformat = total.toString().replace(".", ",");
                //time = time / 60;
                document.getElementById('total').innerHTML = 'Distância = ' + totalformat + ' km | Tempo = ' + formatTime(time) + 'min';
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
                          //window.alert('Directions request failed due to ' + status);
                        }
                    });
                }
                navigator.geolocation.getCurrentPosition(onSuccess);
            }

            function locError(error) {
                // the current position could not be located
                //alert("The current position could not be found!");
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
                    //alert("Your browser does not support the Geolocation API");
                }
            }
    }



function dataamericana(data){
    split = data.split('/');
    novadata = split[2] + "-" +split[1]+"-"+split[0];
    //data_americana = new Date(novadata);
    //alert(novadata);
    return (novadata);
}
function convertMysqldate(dateStr) {    
// Assuming input:2014-01-30 16:21:09
            var t = dateStr.split(/[- :]/);
            //var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
            var year = t[0];
            var month = monthNames[parseInt(t[1]-1)];
            var day = t[2];
            var hourTmp = t[3];
            var minute = t[4];
            var seconds = t[5];
            if (parseInt(hourTmp) > 12) {
                var hour = parseInt(parseInt(hourTmp) - 12) + ':' + minute + ':' + seconds + ' PM';
            } else if (parseInt(hourTmp) === 12) {
                hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' PM';
            } else {
               hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' AM';
            }
            //return (hour + '<br>' + day + ' ' + month + ' ' + year);
            return (day + '/' + month + '/' + year +' - '+ hour);
}

function convertToAmericanDate(dateStr) {    
// Assuming input:2014-01-30 16:21:09
            var t = dateStr.split(/[/ :]/);
            //var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
            var year = t[0];
            var month = monthNames[parseInt(t[1]-1)];
            var day = t[2];
            var hourTmp = t[3];
            var minute = t[4];
            var seconds = t[5];
            if (parseInt(hourTmp) > 12) {
                var hour = parseInt(parseInt(hourTmp) - 12) + ':' + minute + ':' + seconds + ' PM';
            } else if (parseInt(hourTmp) === 12) {
                hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' PM';
            } else {
               hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' AM';
            }
            //return (hour + '<br>' + day + ' ' + month + ' ' + year);
            //return (year + '/' + month + '/' + day +' - '+ hour);
            return (day + '/' + month + '/' + year +' - '+ hour);
}

$(".selcor").spectrum({
    color: "#000",
    className: "full-spectrum",
    showPaletteOnly: true,
    /*togglePaletteOnly: true,
    togglePaletteMoreText: "Mais",
    togglePaletteLessText: "Menos",*/
    chooseText: "Selecionar",
    cancelText: "Cancelar",
    localStorageKey: "spectrum.homepage",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
        
    },
    palette :  [
    ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
    ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
    ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
    ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
    ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
    ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
    ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
    ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ]
});
