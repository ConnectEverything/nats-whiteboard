# NATS Whiteboard

This project is a simple (~100 lines of JavaScript) implementation of a real-time, persistent interactive whiteboard using [NATS Websockets](https://github.com/nats-io/nats.ws), [NATS Jetstream](https://docs.nats.io/nats-concepts/jetstream) and AlpineJS.

## Demo
To see the NATS whiteboard in action, feel free to [try the demo](https://nats-whiteboard.onrender.com/)

## Installation
To get this working on your local computer, you will need to:

1. [Install NATS](https://docs.nats.io/running-a-nats-service/introduction/installation)
2. Run NATS with Websockets and Jetstream support `nats-server -c nats.conf`
3. Create a stream for your whiteboard in NATS: `nats stream create whiteboard --subjects='whiteboard.*' --allow-rollup`
4. `npm install`
5. `npm run dev`
