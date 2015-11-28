
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('chart-view', '<chart each="{dane}" dane="{this}"></chart>', 'chart { float: left }', '', function(opts) {
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
            url: "http://poldas.pl/analiza/php/ante/dane.php",
            dataType: "json",
            async: false
        }).responseText;
        this.dane = JSON.parse(jsonData);
        console.log("zaladowalem dane", this.dane);
   }

}, '{ }');
riot.tag2('chart', '<div id="{opts.dane.id_wykres}" class="map"></div> <chart-description> <button name="dodaj" onblur="{zapiszBlur}" onclick="{dodajKomentarz}" type="button" class="btn btn-success btn-sm">Zapisz</button> <span>{this.zapisujeText}</span> <textarea name="opis" onkeyup="{this.resize}" class="opis" cols="55" rows="{this.rows}">{opts.dane.komentarz}</textarea> </chart-description>', 'textarea { display: block; } chart { margin: 2px; padding: 5px; } a { cursor: pointer; } div.map { width: 520px; height: 340px; } div.opis { height: 150px; width: 440px; } .textarea { -moz-appearance: textfield-multiline; -webkit-appearance: textarea; border: 1px solid gray; font: medium -moz-fixed; font: -webkit-small-control; height: 28px; overflow: auto; padding: 2px; resize: both; width: 400px; }', '', function(opts) {
        var self = this;
        var maxRow = 5;
        this.rows = maxRow;
        self.zapisujeText = "";
        console.log('chart.tag');
        self.on('before-mount', function() {
            var str = this.opis.value;
            var cols = this.opis.cols;
            var linecount = 0;
            var len = 0;
            jQuery.each(str.split("\n"),function(index, l) {
                len =  Math.ceil( l.length / cols );
                if (!len) {
                    len = 1;
                }
              linecount += len;
            } );
            this.rows = Math.max(maxRow, linecount);
            this.update();
        });

        self.resize = function() {
            var str = this.opis.value;
            var cols = this.opis.cols;
            var linecount = 0;
            var len = 0;
            jQuery.each(str.split("\n"),function(index, l) {
                len =  Math.ceil( l.length / cols );
                if (!len) {
                    len = 1;
                }
              linecount += len;
            } );
            this.rows = (maxRow > linecount)? maxRow : linecount;
        }
        self.on('mount', function() {
            console.log("chart.tag on mount");
            self.drawHighChart();
            this.update();
        })

        self.drawHighChart = function() {
            console.log("rysuje wykres", opts.dane.id_wykres,  jQuery('#'+opts.dane.id_wykres));
            jQuery('#'+opts.dane.id_wykres).highcharts({
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
                        text: 'Umiejętności'
                    },
                    categories: opts.dane.categories,
                    crosshair: true
                },
                yAxis: {
                    max: opts.dane.opcje.max,
                    min: 0,
                    title: {
                        text: 'średnia'
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

        self.dodajKomentarz = function(e) {
            console.log(this.opis.value);
            self.zapisujeText = "zapisuje...";
            var mainUrl = ["http://localhost/analiza/php/ante/dodaj_komentarz.php?"];
            mainUrl.push("id_wykresu="+e.item.id_wykres);
            mainUrl.push("opis="+encodeURI(this.opis.value.trim()));
            console.log(mainUrl.join('&'));
            jQuery.ajax({
                url: mainUrl.join('&'),
                type: "get"
            }).success(function(response){
                self.zapisujeText = "";
                self.update();
            });
        }
}, '{ }');});