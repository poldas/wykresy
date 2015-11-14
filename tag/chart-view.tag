<chart-view>
   <chart each={ dana in dane } name={dana.name} danemapy={ dana.dane } komentarz = {dana.komentarz}></chart>
   <style>
    chart {
    float: left
    }
   </style>
   <script>
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
   </script>
</chart-view>