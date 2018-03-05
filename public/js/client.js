//****************************
$(document).ready(function() {

    var gaugeTensionPrimaire = undefined;
    var gaugeTensionSecondaire = undefined;

    var gaugeCourantPrimaire = $('#gauge_courant_primaire');
    var gaugeCourantSecondaire = $('#gauge_courant_secondaire');

    var gaugePuissancePrimaire = $('#gauge_puissance_primaire');
    var gaugePuissanceSecondaire = $('#gauge_puissance_secondaire');

    var socket=undefined;

    //
    var reglages={
        u1eff:0,
        module:500,
        phase:0,
    };

    //sockets
    socket=io.connect();

    //*************************************
    // gauge tension primaire
    //**************************************
    gaugeTensionPrimaire = $('#gauge_tension_primaire').SonicGauge({
        label: 'U1 eff',
        start: {
            angle: -225,
            num: 0
        },
        end: {
            angle: 45,
            num: 220
        },
        style: {
            "needle": {
                "fill": "#fff",
                "height": 2,
            },
        },
        markers: [{
            gap: 20,
            line: {
                "width": 20,
                "stroke": "none",
                "fill": "#eeeeee"
            },
            text: {
                "space": 22,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 18
            }
        }, {
            gap: 20,
            line: {
                "width": 12,
                "stroke": "none",
                "fill": "#aaaaaa"
            },
            text: {
                "space": 18,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 12
            }
        }, {
            gap: 10,
            line: {
                "width": 8,
                "stroke": "none",
                "fill": "#999999"
            }
        }],
        animation_speed: 500
    });
    //*******************************
    //*************************************
    // gauge tension secondaire
    //**************************************
    gaugeTensionSecondaire = $('#gauge_tension_secondaire').SonicGauge({
        label: 'U2 eff',
        start: {
            angle: -225,
            num: 0
        },
        end: {
            angle: 45,
            num: 250
        },
        style: {
            "needle": {
                "fill": "#fff",
                "height": 2,
            },
        },
        markers: [{
            gap: 20,
            line: {
                "width": 20,
                "stroke": "none",
                "fill": "#eeeeee"
            },
            text: {
                "space": 22,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 18
            }
        }, {
            gap: 20,
            line: {
                "width": 12,
                "stroke": "none",
                "fill": "#aaaaaa"
            },
            text: {
                "space": 18,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 12
            }
        }, {
            gap: 10,
            line: {
                "width": 8,
                "stroke": "none",
                "fill": "#999999"
            }
        }],
        animation_speed: 500
    });
    //*******************************
    //******* slider u1 *************
    $("#range_u1").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:true,
        keyboard:true,
        min:0,
        max:220,
        from:0,
        step:1,
        grid:true,
        onFinish:function(data){
            reglages.u1eff=data.from
            gaugeTensionPrimaire.SonicGauge('val',reglages.u1eff);
            socket.emit('reglages',reglages)
        },
    });
    //******* slider charge *************
    $("#range_charge").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:false,
        keyboard:true,
        min:5,
        max:500,
        from:500,
        step:1,
        grid:true,
        onFinish:function(data){
            reglages.module=data.from;
            socket.emit('reglages',reglages)
        },
    });
    //******* slider phi *************
    $("#range_phi").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:false,
        keyboard:true,
        min:-90,
        max:90,
        from:0,
        step:1,
        grid:true,
        onFinish:function(data){
            reglages.phase=data.from;
            socket.emit('reglages',reglages)
        },
    });
    //*******************************
    function setMesures(u2,i1,i2,p1,p2){
        gaugeCourantPrimaire.text(i1);
        gaugeCourantSecondaire.text(i2);

        gaugePuissancePrimaire.text(p1);
        gaugePuissanceSecondaire.text(p2);

        gaugeTensionSecondaire.SonicGauge('val',u2);
    }
    //*********************************
    setMesures(0,0,0,0,0);

    //
    //***********************************
    socket.on("mesures",function(datas){
        //console.log(datas);
        gaugeCourantSecondaire.text(datas.i2eff.toFixed(2));
        //
        gaugeTensionSecondaire.SonicGauge('val',datas.u2eff.toFixed(1));
        //
        gaugePuissanceSecondaire.text(datas.p2.toFixed(0));
        //
        gaugeCourantPrimaire.text(datas.i1eff.toFixed(2));
        //
        gaugePuissancePrimaire.text(datas.p1.toFixed(0));
    });

    //******************************
    //exit
    socket.on('exit',function(){
        socket.close()
    })
});
//fin
