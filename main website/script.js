//check malpundu 
document.addEventListener('DOMContentLoaded', function() {
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  
  //not login
  if (!userData) {
    window.location.href = '../login page/login.html';
    return;
  }
  document.getElementById('userName').textContent = `Welcome, ${userData.name}`;
  document.getElementById('phoneNumber').value = userData.phone;
  if (userData.defaultStop) {
    document.getElementById('stopSelect').value = userData.defaultStop;
  }
  document.getElementById('notificationsEnabled').checked = userData.enableNotifications;
  initializeMap();
  document.getElementById('infoPanelToggle').addEventListener('click', function() {
    togglePanel('infoPanel');
  });
  
  document.getElementById('stopsPanelToggle').addEventListener('click', function() {
    togglePanel('stopInfoPanel');
  });
  
  document.getElementById('notificationPanelToggle').addEventListener('click', function() {
    togglePanel('notificationPanel');
  });
  
  document.getElementById('notifyBtn').addEventListener('click', updatePreferences);
  
  initializePanels();
  
  setupMenuHandlers();
});
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('busTrackerUser');
  window.location.href = '../login page/login.html';
});
function setupMenuHandlers() {
  //menu 
  document.getElementById('menuButton').addEventListener('click', function() {
    document.getElementById('menuPanel').classList.add('active');
    document.getElementById('menuOverlay').classList.add('active');
    
    //Update menu
    const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
    if (userData) {
      document.getElementById('menuStopSelect').value = userData.defaultStop || '';
      document.getElementById('menuNotificationsEnabled').checked = userData.enableNotifications || false;
    }
  });
  
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  document.getElementById('menuOverlay').addEventListener('click', closeMenu);
  document.getElementById('menuStops').addEventListener('click', function() {
    closeMenu();
    // not complete
    const stopInfoPanel = document.getElementById('stopInfoPanel');
    const panels = document.querySelectorAll('.panel');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    panels.forEach(p => {
      p.classList.remove('active');
      if (isMobile) p.style.display = 'none';
    });
    stopInfoPanel.classList.add('active');
    stopInfoPanel.style.display = 'block';
    const stopList = document.getElementById('stopList');
    const stopToggle = document.getElementById('stopToggle');
    stopList.classList.remove('collapsed');
    stopToggle.innerHTML = 'Stop Information &#9650;';
  });
  
  document.getElementById('menuSettings').addEventListener('click', function() {
    closeMenu();
    //not complete
    alert('Settings feature coming soon!');
  });
  document.getElementById('savePreferencesBtn').addEventListener('click', saveMenuPreferences);
}

function closeMenu() {
  document.getElementById('menuPanel').classList.remove('active');
  document.getElementById('menuOverlay').classList.remove('active');
  document.getElementById('menuSaveStatus').classList.remove('success', 'error');
  document.getElementById('menuSaveStatus').style.display = 'none';
}

function showPanel(panelId) {
  const panels = document.querySelectorAll('.panel');
  const panel = document.getElementById(panelId);
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  //on mobile
  if (isMobile) {
    panels.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    panel.classList.add('active');
    panel.style.display = 'block';
  } else {
    //on desktope
    panels.forEach(p => {
      p.classList.remove('active');
    });
    panel.classList.add('active');
  }
  if (panelId === 'stopInfoPanel') {
    const stopList = document.getElementById('stopList');
    const stopToggle = document.getElementById('stopToggle');
    stopList.classList.remove('collapsed');
    if (stopToggle) {
      stopToggle.innerHTML = 'Stop Information &#9650;';
    }
  }
}


function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
    panel.classList.remove('active');
  } else {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(p => {
      p.style.display = 'none';
      p.classList.remove('active');
    });
    panel.style.display = 'block';
    panel.classList.add('active');
  }
}

