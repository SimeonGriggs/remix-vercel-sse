import type {LoaderFunctionArgs} from '@vercel/remix'

import {eventStream} from '~/remix-utils/eventStream'
import {emitter} from '~/services/emitter.server'

type Message = string

export const config = {runtime: 'edge'}

export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(message: Message) {
      send({event: 'new-message', data: message})
    }

    emitter.on('message', handle)

    return function clear() {
      emitter.off('message', handle)
    }
  })
}
