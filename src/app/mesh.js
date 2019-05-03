import React from 'react'
import ClassName from 'classnames'
import Point from './point'

export default class Mesh extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
    this.options = {
      pointCount: 50,
      pointRadius: 3,
      pointSpeed: .5,
      pointColor: '225,228,235',
      lineRadius: 250,
      lineWidth: 1,
      lineColor: '225,228,235'
    }
    this.mouseActive = false
    this.mousePosition = { x: 0, y: 0 }
  }

  componentDidMount () {
    // Get the canvas
    this.canvas = this.canvasElement.getContext('2d')
    // Get the canvas size
    this.initialiseMesh()
    // Call the loop function before rendering the next frame
    window.requestAnimationFrame(this.loop)
    // Update canvas size on resize
    window.addEventListener('resize', this.resize)
    // Setup Mouse Events
    this.canvasContainer.addEventListener('mouseenter', () => {
      this.mouseActive = true
    })
    this.canvasElement.addEventListener('mousemove', event => {
      let canvasBounding = this.canvasElement.getBoundingClientRect()
      this.mousePosition = {
        x: event.clientX - canvasBounding.left, 
        y: event.pageY  - canvasBounding.top
      }
    })
    this.canvasContainer.addEventListener('mouseleave', () => {
      this.mouseActive = false
    })
  }

  initialiseMesh = () => {
    // Set the canvas size
    this.canvasSize = {
      x: this.canvasElement.width = this.canvasContainer.offsetWidth,
      y: this.canvasElement.height = this.canvasContainer.offsetHeight
    }
    // Create the points
    this.createPoints()
    // Show the canvas
    this.setState({show: true})
  }

  resize = () => {
    // Clear resize timer
    clearTimeout(this.resizeTimer)
    // Hide the canvas
    this.setState({show: false})
    // Wait for fade animation to be finished
    this.resizeTimer = setTimeout(this.initialiseMesh, 400)
  }
  
  loop = () => {
    // Clear the canvas
    this.canvas.clearRect(0,0,this.canvasSize.x,this.canvasSize.y);
    // Update and draw the points
    for (let point of this.points) {
      point.update()
      point.draw(this.canvas, this.options.pointColor)
    }
    this.createLines()
    // Call the loop function before rendering the next frame
    window.requestAnimationFrame(this.loop)
  }

  createPoints = () => {
    // Prepare an array for the points
    this.points = []
    // Create the points
    for (let i = 0; i < this.options.pointCount; i++) {
      this.points.push(new Point(this.canvasSize, this.options.pointRadius, this.options.pointSpeed))
    }
  }

  createLines = () => {
    // Prepare an array for the lines
    this.lines = []
    // Loop through the points
    for (let pointA = 0; pointA < this.options.pointCount; pointA++) {
      // Compare unique pairs
      for (let pointB = pointA + 1; pointB < this.options.pointCount; pointB++) {
        this.compareDistances(this.points[pointA].position, this.points[pointB].position)
      }
      // Check the distance from the mouse
      if (this.mouseActive) {
        this.compareDistances(this.points[pointA].position, this.mousePosition)
      }
      
    }
  }

  compareDistances = (pointAPosition, pointBPosition) => {
    let distance = Math.sqrt(
      Math.pow(pointAPosition.x - pointBPosition.x, 2) + 
      Math.pow(pointAPosition.y - pointBPosition.y, 2)
    )
    if (distance < this.options.lineRadius) {
      let opacity = 1 - (distance / this.options.lineRadius)
      this.drawLine(pointAPosition, pointBPosition, opacity)
    }
  }

  drawLine = (startPoint, endPoint, opacity) => {
    this.canvas.lineWidth = this.options.lineWidth
    this.canvas.strokeStyle = `rgba(${this.options.lineColor}, ${opacity})`
    this.canvas.beginPath()
    this.canvas.moveTo(startPoint.x, startPoint.y)
    this.canvas.lineTo(endPoint.x, endPoint.y)
    this.canvas.closePath()
    this.canvas.stroke()
  }

  render () {
    return (
      <div className='mesh-canvas-container' ref={element => (this.canvasContainer = element)}>
        <canvas className={ClassName('mesh-canvas', { 'show': this.state.show })} ref={element => (this.canvasElement = element)} />
      </div>
    )
  }
}