const INITIAL_CENTER = [12.806817987493606, 74.85809163962097]; // map center g bariyere
const busRoute = {
  coordinates: [
    INITIAL_CENTER,
    [12.806817987493606, 74.85809163962097],
    [12.814454558312642, 74.85863329697946],
    [12.814695175397038, 74.85840799142666],
    [12.81460102091313, 74.85720636181175],
    [12.814611482524183, 74.85674502187032],
    [12.814653328964075, 74.85484601792534],
    [12.816243488591754, 74.84947087106184],
    [12.816756103711821, 74.84716417126748],
    [12.818806553675135, 74.84315158655397],
    [12.819319163546051, 74.8413705998033],
    [12.81919362653129, 74.84123112493728],
    [12.81914131942334, 74.84151007466932],[12.819146485801253, 74.84174223800177],
[12.818150294527841, 74.84412510388],
[12.81657032127128, 74.84737473726595],
[12.816125952009225, 74.84937038745396],
[12.814784126330261, 74.85420164809187],
[12.814749273620695, 74.85424930540819],
[12.814757986798536, 74.8543773844458],
[12.814598136056183, 74.85665758673792],
[12.81463652701673, 74.85835263755392],
[12.814643271453173, 74.85851352889188],
[12.814677317605367, 74.85851475519422],
[12.815102411506082, 74.8585236978153],
[12.815815986329174, 74.85856766570255],
[12.816231631830696, 74.8585840605088],
[12.8164765135633, 74.8585810796362],
[12.817280915680751, 74.85866827018363],
[12.817825567010425, 74.85872392602664],
[12.818151180327206, 74.85877555855511],
[12.818716098820195, 74.85886876532803],
[12.818846866812288, 74.85889357576568],
[12.819607935159793, 74.85897135983711],
[12.820423269577615, 74.85911686969362],
[12.821020220848638, 74.85923756911494],
[12.821178448657724, 74.85933345809713],
[12.821290254197008, 74.85939045504351],
[12.821352368367561, 74.85941325382532],
[12.822418114342502, 74.85962917167815],
[12.823810769456118, 74.85983771345697],
[12.825028192167764, 74.85986319444706],
[12.825829778774628, 74.85989269874979],
[12.826602594763589, 74.85990745090223],
[12.827086420829337, 74.85993427299489],
[12.82771277805281, 74.85997450613412],
[12.828354825277158, 74.86002882087313],
[12.829006678066605, 74.86009118224052],
[12.829448001671837, 74.8601092871573],
[12.830195307858826, 74.86015957857495],
[12.830851732458395, 74.8601931061883],
[12.83132639698866, 74.8602279749057],
[12.831876248305209, 74.86027893687624],
[12.832505862544977, 74.86033325160791],
[12.833124360565696, 74.86034867430973],
[12.833891923648379, 74.8603258755338],
[12.835388468784192, 74.86029972399669],
[12.836183484332524, 74.86023468042912],
[12.836864737432474, 74.8601978000545],
[12.837985989719458, 74.8601226982034],
[12.839740102064132, 74.86002010370987],
[12.841800252023523, 74.85985575990581],
[12.84215765339904, 74.8598322366274],    
[12.845107447323825, 74.85964910721756],
[12.846010515245139, 74.8597040460411],
[12.847899790802966, 74.86069333457569],
[12.848767661211784, 74.86140252644708],
[12.84989064292044, 74.86222787907079],
[12.85070106606913, 74.86284747700188],
[12.850784514344799, 74.86291228246431],
[12.850913263067927, 74.86294651931647],
[12.851529587022693, 74.86336958895227],
[12.851578463711993, 74.86342094422439],
[12.851702443574291, 74.86362269709637],
[12.852509574166351, 74.86430714403421],
[12.853540747077734, 74.86518629741272],
[12.853214236586094, 74.86489507471651],
[12.853895005814827, 74.86548521411471],
[12.85497966046576, 74.86641145944348],
[12.856836517369262, 74.86746146467878],
[12.85702829866974, 74.86745885921067],
[12.858018954658515, 74.86741065798013],
[12.860274587570855, 74.8669911769793],
[12.86206917292858, 74.86654824673025],
[12.867698475764694, 74.8648015652825],
[12.869131062612324, 74.86389633253773],
[12.869425227271604, 74.86381184415072],
[12.869445818784829, 74.86478949548622],
[12.869784107700616, 74.86630726906006],
[12.869466410304838, 74.86720043206603],
[12.869057521393875, 74.86846172303095],
[12.86943699385003, 74.87086662470533],
[12.869639967255313, 74.87319609033003],
[12.870222617325055, 74.87628835985824],
[12.87023641569447, 74.87855299199805],
[12.87032380530444, 74.88049208322111],
[12.871308086151895, 74.88098747153497],
[12.870728556785044, 74.88239814857234],
[12.870673363429392, 74.88245004645489],
[12.871096512092493, 74.88490339791956],
[12.871386276518148, 74.88563468534694],
[12.871643844615388, 74.88584699460007],
[12.871699927680451, 74.88591044062433],
[12.871776000805724, 74.88593638347912],
[12.871778740846587, 74.88594689126346],
[12.871745402044636, 74.88615073914407],
[12.871723176175308, 74.88645382876521],
[12.871737557621195, 74.8866026913597],
[12.871766320510487, 74.8867468600886],
[12.872037606696189, 74.88752604181424],
[12.872102976816704, 74.88774665351043],
[12.872104284219901, 74.88820799345943],
[12.872109513828145, 74.88885038251588],
[12.872149389591664, 74.88917224760704],
[12.872119973045256, 74.88939554149877],
[12.872032377086597, 74.88958597833135],
[12.872029108577543, 74.88961145932578],
[12.871791161184248, 74.8902062391722],
[12.87179513894883, 74.89095180832766],
[12.871822594428243, 74.89115632676432],
[12.87182324813107, 74.89132195317083],
[12.871799714858293, 74.89158480966151],
[12.871673550357851, 74.89196501278171],
[12.871391845512823, 74.89292371634792],
[12.871264080312743, 74.89452779990522],
[12.871189384723694, 74.89492809959195],
[12.87109564145454, 74.89535650399017],
[12.870870767262756, 74.89616116669005],
[12.870804743116576, 74.89634556856083],
[12.870354893420688, 74.8974206168248],
[12.870064647927093, 74.89809318073708],
[12.869875726693047, 74.89852300473731],
[12.86960982350621, 74.89912366759943],
[12.869041879426144, 74.90052250779685],
[12.868426084691809, 74.90135734535292],
[12.868290766538495, 74.90164635337507],
[12.868265271805468, 74.90215664364001],
[12.868214282331987, 74.90290162719171],
[12.868052815596846, 74.90330664075697],
[12.86777445300002, 74.90401547570322],
[12.867627367664584, 74.90439500827803],
[12.867407720068256, 74.90495424886514],
[12.867067788890019, 74.90570660848834],
[12.866735701829114, 74.90669500250539],
[12.866620647942351, 74.90718785841196],
[12.866500364277531, 74.90801062602628],
[12.866481196089813, 74.9100806161701],
[12.866923067881087, 74.9121346166309],
[12.867237504419387, 74.91294196154148],
[12.867863107755856, 74.91462370658869],
[12.868022613476269, 74.91539685334531],
[12.868066153131851, 74.91727656989919],
[12.868067460555364, 74.91766750186726],
[12.86806288457388, 74.91786062090874],
[12.868078573655067, 74.91864114373138],
[12.868081188501472, 74.91866461305933],
[12.868083803347545, 74.91868540019652],
[12.868020151838735, 74.92101352528483],
[12.867982890264225, 74.92213804141895],
[12.868188406854225, 74.9242510324244],
[12.86820671077145, 74.92506776507051],
[12.868128265404467, 74.92616545911045],
[12.868026045476684, 74.92784546466414],
[12.868020449798454, 74.92925386576523],
[12.868708620236731, 74.9317856087901],
[12.869191752984728, 74.93461907335949],
[12.86915267418838, 74.935246507376],
[12.868798723954034, 74.93714063909528],
[12.8687112965879, 74.93755337535552],
[12.86862124203495, 74.93866948687932],
[12.868754598881702, 74.93910467529028],
[12.86914486336223, 74.93957540297347],
[12.869924911377975, 74.94074869431634],
[12.870356899632688, 74.94248975241128],
[12.870496138905017, 74.94276132607624],
[12.87072558936526, 74.94303289973467],
[12.871013219277005, 74.94343523108823],
[12.871283866135098, 74.94433834467044],
[12.87273617983405, 74.94702052420755],
[12.873486370446665, 74.94844000798085],
[12.873840244851817, 74.95032572779273],
[12.873878314797489, 74.95063618927557],
[12.873923333886875, 74.95162100293638],
[12.873996022077044, 74.9527395271705],
[12.874046972861585, 74.95407884994502],
[12.874329555662719, 74.95570568306107],
[12.874395256016676, 74.95753580687453],
[12.873966004745613, 74.95832838318763],
[12.872800354722814, 74.95940864254486],
[12.870775227205952, 74.96170295876645],
[12.873266894213243, 74.95898391990622],
[12.87032857342233, 74.96294577899474],
[12.870092604431678, 74.96508534785187],
[12.870022242254198, 74.96544403764672],
[12.869965705639405, 74.96673735283703],
[12.870016158435643, 74.97103755271347],
[12.86959681989124, 74.9725281785167],
[12.86943050892932, 74.97293935950104],
[12.869432843458288, 74.9729768049149],
[12.869553374229842, 74.97314666614479],
[12.869852219145715, 74.97360362855876],
[12.870002569558602, 74.97436713657683],
[12.870282852186204, 74.97496689973374],
[12.870650798091143, 74.97556395883343],
[12.87113153183595, 74.97773171747598],
[12.871141211029189, 74.978052744321],
[12.871476756164279, 74.97809245898223],
[12.872505973552007, 74.9786451547319],
[12.873925576809697, 74.97928058932158],
[12.874890257186749, 74.98043231455617],
[12.876293715283325, 74.98096515294147],
[12.877164823252379, 74.98161382576433],
[12.879074797553146, 74.98249085789749],
[12.880823443691053, 74.98358632069468],
[12.886059630237014, 74.98386763292312],
[12.887667368185664, 74.98386148033816],
[12.887741570433384, 74.98373240767263],
[12.889522417660828, 74.9810781443867],
[12.891964609687822, 74.98255089644205],
[12.893190291181785, 74.98349504911548],
[12.893548389550823, 74.98461036918532],
[12.893506450140247, 74.98509025472661],
[12.898319759571182, 74.98694360565823],
[12.898345567950766, 74.98666560302954],
[12.89824233441644, 74.98641076728657],
[12.898668140086883, 74.98541324435404],
[12.898892839265745, 74.98489867931373]
  ],
  stops: [
    { name: "Ambika Rd", coords: INITIAL_CENTER },
    { name: "SHREE MOOKAMBIKA", coords: [12.814684990616797, 74.85851543110245] },
    { name: "Abbakka circle", coords: [12.819197649511906, 74.84139641448603] },
    { name: "Thokottu", coords: [12.817868523116243, 74.85869779642621] },
    { name: "Jeppinamogaru", coords: [12.846397942499397, 74.8597402905164] },
    { name: "Kulashekara", coords: [12.862096019271089, 74.86656337651152] },
    { name: "Konkan Complex", coords:[12.869473453533018, 74.86476978688982] },
    { name: "Navoor", coords:[12.8896811, 75.0903679]},
    { name: "Canara Engineering College", coords:[12.898889736519566, 74.98489665011179] }
  ]
};
const COLLEGE_STOP_COORDS = busRoute.stops[busRoute.stops.length - 1].coords;
const stopLabels = ["A", "B", "C", "D", "E", "F", "G", "H","I"];
let map;
let busMarker;
let lastPosition = null;
let lastTimestamp = null;
let currentStopIndex = 0;
let selectedStopForNotification = null;
let userPhoneNumber = null;
let notificationsEnabled = false;
let stopNotificationSent = false;
const NOTIFICATION_DISTANCE_THRESHOLD = 1000; // meters

