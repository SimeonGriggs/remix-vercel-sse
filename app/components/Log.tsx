import {useEffect, useState} from 'react'

import {useEventSource} from '~/remix-utils/useEventSource'

export function Log() {
  const latestMessage = useEventSource('/resource/subscribe', {
    event: 'new-message',
    // Prevents error on Vercel's protected preview builds?
    init: {withCredentials: true},
  })
  const [messageLog, setMessageLog] = useState<string[]>([])
  useEffect(() => {
    if (latestMessage && !messageLog.includes(latestMessage)) {
      const updatedLog = [latestMessage, ...messageLog]
      setMessageLog(updatedLog)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestMessage, messageLog])

  return (
    <div className="rounded bg-slate-950 p-8 font-mono text-xs leading-paragraph text-white">
      {messageLog.length > 0 ? (
        <div className="grid-col-1 grid gap-1">
          {messageLog.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </div>
      ) : (
        <div className="animate-pulse opacity-50">
          Message log will appear here
        </div>
      )}
    </div>
  )
}
