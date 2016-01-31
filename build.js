
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('chart-view', '<chart each="{dane}" dane="{this}"></chart>', 'chart-view { overflow: hidden; }', '', function(opts) {
   RiotControl.addStore(this);
   console.log("chart-view.tag");
   loadDataFromServer();
   this.on("mount", function (){
        console.log("zamontowano chart-view");
   })
   var self = this;
   function loadDataFromServer() {
        console.log("laduje dane");
         var jsonData = jQuery.ajax({
            url: "http://" + window.location.hostname + "/analiza/php/ante/dane.php",
            dataType: "json",
            async: false
        }).responseText;
        this.dane = JSON.parse(jsonData);
        console.log("zaladowalem dane", this.dane);
   }

}, '{ }');
riot.tag2('chart', '<div name="calaMapa"> <div id="{opts.dane.id_wykres}" name="wykresArea" class="{hide: !this.czy_drukowac, map:1}"></div> </div> <div class="{hide: this.czy_drukowac, nazwa: 1}"><h2>{opts.dane.nazwa}</h2></div> <chart-description> <button show="{this.czy_drukowac}" name="dodaj" onblur="{zapiszBlur}" onclick="{dodajKomentarz}" class="btn btn-success btn-m"> <span class="glyphicon glyphicon-floppy-disk"></span> Zapisz </button> <input type="checkbox" name="czy_zapisac" data-toggle="toggle" data-on="Ukryj wykres" data-off="Dodaj do druku" __checked="{checked: !!this.czy_drukowac}"> <button show="{this.czy_drukowac}" type="button" class="btn btn-info btn-m" name="powieksz" data-toggle="modal" data-target="#myModal{opts.dane.id_wykres}"> Powiększ </button> <span>{this.zapisujeText}</span> <textarea show="{this.czy_drukowac}" name="opis" class="opis" cols="55" rows="{this.rows}"> {opts.dane.komentarz} </textarea> <div show="{this.czy_drukowac}" name="printhelper" class="print_helper">{opts.dane.komentarz}</div> </chart-description> <div class="modal fade" id="myModal{opts.dane.id_wykres}" role="dialog"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title"></h4> </div> <div class="modal-body" name="myModal"> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Zamknij</button> </div> </div> </div> </div>', 'div.off { top: 17px; left: 15px; } .modal-block div.map { width: 600px; } chart { width: 48%; margin: 3px; min-height: 100px; padding: 10px; overflow: hidden; float: left; } charta:hover { -webkit-box-shadow: -3px 5px 13px 0px rgba(50, 50, 50, 0.62); -moz-box-shadow: -3px 5px 13px 0px rgba(50, 50, 50, 0.62); box-shadow: -3px 5px 13px 0px rgba(50, 50, 50, 0.62); } .hide { visible: hidden; display: none; } textarea { display: block; margin: 3px; } a { cursor: pointer; } div.map { width: 520px; height: 340px; } div.opis { height: 150px; width: 500px; } chart-description, div.nazwa { float: left; } @media print { chart { margin: 20px auto; float: none; } chart-description, div.nazwa { float: none; } }', 'class="{schowaj: !this.czy_drukowac}"', function(opts) {
        this.czy_drukowac = opts.dane.czy_wyswietlac;
        var self = this;
        var maxRow = 5;
        this.rows = maxRow;
        self.zapisujeText = "";
        self.on('before-mount', function () {
            var str = this.opis.value;
            var cols = this.opis.cols;
            var linecount = 0;
            var len = 0;
            jQuery.each(str.split("\n"), function (index, l) {
                len = Math.ceil(l.length / cols);
                if (!len) {
                    len = 1;
                }
                linecount += len;
            });
            this.rows = Math.max(maxRow, linecount);
            this.update();
        });

        self.resize = function () {
            var str = this.opis.value;
            var cols = this.opis.cols;
            var linecount = 0;
            var len = 0;
            jQuery.each(str.split("\n"), function (index, l) {
                len = Math.ceil(l.length / cols);
                if (!len) {
                    len = 1;
                }
                linecount += len;
            });
            this.rows = (maxRow > linecount) ? maxRow : linecount;
        }
        self.on('mount', function () {
            self.drawHighChart();
            jQuery(self.czy_zapisac).bootstrapToggle({});
            jQuery(self.czy_zapisac).change(function (e) {
                self.czy_drukowac = $(this).prop('checked');
                var opis = encodeURI(self.opis.value);
                self.zapisz(opts.dane.id_wykres, opis, self.czy_drukowac);
            });

            jQuery(self.powieksz).click(function () {
                jQuery(self.myModal).html(jQuery(self.calaMapa).html());
            });

            function copy_to_print_helper() {
                jQuery(self.printhelper).text(jQuery(self.opis).val());
            }

            jQuery(self.opis).bind('keydown keyup keypress cut copy past blur change', function () {
                copy_to_print_helper();
            });
        })

        self.drawHighChart = function () {
            jQuery('#' + opts.dane.id_wykres).highcharts({
                chart: {
                    type: 'column',
                    margin: 75,
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {
                    text: opts.dane.nazwa
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    categories: opts.dane.categories,
                    crosshair: true
                },
                yAxis: {
                    max: opts.dane.opcje.max,
                    min: 0,
                    title: {
                        text: opts.dane.opisY
                    }
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    },
                    column: {
                        depth: 25
                    }
                },
                series: opts.dane.series
            });
            self.update();
        }
        self.zapisz = function (id_wykres, opis, czy_wyswietlac) {
            self.zapisujeText = "zapisuje...";
            var mainUrl = ["http://" + window.location.hostname + "/analiza/php/ante/dodaj_komentarz.php?"];
            mainUrl.push("id_wykresu=" + id_wykres);
            mainUrl.push("opis=" + opis);
            mainUrl.push("czy_wyswietlac=" + czy_wyswietlac);
            console.log(mainUrl.join('&'));
            jQuery.ajax({
                url: mainUrl.join('&'),
                type: "get"
            }).success(function (response) {
                self.zapisujeText = "";
                self.update();
            });
        }
        self.dodajKomentarz = function (e) {
            var id_wykres = e.item.id_wykres;
            var opis = encodeURI(this.opis.value.trim());
            var czy_wyswietlac = !!this.czy_zapisac.checked;

            self.zapisz(id_wykres, opis, czy_wyswietlac);
        }
}, '{ }');
});