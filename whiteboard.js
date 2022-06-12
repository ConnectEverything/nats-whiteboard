export const Whiteboard = () => ({
  drawing: false,
  last: { x:0, y:0 },

  draw: (e) => {
    const { offsetX, offsetY } = e
    const c = e.target.getContext("2d")
    c.beginPath()
    c.lineWidth = 5
    c.lineCap = "round"
    c.lineJoin = "round"
    c.strokeStyle = "black"
    // c.moveTo(this.last.x, this.last.y)
    // c.lineTo(offsetX, offsetY)
    // c.stroke()
  }
})
