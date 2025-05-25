<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <div :id="mapId" style="height: 300px; width: 100%; border: 1px solid #ccc;">
      Cargando mapa...
    </div>
    <small v-if="modelValue">Ubicación seleccionada: {{ modelValue }}</small>
    <small v-else>Haz clic en el mapa para seleccionar una ubicación.</small>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
// Necesitarías importar 'L' de Leaflet si usas Leaflet directamente
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// Este es un ESQUELETO. La implementación real dependerá de la librería de mapas.
// Por ejemplo, con vue-leaflet:
// import { LMap, LTileLayer, LMarker, LIcon } from "@vue-leaflet/vue-leaflet";

const props = defineProps({
  modelValue: { // WKT string
    type: String,
    default: ''
  },
  label: String,
  initialLat: {
    type: Number,
    default: -33.456 // Santiago
  },
  initialLng: {
    type: Number,
    default: -70.651 // Santiago
  },
  zoom: {
    type: Number,
    default: 13
  }
});

const emit = defineEmits(['update:modelValue']);

const mapId = `map-${Math.random().toString(36).substring(7)}`;
let map: any = null; // Tipo de 'L.Map' si usas Leaflet
let marker: any = null; // Tipo de 'L.Marker'

const updateMarkerPosition = (lat: number, lng: number) => {
  const wktPoint = `POINT(${lng} ${lat})`;
  emit('update:modelValue', wktPoint);
  // Si usas Leaflet y el marcador existe:
  // if (marker) {
  //   marker.setLatLng([lat, lng]);
  // } else if (map) {
  //   marker = L.marker([lat, lng]).addTo(map);
  // }
  // if (map) map.panTo([lat, lng]);
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    // Carga dinámica de Leaflet para evitar problemas con SSR
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    // Configuración básica del ícono para evitar errores con Webpack/Vite
    // delete L.Icon.Default.prototype._getIconUrl;
    // L.Icon.Default.mergeOptions({
    //   iconRetinaUrl: (await import('leaflet/dist/images/marker-icon-2x.png')).default,
    //   iconUrl: (await import('leaflet/dist/images/marker-icon.png')).default,
    //   shadowUrl: (await import('leaflet/dist/images/marker-shadow.png')).default,
    // });


    map = L.map(mapId).setView([props.initialLat, props.initialLng], props.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', (e: any) => { // e es L.LeafletMouseEvent
      updateMarkerPosition(e.latlng.lat, e.latlng.lng);
    });

    // Si hay un valor inicial, colocar el marcador
    if (props.modelValue) {
      const match = props.modelValue.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], props.zoom);
      }
    }
  }
});

watch(() => props.modelValue, (newWkt) => {
  if (typeof window === 'undefined' || !map) return;
  const L = (window as any).L; // Acceder a L si ya está cargado
  if (!L) return;


  const match = newWkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
    // No mover el mapa aquí para evitar conflictos si el usuario está navegando el mapa
    // map.setView([lat, lng]); 
  } else if (marker) {
    // Si el WKT se vacía o es inválido, remover el marcador
    map.removeLayer(marker);
    marker = null;
  }
});

</script>

<style>
/* Asegúrate que los estilos de Leaflet se cargan.
   Puede ser globalmente en nuxt.config.ts o aquí. */
/* @import 'leaflet/dist/leaflet.css'; */
.leaflet-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-container,
.leaflet-pane > svg,
.leaflet-pane > canvas,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
  /* Estos estilos pueden ayudar a evitar que los marcadores se rompan
     con algunas configuraciones de build, pero es mejor configurar
     correctamente la importación de los assets de Leaflet. */
  /* max-width: none !important; */
  /* max-height: none !important; */
}
</style>