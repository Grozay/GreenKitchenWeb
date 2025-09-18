export default async function getCroppedImg(imageSrc, pixelCrop, width = 300, height = 300) {
  const image = new Image()
  image.src = imageSrc
  await new Promise(resolve => image.onload = resolve)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

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
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 1)
  })
}