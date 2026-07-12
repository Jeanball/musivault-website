import { defineConfig } from 'astro/config';

export default defineConfig({
    // Remplacez par votre nom d'utilisateur et le nom de votre dépôt GitHub
    site: 'https://jeanball.github.io',
    base: '/musivault-website',
    output: 'static' // Assure que le build génère du HTML/CSS/JS vanilla
});