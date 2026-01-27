import { useState, useCallback } from 'react'

interface ConfirmState {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const confirm = useCallback(
    (opts: { title: string; description: string; onConfirm: () => void }) => {
      setState({ open: true, ...opts })
    },
    [],
  )

  const handleClose = useCallback(() => {
    setState((s) => ({ ...s, open: false }))
  }, [])

  const handleConfirm = useCallback(() => {
    state.onConfirm()
    handleClose()
  }, [state, handleClose])

  return { ...state, confirm, handleClose, handleConfirm }
}
