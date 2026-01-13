<script lang="ts">
  import { Geolocation } from '@capacitor/geolocation'
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import "@maptiler/sdk/dist/maptiler-sdk.css";
  import User from './user';
  import Position from './position';
  import Map from './map';
  import { Parking } from './parking';
  import { LngLat } from '@maptiler/sdk';
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Home from './routes/Home.svelte';
  import Params from './routes/Params.svelte';
  import RoutingComponent from './components/Routing.svelte';
  import LoginRegisterForm from './components/LoginRegisterForm.svelte';
  import { get } from 'svelte/store';
  import { routingState } from './stores/routingStore';
  import { mapStore } from './stores/mapStore';
  import { UserContent } from './stores/userStore';

  let hasArrived = false;

  const routes: RouteConfig[] = [
    {
      component: Home,
    },
    {
      path: "parametres",
      component: Params,
      props: {
        UserContent
      }
    }
  ];

  const deviceHeight = window.innerHeight;
  const deviceWidth = window.innerWidth;
  let openSideMenu = false;
  let showNoResultWarning = false;
  let locationError = false;
  let locationErrorMessage = "";
  const position: Position = new Position();
  const parking = new Parking();
  onMount(() => {
    mapInit();
  });
  // Clear route when routing component is closed
  $: if (!$routingState.isVisible) {
    const currentMap = get(mapStore);
    if (currentMap) {
      currentMap.clearRoute();
      currentMap.map.easeTo({pitch: 0, bearing:0,zoom:15});
    }
    hasArrived = false;
  }

  // refresh markers when dspOnly changes and map exists
  $: if ($mapStore && $UserContent) {
    (async () => {
      try {
        const prefs = [
          $UserContent.free ? 1 : 0,
          $UserContent.pmr ? 1 : 0,
          $UserContent.elec ? 1 : 0
        ];
        const LngLatActuel = new LngLat(position.longitude, position.latitude);
        let filtered = parking.getNearParkings(
          LngLatActuel,
          $UserContent.dspOnly,
          30000, // Rayon
          prefs
        );

        if(filtered.length === 0){
          showNoResultWarning = true;
          setTimeout(() => { showNoResultWarning = false; }, 3000);  
        } else {
          showNoResultWarning = false;
        }
        $mapStore.clearParkingMarkers();
        $mapStore.setParkingMarkers(filtered);
      } catch (e) {
        console.error("Erreur rafraîchissement parkings", e);
      }
    })();
  }

  async function mapInit() {
    console.log('mapInit started');
    let map = get(mapStore);
    
    // Ensure permissions are checked/requested before proceeding
    try {
      const permStatus = await Geolocation.checkPermissions();
      if (permStatus.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
      }
    } catch (e) {
      console.error('Error checking permissions in mapInit', e);
    }

    if (!map) {
      console.log('Creating new Map instance');
      map = new Map('map');
      mapStore.set(map);
      
      try {
        await position.getPosition();
        map.longitude = position.longitude;
        map.latitude = position.latitude;
        locationError = false;
      } catch (e) {
        locationError = true;
        locationErrorMessage = "Impossible de déterminer votre position GPS";
        console.error('Could not get initial position', e);
        position.longitude = -0.109530; // Pour afficher les parkings même sans position (TEST SEULEMENT - A SUPPRIMER)
        position.latitude = 51.553059; // IDEM  ----------------------------------------------------------------------
        map.longitude =  -0.109530; 
        map.latitude = 51.553059;
      }

      map.loadMap();
      position.setWatcher((lat: number, lng: number) => {
        map!.setPosition(lat, lng);
        const currentRoute = get(routingState);
        if(currentRoute.isVisible && currentRoute.LngLat && !hasArrived){
          const userLocation = new LngLat(lng, lat);
          const destinationLocation = new LngLat(currentRoute.LngLat.lng, currentRoute.LngLat.lat);
          const distance = userLocation.distanceTo(destinationLocation);

          if(distance < 40){
            hasArrived = true;
            triggerArrivalAnimation(map,destinationLocation);
            console.log("Vous êtes arrivé à destination !");
          }
        }
      });
      await parking.fetchParkings();
      console.log(parking.parkings.length + ' parkings loaded');
      const largeRadius = 50000; 
      map.setParkingMarkers(parking.getNearParkings(new LngLat(position.longitude, position.latitude), $UserContent.dspOnly, largeRadius, [0,0,0]));
    } else {
      console.log('Using existing Map instance');
      map.loadMap();
      
      // Re-attach watcher
      position.setWatcher((lat: number, lng: number) => {
        map!.setPosition(lat, lng);
        const currentRoute = get(routingState);
        if(currentRoute.isVisible && currentRoute.LngLat && !hasArrived){
          const userLocation = new LngLat(lng, lat);
          const destinationLocation = new LngLat(currentRoute.LngLat.lng, currentRoute.LngLat.lat);
          const distance = userLocation.distanceTo(destinationLocation);

          if(distance < 40){
            hasArrived = true;
            triggerArrivalAnimation(map, destinationLocation);
            console.log("Vous êtes arrivé à destination !");
          }
        }
      });
      
      // Check if we need to fetch
      if (parking.parkings.length === 0) {
         await parking.fetchParkings();
      }
      const largeRadius = 50000; 
      map!.setParkingMarkers(parking.getNearParkings(new LngLat(position.longitude, position.latitude), $UserContent.dspOnly, largeRadius));
    }

      const routeState = get(routingState);
      if (routeState.isVisible && routeState.LngLat) {
        console.log('Redrawing route on existing map');
        map.drawRoute(routeState.LngLat.lng, routeState.LngLat.lat, routeState.destination);
      }
    }
  function triggerArrivalAnimation(mapInstance: any, target: LngLat) {
    if (!mapInstance || !mapInstance.map) return;
    mapInstance.map.flyTo({
        center: target,
        zoom: 18,
        pitch: 60,
        bearing: -45,
        speed: 0.8,
        essential: true
  });
}
</script>

<main class="flex flex-col justify-center items-center" style="height: {deviceHeight}px; width: {deviceWidth}px; ">

  {#if showNoResultWarning}
    <div class="absolute top-20 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold transition-opacity">
      <i class="fa-solid fa-circle-exclamation mr-2"></i>
      Aucun parking ne correspond à vos filtres.
    </div>
  {/if}
  {#if locationError}
    <div class="absolute top-5 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border-2 border-white animate-bounce">
      <i class="fa-solid fa-location-dot"></i>
      <div class="text-sm">
        <p class="font-bold">{locationErrorMessage}</p>
        <p class="text-xs opacity-90">Affichage des parkings par défaut (Londres).</p>
      </div>
      <button on:click={() => locationError = false} aria-label="Fermer l'avertissement" class="ml-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  {/if}
  {#if $UserContent.token === ""}

    <LoginRegisterForm UserContent={UserContent} />

  {:else}

    <Navbar bind:open={openSideMenu} />

    {#if $routingState.isVisible}
      <RoutingComponent destination={$routingState.destination} />
    {/if}

    <Router {routes} />

  {/if}
</main>