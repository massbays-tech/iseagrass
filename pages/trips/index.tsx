import { useDB } from 'hooks'
import { compact, union, uniq } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row
} from 'reactstrap'

const format = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`

export default () => {
  const router = useRouter()
  const { db } = useDB()
  const [crews, setCrew] = useState([''])
  const [date, setDate] = useState(new Date())
  const [boat, setBoat] = useState('')

  const updateCrew = (i: number, value: string) => {
    setCrew((crew) => {
      crew[i] = value
      return union(uniq(crew), [''])
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const harbor = ''
    const crew = compact(crews)
    const stations = []
    await db.put('trips', {
      crew,
      date,
      harbor,
      boat,
      stations
    })
    router.push('/stations')
  }
  return (
    <Form onSubmit={onSubmit} className="p-3">
      <FormGroup>
        <Label for="crew">Crew Members</Label>
        {crews.map((c, i) => (
          <Input
            className={`${i > 0 ? 'mt-3' : ''}`}
            key={i}
            type="text"
            id={`crew-${i}`}
            placeholder="Full name..."
            required={i == 0}
            value={c}
            onChange={(e) => updateCrew(i, e.target.value)}
          />
        ))}
        <FormText color="muted">
          This lets us reach out to you later if we have any questions.
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label for="date">Date</Label>
        <Input
          type="date"
          id="date"
          required={true}
          value={format(date)}
          onChange={(e) => {
            setDate(new Date(e.target.value))
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label for="boat">Boat Name</Label>
        <Input
          type="text"
          name="boat"
          id="boat"
          required={true}
          value={boat}
          onChange={(e) => setBoat(e.target.value)}
        />
      </FormGroup>
      <Row className="justify-content-between">
        <Col xs="auto" className="d-flex align-items-center">
          <Link href="/">
            <a>Back</a>
          </Link>
        </Col>
        <Col xs="auto">
          <Button value="submit" color="primary">
            Save and Continue
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
