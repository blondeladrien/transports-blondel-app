// Service worker minimal — nécessaire pour que le navigateur autorise l'installation de l'app.
// Met simplement la page en cache pour un chargement plus rapide (et un accès de secours hors connexion).
const CACHE_NOM = 'transports-blondel-v2';
 
self.addEventListener('install', (evenement) => {
  self.skipWaiting();
});
 
self.addEventListener('activate', (evenement) => {
  // Supprime tous les anciens caches (v1, etc.) pour ne jamais servir une page obsolète
  evenement.waitUntil(
    caches.keys().then((noms) => Promise.all(
      noms.filter((nom) => nom !== CACHE_NOM).map((nom) => caches.delete(nom))
    ))
  );
  self.clients.claim();
});
 
self.addEventListener('fetch', (evenement) => {
  // Ne met en cache que les fichiers de l'app elle-même (pas les appels à l'API du serveur)
  if (evenement.request.url.includes('/api/')) return;
 
  evenement.respondWith(
    fetch(evenement.request)
      .then((reponse) => {
        const copie = reponse.clone();
        caches.open(CACHE_NOM).then((cache) => cache.put(evenement.request, copie));
        return reponse;
      })
      .catch(() => caches.match(evenement.request))
  );
});
 
 
