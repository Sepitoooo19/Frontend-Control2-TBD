<template>
  <div>
    <h1>Dashboard de Administración</h1>
    <p>Bienvenido al panel de control.</p>
    <div class="row">
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Gestionar Usuarios</h5>
                    <p class="card-text">Ver, editar y eliminar usuarios.</p>
                    <NuxtLink to="/admin/users" class="btn btn-primary">Ir a Usuarios</NuxtLink>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Gestionar Tareas</h5>
                    <p class="card-text">Ver, editar y eliminar todas las tareas.</p>
                    <NuxtLink to="/admin/tasks" class="btn btn-primary">Ir a Tareas</NuxtLink>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Gestionar Sectores</h5>
                    <p class="card-text">Crear, ver, editar y eliminar sectores.</p>
                    <NuxtLink to="/admin/sectors" class="btn btn-primary">Ir a Sectores</NuxtLink>
                </div>
            </div>
        </div>
         <div class="col-md-4 mt-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Reportes Globales</h5>
                    <p class="card-text">Ver estadísticas y reportes del sistema.</p>
                    <NuxtLink to="/admin/reports" class="btn btn-primary">Ir a Reportes</NuxtLink>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-role'],
});
useHead({
  title: 'Admin Dashboard',
});
</script>