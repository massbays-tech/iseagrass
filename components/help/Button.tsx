import { QuestionCircle } from 'components/Icon'
import { useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

interface Props {
  title: string
  children: any
}

export const Button = ({ title, children }: Props) => {
  const [modal, setModal] = useState(false)
  const toggle = (e: React.MouseEvent<any>) => {
    e.preventDefault()
    setModal(!modal)
  }

  return (
    <>
      <button
        onClick={toggle}
        className="btn btn-link"
        type="button"
        aria-label="Help"
      >
        <QuestionCircle />
      </button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Modal>
    </>
  )
}