function initializeMap() {
  map = new MapmyIndia.Map("map", {
    center: INITIAL_CENTER,
    zoom: 12,
    mapType: "roadmap"
  });
  const busIcon = L.icon({
    iconUrl: 'b.webp',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45]
  });
  busMarker = L.marker(INITIAL_CENTER, {
    icon: busIcon,
    rotationAngle: 0
  })
  .addTo(map)
  .bindPopup("<b>CEC Bus</b><br>Currently in transit");
  initializeRoute();
  populateStopInfoPanel();
  startTracking();
  populateStopOptions();
  loadUserPreferences();
}

function initializeRoute() {
  L.polyline(busRoute.coordinates, {
    color: '#673ab7',
    weight: 4,
    opacity: 0.7
  }).addTo(map);
  busRoute.stops.forEach((stop, index) => {
    const label = stopLabels[index] || "?";
    const letterIcon = L.divIcon({
      className: 'letter-marker-wrapper',
      html: `<div class="letter-marker">${label}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });  
    L.marker(stop.coords, { icon: letterIcon })
     .addTo(map)
     .bindPopup(`<b>Stop ${label}</b><br>${stop.name}`);
  });
}

function populateStopInfoPanel() {
  const stopListElement = document.getElementById('stopList');
  
  busRoute.stops.forEach((stop, index) => {
    const label = stopLabels[index] || "?";
    const li = document.createElement('li');
    li.innerHTML = `<strong>${label}</strong> - ${stop.name}`;
    stopListElement.appendChild(li);
  });
}

document.getElementById('stopToggle').addEventListener('click', function() {
  const stopList = document.getElementById('stopList');
  stopList.classList.toggle('collapsed');
  if (stopList.classList.contains('collapsed')) {
    this.innerHTML = 'Stop Information &#9660;'; 
  } else {
    this.innerHTML = 'Stop Information &#9650;';
  }
});

function startTracking() {
  lastTimestamp = Date.now();
  setInterval(getLocationUpdates, 5000);
}

async function getLocationUpdates() {
  try {
    showLoading();
    const response = await fetch('https://last-5-shp6.onrender.com/get-location');
    const data = await response.json();   
    if (data?.lat && data?.lng) {
      const currentTimestamp = Date.now();
      const newLatLng = L.latLng(data.lat, data.lng);
      if (lastPosition) {
        const distance = map.distance(lastPosition, newLatLng); 
        const timeDiff = (currentTimestamp - lastTimestamp) / 1000;
        const speedMps = distance / timeDiff;
        const speedKmh = (speedMps * 3.6).toFixed(2); 
        document.getElementById('speed').textContent = `${speedKmh} km/h`;
        document.getElementById('speedMobile').textContent = `${speedKmh} km/h`;
        
        if (speedMps > 0) {
          const remainingDistance = map.distance(newLatLng, COLLEGE_STOP_COORDS); 
          const etaSeconds = remainingDistance / speedMps;
          const etaMinutes = Math.round(etaSeconds / 60);
          document.getElementById('eta').textContent = `${etaMinutes} min`;
          document.getElementById('etaMobile').textContent = `${etaMinutes} min`;
        } else {
          document.getElementById('eta').textContent = '-- min';
          document.getElementById('etaMobile').textContent = '-- min';
        }
      }
      updateBusPosition({ lat: data.lat, lng: data.lng });
      updateNextStopInfo([data.lat, data.lng]);
      lastTimestamp = currentTimestamp;
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  } finally {
    hideLoading();
  }
}  

function updateBusPosition({ lat, lng }) {
  if (!lat || !lng) return;
  const newLatLng = L.latLng(lat, lng);
  if (lastPosition) {
    const angle = calculateBearing(lastPosition, newLatLng);
    busMarker.setRotationAngle(angle); 
  }      
  busMarker.setLatLng(newLatLng);
  lastPosition = newLatLng;  
  
  checkBusApproachingSelectedStop(newLatLng);
}

function calculateBearing(from, to) {
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const dLon = (to.lng - from.lng) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
} 

function updateNextStopInfo(currentPos) {
  let nearestStop = null;
  let minDistance = Infinity;
  busRoute.stops.forEach((stop, index) => {
    const distance = map.distance(currentPos, stop.coords);
    if (distance < minDistance && index > currentStopIndex) {
      minDistance = distance;
      nearestStop = stop;
      currentStopIndex = index;
    }
  }); 
  if (nearestStop) {
    document.getElementById('nextStop').textContent = nearestStop.name;
    document.getElementById('nextStopMobile').textContent = nearestStop.name;
  }
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function checkBusApproachingSelectedStop(currentPos) {
  //if changes
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  if (!userData) return;
  
  //update
  selectedStopForNotification = userData.defaultStop ? parseInt(userData.defaultStop) : null;
  userPhoneNumber = userData.phone;
  notificationsEnabled = userData.enableNotifications;
  
  if (selectedStopForNotification !== null && notificationsEnabled && !stopNotificationSent) {
    const selectedStop = busRoute.stops[selectedStopForNotification];
    const distanceToSelectedStop = map.distance(currentPos, selectedStop.coords);
    
    if (distanceToSelectedStop <= NOTIFICATION_DISTANCE_THRESHOLD) {
      //trigger
      sendStopNotification(selectedStop);
      stopNotificationSent = true;
    }
  }
}

function sendStopNotification(stop) {
  //gets user data
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  if (!userData || !userData.enableNotifications) return;
  
  const statusElement = document.getElementById('notificationStatus');
  statusElement.style.display = 'block';
  statusElement.textContent = `Bus is approaching ${stop.name}!`;
  alert(`ALERT: Bus is approaching ${stop.name}! ETA: Soon`);
  
  //makes api call
  if (userData.phone) {
    const apiUrl = 'https://twillo-bus-tracker.onrender.com/make-call';
    
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        phone: userData.phone,
        message: `The bus is approaching ${stop.name}. Please be ready to board.`
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Call initiated:', data);
      statusElement.textContent = `Call initiated to ${userData.phone} for ${stop.name} notification`;
    })
    .catch(error => {
      console.error('Error making call:', error);
      statusElement.textContent = `Error making call: ${error.message}`;
    });
  }
}

function populateStopOptions() {
  const mainStopSelect = document.getElementById('stopSelect');
  const menuStopSelect = document.getElementById('menuStopSelect');
  while (mainStopSelect.options.length > 1) {
    mainStopSelect.remove(1);
  }
  
  while (menuStopSelect.options.length > 1) {
    menuStopSelect.remove(1);
  }
  busRoute.stops.forEach((stop, index) => {
    const label = stopLabels[index] || "?";
    const mainOption = document.createElement('option');
    mainOption.value = index;
    mainOption.textContent = `${label} - ${stop.name}`;
    mainStopSelect.appendChild(mainOption);
    const menuOption = document.createElement('option');
    menuOption.value = index;
    menuOption.textContent = `${label} - ${stop.name}`;
    menuStopSelect.appendChild(menuOption);
  });
}
function saveMenuPreferences() {
  const stopSelect = document.getElementById('menuStopSelect');
  const notificationsEnabled = document.getElementById('menuNotificationsEnabled');
  const statusElement = document.getElementById('menuSaveStatus');
  
  // Getuser data
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  if (!userData) {
    window.location.href = 'login.html';
    return;
  }
  userData.defaultStop = stopSelect.value;
  userData.enableNotifications = notificationsEnabled.checked;
  localStorage.setItem('busTrackerUser', JSON.stringify(userData));
  
  //reset
  selectedStopForNotification = userData.defaultStop ? parseInt(userData.defaultStop) : null;
  userPhoneNumber = userData.phone;
  stopNotificationSent = false;
  
  // update main 
  if (document.getElementById('stopSelect')) {
    document.getElementById('stopSelect').value = userData.defaultStop;
  }
  if (document.getElementById('notificationsEnabled')) {
    document.getElementById('notificationsEnabled').checked = userData.enableNotifications;
  }
  
  // message
  statusElement.textContent = 'Preferences saved successfully!';
  statusElement.classList.add('success');
  statusElement.style.display = 'block';
  
  //hide
  setTimeout(function() {
    statusElement.style.display = 'none';
    statusElement.classList.remove('success');
  }, 3000);
}

//update 
function updatePreferences() {
  const stopSelect = document.getElementById('stopSelect');
  const statusElement = document.getElementById('notificationStatus');
  const notificationsEnabled = document.getElementById('notificationsEnabled').checked;
  
  //get data
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  if (!userData) {
    window.location.href = '../login page/login.html';
    return;
  }
  userData.defaultStop = stopSelect.value;
  userData.enableNotifications = notificationsEnabled;
  
  //save 
  localStorage.setItem('busTrackerUser', JSON.stringify(userData));
  
  //Reset
  selectedStopForNotification = userData.defaultStop ? parseInt(userData.defaultStop) : null;
  userPhoneNumber = userData.phone;
  stopNotificationSent = false;
  if (document.getElementById('menuStopSelect')) {
    document.getElementById('menuStopSelect').value = userData.defaultStop;
  }
  if (document.getElementById('menuNotificationsEnabled')) {
    document.getElementById('menuNotificationsEnabled').checked = userData.enableNotifications;
  }
  
  // Update UI
  statusElement.style.display = 'block';
  if (selectedStopForNotification !== null && notificationsEnabled) {
    const selectedStop = busRoute.stops[selectedStopForNotification];
    statusElement.textContent = `You will be notified when the bus approaches ${selectedStop.name}`;
  } else if (!notificationsEnabled) {
    statusElement.textContent = 'Notifications are turned off';
  } else {
    statusElement.textContent = 'Please select a stop for notifications';
  }
}

//responsive
function initializePanels() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const panels = document.querySelectorAll('.panel');
  
  function handleScreenSizeChange(e) {
    if (!e.matches) {
      // 768px
      panels.forEach(panel => {
        panel.style.display = 'block';
        panel.classList.remove('active');
      });
    } else {
      panels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
      });
    }
  }
  
  //initial call
  handleScreenSizeChange(mediaQuery);
  mediaQuery.addEventListener('change', handleScreenSizeChange);
}

//user preference
function loadUserPreferences() {
  const userData = JSON.parse(localStorage.getItem('busTrackerUser'));
  if (userData) {
   
    if (document.getElementById('stopSelect')) {
      document.getElementById('stopSelect').value = userData.defaultStop || '';
    }
    if (document.getElementById('notificationsEnabled')) {
      document.getElementById('notificationsEnabled').checked = userData.enableNotifications || false;
    }
    
    // Set values in the menu
    if (document.getElementById('menuStopSelect')) {
      document.getElementById('menuStopSelect').value = userData.defaultStop || '';
    }
    if (document.getElementById('menuNotificationsEnabled')) {
      document.getElementById('menuNotificationsEnabled').checked = userData.enableNotifications || false;
    }
    
    // Update notification
    selectedStopForNotification = userData.defaultStop ? parseInt(userData.defaultStop) : null;
    userPhoneNumber = userData.phone;
    notificationsEnabled = userData.enableNotifications;
  }
} 