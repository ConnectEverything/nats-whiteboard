import './style.css'
import Alpine from "alpinejs";
import throttle from './throttle';
import { connect, consumerOpts, headers, JSONCodec } from 'nats.ws';

Alpine.data("whiteboard", (subject) => ({
  id: Math.random(),
  color: "black",
  thickness: 5,
  drawing: false,
  last: { x:0, y:0 },
  context: null,
  nats: null,
  jc: null,

  async init() {
    const server = import.meta.env.VITE_NATS_SERVER
    this.jc = JSONCodec()
    this.nats = await connect({ servers: server })

    const opts = consumerOpts()
    opts.orderedConsumer()
    const sub = await this.nats.jetstream().subscribe(subject, opts)

    for await(const m of sub) {
      const data = this.jc.decode(m.data)
      switch (data.type) {
        case "draw":
          if(data.id !== this.id) {
            this.drawRaw(data)
          }
          break;
        case "clear":
          this.context.clearRect(0 ,0 ,window.innerWidth, window.innerHeight)
        default:
          break;
      }
    }
  },

  sizeCanvas(canvas) {
    this.context = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  },

  startDrawing(e) {
    this.drawing = true
    this.last = this.getPoint(e)
  },

  draw(e) {
    throttle(() => {
      const from = this.last
      const to = this.getPoint(e)
      const msg = {
        id: this.id,
        type: "draw",
        from: from,
        to: to,
        thickness: this.thickness,
        color: this.color 
      }

      this.drawRaw(msg)
      this.nats.publish(subject, this.jc.encode(msg))

      this.last = to
    }, 30)()
  },

  getPoint(e) {
    if(!e.offsetX || !e.offsetY) {
      const rect = e.target.getBoundingClientRect()
      e.offsetX = (e.touches[0].clientX - window.pageXOffset - rect.left)
      e.offsetY = (e.touches[0].clientY - window.pageYOffset - rect.top)
    }
    return { x: e.offsetX, y: e.offsetY }
  },

  clear() {
    const msg = { id: this.id, type: "clear", }
    const h = headers()
    h.set("Nats-Rollup", "sub")
    this.nats.publish(subject, this.jc.encode(msg), { headers: h })
  },

  drawRaw({from, to, thickness, color}) {
    const c = this.context
    c.beginPath()
    c.lineWidth = thickness
    c.lineCap = "round"
    c.lineJoin = "round"
    c.strokeStyle = color
    c.moveTo(from.x, from.y)
    c.lineTo(to.x, to.y)
    c.stroke()
  },
}))

Alpine.start()
