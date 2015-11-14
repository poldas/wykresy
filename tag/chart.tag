<chart>
    <h2>{opts.name}</h2>
    <div id={opts.name} class="map"></div>
    <chart-description>
        <a name="dodaj" onclick={this.dodajKomentarz}>dodaj</a>
        <div name="opis" class="opis textarea" contenteditable>{opts.komentarz}</div>
    </chart-description>
    <style>
        a {
            cursor: pointer;
        }
        div.map {
            width: 520px;
            height: 240px;
        }
        div.opis {
            height: 100px;
        }
        .textarea {
            -moz-appearance: textfield-multiline;
            -webkit-appearance: textarea;
            border: 1px solid gray;
            font: medium -moz-fixed;
            font: -webkit-small-control;
            height: 28px;
            overflow: auto;
            padding: 2px;
            resize: both;
            width: 400px;
        }
    </style>

    <script>
        // Define maps state, defaults
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
            //instantiate our chart object
            var el = document.getElementById(opts.name);
            var chart = new google.visualization.ColumnChart(el);
            var dataTable = google.visualization.arrayToDataTable(opts.danemapy);
            //define options for visualization
            var options = {width: 600, height: 240, title: 'Company Earnings',
                vAxis: {
                    minValue: "0",
                    viewWindowMode:'explicit',
                    viewWindow: {
                        min: "0"
                    }
                }
            };
            //draw our chart
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
    </script>
</chart>