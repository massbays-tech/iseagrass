import { Collapse, Row } from 'reactstrap'
import { Check, ChevronRight, Circle } from '../Icon'

export type Toggle = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => void

interface SectionProps {
  title: string
  complete?: boolean
  hideIcon?: boolean
  className?: string
  id: string
  children?: React.ReactNode
  open: boolean
  toggle: Toggle
  passRef?: any
}

export const Section = ({
  open,
  toggle,
  title,
  complete,
  hideIcon,
  className,
  id,
  passRef,
  children
}: SectionProps) => {
  const statusIcon = complete ? (
    <Check className="text-success" />
  ) : (
    <Circle style={{ fontSize: '.75rem' }} className="text-black-50" />
  )
  return (
    <Row className={`${className ?? 'border-bottom'}`}>
      <a
        ref={passRef}
        id={id}
        className="col-12 d-flex align-items-center justify-content-start station-section"
        onClick={toggle}
      >
        {!hideIcon && (
          <div className="d-flex align-items-center" style={{ width: 20 }}>
            {statusIcon}
          </div>
        )}
        <h4 className="text-dark font-weight-light my-2">{title}</h4>
        <span className="flex-fill" />
        <ChevronRight
          className="text-black-50"
          style={{
            transform: `rotate(${open ? '90' : '0'}deg)`,
            transition: '.35s ease'
          }}
        />
      </a>
      <Collapse isOpen={open} className="w-100 pb-3">
        {children}
      </Collapse>
      <style jsx>{`
        a:hover {
          text-decoration: none;
        }
      `}</style>
    </Row>
  )
}
