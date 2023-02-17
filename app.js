const apiKey = `pk.eyJ1IjoiY2hyaXMtbWFjZG9uYWxkIiwiYSI6ImNrNGN3NHdtNTBoYXozbGxyaW16MW52Y3EifQ.OcnydfpxGWU11o0GbRyoyw`;
const tripKey = `JjgdVbrdDFCh10_hXAg4`;
const tripURL = `https://api.winnipegtransit.com/v3/`

const coords = {
  lat1: 0,
  lon1: 0,
  lat2: 0,
  lon2: 0,
};

  const createFeatureHTML = (feature) => {
    return `
      <li data-long=${feature.center[0]} data-lat=${feature.center[1]} class="origin-item" id="origin-id">
      <div class="name">${feature.text}</div>
      <div>${feature.properties.address}</div>
      </li>
    `
  }

  const createFeatureHTML1 = (feature) => {
    return `
      <li data-long=${feature.center[0]} data-lat=${feature.center[1]} class="destination-item" id="destination-id">
      <div class="name">${feature.text}</div>
      <div>${feature.properties.address}</div>
      </li>
    `
  }

  const createTripHTML1 = (plans) => {
    var resultsHtml = '';
    
    for (var  i = 0; i < plans[0].segments.length; i++){

      if (plans[0].segments[i].type === 'ride') {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-bus" aria-hidden="true"></i> ${plans[0].segments[i].type} the #${plans[0].segments[i].route.number} for ${plans[0].segments[i].times.durations.total} minutes 
            </li>
          `    
          )
      } else if (i + 1 == plans[0].segments.length) {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-walking" aria-hidden="true"></i> ${plans[0].segments[i].type} to end destination
            </li>
          `    
          )        
      } else if (plans[0].segments[i].type === 'transfer') {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-ticket-alt" aria-hidden="true"></i> ${plans[0].segments[i].type} at ${plans[0].segments[i].to.stop.name}
            </li>
          `    
          )   
      } else {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-walking" aria-hidden="true"></i> ${plans[0].segments[i].type} for ${plans[0].segments[i].times.durations.total} minutes to ${plans[0].segments[i].to.stop.name}
            </li>
          `    
          )
      }
    }
    return resultsHtml;
  }

  const createTripHTML2 = (plans) => {
    var resultsHtml = '';
    for (var  i = 0; i < plans[1].segments.length; i++){

      if (plans[1].segments[i].type === 'ride') {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-bus" aria-hidden="true"></i> ${plans[1].segments[i].type} the #${plans[1].segments[i].route.number} for ${plans[1].segments[i].times.durations.total} minutes 
            </li>
          `    
          )
      } else if (i + 1 == plans[1].segments.length) {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-walking" aria-hidden="true"></i> ${plans[1].segments[i].type} to end destination
            </li>
          `    
          )        
      } else if (plans[1].segments[i].type === 'transfer') {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-ticket-alt" aria-hidden="true"></i> ${plans[1].segments[i].type} at ${plans[1].segments[i].to.stop.name}
            </li>
          `    
          )   
      } else {
        resultsHtml = resultsHtml + (
          `
            <li>
            <i class="fas fa-walking" aria-hidden="true"></i> ${plans[1].segments[i].type} for ${plans[1].segments[i].times.durations.total} minutes to ${plans[1].segments[i].to.stop.name}
            </li>
          `    
          )
      }
    }
    return resultsHtml;
  }

  const createFailTripHTML1 = (feature) => {
    return `
      <li data-long=${feature.center[0]} data-lat=${feature.center[1]} class="destination-item" id="destination-id">
      <h1>No Route Here</h1>
      </li>
    `
  }
  const createFailTripHTML2 = (feature) => {
    return `
      <li data-long=${feature.center[0]} data-lat=${feature.center[1]} class="destination-item" id="destination-id">
      <h1>No Route Here</h1>
      </li>
    `
  }

  const getWinnipeg = async (userInput) => {
    const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?access_token=${apiKey}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`
  
    const request = await fetch(URL);
    const response = await request.json();
    console.log(response);
    return response.features;
  }

  const getRoute = async () => {
    const Route = `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=JjgdVbrdDFCh10_hXAg4&origin=geo/${coords.lat1},${coords.lon1}&destination=geo/${coords.lat2},${coords.lon2}`

    const request = await fetch(Route);
    const response = await request.json();
    // console.log(response);
    return response.plans;
  }

const searchHandlerOrigin = (event) => {
  event.preventDefault();
  const userInput = document.getElementById('origin-input').value;
    if (userInput === '') {
      alert('Must enter origin!!!')
    }else {
    getWinnipeg(userInput).then((features) => {
      const originEle = document.querySelector('.origins');
      originEle.textContent = '';
      features.forEach((feature) => {
        originEle.insertAdjacentHTML('beforeend', createFeatureHTML(feature));
      });
      console.log(features);
    });
  };
};

const searchHandlerDestination = (event) => {
  event.preventDefault();
  const userInput = document.getElementById('destination-input').value;
  if (userInput === '') {
    alert('Must enter a destination!!!')
  }else {
    getWinnipeg(userInput).then((features) => {
      const destinationEle = document.querySelector('.destinations');
      destinationEle.textContent = '';
      features.forEach((feature) => {
        destinationEle.insertAdjacentHTML('beforeend', createFeatureHTML1(feature));
      });
      console.log(features);
    });
  };
};

const updateTrip = (event) => {
  event.preventDefault();
  if (coords.lat1 === coords.lat2 && coords.lon1 === coords.lon2 && coords.lat1 !== 0 && coords.lat2 !== 0) {
    alert('Origin and Destination Must Be Different!!')
  }else if (coords.lat1 === 0 && coords.lat2 !== 0 || coords.lat1 !== 0 && coords.lat2 === 0 || coords.lat1 === 0 && coords.lat2 === 0) { 
    alert('Missing Origin or Destination Option')
  }else {
    getRoute().then((plans) => {
      const tripEle1 = document.querySelector('.my-trips1');
      const tripEle2 = document.querySelector('.my-trips2');
      tripEle1.textContent = '';
      tripEle1.insertAdjacentHTML('beforeend', createTripHTML1(plans));
      tripEle2.textContent = '';
      tripEle2.insertAdjacentHTML('beforeend', createTripHTML2(plans));
    });
  };
};

const selectionOrigin = (event) => {
  var els = document.getElementsByClassName("origin-item");
  for(var i = 0; i < els.length; i++) {
    if (els[i].classList.contains('selected')){
      els[i].classList.remove('selected');
    }
  }

  var originEl = event.target.closest('li.origin-item')
  originEl.classList.add('selected');
  coords.lat1 = originEl.dataset.lat;
  coords.lon1 = originEl.dataset.long;
  console.log(originEl.dataset.long);
  console.log(originEl.dataset.lat);
  console.log(coords);
};


const selectionDestination = (event) => {
  var els = document.getElementsByClassName("destination-item");
  for(var i = 0; i < els.length; i++) {
    if (els[i].classList.contains('selected')){
      els[i].classList.remove('selected');
    }
  }

  var destinationEl = event.target.closest('li.destination-item')
  destinationEl.classList.add('selected');
  coords.lat2 = destinationEl.dataset.lat;
  coords.lon2 = destinationEl.dataset.long;
  console.log(destinationEl.dataset.long);
  console.log(destinationEl.dataset.lat);
  console.log(coords);
};



console.log(coords);
document.getElementById('origin').addEventListener('submit', searchHandlerOrigin);
document.getElementById('destination').addEventListener('submit', searchHandlerDestination);
document.getElementById('trip-button').addEventListener('click', updateTrip);
document.querySelector('.origins').addEventListener('click', selectionOrigin);
document.querySelector('.destinations').addEventListener('click', selectionDestination);


























//  Walk for 15 minutes to stop #61121 - Southbound Dovercourt at Falcon Ridge

// const updateTrip = (event) => {
//   event.preventDefault();
//   getRoute().then(plans) => {

//   }
//   console.log('clicked');
// };

// let menuItems = document.querySelectorAll('.menu-item');

// getRoute('49.836954','-97.063598','49.830535','-97.109664');
// getWinnipeg("19 Myles Robinson Way");
// getRoute();
// updateTrip();


  // const getLocation = async (lat, lon) => {
  //   const Location = `${tripURL}locations.json?lat=${lat}&lon=${lon}&api-key=${tripKey}`
  
  //   const request = await fetch(Location);
  //   const response = await request.json();
  //   console.log(response);
  //   return response.features;
  // }

// getLocation('49.830535', '-97.109664'); 
// getLocation('49.836954', '-97.063598');
// getLocation('49.839669', '-97.094124');


//  `https://api.winnipegtransit.com/v3/locations.json?lat=${lat}&lon=${lon}&api-key=${tripKey}`
//  `https://api.winnipegtransit.com/api-key=${tripKey}&locations?lat=${lat}&lon=${lon}`