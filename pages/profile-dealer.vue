<!-- page para mostrar el perfil del repartidor y su calificación-->

<script setup>
// Importa los módulos necesarios
import { ref, onMounted } from 'vue';
import { getDealerNameById } from '~/services/dealerService';
import { getAverageDeliveryTimeByDealer, getAuthenticatedDealerAverageDeliveryTime, getAuthenticatedDealerDeliveryCount } from '~/services/dealerService'; // Importa el nuevo servicio
import { getDealerRatings } from '~/services/ratingService';

const dealerId = 1; // Reemplaza con el ID dinámico del repartidor si es necesario
const dealer = ref({
  name: '',
  avgWaitTime: null,
  rating: null,
  deliveryCount: null, // Número de entregas
  authenticatedAvgWaitTime: null, // Tiempo promedio de espera del repartidor autenticado
});
const errorMessage = ref(null);

// Cargar los datos del repartidor al montar el componente
// Método: getDealerNameById, getAverage
//DeliveryTimeByDealer, getDealerRatings y getDealerDeliveryCount
// Entrada: dealerId
// Salida: dealer (con nombre, tiempo de espera promedio, puntuación y número de entregas)
onMounted(async () => {
  try {
    // Obtener el nombre del repartidor
    dealer.value.name = await getDealerNameById(dealerId);

    // Obtener el tiempo de espera promedio (por ID del repartidor)
    const avgWaitTimeData = await getAverageDeliveryTimeByDealer(dealerId);
    dealer.value.avgWaitTime = avgWaitTimeData.avg_delivery_time_hours;

    // Obtener el tiempo de espera promedio del repartidor autenticado
    dealer.value.authenticatedAvgWaitTime = await getAuthenticatedDealerAverageDeliveryTime();

    // Obtener el número de entregas del repartidor autenticado
    dealer.value.deliveryCount = await getAuthenticatedDealerDeliveryCount();

    // Obtener la puntuación promedio
    const ratings = await getDealerRatings(dealerId);
    if (ratings.length > 0) {
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      dealer.value.rating = (totalRatings / ratings.length).toFixed(2);
    } else {
      dealer.value.rating = 'Sin calificaciones';
    }
  } catch (error) {
    console.error('Error al cargar los datos del repartidor:', error);
    errorMessage.value = 'Hubo un error al cargar los datos del repartidor.';
  }
});
definePageMeta({
  layout: 'dealer', // Usa el layout de repartidor
});
</script>


<template>
  <div>
    <h1>Perfil del Repartidor</h1>
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    <ul v-else>
      <li><strong>Nombre:</strong> {{ dealer.name }}</li>
      <li><strong>Puntuación Promedio:</strong> {{ dealer.rating }}</li>
      <li><strong>Tiempo de Espera Promedio:</strong> {{ dealer.authenticatedAvgWaitTime?.toFixed(2) }} horas</li>
      <li><strong>Número de Entregas:</strong> {{ dealer.deliveryCount }}</li>
    </ul>
  </div>
</template>