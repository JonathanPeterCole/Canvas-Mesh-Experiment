import React from 'react'
import PropTypes from 'prop-types'
import ClassName from 'classnames'
import Point from './point'

export default class Mesh extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
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
      point.draw(this.canvas, this.props.pointColor)
    }
    this.createLines()
    // Call the loop function before rendering the next frame
    window.requestAnimationFrame(this.loop)
  }

  createPoints = () => {
    // Prepare an array for the points
    this.points = []
    // Calculate the points count from the density
    // Density is number of points per 1000px squared
    let pointCount = Math.round(this.props.density * (Math.sqrt(this.canvasSize.x * this.canvasSize.y) / 1000))
    // Create the points
    for (let i = 0; i < pointCount; i++) {
      let pointSpeed = this.props.minSpeed + (Math.random() * (this.props.maxSpeed - this.props.minSpeed))
      this.points.push(new Point(this.canvasSize, this.props.pointRadius, pointSpeed))
    }
  }

  createLines = () => {
    // Prepare an array for the lines
    this.lines = []
    // Loop through the points
    for (let pointA = 0; pointA < this.points.length; pointA++) {
      // Compare unique pairs
      for (let pointB = pointA + 1; pointB < this.points.length; pointB++) {
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
    if (distance < this.props.lineRadius) {
      let opacity = 1 - (distance / this.props.lineRadius)
      this.drawLine(pointAPosition, pointBPosition, opacity)
    }
  }

  drawLine = (startPoint, endPoint, opacity) => {
    this.canvas.lineWidth = this.props.lineWidth
    this.canvas.strokeStyle = `rgba(${this.props.lineColor}, ${opacity})`
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

Mesh.protoTypes = {
  // The number of points per 1000px squared
  density: PropTypes.number,
  // The size of the points
  pointRadius: PropTypes.number,
  // The minimum speed of the points
  minSpeed: PropTypes.number,
  // The maximum speed of the points
  maxSpeed: PropTypes.number,
  // The colour of the points
  pointColor: PropTypes.string,
  // The maximum distance between two points to draw a line
  lineRadius: PropTypes.number,
  // The stroke width of the lines
  lineWidth: PropTypes.number,
  // The colour of thelines
  lineColor: PropTypes.string
}

Mesh.defaultProps = {
  density: 50,
  minSpeed: 0.2,
  maxSpeed: 1.5,
  pointRadius: 3,
  pointColor: '225,228,235',
  lineRadius: 250,
  lineWidth: 1,
  lineColor: '225,228,235'
}