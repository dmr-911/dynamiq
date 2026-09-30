let map: google.maps.Map;
// map return promise so we use another side is async await
export async function mapDeclare(params: any, mapId = '15431d2b469f209dsfdsfsde') {
  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: new google.maps.LatLng(params.lat, params.lng),
    zoom: 10,
    mapId: mapId,
    disableDefaultUI: true,
    minZoom: 2
  });
  let marker = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
  let { PinElement, AdvancedMarkerElement } = marker;

  return { map, PinElement, AdvancedMarkerElement, marker };
}
// marker decalre marker return promise so we can recieve value use async await
export async function markerDeclare(params: any) {
  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  return { marker };
}
// decalre infow window because infowindow show content in display
export async function infoWindowDeclare(params: any) {
  let infoWindow = new google.maps.InfoWindow({
    content: 'hellow world',
    position: new google.maps.LatLng(-33.91722, 151.23064)
  });
  return { infoWindow };
}
