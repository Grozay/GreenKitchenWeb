export default async function getCroppedImg(imageSrc, pixelCrop, width = 300, height = 300) {
  const image = new Image()
  image.src = imageSrc
  await new Promise(resolve => image.onload = resolve)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Set nền trong suốt
  ctx.clearRect(0, 0, width, height)

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height
  )

  return new Promise(resolve => {
    // Dùng PNG để giữ nền trong suốt
    canvas.toBlob(blob => resolve(blob), 'image/png', 1)
  })
}