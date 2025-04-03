document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger or navMenu element not found');
    }
});


    initMap();


document.cookie = "example_cookie=value; SameSite=None; Secure";

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.4979, lng: 19.0402},
        zoom: 8
    });

    var locations = [
        {
            position: {lat: 47.4979, lng: 19.0402},
            title: 'Budapest',
            info: '<div><strong>Budapest</strong><br>Ez Budapest.</div>'
        },
        {
            position: {lat: 47.5316, lng: 21.6273},
            title: 'Debrecen',
            info: '<div><strong>Debrecen</strong><br>Ez Debrecen.</div>'
        },
        {
            position: {lat: 46.2530, lng: 20.1414},
            title: 'Szeged',
            info: '<div><strong>Szeged</strong><br>Ez Szeged.</div>'
        }

       
    ];

    locations.forEach(function(location) {
        var marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.title
        });

        var infowindow = new google.maps.InfoWindow({
            content: location.info
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    });
}
