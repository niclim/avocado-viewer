(async () => {
  const imageId = 'image-viewer-image'
  const playId = 'image-viewer-play'
  const timeSliderId = 'time-slider'
  const loadingSpinner = './assets/loadingspinner.gif'
  const imageViewer = document.getElementById('avocado-viewer')
  let imagesCache = [] // we don't want this to be garbage collected
  const mount = (imageViewer) => {
    const resetId = 'image-viewer-reset'
    const image = `
    <div class="image-container">
      <img id="${imageId}" src="${loadingSpinner}">
    </div>
    <div class="controls">
      <div>
        <input
          type="range"
          id="${timeSliderId}"
          value="1"
          step="1"
          min="1"
        />
      </div>
      <div class="action-controls">
        <button id="${playId}">Play</button>
        <button id="${resetId}">Reset</button>
      </div>
      <div class="time-controls">
        
      </div>
    </div>
    `
    imageViewer.innerHTML = image
    document.getElementById(playId).addEventListener('click', play)
    document.getElementById(resetId).addEventListener('click', reset)
    document.getElementById(timeSliderId).addEventListener('input', rangeUpdateEvent)
    document.getElementById(timeSliderId).addEventListener('change', rangeUpdateEvent)
  }

  const preloadImages = (images) => {
    const getImage = (imgPath) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.src = imgPath
        img.onload = () => resolve(img)
        img.onerror = reject
      })
    }
    const imagePromises = images.map(image => getImage(`./pics/${image.image}`))
    return Promise.all(imagePromises)
  }

  // will hit an endpoint and get information here instead of hardcoded
  const getImageNameToLoad = (timePeriod = 'alltime') => {
    // update this to be variable and selectable
    return window
      .fetch(`/api/get_images?timePeriod=alltime`)
      .then(res => res.json())
  }

  const updateImage = image => {
    document.getElementById(imageId).src = `./pics/${image.image}`
  }

  const load = async (images) => {
    imagesCache = await preloadImages(images)
    document.getElementById(timeSliderId).max = images.length - 1
    updateImage(images[0])
    loaded = true
  }

  let playing = false
  let loaded = false
  let current = 0

  const play = () => {
    playing = !playing
    document.getElementById(playId).innerHTML = playing ? 'Pause' : 'Play'
  }
  const reset = () => {
    updateImage(images[0])
    current = 0
    document.getElementById(timeSliderId).value = current
  }

  const rangeUpdateEvent = (e) => {
    const { value } = e.target
    current = value
    updateImage(images[value])
  }

  // too lazy to set play and pause to update having a timeout
  const loop = () => {
    if (loaded && playing) {
      if (current < images.length - 1) {
        current++
        updateImage(images[current])
        document.getElementById(timeSliderId).value = current
      }
    }
    setTimeout(loop, 25)
  }

  mount(imageViewer)
  const images = await getImageNameToLoad()
  load(images)
  loop()
})()
