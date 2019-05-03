export default class Point {
  constructor (canvasSize, pointRadius, speed) {
    this.canvasSize = canvasSize
    this.radius = pointRadius
    this.position = {
      x: Math.random() * canvasSize.x,
      y: Math.random() * canvasSize.y
    }
    let angle = Math.floor(Math.random() * 360)
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    }
  }
  update = () => {
    // Update the postion
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    // Check if the point should bounce off an edge
    if (this.position.x <= 0 + this.radius) {
      this.velocity.x *= -1
      this.position.x = 0 + this.radius
    }
    if (this.position.x >= this.canvasSize.x - this.radius) {
      this.velocity.x *= -1
      this.position.x = this.canvasSize.x - this.radius
    }
    if (this.position.y <= 0 + this.radius) {
      this.velocity.y *= -1
      this.position.y = 0 + this.radius
    }
    if (this.position.y >= this.canvasSize.y - this.radius) {
      this.velocity.y *= -1
      this.position.y = this.canvasSize.y - this.radius
    }
  }
  draw = (canvas, color) => {
    canvas.beginPath()
    canvas.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
    canvas.closePath()
    canvas.fillStyle = `rgb(${color})`
    canvas.fill()
  }
}