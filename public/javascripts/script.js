var mymap = L.map('worldmap',
     {
      center: [45.764043
        , 4.835659],
      zoom: 5
     }
);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

var cityItem = document.getElementsByClassName('list-group-item');
console.log(cityItem.length)

for(let i= 0; i<cityItem.length; i++){
  var customIcon = L.icon({
    iconUrl: `${cityItem[i].dataset.url}`,
    
  
    iconSize:     [43, 48], 
    
    iconAnchor:   [18, 33], 
   popupAnchor:  [0, -28]
});
  
  var longitude = cityItem[i].dataset.longitude;
  var latitude = cityItem[i].dataset.latitude;
  var nom= cityItem[i].dataset.nom;
  L.marker([latitude,longitude],{icon: customIcon}).addTo(mymap).bindPopup(cityItem[i].dataset.nom);
}

