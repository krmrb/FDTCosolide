<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        © GRICS, 2025
      </div>
      <div class="footer-right">
        <img src="../assets/grics_icone_blanc.png" alt="GRICS" class="logo" an>
        <span class="logo-text"></span>
      </div>
    </div>
  </footer>
</template>


<script setup>
</script>


<style scoped>

  .footer {
    
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(110, 110, 110, 0.5 ); /* gris pâle transparent */
    color: #e0f0ff;
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
    z-index: 1000;
    backdrop-filter: blur(6px);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-left {
    flex: 1;
    text-align: center;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo {
    height: 1.2rem;
  }

  .logo-text {
    font-weight: bold;
    font-size: 1rem;
    color: #e0f0ff;
  }

</style>
