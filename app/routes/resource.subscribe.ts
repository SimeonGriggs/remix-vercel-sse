import type {LoaderFunctionArgs} from '@vercel/remix'

import {eventStream} from '~/remix-utils/eventStream'
import {emitter} from '~/services/emitter.server'

type Message = string

export const config = {runtime: 'edge'}

export async function loader({request}: LoaderFunctionArgs) {
  const stream = eventStream(request.signal, function setup(send) {
    function handle(message: Message) {
      console.log(`Handling message: ${message}`)
      send({event: 'message', data: message})
    }

    emitter.on('message', handle)

    return function clear() {
      emitter.off('message', handle)
    }
  })

  console.log('content-type', stream.headers.get('content-type'))

  stream.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') ?? '*')

  // Required on Vercel?
  // https://github.com/vercel/next.js/discussions/48427#discussioncomment-5624579
  stream.headers.set("Connection", "keep-alive");
  stream.headers.set("Content-Encoding", "none");
  stream.headers.set("Cache-Control", "no-cache, no-transform");
  stream.headers.set("Content-Type", "text/event-stream");

  return stream
}
