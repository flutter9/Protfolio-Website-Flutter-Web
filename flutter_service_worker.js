'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "3daa223e44daa89a1858e16114a8f6d3",
"main.dart.js": "07ffc43e3bf40d2ab92f0b1473443ee2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/AssetManifest.json": "238e191ce6a36aa7b56a0d7313de6c1f",
"assets/assets/images/graphic.png": "d7aaa5a5615483382572b5d5c24c5e5b",
"assets/assets/images/Hover_flip.png": "57d317fc22080b316188ebe73407065b",
"assets/assets/images/sign.png": "09ce9472b81f95dc3193a4ce58872bfb",
"assets/assets/images/Intreaction_design.png": "98e873648b7c2d3062556f2f8c09d4c3",
"assets/assets/images/contact_icon.png": "856b95eb03d60fa2576140e4c3d034b9",
"assets/assets/images/hand.png": "d7c6f40ec1244a86fb4610cd515fee55",
"assets/assets/images/desktop.png": "d4794e3ddcb4fce9a2c12246e3b4d8a7",
"assets/assets/images/work_3.png": "035401cff7e0fc62875bb280c53523c5",
"assets/assets/images/bg_img_2.png": "8257ef89b2dfeab767578260965a7e2d",
"assets/assets/images/person.png": "6ede1e25d66c72b4e0ca2e5459cfd8b1",
"assets/assets/images/work_4.png": "74e5fc2d50c04cdd638cfa878bd2ef66",
"assets/assets/images/email.png": "f59e8ec158ec05d21c8b251d7b0017ca",
"assets/assets/images/people.png": "f6561cf54d239a098a72225cd21bdc80",
"assets/assets/images/work_1.png": "ff8242cdad37e4c83136a90a325810a8",
"assets/assets/images/recent_work_bg.png": "531a8461fd1ec42f03f4cfb891790635",
"assets/assets/images/Hover.png": "f0a2318c40269d84384f56f54d25ad69",
"assets/assets/images/Logo.png": "f76fc5deb917710b053e34eb147af750",
"assets/assets/images/download.png": "d9317d736e7b69f20f57f6ab13f34d3c",
"assets/assets/images/work_2.png": "e1d3843d3e6d8752cfe40f655caab6d5",
"assets/assets/images/whatsapp.png": "e33ef8b852729cd9dd7c6af3837f9b23",
"assets/assets/images/ui.png": "6ca82a6c70f80fd75c56b1fe66caa180",
"assets/assets/images/skype.png": "955d4329bf55cd47008c2edd6c08ad99",
"assets/assets/images/messanger.png": "beacdbb3a93df25674af2f5302f5633a",
"assets/assets/images/background.png": "0614a717659df3fd409c60ff04fac983",
"assets/NOTICES": "c83a14ed9f90464a987569624f844d45",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"index.html": "17631b7607f19a89a99a79b9e1229fc1",
"/": "e6e25ef07ab061f3396db68372e4cc59",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"manifest.json": "9d3d57f21e96b6052aaf48bd974ffe62",
"web/index.html": "e6e25ef07ab061f3396db68372e4cc59"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
