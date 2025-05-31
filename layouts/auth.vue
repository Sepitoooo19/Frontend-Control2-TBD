<template>
  <div class="flex flex-col min-h-screen bg-gray-100 ">
    <main class="flex-grow flex flex-col items-center justify-center ">
      <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full ">
        <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">
        </h1>
        <slot />
      </div>
    </main>
    <footer class="bg-gray-800 text-white py-4">
      <div class="text-center">
        <p>&copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>