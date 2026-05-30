(function() {
  // Find the script tag that loaded this script
  var scripts = document.getElementsByTagName('script');
  var currentScript = null;
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.indexOf('embed.js') !== -1) {
      currentScript = scripts[i];
    }
  }

  if (!currentScript) {
    console.error('Kangqore Embed: Could not find script tag.');
    return;
  }

  var slug = currentScript.getAttribute('data-slug');
  if (!slug) {
    console.error('Kangqore Embed: data-slug attribute is required.');
    return;
  }

  // Determine base URL (assuming embed.js is served from the same domain as the app)
  var scriptUrl = new URL(currentScript.src);
  var baseUrl = scriptUrl.origin;

  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/schedule/' + slug + '?embed=true';
  iframe.style.width = '100%';
  iframe.style.height = '700px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)';
  iframe.allow = 'camera; microphone; autoplay; encrypted-media;';

  // Inject after the script tag
  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
})();
