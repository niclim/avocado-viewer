(async () => {
  const NUM_CREATE = 100
  const SPEED = 40
  const getRandomRange = (min, max) => Math.floor(Math.random() * (max - min)) + min
  const genPromise = (i, dir) => new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.src = './assets/avocado.png'
    img.id = `avocado-${i}`
    img.className = 'flying-avocado'
    img.style.top = `${getRandomRange(
      0,
      window.innerHeight
    )}px`

    img.style[dir] = `${getRandomRange(
      window.innerWidth,
      window.innerWidth * 3
    )}px`

    document.querySelector('body').appendChild(img)

    const convertToNum = (str) => Number(str.replace(/px$/i, ''))
    const loop = () => {
      const offset = convertToNum(img.style[dir])
      img.style[dir] = `${offset - SPEED}px`
      if (convertToNum(img.style[dir]) < -100) {
        resolve()
      } else {
        window.requestAnimationFrame(loop)
      }
    }
    loop()
  })

  const promises = []
  for (let i = 0; i < NUM_CREATE; i++) {
    promises.push(genPromise(
      i,
      i % 2 === 0 ? 'left' : 'right'
    ))
  }

  await Promise.all(promises)

  // Clean up
  for (let i = 0; i < NUM_CREATE; i++) {
    document.getElementById(`avocado-${i}`).remove()
  }
})()
