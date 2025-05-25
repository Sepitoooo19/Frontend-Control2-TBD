<template>
  <div class="container">
    <p>Redirigiendo...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth-role' // Ya debería manejar la redirección basada en token/rol
});

// El middleware authRole ya se encarga de redirigir desde "/"
// si el usuario está logueado. Si no está logueado, lo redirige a /login.
// Esta página sirve como un punto de entrada que el middleware evaluará.
</script>