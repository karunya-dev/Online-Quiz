<template>
  <div>
    <div class="top-strip">New name. Same commitment to helping every student find a way.</div>
    <header class="site-nav">
      <BrandLogo />
      <nav class="nav-links" aria-label="Public navigation">
        <a href="#library">Library</a>
        
        <a href="#reports">Reports</a>
        <a href="#privacy">Privacy</a>
      </nav>
      <div class="nav-actions">
        <NuxtLink class="btn btn-outline" to="/join">Enter code</NuxtLink>
        <NuxtLink class="btn btn-dark" to="/login">Log in</NuxtLink>
        <NuxtLink class="btn btn-primary" to="/signup">Sign up</NuxtLink>
      </div>
    </header>
  </div>
</template>
