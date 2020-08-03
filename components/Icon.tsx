interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<SVGSVGElement>,
    SVGSVGElement
  > {
  width?: number | string
  height?: number | string
}

export const Add = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className="bi bi-plus"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
    />
    <path
      fillRule="evenodd"
      d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
    />
  </svg>
)

export const AlertCircle = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className="bi bi-exclamation-circle"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
    />
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
  </svg>
)

export const ChevronLeft = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className="bi bi-chevron-left"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
  </svg>
)

export const ChevronRight = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className="bi bi-chevron-right"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
)
