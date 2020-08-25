import { Col, Collapse, Row } from 'reactstrap'
import { Check, ChevronRight, Circle } from '../Icon'

interface SectionProps {
  title: string
  complete?: boolean
  hideIcon?: boolean
  className?: string
  children?: React.ReactNode
  open: boolean
  toggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Section = ({
  open,
  toggle,
  title,
  complete,
  hideIcon,
  className,
  children
}: SectionProps) => {
  const statusIcon = complete ? (
    <Check className="text-success" />
  ) : (
    <Circle style={{ fontSize: '.75rem' }} />
  )
  return (
    <Row className={`${className ?? 'border-bottom'}`}>
      <Col
        xs="12"
        className="d-flex align-items-center justify-content-start station-section"
        onClick={toggle}
      >
        {!hideIcon && (
          <div className="d-flex align-items-center" style={{ width: 20 }}>
            {statusIcon}
          </div>
        )}
        <h4 className="font-weight-light my-2">{title}</h4>
        <span className="flex-fill" />
        <ChevronRight
          style={{
            transform: `rotate(${open ? '90' : '0'}deg)`,
            transition: '.35s ease'
          }}
        />
      </Col>
      <Collapse isOpen={open} className="w-100 pb-3">
        {children}
      </Collapse>
    </Row>
  )
}
