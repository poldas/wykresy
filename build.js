
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('chart-view', '<chart each="{dana in dane}" name="{dana.name}" danemapy="{dana.dane}" komentarz="{dana.komentarz}"></chart>', 'chart { float: left }', '', function(opts) {
   RiotControl.addStore(this);
   console.log("chart-view.tag");
   loadDataFromServer();
   this.on("mount", function (){
        console.log("zamontowano chart-view");
        loadGoogleMaps();
   })

   function loadDataFromServer() {
        console.log("laduje dane");
         var jsonData = jQuery.ajax({
            url: "http://localhost/analiza/php/ante/dane.php",
            dataType: "json",
            async: false
        }).responseText;
        this.dane = JSON.parse(jsonData);
        console.log("zaladowalem dane", this.dane);
   }

   function loadGoogleMaps() {
        google.load('visualization', '1', {'packages': ['columnchart']});
        google.setOnLoadCallback(googleLoaded);
        console.log("google loader wykonany");
    }
   function googleLoaded() {
       RiotControl.trigger("google-loaded", '1');
       console.log("riot trigger google-loaded");
   }
}, '{ }');
riot.tag2('chart', '<h2>{opts.name}</h2> <div id="{opts.name}" class="map"></div> <chart-description> <a name="dodaj" onclick="{this.dodajKomentarz}">dodaj</a> <div name="opis" class="opis textarea" contenteditable>{opts.komentarz}</div> </chart-description>', 'a { cursor: pointer; } div.map { width: 520px; height: 240px; } div.opis { height: 100px; } .textarea { -moz-appearance: textfield-multiline; -webkit-appearance: textarea; border: 1px solid gray; font: medium -moz-fixed; font: -webkit-small-control; height: 28px; overflow: auto; padding: 2px; resize: both; width: 400px; }', '', function(opts) {

        var self = this;
        console.log('chart.tag');
        self.on('mount', function() {
            console.log("chart.tag on mount");
        })
        RiotControl.one("google-loaded", function() {
            console.log("riot on chart.tag");
            self.drawChart();
        });
        self.drawChart = function() {

            var el = document.getElementById(opts.name);
            var chart = new google.visualization.ColumnChart(el);
            var dataTable = google.visualization.arrayToDataTable(opts.danemapy);

            var options = {width: 600, height: 240, title: 'Company Earnings',
                vAxis: {
                    minValue: "0",
                    viewWindowMode:'explicit',
                    viewWindow: {
                        min: "0"
                    }
                }
            };

            chart.draw(dataTable, options);
        }

        self.dodajKomentarz = function(e) {
            var mainUrl = ["http://localhost/analiza/php/ante/dodaj_komentarz.php?"];
            mainUrl.push("id_wykresu="+e.item.dana.name);
            mainUrl.push("opis="+this.opis.innerHTML.trim());
            e.preventDefault();
            console.log(mainUrl.join('&'));
            jQuery.ajax({
                url: mainUrl.join('&'),
                type: "get"
            });
        }

        console.log("komentarz", opts.komentarz);
}, '{ }');});