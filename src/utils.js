export const download = (data) => {
  const filename = `${new Date().toDateString().split(' ').join('')}.json`;

  // Place file live in the URL
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a new link
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);

  // Remove the object url
  URL.revokeObjectURL(url);
};

// check if image exists
export const checkImage = (path) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ path, exists: true });
    img.onerror = () => resolve({ path, exists: false });
    img.src = path;
  });
};
