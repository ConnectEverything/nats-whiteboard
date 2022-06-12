import './style.css'
import Alpine from "alpinejs";

window.Alpine = Alpine

Alpine.data("whiteboard", () => ({
  drawing: false,
  last: { x:0, y:0 },

  sizeCanvas(canvas) {
    console.log(canvas)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  },

  startDrawing(e) {
    this.drawing = true
    this.last = { x: e.offsetX, y: e.offsetY }
  },

  draw(e) {
    const { offsetX, offsetY } = e
    const c = e.target.getContext("2d")
    c.beginPath()
    c.lineWidth = 5
    c.lineCap = "round"
    c.lineJoin = "round"
    c.strokeStyle = "black"
    c.moveTo(this.last.x, this.last.y)
    c.lineTo(offsetX, offsetY)
    c.stroke()

    this.last = { x: offsetX, y: offsetY }
  }
}))

Alpine.start()
